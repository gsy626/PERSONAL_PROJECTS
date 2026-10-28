import { createApp } from './app.js';
import { loadConfig, loadDotEnv } from './config.js';
import { log } from './log.js';

const loaded = loadDotEnv();
const config = loadConfig();
const args = new Set(process.argv.slice(2));

if (loaded) log.info('已加载 .env');
const app = createApp(config);

if (args.has('--once')) {
  // 适合放进云函数定时触发器
  try {
    const result = await app.tick();
    log.info(`单次模式结束：${JSON.stringify(result)}`);
  } catch (error) {
    log.error(error?.message ?? String(error));
    if (process.env.DEBUG) console.error(error?.stack);
    process.exitCode = 1;
  }
} else {
  await app.start();
}
