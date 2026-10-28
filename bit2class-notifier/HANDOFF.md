# 交接说明

> 一段话版本，可直接转发 / 粘给新的会话。

项目在 `/home/guosh/drafts/bit2class-notifier`，是一个零依赖的 Node.js（≥ 20.6，纯 ESM）小工具：定时轮询北理「第二课堂」的活动列表，在**报名开始前 N 分钟**（默认 5 分钟）把提醒推到本机，已有 console / 系统桌面通知 / Markdown 日志三个渠道，微信推送（企业微信机器人、PushPlus）代码就绪但没启用。**真实接口已经接上**（`https://qcbldekt.bit.edu.cn/api/course/list`，公开 JSON、无需登录态，见 `docs/CAPTURED-API.md`），`.env` 已配好，`npm run dump` / `npm run once` 都能拿到 100 条真实活动；23 个单测全绿。PC 微信 4.x 的 `V1MMWX` 加密包也已支持自动解密（`npm run wxapkg -- 包路径`，认不出 appId 时加 `--appid wx...`），接口以后变了重新解包即可。还剩两件事：平台**没有网页版**（根路径 404），所以做不了「点通知直接跳活动」的深链；以及微信渠道要你自己填 `WECOM_WEBHOOK` / `PUSHPLUS_TOKEN` 才会真正推到手机。注意两点：Windows/WSL 下长时间挂着按 `docs/WSL.md` 用 systemd 托管，WSL 会随终端退出而停；提醒是按分钟算的，注意时钟漂移。细节：`docs/CAPTURED-API.md`（接口清单与抓包过程）、`docs/WINDOWS.md`（重新解包/抓包）、`docs/CAPTURE.md`（总览）。

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
- ✅ mock 数据端到端跑通，23 个测试全绿
- ✅ 真实数据源已接上：`https://qcbldekt.bit.edu.cn/api/course/list`（公开 JSON，无需登录）
  —— 抓包过程、字段对照、备选接口见 `docs/CAPTURED-API.md`
- ✅ PC 微信 4.x `V1MMWX` 加密包自动解密
- ⬜ 详情深链（平台没有网页版，做不了可点链接）
- ⬜ 微信渠道（代码就绪，等你填 webhook / token）
