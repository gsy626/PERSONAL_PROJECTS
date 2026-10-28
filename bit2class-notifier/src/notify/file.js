import { appendFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

import { formatDateTime } from '../time.js';

/**
 * 落盘一份 Markdown 记录。优点是不依赖任何服务、永远成功，
 * 出去一趟回来还能翻到「那天到底提醒过什么」。
 */
export function fileNotifier({ path = './data/alerts.md' } = {}) {
  return {
    name: 'file',
    async send(message) {
      await mkdir(dirname(path), { recursive: true });

      const block = [
        `## ${message.title}`,
        '',
        `- 时间：${formatDateTime(new Date())}`,
        ...message.lines.map((line) => `- ${line}`),
        message.url ? `- 链接：${message.url}` : '',
        '',
      ]
        .filter((line) => line !== '')
        .join('\n');

      await appendFile(path, `${block}\n`, 'utf8');
    },
  };
}
