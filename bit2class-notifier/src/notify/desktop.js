import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);

/**
 * 系统原生通知。
 * Linux 走 notify-send，macOS 走 osascript，Windows 走 PowerShell Toast。
 *
 * 注意：Linux 上没有通知守护进程时，notify-send 会「成功返回 0 但什么都不显示」，
 * 这是最坑的静默失败。所以发送前先查一次 org.freedesktop.Notifications 有没有主人。
 */
export function desktopNotifier() {
  return {
    name: 'desktop',
    async send(message) {
      const title = String(message.title).slice(0, 120);
      const body = message.lines.join('\n').slice(0, 800);

      if (process.platform === 'darwin') {
        const script = `display notification ${quote(body)} with title ${quote(title)}`;
        await run('osascript', ['-e', script]);
        return;
      }

      if (process.platform === 'win32') {
        await sendWindowsToast(title, body);
        return;
      }

      await sendLinux(title, body);
    },
  };
}

function quote(text) {
  return JSON.stringify(text);
}

async function sendLinux(title, body) {
  if (!process.env.DISPLAY && !process.env.WAYLAND_DISPLAY) {
    throw new Error('没有图形会话（DISPLAY/WAYLAND_DISPLAY 都没设置），desktop 渠道不可用');
  }

  try {
    await run('notify-send', [
      '-a',
      '第二课堂',
      '-u',
      'normal',
      '-t',
      '15000',
      '-i',
      'dialog-information',
      title,
      body,
    ]);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error('没找到 notify-send，装一下 libnotify-bin（Debian/Ubuntu）或 libnotify（Arch）');
    }
    throw new Error(
      `notify-send 失败：${error.stderr?.trim() || error.message}。没有通知守护进程时通知会被丢弃，i3 下先运行 dunst`,
    );
  }
}

async function sendWindowsToast(title, body) {
  const script = `
$ErrorActionPreference = 'Stop'
[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
$template = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent([Windows.UI.Notifications.ToastTemplateType]::ToastText02)
$nodes = $template.GetElementsByTagName('text')
$nodes.Item(0).AppendChild($template.CreateTextNode($env:BIT2CLASS_TITLE)) | Out-Null
$nodes.Item(1).AppendChild($template.CreateTextNode($env:BIT2CLASS_BODY)) | Out-Null
$toast = [Windows.UI.Notifications.ToastNotification]::new($template)
[Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('第二课堂').Show($toast)
`;

  await run('powershell', ['-NoProfile', '-NonInteractive', '-Command', script], {
    env: { ...process.env, BIT2CLASS_TITLE: title, BIT2CLASS_BODY: body },
  });
}
