import { toDate } from './time.js';

/**
 * 纯函数：根据当前活动列表 + 已通知记录，算出这一轮该发哪些提醒。
 * 发不发得出去、发完怎么记，都由调用方负责，方便单测。
 *
 * @returns {Array<{key: string, kind: 'signup-soon'|'signup-open'|'new',
 *                  activity: object, signupStart: Date|null, minutesUntil: number|null}>}
 */
export function planNotifications({
  activities = [],
  state = {},
  now = Date.now(),
  leadMinutes = 5,
  graceMinutes = 10,
} = {}) {
  const notified = state.notified ?? {};
  const fired = [];

  for (const activity of activities) {
    const id = activity?.id;
    if (id === undefined || id === null || id === '') continue;

    const signupStart = toDate(activity.signupStart);

    // 没有明确的报名开始时间：只能按「新活动」提醒一次
    if (!signupStart) {
      const key = `new:${id}`;
      if (!notified[key]) {
        fired.push({ key, kind: 'new', activity, signupStart: null, minutesUntil: null });
      }
      continue;
    }

    const startAt = signupStart.getTime();
    const windowFrom = startAt - leadMinutes * 60_000;
    // 过了开始时间还能补发一段，防止进程恰好在那几分钟里重启/断网
    const windowUntil = startAt + graceMinutes * 60_000;

    // 时间改了也要重新提醒：key 里带上这次解析出的报名时间
    const key = `signup:${id}:${signupStart.toISOString()}:${leadMinutes}`;

    // 还没进窗口（或者已经过期很久），但需要把 key 记下来吗？不需要，交给调用方。
    if (now < windowFrom || now > windowUntil) continue;
    if (notified[key]) continue;

    fired.push({
      key,
      kind: now < startAt ? 'signup-soon' : 'signup-open',
      activity,
      signupStart,
      minutesUntil: Math.round((startAt - now) / 60_000),
    });
  }

  return fired;
}
