/**
 * 不等真活动，用「已经报满的活动」把整条提醒链路跑一遍。
 *
 *   npm run demo                 # 挑 3 条已满的真实活动，响铃 + 打印
 *   npm run demo -- --limit=5    # 多来几条
 *   npm run demo -- --all        # 除了 console，桌面通知和 alerts-demo.md 也一起走
 *   npm run demo -- --kind=new   # 换一种消息样式：new / open / soon
 *   npm run demo -- --no-bell    # 不响铃
 *
 * 走的是和正式提醒完全相同的 renderMessage + broadcast，只是数据来源是当前接口里的历史活动。
 * 不写 state.json，所以你之后真的跑 npm start 时不会因为这次演练漏提醒。
 */
import { loadConfig, loadDotEnv } from '../config.js';
import { broadcast, createNotifiers } from '../notify/index.js';
import { renderMessage } from '../render.js';
import { createSource } from '../sources/index.js';
import { toDate } from '../time.js';

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const hit = args.find((arg) => arg.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};

const limit = Math.max(1, Number(flag('limit', 3)) || 3);
const kind = flag('kind', 'open');
const useAllChannels = args.includes('--all');
const noBell = args.includes('--no-bell');

if (!['open', 'new', 'soon'].includes(kind)) {
  console.error('--kind 只能是 open / new / soon');
  process.exit(1);
}

loadDotEnv();
const config = loadConfig();
if (noBell) config.channels.console.bell = false;

if (useAllChannels) {
  // 演练不想污染真实记录，写到单独的 alerts-demo.md
  config.channels.file.path = './data/alerts-demo.md';
} else {
  // 默认只打终端：绝不能往 data/alerts.md 里灌假提醒
  config.notifiers = ['console'];
}

const source = createSource(config);
const activities = await source.fetchActivities();
const now = Date.now();

const withTime = activities.filter((activity) => activity.signupStart);
const full = withTime.filter((activity) => {
  const used = Number(activity.applyCount);
  const total = Number(activity.capacity);
  return Number.isFinite(used) && Number.isFinite(total) && total > 0 && used >= total;
});

const picked = (full.length > 0 ? full : activities).slice(0, limit);

if (picked.length === 0) {
  console.error('接口里一条活动都没有，先检查 SOURCE_URL');
  process.exit(1);
}

const head = full.length > 0
  ? `演练：从 ${activities.length} 条真实活动里挑出 ${picked.length} 条【已报满】的（共 ${full.length} 条已满）`
  : `演练：没找到已满的活动，改用前 ${picked.length} 条真实活动`;
console.log(`\n${head}`);
console.log(`渠道：${useAllChannels ? config.notifiers.join(',') : 'console'}　渲染：和正式提醒同一套代码\n`);
if (config.channels.console.bell && process.stdout.isTTY) {
  console.log('（每条前会发一个 BEL，终端要能响：Windows Terminal 需在设置里把「响铃样式」调成非 none）\n');
} else if (config.channels.console.bell && !process.stdout.isTTY) {
  console.log('（当前输出不是终端，响铃自动静音；在真终端里跑才会响）\n');
}

const notifiers = createNotifiers(config);
const messages = picked.map((activity) => {
  const start = toDate(activity.signupStart);
  const minutes = start ? Math.round((start.getTime() - now) / 60_000) : 0;
  if (kind === 'soon') {
    return renderMessage({
      key: `demo:${activity.id}`,
      kind: 'signup-soon',
      activity,
      signupStart: activity.signupStart,
      minutesUntil: 5,
    });
  }
  return renderMessage({
    key: `demo:${activity.id}`,
    kind: kind === 'new' ? 'new' : 'signup-open',
    activity,
    signupStart: activity.signupStart,
    minutesUntil: kind === 'open' ? minutes : null,
  });
});

let delivered = 0;
for (const message of messages) {
  const result = await broadcast(notifiers, message);
  if (result.ok) delivered += 1;
  else console.error(`✘ 发送失败：${result.failed.map((f) => `${f.channel}: ${f.error}`).join('；')}`);
}

console.log(`演练结束：${messages.length} 条消息，${delivered} 条送达（没有写 state.json）`);
