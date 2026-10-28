/**
 * 微信小程序包（.wxapkg）解析。
 *
 * 文件结构（大端）：
 *   0       1 字节  魔数 0xBE
 *   1       4 字节  未知（通常是 0x12345678 之类的版本标记）
 *   5       4 字节  索引区长度
 *   9       4 字节  数据区长度
 *   13      1 字节  结束标记 0xED
 *   14      4 字节  文件数
 *   18      索引区：每项 = 名字长度(4) + 名字(utf8) + 偏移(4) + 大小(4)
 *   ...     数据区：按偏移取内容
 */

import { createDecipheriv, pbkdf2Sync } from 'node:crypto';

const MAGIC = 0xbe;
const END_MARK = 0xed;
const HEADER_SIZE = 18;

/**
 * PC 微信（4.x）落盘的包不是裸 wxapkg，而是套了一层「V1MMWX」加密：
 *   6 字节魔数 "V1MMWX" | 1024 字节 AES-256-CBC（明文前 1023 字节 + PKCS7 补齐）
 *   | 剩余数据逐个字节异或 xorKey
 *
 * AES key = PBKDF2-SHA1(appId, "saltiest", 1000 次, 32 字节)，IV 固定；
 * xorKey = appId 的倒数第 2 个字符的 ASCII（appId 太短时用 0x66）。
 * appId 就是包所在目录名，形如 wx89b19258915c9585。
 */
const ENCRYPTED_MAGIC = 'V1MMWX';
const AES_PLAIN_BYTES = 1023;
const AES_BLOCK_BYTES = 1024;
const AES_SALT = 'saltiest';
const AES_IV = Buffer.from('the iv: 16 bytes', 'latin1');
const FALLBACK_XOR_KEY = 0x66;

/** 这个包是不是被 PC 微信加了 V1MMWX 壳（加密包首字节是 'V'，不是 0xBE）。 */
export function isEncryptedWxapkg(buffer) {
  return Buffer.isBuffer(buffer) && buffer.length >= 6 && buffer.subarray(0, 6).toString('latin1') === ENCRYPTED_MAGIC;
}

/**
 * 解掉 V1MMWX 外壳，返回标准 wxapkg。没加密就原样返回，方便无脑调用。
 * appId 传错会解出乱码，这里用「首字节必须是 0xBE」兜住。
 */
export function decryptWxapkg(buffer, appId) {
  if (!isEncryptedWxapkg(buffer)) return buffer;
  if (!appId) {
    throw new Error('这是 PC 微信加密包（V1MMWX），需要 appId 才能解密：--appid wx1234567890abcdef');
  }

  const body = buffer.subarray(6);
  if (body.length <= AES_BLOCK_BYTES) {
    throw new Error(`加密包太小（${body.length} 字节），不像完整的 wxapkg`);
  }

  let head;
  try {
    const decipher = createDecipheriv(
      'aes-256-cbc',
      pbkdf2Sync(appId, AES_SALT, 1000, 32, 'sha1'),
      AES_IV,
    );
    head = Buffer.concat([decipher.update(body.subarray(0, AES_BLOCK_BYTES)), decipher.final()]);
  } catch (error) {
    throw new Error(`解密失败（appId=${appId}？）：${error.message}`);
  }

  if (head.length !== AES_PLAIN_BYTES) {
    throw new Error(`解密后的头部长度异常（${head.length}，期望 ${AES_PLAIN_BYTES}）`);
  }

  const xorKey = appId.length >= 2 ? appId.charCodeAt(appId.length - 2) : FALLBACK_XOR_KEY;
  const tail = Buffer.allocUnsafe(body.length - AES_BLOCK_BYTES);
  for (let index = 0; index < tail.length; index += 1) {
    tail[index] = body[AES_BLOCK_BYTES + index] ^ xorKey;
  }

  const plain = Buffer.concat([head, tail]);
  if (plain.readUInt8(0) !== MAGIC) {
    throw new Error(
      `解密后首字节是 0x${plain.readUInt8(0).toString(16)}，不是 0xbe：appId 十有八九不对`,
    );
  }
  return plain;
}

/**
 * 从路径里认出 appId：目录名（.../packages/wx89b19258915c9585/32/__APP__.wxapkg）
 * 或文件名前缀（wx89b19258915c9585-__APP__.wxapkg）。认不出返回空串。
 */
export function resolveAppId(filePath) {
  const segments = String(filePath ?? '')
    .split(/[\\/]+/)
    .filter(Boolean)
    .reverse();
  for (const segment of segments) {
    const match = segment.match(/^(wx[0-9a-f]{16})(?:$|[-_.])/i);
    if (match) return match[1].toLowerCase();
  }
  return '';
}

