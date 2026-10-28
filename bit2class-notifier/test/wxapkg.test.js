import assert from 'node:assert/strict';
import { createCipheriv, pbkdf2Sync } from 'node:crypto';
import { test } from 'node:test';

import {
  decryptWxapkg,
  extractUrls,
  isEncryptedWxapkg,
  isNoise,
  parseWxapkg,
  readWxapkgEntries,
  resolveAppId,
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

/** 按 PC 微信 4.x 的 V1MMWX 格式把裸包封一层，验证解密逻辑。 */
function encryptPackage(plain, appId) {
  const cipher = createCipheriv(
    'aes-256-cbc',
    pbkdf2Sync(appId, 'saltiest', 1000, 32, 'sha1'),
    Buffer.from('the iv: 16 bytes', 'latin1'),
  );
  const head = Buffer.concat([cipher.update(plain.subarray(0, 1023)), cipher.final()]);
  const xorKey = appId.charCodeAt(appId.length - 2);
  const tail = Buffer.from(plain.subarray(1023).map((byte) => byte ^ xorKey));
  return Buffer.concat([Buffer.from('V1MMWX', 'latin1'), head, tail]);
}

test('V1MMWX 加密包能按 appId 解回标准 wxapkg', () => {
  // 前 1023 字节要够长，所以塞一段够大的 JS
  const big = `${js}\n${'// padding line\n'.repeat(120)}`;
  const plain = buildPackage([['app-service.js', big], ['app.json', json]]);
  const appId = 'wx89b19258915c9585';

  const encrypted = encryptPackage(plain, appId);
  assert.ok(isEncryptedWxapkg(encrypted));
  assert.equal(isEncryptedWxapkg(plain), false);

  const decrypted = decryptWxapkg(encrypted, appId);
  assert.deepEqual(decrypted, plain);
  assert.equal(parseWxapkg(decrypted).fileCount, 2);

  // 没加密的包原样返回，方便无脑调用
  assert.deepEqual(decryptWxapkg(plain, appId), plain);
});

test('appId 不对时明确报错，而不是吐出乱码', () => {
  const plain = buildPackage([['app-service.js', `${js}\n${'// padding line\n'.repeat(120)}`]]);
  const encrypted = encryptPackage(plain, 'wx89b19258915c9585');
  assert.throws(() => decryptWxapkg(encrypted, 'wx0000000000000000'), /首字节|解密失败/);
  assert.throws(() => decryptWxapkg(encrypted, ''), /需要 appId/);
});

test('能从路径里认出 appId', () => {
  assert.equal(
    resolveAppId('C:\\Users\\a\\AppData\\Roaming\\Tencent\\xwechat\\radium\\users\\x\\applet\\packages\\wx89b19258915c9585\\32\\__APP__.wxapkg'),
    'wx89b19258915c9585',
  );
  assert.equal(resolveAppId('data/wxapkg-src/wxfa43a4a7041a84de-__PLUGINCODE__.wxapkg'), 'wxfa43a4a7041a84de');
  assert.equal(resolveAppId('data/wxapkg-src/__APP__.wxapkg'), '');
});

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
