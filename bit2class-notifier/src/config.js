import { existsSync, readFileSync } from 'node:fs';

/** 极简 .env 读取（不覆盖已有环境变量），省掉 dotenv 依赖。 */
export function loadDotEnv(file = '.env') {
  if (!existsSync(file)) return false;
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
  return true;
}

const num = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const list = (value) =>
  String(value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

function json(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    throw new Error(`环境变量不是合法 JSON：${value.slice(0, 80)}`);
  }
}

export function loadConfig(env = process.env) {
  return {
    source: (env.SOURCE ?? 'mock').trim().toLowerCase(),
    pollSeconds: Math.max(15, num(env.POLL_INTERVAL_SECONDS, 60)),
    leadMinutes: Math.max(0, num(env.LEAD_MINUTES, 5)),
    graceMinutes: Math.max(0, num(env.GRACE_MINUTES, 10)),
    stateFile: env.STATE_FILE || './data/state.json',
    retentionDays: Math.max(1, num(env.RETENTION_DAYS, 30)),

    notifiers: list(env.NOTIFIERS || 'console,desktop,file'),

    http: {
      url: env.SOURCE_URL || '',
      method: (env.SOURCE_METHOD || 'GET').toUpperCase(),
      headers: json(env.SOURCE_HEADERS, {}),
      body: env.SOURCE_BODY || '',
      itemsPath: env.SOURCE_ITEMS_PATH || '',
      map: {
        id: env.SOURCE_FIELD_ID || 'id',
        title: env.SOURCE_FIELD_TITLE || 'title',
        signupStart: env.SOURCE_FIELD_SIGNUP_START || 'signupStart',
        signupEnd: env.SOURCE_FIELD_SIGNUP_END || '',
        eventStart: env.SOURCE_FIELD_EVENT_START || '',
        url: env.SOURCE_FIELD_URL || '',
        applyCount: env.SOURCE_FIELD_APPLY_COUNT || '',
        capacity: env.SOURCE_FIELD_CAPACITY || '',
      },
    },

    channels: {
      console: { bell: String(env.CONSOLE_BELL ?? '1') !== '0' },
      file: { path: env.ALERT_LOG || './data/alerts.md' },
      wecom: { webhook: env.WECOM_WEBHOOK || '' },
      pushplus: { token: env.PUSHPLUS_TOKEN || '', topic: env.PUSHPLUS_TOPIC || '' },
      webhook: { url: env.GENERIC_WEBHOOK_URL || '' },
    },
  };
}
