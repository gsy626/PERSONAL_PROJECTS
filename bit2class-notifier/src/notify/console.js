export function consoleNotifier() {
  return {
    name: 'console',
    async send(message) {
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
