const timeFormatter = new Intl.DateTimeFormat('zh-CN', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

function stamp() {
  return timeFormatter.format(new Date()).replace(/\//g, '-');
}

function emit(level, message) {
  const line = `[${stamp()}] ${level} ${message}`;
  if (level === 'ERROR' || level === 'WARN') {
    console.error(line);
  } else {
    console.log(line);
  }
}

export const log = {
  info: (message) => emit('INFO ', message),
  warn: (message) => emit('WARN ', message),
  error: (message) => emit('ERROR', message),
};
