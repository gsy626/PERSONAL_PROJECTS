/**
 * 抓包之后的第一步：把接口原样打出来，确认哪个字段是报名开始时间。
 *   npm run dump
 */
import { loadConfig, loadDotEnv } from '../config.js';
import { createSource } from '../sources/index.js';

loadDotEnv();
const config = loadConfig();
const source = createSource(config);

if (config.source === 'mock') {
  console.log(JSON.stringify(await source.fetchActivities(), null, 2));
} else {
  const raw = await source.fetchRaw();
  console.log(`HTTP ${raw.status}`);

  let parsed = null;
  try {
    parsed = JSON.parse(raw.text);
    console.log(JSON.stringify(parsed, null, 2));
  } catch {
    console.log('（响应不是 JSON，前 4000 字如下）');
    console.log(raw.text.slice(0, 4000));
  }

  console.log('\n--- 按当前 .env 映射解析出的活动 ---');
  try {
    const activities = await source.parse(raw);
    console.log(JSON.stringify(activities.map(({ raw: _raw, ...rest }) => rest), null, 2));
  } catch (error) {
    console.log(`解析失败：${error.message}`);
    if (parsed && typeof parsed === 'object') {
      console.log(`响应顶层字段：${Object.keys(parsed).join(', ')}`);
    }
  }
}
