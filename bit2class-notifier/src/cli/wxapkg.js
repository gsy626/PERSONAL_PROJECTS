/**
 * 解小程序包，把里面的接口地址扒出来。
 *
 *   npm run wxapkg -- ~/wxapkg/__APP__.wxapkg
 *   npm run wxapkg -- ~/wxapkg/*.wxapkg
 *   npm run wxapkg -- --appid wx1234567890abcdef 加密包.wxapkg
 *
 * PC 微信 4.x 的包带 V1MMWX 壳，会按 appId 自动解密（appId 从路径里认，认不出才要 --appid）。
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';

import {
  decryptWxapkg,
  extractPaths,
  extractUrls,
  isEncryptedWxapkg,
  isNoise,
  readWxapkgEntries,
  resolveAppId,
  safeRelativePath,
} from '../wxapkg.js';

const rawArgs = process.argv.slice(2);
const flags = new Map(
  rawArgs
    .filter((arg) => arg.startsWith('--'))
    .map((arg) => {
      const [key, ...rest] = arg.slice(2).split('=');
      return [key.toLowerCase(), rest.join('=')];
    }),
);
const args = rawArgs.filter((arg) => !arg.startsWith('--'));
const appIdFlag = flags.get('appid') || '';
const outRoot = resolve('data/wxapkg');

if (args.length === 0) {
  console.error(
    '用法：npm run wxapkg -- [--appid wx...] <包路径> [更多包...]\n' +
      '提示：PC 微信打开过小程序后，包一般在\n' +
      '  %APPDATA%\\Tencent\\...  或  %USERPROFILE%\\Documents\\WeChat Files\\Applet\\...',
  );
  process.exit(1);
}

await mkdir(outRoot, { recursive: true });

const texts = [];
let totalFiles = 0;

for (const file of args) {
  const label = basename(file).replace(/\.wxapkg$/i, '');

  let buffer;
  try {
    buffer = await readFile(file);
  } catch (error) {
    console.error(`✘ ${file}：读不到文件（${error.code ?? error.message}）`);
    process.exitCode = 1;
    continue;
  }

  if (isEncryptedWxapkg(buffer)) {
    const appId = appIdFlag || resolveAppId(file);
    if (!appId) {
      console.error(
        `✘ ${file}：这是 PC 微信加密包（V1MMWX），但没从路径里认出 appId。\n` +
          '   手动指定：npm run wxapkg -- --appid wx89b19258915c9585 包路径',
      );
      process.exitCode = 1;
      continue;
    }
    try {
      buffer = decryptWxapkg(buffer, appId);
      console.log(`  （V1MMWX 加密包，已用 appId=${appId} 解密）`);
    } catch (error) {
      console.error(`✘ ${file}：${error.message}`);
      process.exitCode = 1;
      continue;
    }
  }

  let entries;
  try {
    entries = readWxapkgEntries(buffer);
  } catch (error) {
    console.error(`✘ ${file}：${error.message}`);
    process.exitCode = 1;
    continue;
  }

  const dir = join(outRoot, label);
  let written = 0;

  for (const entry of entries) {
    let relative;
    try {
      relative = safeRelativePath(entry.name);
    } catch {
      continue; // 跳过可疑路径，不中断整体
    }
    const target = join(dir, relative);
    await mkdir(resolve(target, '..'), { recursive: true });
    await writeFile(target, entry.content);
    written += 1;

    if (/\.(js|json|wxml)$/i.test(relative)) {
      texts.push({ source: `${label}/${relative}`, text: entry.content.toString('utf8') });
    }
  }

  totalFiles += written;
  console.log(`✔ ${file} → ${written} 个文件，解开到 data/wxapkg/${label}/`);
}

const urls = extractUrls(texts);
const interesting = urls.filter((item) => !isNoise(item.url));
const noiseCount = urls.length - interesting.length;

const report = [];
report.push(`共扫描 ${texts.length} 个文本文件，命中 ${urls.length} 个 URL，其中 ${interesting.length} 个可能有价值。`);
report.push('');

if (interesting.length === 0) {
  report.push('没找到有用的接口地址。可能的原因：');
  report.push('  1. 包被解开了但没解到底（加密包没认出 appId，试 --appid wx...）；');
  report.push('  2. 接口地址是运行时拼出来的（baseUrl + path 分开写）；');
  report.push('  3. 这是主包，接口在分包里（再抓一个 .wxapkg 过来）。');
  report.push('');
  report.push('把 data/wxapkg/ 下的内容留着，发我看看 JS 里是怎么拼 URL 的。');
} else {
  const byHost = new Map();
  for (const item of interesting) {
    const host = new URL(item.url).host;
    if (!byHost.has(host)) byHost.set(host, []);
    byHost.get(host).push(item.url);
  }

  report.push('== 按域名分组 ==');
  for (const [host, list] of [...byHost.entries()].sort((a, b) => b[1].length - a[1].length)) {
    report.push(`\n${host}  (${list.length})`);
    for (const url of list.slice(0, 12)) report.push(`  ${url}`);
    if (list.length > 12) report.push(`  …… 另有 ${list.length - 12} 个`);
  }
}

if (noiseCount > 0) {
  report.push('');
  report.push(`（已过滤 ${noiseCount} 个腾讯/规范类噪音域名）`);
}

const paths = extractPaths(texts);
if (paths.length > 0) {
  report.push('');
  report.push('== 疑似接口路径（字符串字面量里的一级路径）==');
  for (const item of paths.slice(0, 40)) {
    report.push(`  ${item.path}`);
  }
  if (paths.length > 40) report.push(`  …… 另有 ${paths.length - 40} 个`);
}

const output = report.join('\n');
console.log(`\n${output}`);
await writeFile(join(outRoot, 'ENDPOINTS.txt'), `${output}\n`, 'utf8');
console.log(`\n完整清单已写入 data/wxapkg/ENDPOINTS.txt（共解开 ${totalFiles} 个文件）`);
