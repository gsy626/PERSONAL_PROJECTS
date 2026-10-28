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

const MAGIC = 0xbe;
const END_MARK = 0xed;
const HEADER_SIZE = 18;

export function parseWxapkg(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < HEADER_SIZE) {
    throw new Error('文件太小，不像 wxapkg');
  }

  const magic = buffer.readUInt8(0);
  if (magic !== MAGIC) {
    throw new Error(
      `不是标准 wxapkg：首字节是 0x${magic.toString(16)}，期望 0xbe。` +
        '可能是加密包、PC 微信新格式，或者拿错了文件。',
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
