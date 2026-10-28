# bit2class-notifier

北京理工「第二课堂」活动报名提醒。轮询活动列表 → 算准「报名开始前 N 分钟」→ 推到你手机上。

Node.js + 原生 ESM，**零运行时依赖**，一个 `node src/index.js` 就能跑，也能直接丢进云函数。

默认把提醒推到**本机**（终端 + 系统通知 + 本地日志文件），先把数据源接通，再决定要不要上微信。

---

## 先讲清楚三件难事

这类项目真正的难点不在代码，而在下面三件事。想清楚再动手，能省掉大量返工。

### 1. 小程序的「订阅消息」你用不了

微信小程序的订阅消息，**只有小程序自己的后台能发**，而且必须由用户在小程序里主动点「允许订阅」。第三方拿不到这个能力，所以任何「外部提醒工具」都只能：

> 自己定时去拉一次活动列表 → 自己判断时间 → 走**外部**通知渠道推给你。

这个项目就是这条链路。

### 2. 数据从哪来，决定了项目能不能成

先确认一件事：活动列表页面上，**有没有「报名开始时间」这个字段**（比如「11 月 1 日 20:00 开始报名」）。

- **有** → 提前 N 分钟提醒成立，这是最理想的情况。
- **只有「报名中 / 已结束」状态** → 做不到「提前几分钟」，只能做到「一发布就通知」，靠缩短轮询间隔（比如 30 秒）来抢。这也比手动刷强，但性质不一样。
- **发布时间就是开始时间**（发布即可抢） → 同上，提前提醒没有意义。

### 3. 鉴权会过期，这是长期运行的唯一真实成本

校园接口基本都要 token / cookie。抓一次能用几天到几周，过期后要么手动更新，要么做自动续期。项目里做了明确报错（HTTP 401/403 会直接提示你更新凭据），不会静默失败。

---

## 架构

```
                ┌────────────────────────────────┐
                │  数据源适配器  src/sources/     │
                │  mock（内置假数据）             │
                │  http-json（抓包接口，改 .env） │
                │  自定义（继承同一个接口）       │
                └───────────────┬────────────────┘
                                │ 每 60s 拉一次活动列表
                                ▼
                ┌────────────────────────────────┐
                │  调度与去重  src/plan.js        │
                │  now ≥ 报名开始 - 5min → 命中   │
                │  data/state.json 记录已提醒     │
                └───────────────┬────────────────┘
                                │ 一条结构化消息
        ┌───────────┬───────────┼───────────┬────────────┐
        ▼           ▼           ▼           ▼            ▼
     console     企业微信     PushPlus    通用 Webhook   自己加
                群机器人      服务号       （n8n 等）
```

设计上刻意拆成三层，因为**换数据源的概率远高于换通知渠道**：抓包结果一变，只动 `src/sources/`；想换推送方式，只动 `src/notify/`。

---

## 30 秒先跑起来（假数据，不需要任何账号）

```bash
npm test        # 15 个用例，覆盖窗口判断/去重/补发/脏数据
npm start       # 用内置 mock 数据跑起来，日志里 1 分钟内会弹提醒
npm run once    # 只跑一轮就退出（云函数用这个）
```

`mock` 数据每次启动都以当前时间为基准生成：一个 2 分钟后开始报名的活动、一个已经开始 1 分钟的、一个 45 分钟后的、一个长期招募的、一个 100 分钟后的。第一次运行会把现有活动记为「基线」不补发，但**正在窗口内的会正常提醒**，所以 `npm start` 几秒内就能看到完整效果。

想让多条提醒合并成一条摘要，把 `LEAD_MINUTES=120` 再跑一次看看。

### 提醒到本地：三条通道

```dotenv
NOTIFIERS=console,desktop,file
```

| 渠道 | 效果 | 说明 |
| --- | --- | --- |
| `console` | 终端里画个框 | 永远可用，`npm start` 挂着就能看 |
| `desktop` | 系统原生弹窗 | Linux 走 `notify-send`，macOS 走 `osascript`，Windows 走 Toast |
| `file` | 追加到 `data/alerts.md` | 出去一趟回来还能翻「那天提醒过什么」 |

先验证一遍链路：

```bash
npm run test-notify
```

```
✔ console
✔ desktop
✔ file
```

> **Linux 上没弹窗？** 系统通知必须有通知守护进程（i3/dwm 这类窗口管理器默认不带）。`dunst` 是最常见的选择：
> 先 `dunst &` 试一下，再写进 i3 config：`exec --no-startup-id dunst`。
> 没有守护进程时 `notify-send` 有时会「静默丢弃」—— `test-notify` 里 `desktop` 报错或没弹窗，就是这个问题。

---

## 接上真实数据：三条路，按可行性排序

> 手把手流程（侦察平台 → 选抓包路线 → 找对请求 → 抄成配置）单独写在
> **[docs/CAPTURE.md](docs/CAPTURE.md)**，卡住先看那个。Windows + PC 微信的逐步操作在
> **[docs/WINDOWS.md](docs/WINDOWS.md)**，抓完想丢进 WSL 常驻看 **[docs/WSL.md](docs/WSL.md)**。

