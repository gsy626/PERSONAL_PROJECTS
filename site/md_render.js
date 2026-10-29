/*
 * Markdown rendering for the article editor preview.
 *
 * - Uses marked (vendored) for GFM parsing.
 * - Escapes raw HTML like Parsedown's safe mode, then sanitizes with
 *   DOMPurify as a second line of defence.
 * - Replaces math segments with placeholders before parsing so that
 *   underscores / asterisks inside TeX are not treated as Markdown.
 *   The placeholders are restored to <span class="md-math"> nodes in
 *   the DOM, and MathJax typesets them afterwards.
 *
 * The parsing half has no DOM dependency, so it can be exercised from
 * Node without a browser.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MDRender = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var TOKEN_PREFIX = 'MDMATHTOKEN';
  var TOKEN_SUFFIX = 'END';

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[ch];
    });
  }

  /*
   * Walk the source once. Code fences / inline code win over math, so a
   * `$` inside a code block is never turned into a placeholder.
   *
   * Supported math forms (same set MathJax is configured with):
   *   $$ ... $$, \[ ... \], \( ... \), $ ... $
   */
  function protectMath(source) {
    var math = [];
    // The leading (^|[^\\]) group prevents an escaped \$ from opening
    // inline math without using a look-behind (older Safari support).
    var pattern = /(^|[^\\])(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`|\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\$(?!\$)(?=\S)((?:\\.|[^$\\\n])*?\S)\$(?![\d$]))/g;
    var output = '';
    var lastIndex = 0;
    var match;

    while ((match = pattern.exec(source)) !== null) {
      var text = match[2];
      var start = match.index + match[1].length;
      var isCode = text.charAt(0) === '`' || text.indexOf('~~~') === 0;
      if (isCode) {
        continue;
      }

      // Ignore "$ 5 $" and similar currency-like runs. MathJax itself
      // ignores delimiters padded with whitespace.
      if (text.charAt(0) === '$' && text.charAt(1) !== '$') {
        var inner = text.slice(1, -1);
        if (!inner || inner !== inner.trim()) {
          continue;
        }
      }

      output += source.slice(lastIndex, start);
      output += TOKEN_PREFIX + math.length + TOKEN_SUFFIX;
      math.push({
        text: text,
        block: text.slice(0, 2) === '$$' || text.slice(0, 2) === '\\['
      });
      lastIndex = start + text.length;
    }

    output += source.slice(lastIndex);
    return { text: output, math: math };
  }

  var cachedLib = null;
  var cachedParser = null;

  function getParser(markedLib) {
    if (cachedParser && cachedLib === markedLib) {
      return cachedParser;
    }

    var renderer = new markedLib.Renderer();
    // Parsedown safe mode renders raw HTML as text. Match that behaviour
    // so the preview is not more permissive than the published page.
    renderer.html = function (html, block) {
      var escaped = escapeHtml(String(html).replace(/\n+$/, ''));
      return block ? '<p>' + escaped + '</p>\n' : escaped;
    };

    cachedLib = markedLib;
    cachedParser = new markedLib.Marked({
      gfm: true,
      breaks: false,
      renderer: renderer
    });
    return cachedParser;
  }

  function renderMarkdown(source, options) {
    options = options || {};
    var markedLib = options.marked || (typeof window !== 'undefined' ? window.marked : null);
    if (!markedLib) {
      throw new Error('marked is not loaded');
    }

    var protectedSource = protectMath(String(source == null ? '' : source));
    var html = getParser(markedLib).parse(protectedSource.text);

    var purify = options.purify || (typeof window !== 'undefined' ? window.DOMPurify : null);
    if (purify && typeof purify.sanitize === 'function') {
      html = purify.sanitize(html, { USE_PROFILES: { html: true } });
    }

    return { html: html, math: protectedSource.math };
  }

  /*
   * Replace the text placeholders with real DOM nodes. Doing this after
   * DOMPurify means the TeX source is never interpreted as HTML, and
   * MathJax sees the delimiters in text nodes as usual.
   */
  function restoreMath(root, math) {
    if (!root || !math || !math.length) {
      return;
    }

    var tokenPattern = TOKEN_PREFIX + '(\\d+)' + TOKEN_SUFFIX;
    var tokenRe = new RegExp(tokenPattern, 'g');
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    var textNodes = [];

    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    textNodes.forEach(function (node) {
      var value = node.nodeValue;
      if (!value || value.indexOf(TOKEN_PREFIX) === -1) {
        return;
      }

      var parent = node.parentNode;
      var inCode = parent && parent.closest && parent.closest('pre, code');
      var fragment = document.createDocumentFragment();
      var lastIndex = 0;
      var match;

      tokenRe.lastIndex = 0;
      while ((match = tokenRe.exec(value)) !== null) {
        if (match.index > lastIndex) {
          fragment.appendChild(document.createTextNode(value.slice(lastIndex, match.index)));
        }

        var item = math[Number(match[1])];
        if (!item) {
          fragment.appendChild(document.createTextNode(match[0]));
        } else if (inCode) {
          // The placeholder should not have been created inside code,
          // but if it was (e.g. an unclosed fence), keep the source.
          fragment.appendChild(document.createTextNode(item.text));
        } else {
          var span = document.createElement('span');
          span.className = 'md-math' + (item.block ? ' md-math--block' : '');
          span.textContent = item.text;
          fragment.appendChild(span);
        }

        lastIndex = match.index + match[0].length;
      }

      if (lastIndex === 0) {
        return;
      }
      if (lastIndex < value.length) {
        fragment.appendChild(document.createTextNode(value.slice(lastIndex)));
      }
      parent.replaceChild(fragment, node);
    });

    // Placeholders can end up in URLs/alt text when math appears inside a
    // link destination. Put the original TeX back instead of leaking the
    // internal token.
    var elements = root.querySelectorAll('*');
    for (var i = 0; i < elements.length; i++) {
      var attributes = elements[i].attributes;
      for (var j = 0; j < attributes.length; j++) {
        var attr = attributes[j];
        if (attr.value.indexOf(TOKEN_PREFIX) === -1) {
          continue;
        }
        attr.value = attr.value.replace(tokenRe, function (token, index) {
          var item = math[Number(index)];
          return item ? item.text : token;
        });
      }
    }
  }

  return {
    escapeHtml: escapeHtml,
    protectMath: protectMath,
    renderMarkdown: renderMarkdown,
    restoreMath: restoreMath
  };
});
