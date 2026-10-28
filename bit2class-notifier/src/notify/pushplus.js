/**
 * PushPlus：消息落到微信「推送加」服务号，个人免注册域名、免费额度够用。
 * https://www.pushplus.plus  →  一对一推送  →  复制 token
 */
const ENDPOINT = 'https://www.pushplus.plus/send';

export function pushplusNotifier({ token, topic }) {
  return {
    name: 'pushplus',
    async send(message) {
      if (!token) throw new Error('未配置 PUSHPLUS_TOKEN');

      const content = [
        ...message.lines.map((line) => `- ${line}`),
        message.url ? `\n[查看活动详情](${message.url})` : '',
      ]
        .filter(Boolean)
        .join('\n');

      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          token,
          title: message.title,
          content,
          template: 'markdown',
          ...(topic ? { topic } : {}),
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload.code !== 200) {
        throw new Error(`PushPlus 返回异常：${JSON.stringify(payload)}`);
      }
    },
  };
}
