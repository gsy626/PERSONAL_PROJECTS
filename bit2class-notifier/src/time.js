export const TZ = 'Asia/Shanghai';

// 中国大陆无夏令时，固定 +08:00 即可，避免依赖宿主机的 TZ 环境变量。
const OFFSET = '+08:00';

const pad = (value, length = 2) => String(value).padStart(length, '0');

/**
 * 把数据源里各种时间写法统一成 Date，解析不了返回 null。
 * 支持：ISO 字符串、秒/毫秒时间戳、`2026-11-01 12:00`、`2026/11/01`、`2026年11月1日 12:00`。
 * 不带时区的写法一律按北京时间理解。
 */
export function toDate(value) {
  if (value === null || value === undefined || value === '') return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;

  if (typeof value === 'number') {
    // 10 位是秒，13 位是毫秒
    const ms = Math.abs(value) < 1e12 ? value * 1000 : value;
    const date = new Date(ms);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const raw = String(value).trim();
  if (!raw) return null;

  // 纯数字时间戳
  if (/^\d{10}$|^\d{13}$/.test(raw)) return toDate(Number(raw));

  // 无时区的中文/常规写法
  const loose = raw.match(
    /^(\d{4})[-/年](\d{1,2})[-/月](\d{1,2})日?(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/,
  );
  if (loose) {
    const [, y, mo, d, h = '0', mi = '0', s = '0'] = loose;
    return new Date(`${y}-${pad(mo)}-${pad(d)}T${pad(h)}:${pad(mi)}:${pad(s)}${OFFSET}`);
  }

  const parsed = new Date(raw.replace(/\//g, '-'));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

const dateTimeFormatter = new Intl.DateTimeFormat('zh-CN', {
  timeZone: TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

/** 2026-11-01 19:30（北京时间） */
export function formatDateTime(value) {
  const date = toDate(value);
  if (!date) return '未知';
  const parts = Object.fromEntries(
    dateTimeFormatter.formatToParts(date).map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}`;
}

/** 毫秒 → 「2 分钟」「1 小时 5 分钟」 */
export function humanize(ms) {
  const minutes = Math.round(Math.abs(ms) / 60_000);
  if (minutes < 1) return '不到 1 分钟';
  if (minutes < 60) return `${minutes} 分钟`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} 小时 ${rest} 分钟` : `${hours} 小时`;
}
