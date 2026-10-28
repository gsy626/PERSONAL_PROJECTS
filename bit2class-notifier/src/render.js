import { formatDateTime, humanize, toDate } from './time.js';

export const DIGEST_THRESHOLD = 3; // 一轮超过 3 条就合并成一条摘要，避免刷屏
export const MAX_DIGEST_ITEMS = 10;

/** 「名额：12/40（已满）」——接口没给名额信息就返回 null，整行不出现。 */
export function capacityLine(activity) {
  const applied = activity?.applyCount;
  const capacity = activity?.capacity;
  if (applied === null || applied === undefined || applied === '') return null;
  if (capacity === null || capacity === undefined || capacity === '') return null;

  const used = Number(applied);
  const total = Number(capacity);
  if (!Number.isFinite(used) || !Number.isFinite(total) || total <= 0) return null;

  return `名额：${used}/${total}${used >= total ? '（已满）' : ''}`;
}

/** 把 plan.js 算出来的一条命中渲染成「一条消息」，渠道层只管发。 */
export function renderMessage(item) {
  const activity = item.activity;
  const name = activity.title || '(未命名活动)';
  const url = activity.url || '';
  const slots = capacityLine(activity);

  if (item.kind === 'signup-soon') {
    const lead = humanize((item.minutesUntil ?? 0) * 60_000);
    return {
      kind: item.kind,
      title: `⏰ ${lead}后开始报名`,
      lines: [
        `活动：${name}`,
        `报名开始：${formatDateTime(item.signupStart)}`,
        ...(slots ? [slots] : []),
        '可以先去详情页确认报名条件，时间一到立刻下手',
      ],
      url,
    };
  }

  if (item.kind === 'signup-open') {
    return {
      kind: item.kind,
      title: '🔔 报名已经开始',
      lines: [
        `活动：${name}`,
        `报名开始：${formatDateTime(item.signupStart)}（已开始 ${humanize((item.minutesUntil ?? 0) * 60_000)}）`,
        ...(slots ? [slots] : []),
        slots?.endsWith('（已满）') ? '名额已经满了，可以蹲一下有没有人退' : '名额有限，建议立刻前往',
      ],
      url,
    };
  }

  const start = toDate(activity.signupStart);
  return {
    kind: item.kind,
    title: `🆕 新活动：${name}`,
    lines: [
      `报名时间：${start ? formatDateTime(start) : '以活动详情页为准'}`,
      ...(activity.eventStart ? [`活动时间：${formatDateTime(activity.eventStart)}`] : []),
      ...(slots ? [slots] : []),
    ],
    url,
  };
}

/** 一轮命中太多条时合成一条摘要。 */
export function digestMessages(messages) {
  const shown = messages.slice(0, MAX_DIGEST_ITEMS);
  const lines = [];
  for (const [index, message] of shown.entries()) {
    lines.push(`${index + 1}. ${message.title}`);
    if (message.lines[0]) lines.push(`   ${message.lines[0]}`);
  }
  if (messages.length > shown.length) {
    lines.push(`…… 另有 ${messages.length - shown.length} 条`);
  }
  return {
    kind: 'digest',
    title: `第二课堂：${messages.length} 条报名提醒`,
    lines,
    url: '',
  };
}
