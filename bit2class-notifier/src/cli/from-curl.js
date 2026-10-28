/**
 * 把浏览器/抓包工具里「Copy as cURL」的内容，转成 .env 配置。
 *
 *   npm run from-curl -- "<curl 内容>"
 *   npm run from-curl -- "<curl 内容>" --write
 */
import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';

const run = promisify(execFile);

const argv = process.argv.slice(2);
const shouldWrite = argv.includes('--write') || argv.includes('-w');
const useClipboard = argv.includes('--clipboard') || argv.includes('-c');
const rest = argv.filter((arg) => !['--write', '-w', '--clipboard', '-c'].includes(arg));

let source = rest.join(' ');
if (useClipboard) {
  try {
    source = await readClipboard();
    console.log(`已读取剪贴板 ${source.length} 个字符`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

const input = normalizeCommand(source).trim();

if (!input) {
  console.error(
    '用法：\n' +
      '  npm run from-curl -- "curl \'https://...\' -H \'cookie: ...\'" [--write]\n' +
      '  npm run from-curl -- --clipboard [--write]    # 直接读系统剪贴板（WSL 下读 Windows 剪贴板）',
  );
  process.exit(1);
}

/**
 * 抓包工具复制出来的 curl 有三种画风，还常带续行符：
 * bash 的 `\`+换行、cmd 的 `^`+换行、PowerShell 的反引号+换行。
 * 统一抹平，顺便去掉 `curl.exe` 前缀和 Windows 剪贴板可能带的 BOM。
 */
function normalizeCommand(raw) {
  return raw
    .replace(/^\uFEFF/, '')
    .replace(/\r\n?/g, '\n')
    .replace(/\\\n/g, ' ')
    .replace(/\^\n/g, ' ')
    .replace(/`\n/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/^\s*curl(\.exe)?\s+/i, '');
}

/**
 * WSL 里读 Windows 剪贴板：powershell.exe Get-Clipboard 会直接返回文本。
 * 原生 Linux 则退到 wl-paste（Wayland）/ xclip（X11）。
 */
async function readClipboard() {
  const isWsl = Boolean(process.env.WSL_DISTRO_NAME) || (await detectWsl());
  const candidates = isWsl
    ? [['powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', 'Get-Clipboard']]]
    : [
        ['wl-paste', ['--no-newline']],
        ['xclip', ['-selection', 'clipboard', '-o']],
      ];

  const errors = [];
  for (const [command, args] of candidates) {
    try {
      const { stdout } = await run(command, args, { maxBuffer: 8 * 1024 * 1024 });
      if (stdout.trim()) return stdout;
      errors.push(`${command} 返回空内容`);
    } catch (error) {
      if (error.code === 'ENOENT') {
        errors.push(`没装 ${command}`);
        continue;
      }
      errors.push(`${command}: ${error.message.split('\n')[0]}`);
    }
  }

  throw new Error(
    `读不到剪贴板（${errors.join('；')}）。\n` +
      'WSL 里需要 Windows 互操作可用（`powershell.exe` 能直接调用）；' +
      '或者在 Windows 侧先复制好，再手动粘贴 cURL 内容。',
  );
}

async function detectWsl() {
  try {
    return (await readFile('/proc/version', 'utf8')).toLowerCase().includes('microsoft');
  } catch {
    return false;
  }
}

const tokens = tokenize(input);
const parsed = parseCurl(tokens);

if (!parsed.url) {
  console.error('没解析出 URL，确认粘贴的是完整的 curl 命令（以 curl 开头）。');
  process.exit(1);
}

const env = {
  SOURCE: 'http',
  SOURCE_URL: parsed.url,
  SOURCE_METHOD: parsed.method,
  SOURCE_HEADERS: JSON.stringify(parsed.headers),
};
if (parsed.body) env.SOURCE_BODY = parsed.body;

printReport(parsed, env);

if (shouldWrite) {
  await upsertEnv(env);
  console.log('\n已写入 .env，接着运行：npm run dump');
} else {
  console.log('\n确认无误后加 --write 直接写入 .env，或者手动复制上面的内容。');
}

function tokenize(source) {
  const tokens = [];
  let current = '';
  let quote = null;
  let started = false;

  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];

    if (quote) {
      if (char === quote) quote = null;
      else if (char === '\\' && quote === '"' && i + 1 < source.length) {
        current += source[(i += 1)];
      } else current += char;
      continue;
    }

    if (char === "'" || char === '"') {
      quote = char;
      started = true;
      continue;
    }

    if (/\s/.test(char)) {
      if (started) {
        tokens.push(current);
        current = '';
        started = false;
      }
      continue;
    }

    current += char;
    started = true;
  }

  if (started) tokens.push(current);
  return tokens;
}

function parseCurl(tokens) {
  const headers = {};
  let url = '';
  let method = 'GET';
  let body = '';

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];

    if (token === '-H' || token === '--header') {
      const raw = tokens[(i += 1)] ?? '';
      const at = raw.indexOf(':');
      if (at > 0) headers[raw.slice(0, at).trim()] = raw.slice(at + 1).trim();
      continue;
    }

    if (token === '-b' || token === '--cookie') {
      headers.Cookie = tokens[(i += 1)] ?? '';
      continue;
    }

    if (token === '-X' || token === '--request') {
      method = (tokens[(i += 1)] ?? 'GET').toUpperCase();
      continue;
    }

    if (['-d', '--data', '--data-raw', '--data-binary'].includes(token)) {
      body = tokens[(i += 1)] ?? '';
      if (method === 'GET') method = 'POST';
      continue;
    }

    if (token === '--url') {
      url = tokens[(i += 1)] ?? '';
      continue;
    }

    if (!url && !token.startsWith('-') && token !== 'curl') {
      url = token;
    }
  }

  return { url, method, headers, body };
}

function printReport(parsed, env) {
  const names = Object.keys(parsed.headers);
  console.log(`识别到：${parsed.method} ${parsed.url}`);
  console.log(`请求头 ${names.length} 个：${names.join(', ') || '(无)'}`);

  if (!names.some((name) => /^(cookie|authorization|token|x-.*token|sign)$/i.test(name))) {
    console.log('⚠ 没看到明显的鉴权头，接口可能不需要登录，也可能你复制的是未登录状态的请求');
  }

  console.log('\n.env 片段：');
  for (const [key, value] of Object.entries(env)) {
    console.log(`${key}=${value}`);
  }

  console.log('\n下一步要确认「活动数组在响应的哪个位置」，常见写法：');
  for (const guess of ['data.list', 'data.records', 'data.rows', 'result.list', 'data']) {
    console.log(`  SOURCE_ITEMS_PATH=${guess}`);
  }
  console.log('不知道的话直接跑 npm run dump，它会列出响应的顶层字段。');
}

async function upsertEnv(pairs, file = '.env') {
  const text = existsSync(file) ? await readFile(file, 'utf8') : '';
  const seen = new Set();
  const lines = text.split(/\r?\n/).map((line) => {
    const match = line.match(/^([A-Z0-9_]+)=/);
    if (match && Object.hasOwn(pairs, match[1])) {
      seen.add(match[1]);
      return `${match[1]}=${pairs[match[1]]}`;
    }
    return line;
  });

  for (const [key, value] of Object.entries(pairs)) {
    if (!seen.has(key)) lines.push(`${key}=${value}`);
  }

  const output = `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`;
  await writeFile(file, output, 'utf8');
}
