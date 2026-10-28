import { consoleNotifier } from './console.js';
import { desktopNotifier } from './desktop.js';
import { fileNotifier } from './file.js';
import { pushplusNotifier } from './pushplus.js';
import { webhookNotifier } from './webhook.js';
import { wecomNotifier } from './wecom.js';

const ATTEMPTS = 2;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function createNotifiers(config) {
  const notifiers = [];

  for (const name of config.notifiers) {
    const channel = config.channels?.[name] ?? {};
    switch (name) {
      case 'console':
        notifiers.push(consoleNotifier());
        break;
      case 'desktop':
        notifiers.push(desktopNotifier());
        break;
      case 'file':
        notifiers.push(fileNotifier(channel));
        break;
      case 'wecom':
        notifiers.push(wecomNotifier(channel));
        break;
      case 'pushplus':
        notifiers.push(pushplusNotifier(channel));
        break;
      case 'webhook':
        notifiers.push(webhookNotifier(channel));
        break;
      default:
        throw new Error(
          `未知通知渠道 ${name}，可选：console / desktop / file / wecom / pushplus / webhook`,
        );
    }
  }

  return notifiers;
}

/**
 * 多通道并发推送。只要有一个通道成功就算送达；
 * 全挂时 ok=false，调用方不写去重记录，下一轮还会重试。
 */
export async function broadcast(notifiers, message) {
  let delivered = 0;
  const failed = [];

  await Promise.all(
    notifiers.map(async (notifier) => {
      for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
        try {
          await notifier.send(message);
          delivered += 1;
          return;
        } catch (error) {
          if (attempt < ATTEMPTS) {
            await sleep(800 * attempt);
            continue;
          }
          failed.push({ channel: notifier.name, error: error?.message ?? String(error) });
        }
      }
    }),
  );

  return { ok: delivered > 0, delivered, failed };
}