### 路线 A：找网页版接口（首选）

如果这套「第二课堂」跑在到梦空间之类的平台上，通常除了小程序还有**网页版 / APP / H5**，同一个后端、同一套接口，在浏览器里按 F12 就能看到请求，比抓小程序省事得多。

找到活动列表接口后，只改 `.env`：

```dotenv
SOURCE=http
SOURCE_URL=https://xxx/api/activity/list?page=1&size=50
SOURCE_METHOD=GET
SOURCE_HEADERS={"Cookie":"SESSION=xxxx","Referer":"https://xxx/"}
SOURCE_ITEMS_PATH=data.list
SOURCE_FIELD_ID=id
SOURCE_FIELD_TITLE=title
SOURCE_FIELD_SIGNUP_START=applyStartTime
SOURCE_FIELD_URL=detailUrl
```

`SOURCE_ITEMS_PATH` 和 `SOURCE_FIELD_*` 都支持点号路径，比如 `data.page.records`、`base.title`。

### 路线 B：抓小程序的包

1. **Android**：装 [Reqable](https://reqable.com/) / HttpCanary，装好 CA 证书，手机代理指向电脑。
2. **PC 微信**：在电脑版微信里打开这个小程序，用 Charles / Reqable 的 PC 端抓 `dldir1.qq.com` 之外的目标域名。小程序在 PC 上跑，请求看得更清楚。
3. 操作一遍「活动列表 → 下拉刷新 → 进详情」，找出返回活动数组的那个请求。
4. **把完整请求头抄下来**（`token`、`cookie`、`referer`、自定义签名头如 `sign`、`timestamp` 一个都不能少）。很多接口是靠自定义头鉴权的，少一个就 401。
5. 填进 `.env`，先验证：

```bash
npm run dump
```

`dump` 会把原始响应打出来，再按你配的映射解析一遍。对不上时它会告诉你响应顶层有哪些字段，照着改 `SOURCE_ITEMS_PATH` 即可。

> 签名类接口（参数带 `sign`/`nonce`）会麻烦一些：签名通常跟时间戳绑定，过期就失效。这种情况要么走路线 A，要么用 Playwright 打开网页版让浏览器自己算签名。

### 路线 C：平台自带提醒 + 人工兜底

先去看看小程序/公众号里有没有「活动提醒」「开抢通知」开关。有的话，本项目的价值就只剩「聚合 + 多渠道兜底」，别重复造轮子。

### 抓到之后：一条命令转配置

```bash
npm run from-curl -- "curl ..."             # 只解析，先看一眼
npm run from-curl -- "curl ..." --write     # 直接写进 .env
npm run from-clipboard -- --write           # WSL：直接读 Windows 剪贴板，免粘贴
```

三种续行风格（bash `\`、cmd `^`、PowerShell 反引号）和 `curl.exe` 前缀都能吃，粘多行不会错位。

---

## 通知渠道怎么选

| 渠道 | 消息落在哪 | 免费额度 | 到达速度 | 接入成本 |
| --- | --- | --- | --- | --- |
| **企业微信群机器人** | 企业微信 App | 不限 | 1–2 秒 | 建个群 → 加机器人 → 复制 Webhook |
| **PushPlus** | 微信「推送加」服务号 | 约 200 条/天 | 数秒 | 注册拿 token |
| 微信测试号模板消息 | 微信会话 | 够用 | 秒级 | 要关注测试号 + 配模板（最像「真微信推送」） |
| Server酱 | 微信服务号 | 5 条/天 | 数秒 | 注册拿 key |
| Bark | iOS 通知中心 | 免费 | 秒级 | 装 App 拿 URL |
| Telegram Bot | TG | 免费 | 秒级 | 国内要代理 |
| 邮件 | 邮箱 | 免费 | 几十秒 | SMTP 配置 |

额度以各官网为准。**推荐组合：企业微信机器人（主）+ PushPlus（备）**，两个都配，一个挂了另一个还能到。

已实现：`console`、`desktop`、`file`、`wecom`、`pushplus`、`webhook`。加新渠道只要在 `src/notify/` 写一个 `{ name, async send(message) }`，再在 `src/notify/index.js` 注册一行。

```dotenv
NOTIFIERS=wecom,pushplus
WECOM_WEBHOOK=https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxxx
PUSHPLUS_TOKEN=xxxx
```

---

## 配置项

| 变量 | 默认 | 说明 |
| --- | --- | --- |
| `SOURCE` | `mock` | `mock` / `http` |
| `POLL_INTERVAL_SECONDS` | `60` | 轮询间隔，太小容易触发风控 |
| `LEAD_MINUTES` | `5` | 提前几分钟提醒 |
| `GRACE_MINUTES` | `10` | 错过窗口后的补发期 |
| `NOTIFIERS` | `console` | 逗号分隔的渠道列表 |
| `STATE_FILE` | `./data/state.json` | 去重状态 |
| `ALERT_LOG` | `./data/alerts.md` | `file` 渠道的记录文件 |
| `RETENTION_DAYS` | `30` | 状态保留天数 |
| `SOURCE_URL` / `SOURCE_METHOD` / `SOURCE_HEADERS` / `SOURCE_BODY` | — | 接口地址与请求 |
| `SOURCE_ITEMS_PATH` | 空 | 活动数组位置 |
| `SOURCE_FIELD_*` | 见 `.env.example` | 字段映射 |

---

## 部署：注意定时精度

| 方式 | 定时精度 | 适合 |
| --- | --- | --- |
| 家里常开的电脑/NAS/树莓派 | 秒级，进程常驻 | **最推荐**，`pm2 start src/index.js` 或 systemd |
| Windows + WSL | 秒级，但受 Windows 睡眠影响 | 见 [docs/WSL.md](docs/WSL.md)；适合白天开机、活动主要在白天发布的情况 |
| 云函数（腾讯云 SCF / 阿里云 FC） | 最小 1 分钟，基本准时 | 不想维护机器，国内网络直连校园接口 |
| GitHub Actions `schedule` | 最小 5 分钟，高峰期还会延迟 5–15 分钟 | 只适合「提前 30 分钟」这种宽窗口，**不适合提前几分钟** |

云函数用单次模式：`node src/index.js --once`，定时触发器配 1 分钟。

> 网络很关键：校园接口常常只对国内 IP 友好，海外 VPS 可能直接超时或触发风控。

---

## 几个可靠性细节（都已实现）

- **首次运行建立基线**：不会把库里几十个历史活动当「新活动」一次性刷屏。
- **去重 key 带报名时间**：`signup:<id>:<报名开始ISO>:<提前分钟>`，报名时间被改过会重新提醒一次。
- **补发窗口**：进程恰好在那几分钟里重启/断网，报名开始后 `GRACE_MINUTES` 内还会补一条「报名已开始」；超过就放弃，不追着推历史活动。
- **多条合并**：一轮命中超过 3 条会自动合成一条摘要，避免 20 条消息轰炸。
- **失败重试**：单渠道重试 2 次；全部渠道失败则不写去重记录，下一轮再来。
- **单轮失败不退出**：接口抽风、断网都靠下一轮自愈，只记日志。
- **固定北京时间**：不依赖宿主机 `TZ`，无时区的时间字符串一律按 +08:00 解析。

---

## 边界与合规

- 这是**个人自用**的小工具：低频（1 分钟一次）、串行、不并发、不批量拉取。
- 别把抓到的 `token` / `cookie` 提交进 git（`.gitignore` 已排除 `.env`），也别分享给别人用。
- 接口属于学校/平台方，抓取和使用请自行评估是否符合学校规定；高频轮询可能导致账号被限制，宁可把间隔调到 60–120 秒。
- 提醒只作辅助，**报名时间以官方页面为准**；本工具不代报名、不绕过任何限制。

---

## Roadmap

- [x] 本地提醒：终端 / 系统通知 / Markdown 日志
- [x] `from-curl`：抓包结果一条命令转配置
- [ ] 接一个真实数据源（等你抓包结果）
- [ ] 分页拉取（接口只返回 20 条时）
- [ ] Playwright 兜底：网页版登录后复用 `storageState`，自动处理签名/续期
- [ ] 微信测试号模板消息渠道（真正落到微信会话）
- [ ] 详情页直链：把活动 URL 换成小程序深链（`wxaurl` 短链），点通知直接跳活动页
- [ ] 简单 Web 面板：看已收录活动、下次提醒时间、手动测试推送

---

## 目录

```
src/
├── index.js            # 入口，--once 单次 / 默认常驻
├── app.js              # 轮询循环 + 渲染消息 + 去重落盘
├── plan.js             # 纯函数：这一轮该发哪些提醒（可单测）
├── config.js           # .env 解析 + 配置
├── log.js / time.js    # 日志、北京时间处理
├── store.js            # JSON 状态存储（原子写）
├── wxapkg.js           # 小程序包解析 + 接口地址提取
├── sources/            # 数据源适配器（mock / http-json）
├── notify/             # 通知渠道（console / desktop / file / wecom / pushplus / webhook）
└── cli/
    ├── dump.js         # 打印接口原始响应 + 按映射解析的结果
    ├── from-curl.js    # 把「Copy as cURL」变成 .env
    ├── notify-demo.js  # 逐个渠道发测试消息（npm run test-notify）
    └── wxapkg.js       # 解包，扒出接口地址（npm run wxapkg）
docs/CAPTURE.md         # 抓包指南：三条路线怎么选
docs/WINDOWS.md         # Windows + PC 微信 逐步操作
docs/WSL.md             # 在 WSL 里托管常驻
test/                   # node --test，无第三方测试框架
```
