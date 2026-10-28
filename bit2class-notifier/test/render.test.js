import assert from 'node:assert/strict';
import { test } from 'node:test';

import { capacityLine, digestMessages, renderMessage } from '../src/render.js';

const activity = {
  id: '2295',
  title: '报告题目：中医经验的智能传承与临床验证',
  signupStart: '2026-10-28 15:53',
  eventStart: null,
  url: '',
  applyCount: '100',
  capacity: 100,
};

test('名额满了会在消息里标出来', () => {
  assert.equal(capacityLine(activity), '名额：100/100（已满）');
  assert.equal(capacityLine({ ...activity, applyCount: '12', capacity: 40 }), '名额：12/40');
});

test('接口没给名额信息时整行不出现', () => {
  assert.equal(capacityLine({}), null);
  assert.equal(capacityLine({ applyCount: null, capacity: 100 }), null);
  assert.equal(capacityLine({ applyCount: 3, capacity: 0 }), null);
  assert.equal(capacityLine({ applyCount: 'abc', capacity: 10 }), null);
});

test('报名已开始：标题 + 已开始时长 + 满员提示', () => {
  const message = renderMessage({
    kind: 'signup-open',
    activity,
    signupStart: activity.signupStart,
    minutesUntil: -10,
  });

  assert.equal(message.title, '🔔 报名已经开始');
  assert.equal(message.lines[1], '报名开始：2026-10-28 15:53（已开始 10 分钟）');
  assert.equal(message.lines[2], '名额：100/100（已满）');
  assert.ok(message.lines[3].includes('蹲一下'));
});

test('报名将开始：标题带提前量', () => {
  const message = renderMessage({
    kind: 'signup-soon',
    activity: { ...activity, applyCount: '0', capacity: 40 },
    signupStart: activity.signupStart,
    minutesUntil: 5,
  });

  assert.equal(message.title, '⏰ 5 分钟后开始报名');
  assert.ok(message.lines.includes('名额：0/40'));
  assert.ok(!message.lines.some((line) => line.includes('已满')));
});

test('多条命中合成摘要，超出的折成一行', () => {
  const messages = Array.from({ length: 12 }, (_, index) => ({
    title: `⏰ 5 分钟后开始报名`,
    lines: [`活动：活动 ${index + 1}`],
  }));

  const digest = digestMessages(messages);
  assert.equal(digest.title, '第二课堂：12 条报名提醒');
  assert.ok(digest.lines.includes('…… 另有 2 条'));
  assert.equal(digest.lines.filter((line) => line.startsWith('10.')).length, 1);
});
