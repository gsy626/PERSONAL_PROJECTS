/** 通用 Webhook：把结构化消息 POST 出去，方便接 n8n / 自建服务 / 其它机器人。 */
export function webhookNotifier({ url }) {
  return {
    name: 'webhook',
    async send(message) {
      if (!url) throw new Error('未配置 GENERIC_WEBHOOK_URL');

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title: message.title,
          content: message.lines.join('\n'),
          url: message.url ?? '',
          kind: message.kind ?? 'unknown',
          sentAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook 返回 HTTP ${response.status}`);
      }
    },
  };
}
