/*
 * Side-by-side Markdown preview for article_edit.php.
 *
 * The editor is progressively enhanced: without JavaScript the original
 * textarea keeps working exactly as before.
 */
(function () {
  'use strict';

  var source = document.getElementById('md-source');
  var preview = document.getElementById('md-preview');
  var editor = document.querySelector('.md-editor');
  var status = document.getElementById('md-preview-status');
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.md-tab'));

  if (!source || !preview || !editor || !window.MDRender) {
    return;
  }

  var MODES = ['edit', 'split', 'preview'];
  var STORAGE_KEY = 'article-editor-mode-v1';
  var RENDER_DELAY = 160;
  var MATH_DELAY = 180;
  var MATHJAX_URL = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';

  var mode = 'split';
  var renderTimer = 0;
  var mathTimer = 0;
  var mathJaxState = 'idle'; // idle | loading | ready | failed
  var mathPending = 0;
  var mathError = false;
  var hasMath = false;
  var scrollRatio = 0;
  var lastRenderedValue = null;
  var composing = false;

  function storageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function storageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      // Private mode / disabled storage: the editor still works.
    }
  }

  function setStatus(text, tone) {
    if (!status) {
      return;
    }
    status.textContent = text;
    if (tone) {
      status.setAttribute('data-tone', tone);
    } else {
      status.removeAttribute('data-tone');
    }
  }

  function updateStatus() {
    if (mode === 'edit') {
      setStatus('切到分屏或预览即可查看效果');
      return;
    }
    if (hasMath && mathJaxState === 'failed') {
      setStatus('公式组件加载失败，已显示 TeX 源码', 'warn');
      return;
    }
    if (hasMath && mathJaxState !== 'ready') {
      setStatus('公式组件加载中…');
      return;
    }
    if (mathError) {
      setStatus('部分公式渲染失败，已显示 TeX 源码', 'warn');
      return;
    }
    setStatus(hasMath ? '实时预览 · LaTeX 已启用' : '实时预览');
  }

  function captureScroll() {
    var max = preview.scrollHeight - preview.clientHeight;
    if (preview.clientHeight <= 0 || max <= 0) {
      scrollRatio = 0;
      return;
    }
    scrollRatio = preview.scrollTop / max;
  }

  function restoreScroll() {
    var max = preview.scrollHeight - preview.clientHeight;
    if (max <= 0) {
      return;
    }
    preview.scrollTop = scrollRatio * max;
  }

  function parseMath(text, block) {
    var sourceText = text;
    var display = !!block;

    if (text.slice(0, 2) === '$$' && text.slice(-2) === '$$') {
      sourceText = text.slice(2, -2);
      display = true;
    } else if (text.slice(0, 2) === '\\[' && text.slice(-2) === '\\]') {
      sourceText = text.slice(2, -2);
      display = true;
    } else if (text.slice(0, 2) === '\\(' && text.slice(-2) === '\\)') {
      sourceText = text.slice(2, -2);
      display = false;
    } else if (text.charAt(0) === '$' && text.charAt(text.length - 1) === '$') {
      sourceText = text.slice(1, -1);
      display = false;
    }

    return { source: sourceText, display: display };
  }

  function renderMath() {
    if (!hasMath || mode === 'edit') {
      updateStatus();
      return;
    }
    if (mathJaxState !== 'ready') {
      updateStatus();
      return;
    }

    var mathJax = window.MathJax;
    if (!mathJax || typeof mathJax.tex2svgPromise !== 'function') {
      setStatus('公式组件不可用，已显示 TeX 源码', 'warn');
      return;
    }

    var nodes = preview.querySelectorAll('.md-math');
    for (var i = 0; i < nodes.length; i++) {
      var span = nodes[i];
      var state = span.getAttribute('data-md-math');
      if (state === 'pending' || state === 'done') {
        continue;
      }

      var parsed = parseMath(span.textContent, span.classList.contains('md-math--block'));
      if (!parsed.source.trim()) {
        span.setAttribute('data-md-math', 'done');
        continue;
      }

      span.setAttribute('data-md-math', 'pending');
      mathPending++;

      (function (node, mathSource, display) {
        var promise;
        try {
          promise = mathJax.tex2svgPromise(mathSource, { display: display });
        } catch (error) {
          mathPending = Math.max(0, mathPending - 1);
          node.setAttribute('data-md-math', 'error');
          mathError = true;
          updateStatus();
          return;
        }

        promise.then(function (mathNode) {
          mathPending = Math.max(0, mathPending - 1);
          if (!preview.contains(node)) {
            updateStatus();
            return;
          }
          if (!mathNode) {
            node.setAttribute('data-md-math', 'error');
            mathError = true;
            updateStatus();
            return;
          }
          node.setAttribute('data-md-math', 'done');
          node.textContent = '';
          node.appendChild(mathNode);
          if (mathPending === 0) {
            restoreScroll();
          }
          updateStatus();
        }, function () {
          mathPending = Math.max(0, mathPending - 1);
          if (!preview.contains(node)) {
            updateStatus();
            return;
          }
          node.setAttribute('data-md-math', 'error');
          mathError = true;
          updateStatus();
        });
      })(span, parsed.source, parsed.display);
    }

    updateStatus();
  }

  function scheduleMath() {
    clearTimeout(mathTimer);
    mathTimer = window.setTimeout(renderMath, MATH_DELAY);
  }

  function render(force) {
    if (mode === 'edit' && !force) {
      return;
    }

    var value = source.value;
    if (!force && value === lastRenderedValue) {
      return;
    }

    captureScroll();

    var result;
    try {
      result = window.MDRender.renderMarkdown(value, {
        marked: window.marked,
        purify: window.DOMPurify
      });
    } catch (error) {
      preview.textContent = '预览渲染失败：' + (error && error.message ? error.message : '未知错误');
      hasMath = false;
      mathError = false;
      lastRenderedValue = value;
      setStatus('预览渲染失败', 'warn');
      return;
    }

    preview.innerHTML = result.html;
    window.MDRender.restoreMath(preview, result.math);

    // Empty content is left as an empty node so the CSS placeholder shows.
    if (value === '') {
      preview.innerHTML = '';
    }

    lastRenderedValue = value;
    hasMath = !!preview.querySelector('.md-math');
    mathError = false;

    window.requestAnimationFrame(restoreScroll);

    if (hasMath && mode !== 'edit') {
      loadMathJax();
      if (mathJaxState === 'ready') {
        scheduleMath();
      } else {
        updateStatus();
      }
    } else {
      clearTimeout(mathTimer);
    }

    updateStatus();
  }

  function scheduleRender() {
    clearTimeout(renderTimer);
    renderTimer = window.setTimeout(function () {
      render(false);
    }, RENDER_DELAY);
  }

  function loadMathJax() {
    if (mathJaxState === 'loading' || mathJaxState === 'ready' || mathJaxState === 'failed') {
      return;
    }
    if (window.MathJax && typeof window.MathJax.tex2svgPromise === 'function') {
      mathJaxState = 'ready';
      updateStatus();
      renderMath();
      return;
    }

    mathJaxState = 'loading';
    updateStatus();

    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']]
      },
      startup: {
        typeset: false
      }
    };

    var script = document.createElement('script');
    script.src = MATHJAX_URL;
    script.async = true;
    script.onload = function () {
      var mathJax = window.MathJax;
      if (!mathJax) {
        mathJaxState = 'failed';
        updateStatus();
        return;
      }

      var ready = mathJax.startup && mathJax.startup.promise
        ? mathJax.startup.promise
        : Promise.resolve();

      ready.then(function () {
        mathJaxState = 'ready';
        updateStatus();
        renderMath();
      }, function () {
        mathJaxState = 'failed';
        updateStatus();
      });
    };
    script.onerror = function () {
      mathJaxState = 'failed';
      updateStatus();
    };
    document.head.appendChild(script);
  }

  function setMode(nextMode, persist) {
    if (MODES.indexOf(nextMode) === -1) {
      nextMode = 'split';
    }

    mode = nextMode;
    editor.setAttribute('data-mode', mode);

    tabs.forEach(function (tab) {
      var active = tab.getAttribute('data-md-mode') === mode;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    if (persist !== false) {
      storageSet(STORAGE_KEY, mode);
    }

    if (mode !== 'edit') {
      render(true);
    }
    updateStatus();
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      setMode(tab.getAttribute('data-md-mode'));
      if (mode === 'preview') {
        source.blur();
      } else {
        source.focus();
      }
    });
  });

  source.addEventListener('input', function () {
    if (!composing) {
      scheduleRender();
    }
  });

  source.addEventListener('compositionstart', function () {
    composing = true;
  });

  source.addEventListener('compositionend', function () {
    composing = false;
    scheduleRender();
  });

  // Keep the author on the edit page when clicking a link in the preview.
  preview.addEventListener('click', function (event) {
    var link = event.target && event.target.closest ? event.target.closest('a') : null;
    if (!link) {
      return;
    }
    var href = link.getAttribute('href');
    if (!href || href.charAt(0) === '#') {
      return;
    }
    event.preventDefault();
    var opened = window.open(link.href, '_blank', 'noopener,noreferrer');
    if (opened) {
      try {
        opened.opener = null;
      } catch (error) {
        // Cross-origin WindowProxy: noopener already isolates it.
      }
    }
  });

  var storedMode = storageGet(STORAGE_KEY);
  if (MODES.indexOf(storedMode) === -1) {
    storedMode = window.matchMedia('(min-width: 901px)').matches ? 'split' : 'edit';
  }

  setMode(storedMode, false);
  window.requestAnimationFrame(function () {
    editor.classList.add('md-ready');
  });
})();
