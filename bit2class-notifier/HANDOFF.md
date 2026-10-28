# 交接说明

> 一段话版本，可直接转发 / 粘给新的会话。

项目在 `/home/guosh/drafts/bit2class-notifier`，是一个零依赖的 Node.js（≥ 20.6，纯 ESM）小工具：定时轮询北理「第二课堂」的活动列表，在**报名开始前 N 分钟**（默认 5 分钟）把提醒推到本机，已有 console / 系统桌面通知 / Markdown 日志三个渠道，微信推送（企业微信机器人、PushPlus）代码就绪但没启用。数据源做成适配器，目前只有内置 mock，20 个单测全绿，`npm start` 能用假数据跑通全流程（去重、错过补发、多条合并、失败重试都实现好了）；**真实接口还没接上，这是唯一卡点**。换到 Windows 后：把整个目录拷过去（原生 Windows 或 WSL 都行；用 WSL 就放 `~` 下，别放 `/mnt/c`），先 `npm test` 确认全绿，然后二选一拿到接口——① 在 PC 微信里打开一次小程序，把磁盘上的 `.wxapkg` 拷过来，`npm run wxapkg -- 包路径` 直接扒出接口地址（不用装证书）；② 用 Reqable 抓包，`npm run from-curl -- "curl ..." --write`。拿到后填 `.env` 的 `SOURCE_URL` / `SOURCE_HEADERS` / `SOURCE_ITEMS_PATH` / `SOURCE_FIELD_*`，用 `npm run dump` 验证能解析出活动，再把「请求路径 + 一条活动 JSON + 请求头名字」带回来。注意两点：WSL 会随终端退出而停，要按 `docs/WSL.md` 用 systemd 托管；提醒是按分钟算的，注意 WSL 时钟漂移。细节：`docs/WINDOWS.md`（抓包与解包）、`docs/WSL.md`（WSL 托管）、`docs/CAPTURE.md`（总览）。

---

## 落地先跑这四条

```bash
node -v                 # 需要 >= 20.6
npm test                # 20 个用例应全绿
npm start               # mock 数据，几秒内能看到提醒
npm run test-notify     # 验证本地通知真的能弹出来
```

## 目录在哪儿

| 想看什么 | 去哪 |
| --- | --- |
| 抓包 / 解包小程序 | `docs/WINDOWS.md` |
| 迁到 WSL 长期挂着 | `docs/WSL.md` |
| 三条路线怎么选 | `docs/CAPTURE.md` |
| 改了行为要跑测试 | `npm test`（`test/` 下，`node --test`，无第三方框架） |

## 当前状态

- ✅ 调度、去重、补发、摘要、重试、本地三通道 —— 全部可用
- ✅ mock 数据端到端跑通，20 个测试全绿
- ⬜ 真实数据源 —— 等接口
- ⬜ 分页、详情深链、微信渠道 —— 接口确定后再做
