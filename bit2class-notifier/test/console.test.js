import assert from 'node:assert/strict';
import { test } from 'node:test';

import { consoleNotifier } from '../src/notify/console.js';

/** 截获 stdout.write，并临时把 isTTY 装作真终端（响铃只在 TTY 里发）。 */
async function capture({ isTTY }, run) {
  const chunks = [];
  const originalWrite = process.stdout.write;
  const descriptor = Object.getOwnPropertyDescriptor(process.stdout, 'isTTY');

  process.stdout.write = (chunk) => {
    chunks.push(String(chunk));
    return true;
  };
  Object.defineProperty(process.stdout, 'isTTY', { value: isTTY, configurable: true });

  try {
    await run();
  } finally {
    process.stdout.write = originalWrite;
    if (descriptor) Object.defineProperty(process.stdout, 'isTTY', descriptor);
    else delete process.stdout.isTTY;
  }

  return chunks.join('');
}

const message = { title: '🔔 报名已经开始', lines: ['活动：测试活动', '名额：1/1（已满）'], url: '' };

test('终端里会先响铃，再输出内容', async () => {
  const output = await capture({ isTTY: true }, () => consoleNotifier().send(message));

  assert.equal(output[0], '\u0007', '第一个字节应该是 BEL');
  assert.ok(output.includes('报名已经开始'));
  assert.ok(output.includes('活动：测试活动'));
  assert.equal(output.split('\u0007').length - 1, 1, '一条消息只响一次');
});

test('CONSOLE_BELL=0 时不响铃', async () => {
  const output = await capture({ isTTY: true }, () => consoleNotifier({ bell: false }).send(message));
  assert.ok(!output.includes('\u0007'));
  assert.ok(output.includes('活动：测试活动'));
});

test('输出被重定向（不是 TTY）时不往日志里塞乱码', async () => {
  const output = await capture({ isTTY: false }, () => consoleNotifier().send(message));
  assert.ok(!output.includes('\u0007'));
  assert.ok(output.includes('活动：测试活动'));
});
