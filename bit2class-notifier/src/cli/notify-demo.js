/** 逐个渠道发一条测试消息，确认本地提醒真的能看见。 */
import { loadConfig, loadDotEnv } from '../config.js';
import { createNotifiers } from '../notify/index.js';

loadDotEnv();
const config = loadConfig();

let notifiers;
try {
  notifiers = createNotifiers(config);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const message = {
  kind: 'test',
  title: '🔔 测试提醒：本地链路是否通畅',
  lines: [
    '活动：【测试】看到这条就说明通知链路是通的',
    '报名开始：刚刚',
    `发送时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`,
  ],
  url: 'https://example.com',
};

console.log(`渠道：${notifiers.map((notifier) => notifier.name).join(', ')}\n`);

let ok = 0;
for (const notifier of notifiers) {
  try {
    await notifier.send(message);
    ok += 1;
    console.log(`✔ ${notifier.name}`);
  } catch (error) {
    console.log(`✘ ${notifier.name}：${error.message}`);
  }
}

process.exitCode = ok > 0 ? 0 : 1;