export function parseWxapkg(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < HEADER_SIZE) {
    throw new Error('文件太小，不像 wxapkg');
  }

  const magic = buffer.readUInt8(0);
  if (magic !== MAGIC) {
    throw new Error(
      `不是标准 wxapkg：首字节是 0x${magic.toString(16)}，期望 0xbe。` +
        'PC 微信 4.x 的包是 V1MMWX 加密壳，先用 decryptWxapkg() 解密（CLI 会自动做，认不出 appId 时加 --appid）。',
    );
  }

  if (buffer.readUInt8(13) !== END_MARK) {
    throw new Error('wxapkg 结束标记异常（应为 0xED），文件可能不完整');
  }

  const indexInfoLength = buffer.readUInt32BE(5);
  const bodyInfoLength = buffer.readUInt32BE(9);
  const fileCount = buffer.readUInt32BE(14);

  if (fileCount > 200_000) {
    throw new Error(`文件数异常（${fileCount}），可能不是 wxapkg 或已损坏`);
  }

  const files = [];
  let cursor = HEADER_SIZE;

  for (let index = 0; index < fileCount; index += 1) {
    if (cursor + 4 > buffer.length) throw new Error(`索引越界：第 ${index} 个文件`);

    const nameLength = buffer.readUInt32BE(cursor);
    cursor += 4;
    if (nameLength > 1024 || cursor + nameLength + 8 > buffer.length) {
      throw new Error(`索引损坏：第 ${index} 个文件路径长度异常（${nameLength}）`);
    }

    const name = buffer.toString('utf8', cursor, cursor + nameLength);
    cursor += nameLength;

    const offset = buffer.readUInt32BE(cursor);
    cursor += 4;
    const size = buffer.readUInt32BE(cursor);
    cursor += 4;

    if (offset + size > buffer.length) {
      throw new Error(`文件「${name}」数据越界（offset=${offset}, size=${size}）`);
    }

    files.push({ name, offset, size });
  }

  return { indexInfoLength, bodyInfoLength, fileCount, files };
}

/** 取出每个文件的真实内容。 */
export function readWxapkgEntries(buffer) {
  const { files } = parseWxapkg(buffer);
  return files.map((file) => ({
    name: file.name,
    content: buffer.subarray(file.offset, file.offset + file.size),
  }));
}

/** 去掉开头的 /，并挡掉 ../ 这种路径穿越。 */
export function safeRelativePath(name) {
  const cleaned = name.replace(/^[\\/]+/, '').replace(/\\/g, '/');
  if (!cleaned || cleaned.split('/').includes('..')) {
    throw new Error(`不安全的文件路径：${name}`);
  }
  return cleaned;
}

const NOISE_HOSTS = [
  'w3.org',
  'qq.com',
  'weixin.qq.com',
  'wechat.com',
  'gtimg.cn',
  'qpic.cn',
  'qlogo.cn',
  'wx.qq.com',
  'npmjs.com',
  'github.com',
  'json-schema.org',
  'schema.org',
  'example.com',
];

const URL_PATTERN = /https?:\/\/[\w.-]+(?::\d{1,5})?(?:[/?#][^\s"'`)\]<>\\]*)?/g;

/** 从一堆 JS 文本里捞出所有绝对 URL。 */
export function extractUrls(texts) {
  const hits = new Map();

  for (const { source, text } of texts) {
    const matches = text.match(URL_PATTERN);
    if (!matches) continue;
    for (const url of matches) {
      const trimmed = url.replace(/["'`,;)\]]+$/, '');
      if (!hits.has(trimmed)) hits.set(trimmed, new Set());
      hits.get(trimmed).add(source);
    }
  }

  return [...hits.entries()]
    .map(([url, sources]) => ({ url, sources: [...sources] }))
    .sort((a, b) => a.url.localeCompare(b.url));
}

export function isNoise(url) {
  try {
    const { hostname } = new URL(url);
    return NOISE_HOSTS.some((host) => hostname === host || hostname.endsWith(`.${host}`));
  } catch {
    return true;
  }
}

const PATH_PATTERN = /["'`](\/[\w\-.]+(?:\/[\w\-.]+)*(?:\?[^"'`\s]*)?)["'`]/g;
const STATIC_ASSET = /\.(png|jpe?g|gif|svg|webp|css|wxml|wxss|js|json|ttf|woff2?)$/i;

/**
 * 接口地址常写成 `base + "/activity/list"`，绝对 URL 抓不到。
 * 这里把字符串字面量里的路径也捞出来，排掉静态资源和页面路由。
 */
export function extractPaths(texts) {
  const hits = new Map();

  for (const { source, text } of texts) {
    for (const match of text.matchAll(PATH_PATTERN)) {
      const path = match[1];
      if (path.length < 4 || STATIC_ASSET.test(path)) continue;
      if (path.startsWith('/pages/') || path.startsWith('/images/') || path.startsWith('/static/')) {
        continue;
      }
      if (!hits.has(path)) hits.set(path, new Set());
      hits.get(path).add(source);
    }
  }

  return [...hits.entries()]
    .map(([path, sources]) => ({ path, sources: [...sources] }))
    .sort((a, b) => a.path.localeCompare(b.path));
}
