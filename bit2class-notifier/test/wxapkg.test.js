import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  extractUrls,
  isNoise,
  parseWxapkg,
  readWxapkgEntries,
  safeRelativePath,
} from '../src/wxapkg.js';

/** 按真实格式拼一个 wxapkg，用来验证解析器（拿不到真实包时至少保证格式正确）。 */
function buildPackage(entries) {
  const names = entries.map(([name]) => Buffer.from(name, 'utf8'));
  const indexLength = names.reduce((sum, name) => sum + 4 + name.length + 8, 0);
  const bodyLength = entries.reduce((sum, [, content]) => sum + Buffer.byteLength(content), 0);

  const header = Buffer.alloc(18);
  header.writeUInt8(0xbe, 0);
  header.writeUInt32BE(0x12345678, 1);
  header.writeUInt32BE(indexLength, 5);
  header.writeUInt32BE(bodyLength, 9);
  header.writeUInt8(0xed, 13);
  header.writeUInt32BE(entries.length, 14);

  const indexParts = [];
  let offset = 18 + indexLength;

  for (let i = 0; i < entries.length; i += 1) {
    const name = names[i];
    const size = Buffer.byteLength(entries[i][1]);
    const part = Buffer.alloc(4 + name.length + 8);
    part.writeUInt32BE(name.length, 0);
    name.copy(part, 4);
    part.writeUInt32BE(offset, 4 + name.length);
    part.writeUInt32BE(size, 8 + name.length);
    indexParts.push(part);
    offset += size;
  }

  return Buffer.concat([header, ...indexParts, ...entries.map(([, content]) => Buffer.from(content, 'utf8'))]);
}

const js = 'var base="https://dekt.bit.edu.cn/api";wx.request({url:base+"/activity/list"});';
const json = '{"pages":["pages/index/index"]}';

test('能解开自己按格式拼出来的包', () => {
  const buffer = buildPackage([
    ['app-service.js', js],
    ['app.json', json],
  ]);

  const parsed = parseWxapkg(buffer);
  assert.equal(parsed.fileCount, 2);
  assert.deepEqual(
    parsed.files.map((file) => file.name),
    ['app-service.js', 'app.json'],
  );

  const entries = readWxapkgEntries(buffer);
  assert.equal(entries[0].content.toString('utf8'), js);
  assert.equal(entries[1].content.toString('utf8'), json);
});

test('魔数不对时给明确错误，而不是乱解析', () => {
  const bogus = Buffer.from('not a wxapkg at all, just some bytes');
  assert.throws(() => parseWxapkg(bogus), /不是标准 wxapkg/);
});

test('文件太小时直接拒绝', () => {
  assert.throws(() => parseWxapkg(Buffer.from([0xbe, 0x00])), /文件太小/);
});

test('路径穿越的条目要被挡住', () => {
  assert.equal(safeRelativePath('/app-service.js'), 'app-service.js');
  assert.equal(safeRelativePath('\\pages\\index.js'), 'pages/index.js');
  assert.throws(() => safeRelativePath('../etc/passwd'), /不安全/);
});

test('能从 JS 里捞出接口地址，并过滤腾讯噪音', () => {
  const urls = extractUrls([
    {
      source: 'app-service.js',
      text: 'a("https://dekt.bit.edu.cn/api/activity/list?page=1");b("https://res.wx.qq.com/x.js");c("https://api.5idream.net/v1/act")',
    },
  ]);

  const addresses = urls.map((item) => item.url);
  assert.ok(addresses.includes('https://dekt.bit.edu.cn/api/activity/list?page=1'));
  assert.ok(addresses.includes('https://api.5idream.net/v1/act'));

  const useful = urls.filter((item) => !isNoise(item.url)).map((item) => item.url);
  assert.equal(useful.length, 2);
  assert.ok(!useful.some((url) => url.includes('qq.com')));

  // 记录来源文件，方便回头读上下文
  const hit = urls.find((item) => item.url.includes('dekt.bit.edu.cn'));
  assert.deepEqual(hit.sources, ['app-service.js']);
});
