/**
 * 通用 JSON 接口适配器：抓包拿到活动列表接口后，只改 .env 就能接上，不用写代码。
 *
 * 关键是两个配置：
 *   SOURCE_ITEMS_PATH   活动数组在响应里的位置，如 `data.list`
 *   SOURCE_FIELD_*      各字段在单条活动里的位置，如 `activityStartTime`、`base.title`
 */

/** 按点号路径取值，支持 `data.list[0].name` 这种写法。 */
export function pick(source, path) {
  if (path === undefined || path === null || path === '') return source;
  return String(path)
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean)
    .reduce((acc, key) => (acc === null || acc === undefined ? undefined : acc[key]), source);
}

export class HttpJsonSource {
  name = 'http';

  constructor(config) {
    this.cfg = config.http;
  }

  async fetchRaw() {
    const { url, method, headers, body } = this.cfg;
    if (!url) {
      throw new Error('缺少 SOURCE_URL：先按 README「接上真实数据」把抓包结果填进 .env');
    }

    const init = {
      method,
      headers: {
        // 有些校园接口会校验 UA/Referer，抓包时看到什么就补什么
        'user-agent': 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 MicroMessenger/8.0.49',
        accept: 'application/json, text/plain, */*',
        ...headers,
      },
    };
    if (method !== 'GET' && method !== 'HEAD' && body) init.body = body;

    const response = await fetch(url, init);
    return {
      status: response.status,
      ok: response.ok,
      text: await response.text(),
    };
  }

  async fetchActivities() {
    return this.parse(await this.fetchRaw());
  }

  /** 把原始响应解析成统一的活动结构；`npm run dump` 也会用到。 */
  parse({ status, ok, text }) {
    if (status === 401 || status === 403) {
      throw new Error(`登录态失效（HTTP ${status}）：重新抓一次 token/cookie，更新 SOURCE_HEADERS`);
    }

    let json;
    try {
      json = JSON.parse(text);
    } catch {
      throw new Error(
        `HTTP ${status}：响应不是 JSON（可能是登录页/风控页）。前 200 字：${text.slice(0, 200)}`,
      );
    }

    if (!ok) throw new Error(`HTTP ${status}：${text.slice(0, 200)}`);

    const items = this.cfg.itemsPath ? pick(json, this.cfg.itemsPath) : json;
    if (!Array.isArray(items)) {
      throw new Error(
        `在「${this.cfg.itemsPath || '(响应根)'}」没找到数组，检查 SOURCE_ITEMS_PATH（响应键：${Object.keys(json ?? {})
          .slice(0, 8)
          .join(', ')}）`,
      );
    }

    return items.map((raw, index) => this.normalize(raw, index));
  }

  normalize(raw, index) {
    const { map } = this.cfg;
    const id = pick(raw, map.id);
    const title = pick(raw, map.title);

    return {
      id: id === undefined || id === null || id === '' ? `row-${index}` : String(id),
      title: String(title ?? '').trim() || `(未命名活动 ${index + 1})`,
      signupStart: pick(raw, map.signupStart) ?? null,
      signupEnd: map.signupEnd ? (pick(raw, map.signupEnd) ?? null) : null,
      eventStart: map.eventStart ? (pick(raw, map.eventStart) ?? null) : null,
      url: map.url ? (pick(raw, map.url) ?? '') : '',
      raw,
    };
  }
}
