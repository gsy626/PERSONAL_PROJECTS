import { broadcast, createNotifiers } from './notify/index.js';
import { planNotifications } from './plan.js';
import { DIGEST_THRESHOLD, digestMessages, renderMessage } from './render.js';
import { createSource } from './sources/index.js';
import { JsonStore, prune } from './store.js';
import { log } from './log.js';

export function createApp(config) {
  const source = createSource(config);
  const notifiers = createNotifiers(config);
  const store = new JsonStore(config.stateFile);

  let timer = null;
  let busy = false;
  let stopped = false;

  async function tick() {
    if (busy) {
      log.warn('上一轮还没跑完，跳过本轮');
      return { skipped: true };
    }
    busy = true;

    try {
      const activities = await source.fetchActivities();
      const now = Date.now();
      const state = await store.load();

      // 首次运行只建立基线：不把已经存在的几十个活动当成「新活动」刷一遍
      if (!state.initializedAt) {
        state.initializedAt = new Date(now).toISOString();
        for (const activity of activities) {
          if (activity?.id) state.notified[`new:${activity.id}`] = new Date(now).toISOString();
        }
        log.info(`首次运行：已把 ${activities.length} 个活动记为基线（不补发历史「新活动」提醒）`);
      }

      const fired = planNotifications({
        activities,
        state,
        now,
        leadMinutes: config.leadMinutes,
        graceMinutes: config.graceMinutes,
      });

      const messages = fired.map(renderMessage);
      const payloads = messages.length > DIGEST_THRESHOLD ? [digestMessages(messages)] : messages;

      let delivered = 0;
      for (const payload of payloads) {
        const result = await broadcast(notifiers, payload);
        if (result.ok) delivered += 1;
        else log.error(`推送失败：${result.failed.map((f) => `${f.channel}: ${f.error}`).join('；')}`);
      }

      if (payloads.length > 0 && delivered < payloads.length) {
        log.warn('有提醒没送达，不写去重记录，下一轮重试');
      } else {
        for (const item of fired) state.notified[item.key] = new Date(now).toISOString();
      }

      for (const activity of activities) {
        if (!activity?.id) continue;
        state.activities[activity.id] = {
          title: activity.title,
          signupStart: activity.signupStart ?? null,
          lastSeenAt: new Date(now).toISOString(),
        };
      }

      prune(state, now, { keepDays: config.retentionDays });
      await store.save(state);

      log.info(
        `轮询完成：${activities.length} 个活动，${fired.length} 条提醒，${delivered} 条送达`,
      );
      return { activities: activities.length, fired: fired.length, delivered };
    } finally {
      busy = false;
    }
  }

  async function start() {
    log.info(
      `数据源=${config.source} | 每 ${config.pollSeconds}s 轮询 | 提前 ${config.leadMinutes} 分钟提醒 | 渠道=${notifiers
        .map((n) => n.name)
        .join(',')}`,
    );

    const shutdown = (signal) => {
      stopped = true;
      if (timer) clearTimeout(timer);
      log.info(`收到 ${signal}，退出`);
      process.exit(0);
    };
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    const loop = async () => {
      try {
        await tick();
      } catch (error) {
        // 单轮失败不退出：接口偶尔抽风、断网、登录态过期都靠下一轮自愈
        log.error(`本轮出错：${error.message}`);
      }
      if (stopped) return;
      // 用 setTimeout 串起来而不是 setInterval，避免上一轮没跑完就叠buff
      timer = setTimeout(loop, config.pollSeconds * 1000);
    };

    await loop();
  }

  return { tick, start };
}
