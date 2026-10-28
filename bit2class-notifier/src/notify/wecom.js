/**
 * 企业微信群机器人：免费、稳定、秒级到达，是个人自用最省事的一条通道。
 * 群设置 → 群机器人 → 添加 → 复制 Webhook。
 */
export function wecomNotifier({ webhook }) {
  return {
    name: 'wecom',
    async send(message) {
      if (!webhook) throw new Error('未配置 WECOM_WEBHOOK');

      const content = [
        `**${message.title}**`,
        ...message.lines.map((line) => `> ${line}`),
        message.url ? `[查看活动详情](${message.url})` : '',
      ]
        .filter(Boolean)
        .join('\n');

      const response = await fetch(webhook, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ msgtype: 'markdown', markdown: { content } }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok || (payload.errcode ?? 0) !== 0) {
        throw new Error(`企业微信返回异常：${JSON.stringify(payload)}`);
      }
    },
  };
}
