# 使用方法

> 一句话：`cd` 进项目目录，`npm start`，窗口别关。到点它自己响铃 + 打印。
> 当前这台机器上已经有一个标题为「第二课堂监控」的窗口在跑，别重复启动。

---

## 1. 启动与停止

```powershell
cd D:\HOME\draft\bit2class-notifier
npm start
```

- 启动后立刻跑一轮，之后每 60 秒一轮，日志形如
  `[2026-10-28 21:25:00] INFO  轮询完成：100 个活动，1 条提醒，1 条送达`
- **停止**：窗口里按 `Ctrl+C`，或者直接关掉窗口。没有后台服务、没有守护进程，窗口在就在跑。
- 窗口**必须是真终端**（pwsh / cmd / Windows Terminal / VS Code 终端都行），响铃才有效；输出被重定向到文件时会自动静音。

想验证通知链路（不碰真实数据）：

```powershell
npm run demo                  # 拿接口里「已报满」的真实活动演一遍
npm run test-notify           # 每个渠道发一条测试消息
```

---

## 2. 命令一览

| 想干什么 | 命令 | 说明 |
| --- | --- | --- |
| 常驻监控 | `npm start` | 每 60 秒一轮，这就是日常用法 |
| 只跑一轮就退出 | `npm run once` | 云函数 / 任务计划程序用这个 |
| 演练，不等真活动 | `npm run demo` | 见下方参数 |
| 看接口返回 + 字段对不对 | `npm run dump` | 换接口、字段变了先用它 |
| 逐个渠道发测试消息 | `npm run test-notify` | 配了微信渠道后先发一条试试 |
| 跑单测 | `npm test` | 31 个用例 |
| 重新扒接口 | `npm run wxapkg -- <包路径>` | 见第 8 节 |

`npm run demo` 的参数：

| 参数 | 作用 |
| --- | --- |
| `--limit=5` | 输出几条（默认 3） |
| `--kind=open` | 报名已开始（默认） |
| `--kind=soon` | 5 分钟后开始报名（演示提前提醒的样子） |
| `--kind=new` | 新活动 |
| `--all` | 连桌面通知 + `data/alerts-demo.md` 一起走（默认只在终端打印，不碰真实记录） |
| `--no-bell` | 只验内容，不响铃 |

它不写 `state.json`，演练多少次都不影响真实去重。

---

## 3. 提醒长什么样

到点时终端响一声，然后画框：

```
──────────────────────────────────────────────
  ⏰ 5 分钟后开始报名
──────────────────────────────────────────────
  活动：排练室没有派对 1st
  报名开始：2026-10-28 21:30
  名额：0/150
  可以先去详情页确认报名条件，时间一到立刻下手
──────────────────────────────────────────────
```

三种标题：`⏰ N 分钟后开始报名`（窗口打开）、`🔔 报名已经开始`（错过了但在 10 分钟补救期内）、`🆕 新活动：xxx`（刚发布、没给报名时间）。一轮命中超过 3 条会自动合成一条摘要。

---

## 4. 改配置：只改 `.env`，改完要重启

| 想改什么 | 变量 | 现在 |
| --- | --- | --- |
| 提前几分钟提醒 | `LEAD_MINUTES` | `5` |
| 轮询间隔（秒） | `POLL_INTERVAL_SECONDS` | `60` |
| 错过后的补发窗口（分钟） | `GRACE_MINUTES` | `10` |
| 通知渠道 | `NOTIFIERS` | `console,file` |
| 终端响铃 | `CONSOLE_BELL` | `1`（`0` 静音） |
| 提醒记录文件 | `ALERT_LOG` | `./data/alerts.md` |
| 拉多少条活动 | `SOURCE_URL` 里的 `limit` | `100` |

改完 `.env` **必须重启**（Ctrl+C 再 `npm start`），配置只在启动时读一次。

渠道可选值：`console`（响铃画框）、`file`（写 `data/alerts.md`）、`desktop`（Windows 右下角 Toast）、`wecom`、`pushplus`、`webhook`。

