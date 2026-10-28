import assert from 'node:assert/strict';
import { test } from 'node:test';

import { planNotifications } from '../src/plan.js';

const now = Date.parse('2026-11-01T12:00:00+08:00');

const activity = (overrides = {}) => ({
  id: 'a1',
  title: '活动一',
  signupStart: '2026-11-01T12:03:00+08:00',
  ...overrides,
});

test('进入提前窗口就提醒一次，并算出还剩几分钟', () => {
  const fired = planNotifications({ activities: [activity()], state: { notified: {} }, now });
  assert.equal(fired.length, 1);
  assert.equal(fired[0].kind, 'signup-soon');
  assert.equal(fired[0].minutesUntil, 3);
});

test('还没进窗口不提醒', () => {
  const fired = planNotifications({
    activities: [activity({ signupStart: '2026-11-01T12:30:00+08:00' })],
    state: { notified: {} },
    now,
  });
  assert.equal(fired.length, 0);
});

test('提醒过就不再重复', () => {
  const first = planNotifications({ activities: [activity()], state: { notified: {} }, now });
  const state = { notified: { [first[0].key]: new Date(now).toISOString() } };
  const second = planNotifications({ activities: [activity()], state, now });
  assert.equal(second.length, 0);
});

test('错过窗口但在补救期内，补发「报名已开始」', () => {
  const fired = planNotifications({
    activities: [activity({ signupStart: '2026-11-01T11:58:00+08:00' })],
    state: { notified: {} },
    now,
    graceMinutes: 10,
  });
  assert.equal(fired.length, 1);
  assert.equal(fired[0].kind, 'signup-open');
});

test('超过补救期就放弃，不追着推历史活动', () => {
  const fired = planNotifications({
    activities: [activity({ signupStart: '2026-11-01T11:40:00+08:00' })],
    state: { notified: {} },
    now,
    graceMinutes: 10,
  });
  assert.equal(fired.length, 0);
});

test('报名时间被改动后会重新提醒（去重 key 带时间戳）', () => {
  const first = planNotifications({ activities: [activity()], state: { notified: {} }, now });
  const state = { notified: { [first[0].key]: new Date(now).toISOString() } };
  const second = planNotifications({
    activities: [activity({ signupStart: '2026-11-01T12:04:00+08:00' })],
    state,
    now,
  });
  assert.equal(second.length, 1);
});

test('没有报名开始时间的活动按「新活动」提醒一次', () => {
  const fired = planNotifications({
    activities: [activity({ signupStart: null })],
    state: { notified: {} },
    now,
  });
  assert.equal(fired.length, 1);
  assert.equal(fired[0].kind, 'new');

  const again = planNotifications({
    activities: [activity({ signupStart: null })],
    state: { notified: { [fired[0].key]: 'x' } },
    now,
  });
  assert.equal(again.length, 0);
});

test('时间字段是「待定」这类脏值时按没有时间处理', () => {
  const fired = planNotifications({
    activities: [activity({ signupStart: '待定' })],
    state: { notified: {} },
    now,
  });
  assert.equal(fired[0].kind, 'new');
});

test('没有 id 的活动直接跳过', () => {
  const fired = planNotifications({
    activities: [activity({ id: null })],
    state: { notified: {} },
    now,
  });
  assert.equal(fired.length, 0);
});
