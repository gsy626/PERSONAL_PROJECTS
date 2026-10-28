const BELL = '\u0007';

/**
 * 终端输出。默认每条消息先响一下铃（BEL），再画框输出内容。
 * 关掉：CONSOLE_BELL=0；某些终端（Windows Terminal 默认）要把「响铃样式」打开才有声音。
 */
export function consoleNotifier({ bell = true } = {}) {
  return {
    name: 'console',
    async send(message) {
      // 响铃写在内容前面：先听到声音，低头正好看到字
      if (bell && process.stdout.isTTY) process.stdout.write(BELL);

      const bar = '─'.repeat(46);
      console.log(`\n${bar}`);
      console.log(`  ${message.title}`);
      console.log(bar);
      for (const line of message.lines) console.log(`  ${line}`);
      if (message.url) console.log(`  ${message.url}`);
      console.log(`${bar}\n`);
    },
  };
}
