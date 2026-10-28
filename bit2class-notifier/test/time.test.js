import assert from 'node:assert/strict';
import { test } from 'node:test';

import { formatDateTime, humanize, toDate } from '../src/time.js';

test('不带时区的时间按北京时间理解', () => {
  assert.equal(toDate('2026-11-01 12:00').toISOString(), '2026-11-01T04:00:00.000Z');
  assert.equal(toDate('2026-11-01T12:00:00').toISOString(), '2026-11-01T04:00:00.000Z');
  assert.equal(toDate('2026/11/01').toISOString(), '2026-10-31T16:00:00.000Z');
  assert.equal(toDate('2026年11月1日 12:00').toISOString(), '2026-11-01T04:00:00.000Z');
});

test('带时区的 ISO 原样解析', () => {
  assert.equal(toDate('2026-11-01T12:00:00+08:00').toISOString(), '2026-11-01T04:00:00.000Z');
  assert.equal(toDate('2026-11-01T04:00:00Z').toISOString(), '2026-11-01T04:00:00.000Z');
});

test('秒级和毫秒级时间戳都能认', () => {
  assert.equal(toDate(1761969600).toISOString(), new Date(1761969600_000).toISOString());
  assert.equal(toDate(1761969600000).toISOString(), new Date(1761969600000).toISOString());
});

test('空值和脏值返回 null，不抛异常', () => {
  assert.equal(toDate(null), null);
  assert.equal(toDate(undefined), null);
  assert.equal(toDate(''), null);
  assert.equal(toDate('待定'), null);
});

test('格式化固定按北京时间', () => {
  assert.equal(formatDateTime('2026-11-01T04:00:00Z'), '2026-11-01 12:00');
  assert.equal(formatDateTime(null), '未知');
});

test('时长口语化', () => {
  assert.equal(humanize(0), '不到 1 分钟');
  assert.equal(humanize(90_000), '2 分钟');
  assert.equal(humanize(3_600_000), '1 小时');
  assert.equal(humanize(3_900_000), '1 小时 5 分钟');
});