---

## 5. 想推到手机（可选）

手机比电脑可靠得多——电脑一睡眠就断。二选一或都配：

```dotenv
NOTIFIERS=console,file,wecom,pushplus

WECOM_WEBHOOK=https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx
PUSHPLUS_TOKEN=xxx
```

- **企业微信**：建个只有自己的群 → 群设置 → 群机器人 → 添加 → 复制 Webhook。免费不限量、1–2 秒到。
- **PushPlus**：pushplus.plus 微信扫码拿 token，推到「推送加」服务号，约 200 条/天。

配好先 `npm run test-notify` 验证，通了再 `npm start`。

---

## 6. 确认它还在干活

```powershell
# 1) 心跳：这个文件的修改时间每分钟更新一次
(Get-Item D:\HOME\draft\bit2class-notifier\data\state.json).LastWriteTime

# 2) 提醒记录：到点后会多一段
Get-Content D:\HOME\draft\bit2class-notifier\data\alerts.md -Tail 20
```

3) 最直接：看那个窗口，每分钟应该有一行 `轮询完成`。窗口一旦被关，监控就停了。

---

## 7. 出问题对照表

| 现象 | 原因 | 怎么办 |
| --- | --- | --- |
| 不响铃，但框照常打印 | 终端静音 / 输出被重定向 | Windows Terminal 设置里把「响铃样式」改成 `audible`；VS Code 打开 `terminal.integrated.enableBell` |
| 一条提醒都没有 | 窗口早关了 / 电脑睡眠了 | 重开 `npm start`；电源计划设成不睡眠 |
| 提醒比报名晚 | 电脑时钟不准 / 轮询间隔太大 | 校准时间；`POLL_INTERVAL_SECONDS` 调到 30–60 |
| 同一个活动提醒两次 | 报名时间被后台改过（去重 key 带时间） | 正常行为，不用管 |
| 重复刷屏同一批活动 | 开了两个实例，或删了 `data/state.json` | 只留一个窗口；删了状态文件等于重置基线，会重新建基线 |
| 窗口看着卡住、日志不再滚动 | 鼠标点进窗口选中了文字（Windows 控制台的 QuickEdit 会把进程挂起） | 按 `Esc` 或回车取消选中；想边跑边复制，先暂停再复制 |
| `dump` 返回 HTML / 401 / 403 | 接口要登录态或改版了 | 见第 8 节重新扒 |
| `轮询完成：0 个活动` | `limit` 或 `SOURCE_URL` 写错 | `npm run dump` 看原始返回 |

---

## 8. 接口变了怎么办

```powershell
# 1) 在 PC 微信里打开一次小程序（包会落到磁盘）
npm run wxapkg -- "$env:APPDATA\Tencent\xwechat\radium\users\<uid>\applet\packages\wx89b19258915c9585\32\__APP__.wxapkg"

# 2) 认不出 appId 时手动指定
npm run wxapkg -- --appid wx89b19258915c9585 <包路径>

# 3) 看 data/wxapkg/ENDPOINTS.txt + 解开源码里的 config/index.js、api/app.js

# 4) 改 .env 的 SOURCE_URL / SOURCE_ITEMS_PATH / SOURCE_FIELD_*，验证
npm run dump
```

---

## 9. 开机自启（可选，需要管理员）

```powershell
schtasks /Create /TN "第二课堂监控" /SC ONLOGON /RL LIMITED /TR "pwsh -NoExit -Command \"cd D:\HOME\draft\bit2class-notifier; npm start\""
```

删除：`schtasks /Delete /TN "第二课堂监控" /F`。注意它开的是新窗口，关掉窗口监控还是会停。

---

## 10. 边界

- 只轮询、只提醒，**不代报名**，也不会替你点任何按钮。
- 一分钟一次、单线程、不并发，别把间隔压到 15 秒以内。
- 接口不需要登录态，所以 `.env` 里没有 token 可泄露；`data/` 和 `.env` 都不进 git。
