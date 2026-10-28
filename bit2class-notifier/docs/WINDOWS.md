# Windows 抓包：从零到拿到接口（约 30 分钟）

> 适用：只有小程序、没有网页版，但手边有 Windows 电脑。
> 你的情况：报名时间有明确时间点 → **提前 N 分钟提醒成立**，这条路是通的。

最后要达到的状态，就一句话：

> Reqable 里能看到一个返回 JSON 数组的请求，数组里每条活动都带着「报名开始时间」。

---

## 第 0 步：先记住四个坑

90% 的人卡在这四处，先看一遍再动手：

| # | 坑 | 症状 |
| --- | --- | --- |
| 1 | 只开了「系统代理」，没开 **TUN / 增强模式** | Reqable 里干干净净，什么都没有 |
| 2 | 证书装到了「个人」而不是 **「受信任的根证书颁发机构」** | 一开小程序就白屏 / 提示证书错误 |
| 3 | 装完证书**没有完全退出微信**（托盘里还挂着） | 证书明明装了，微信就是不认 |
| 4 | PC 微信里**搜不到**这个小程序 | 见第 2 步的「转发卡片」技巧 |

---

## 第 1 步：装 Reqable，开 TUN（10 分钟）

1. 官网下 Windows 版，装完打开。
2. 顶部工具栏，**同时**打开这两个开关：
   - **系统代理**（System Proxy）
   - **增强模式 / TUN 模式**（Enhanced Mode）
3. 装根证书。两个入口任选：
   - Reqable 左侧栏 **HTTPS** → 「安装根证书」→ 系统会弹窗，选 **本地计算机 → 受信任的根证书颁发机构**；
   - 或者从 Reqable 导出 `.cer`，双击 → 「安装证书」→ **本地计算机** → **「将所有的证书都放入下列存储」** → 浏览 → **受信任的根证书颁发机构**。

> 判断是否装对：`Win + R` 输入 `certmgr.msc` → 「受信任的根证书颁发机构」→ 「证书」里能看到 Reqable。

4. **自检**：用浏览器打开 `https://example.com`。
   - Reqable 里出现这条记录 ✔
   - 浏览器没有证书警告 ✔
   - 两条都满足才继续，否则先把证书按上面重装一遍。

---

## 第 2 步：让 PC 微信跑起这个小程序

1. 装 PC 版微信，扫码登录。
2. 打开小程序，两种方式：

   **A. 直接搜**：PC 微信左侧「小程序」面板 → 搜索「北京理工第二课堂」。

   **B. 搜不到就用转发卡片**（很常见，因为很多小程序不支持 PC 搜索）：
   1. 手机微信里打开这个小程序（随便哪个页面都行）；
   2. 右上角 `···` → **转发** → 发给「**文件传输助手**」；
   3. 回到 PC 微信，打开「文件传输助手」，点那张**小程序卡片**；
   4. 小程序就在 PC 上打开了，通常在独立窗口里，标题栏有名字。

3. **重要**：如果你在第 1 步之前就已经开着微信，现在**完全退出**（右下角托盘图标 → 右键 → 退出），再重新打开、重新登录。
   证书只在新进程启动时生效。

---

## 第 3 步：制造请求

在小程序里按顺序点一遍，动作越全，抓到的接口越全：

1. 进「活动列表」；
2. **下拉刷新**一次；
3. 点进任意一个活动详情，看完再返回；
4. 回到列表，**再刷新一次**。

---

## 第 4 步：在 Reqable 里把它找出来

### 先过滤噪音

左侧是按域名分组的。先**排除**这些（腾讯自家服务，全是噪音）：

```
*.qq.com   *.weixin.qq.com   *.gtimg.cn   *.qpic.cn   *.qlogo.cn
```

剩下里找 `bit.edu.cn` 之类的学校域名，或者一个陌生的第三方平台域名。

### 三种找法，从快到慢

1. **搜活动标题**（最快）：Reqable 顶部搜索框 → 选「Response」→ 贴一个活动标题的原文。命中的那个请求，就是列表接口。
2. **看 URL 关键词**：`/api/` + `list` / `page` / `activity` / `act` / `apply` / `signup`。
3. **看形状**：逐个点开、切到 Response，找**以 `[` 开头或 `data` 里包着数组**的那个。

### 判定标准（四条全中才算）

- Response 是 **JSON**，不是 HTML；
- 里面能搜到活动标题；
- 是一个**数组**，每条有 `id`、`title`/`name` 之类字段；
- 能找到**报名开始时间**这个字段（重点）。

> 顺便把**详情页**那个请求也看一眼，记下活动 id 的字段名。以后可以做「点通知直接跳活动」。

---

## 第 5 步：抄下来

在 Reqable 里右键那个请求 → **Copy** → **Copy as cURL**。

粘到记事本里检查一下，需要包含：

- URL（带 query）；
- **所有** `-H` 请求头，尤其 `cookie`、`authorization`、`x-token`、`referer`、`user-agent`，以及任何名字奇怪的 `x-` 头（签名头往往就在这）。

> 少一个头 = 后面必然 401。宁可多抄。

---

## 第 6 步：回到 Linux，三条命令

```bash
cd bit2class-notifier

# 1) 解析（纯文本转换，不联网，随便跑）
npm run from-curl -- "把刚才复制的内容整个粘进来"

# 2) 看着没问题，写进 .env
npm run from-curl -- "同上" --write

# 3) 验证能不能拉到数据
npm run dump
```

`from-curl` 已经能吃下 bash / cmd / PowerShell 三种续行风格，`curl.exe` 前缀也会自动去掉。

`dump` 会打印两段：

- **原始响应**：看顶层有哪些 key，用它填 `SOURCE_ITEMS_PATH`（比如 `data.list`）；
- **解析结果**：看你的字段映射对不对。

---

## 第 7 步：对不上号怎么办

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| Reqable 里只有 `qq.com` 一堆，没有学校域名 | TUN 没开，或微信没重启 | 开 TUN → 完全退出微信 → 重开 |
| 打开小程序白屏 / 证书错误 | 证书没进「受信任的根证书颁发机构」 | 重装证书，然后重启微信 |
| 有请求，但 Response 是乱码 | 接口做了加密 | 把响应贴我一段，我判断要不要上 Playwright |
| `dump` 返回 HTML | 被重定向到登录页 / WAF | 补全 `cookie`、`referer`、`user-agent` |
| HTTP 401 / 403 | 少了签名头，或 token 过期 | 回 Reqable 重新 Copy as cURL，一个头都别漏 |
| 返回 `[]` | query 参数不对（学期 / 状态 / 分页） | 对比抓包 URL 里的每个参数，尤其 `status`、`page` |
| 只有 20 条 | 分页 | 把分页参数名告诉我，我加分页 |
| 列表里**没有**报名开始时间字段 | 平台不提供 | 退回「发布即提醒」，缩短轮询间隔 |

---

## 第 8 步：发我三样东西

1. **请求**：`GET/POST` + 域名 + 路径（query 里的 token 打码）；
2. **一条活动的完整 JSON**（标题可以改掉，结构留着）；
3. **请求头名字列表**（值全打码，我看有没有签名头）。

有这三样，我就能把适配器补完、加分页、加详情深链，然后直接拿真实数据跑。

---

## 备选：Reqable 死活抓不到

换成 **Charles + Proxifier**：

- Charles 负责代理和证书；
- Proxifier 把 `WeChat.exe`、`WeChatAppEx.exe`（小程序宿主进程）强制走 `127.0.0.1:8888`；
- 这样即使微信不认系统代理，也能被拽进隧道。

Fiddler Classic 也可以（Windows 免费），但证书安装比 Reqable 麻烦，不优先推荐。

---

## 附：连证书都不想装？直接读小程序包

抓包是在「看流量」，还有一条路是「看源码」：PC 微信打开过小程序之后，**包已经落在你硬盘上了**。解开它，`wx.request` 里写了什么接口、什么参数、什么字段名，一目了然——比抓包还全，而且不用装证书、不用开代理、不用重启微信。

### 1. 找到包

在 Windows PowerShell 里跑：

```powershell
Get-ChildItem -Path "$env:APPDATA\Tencent", "$env:USERPROFILE\Documents\WeChat Files", "$env:USERPROFILE\AppData\Local\Tencent" `
  -Recurse -Filter *.wxapkg -ErrorAction SilentlyContinue |
  Sort-Object LastWriteTime -Descending |
  Select-Object -First 10 FullName, @{n='KB';e={[math]::Round($_.Length/1KB)}}, LastWriteTime
```

找**改时间最新**、体积几百 KB 到几 MB 的那个。同名目录里往往有多个（主包 + 分包），**全拷**。

> 前提：你已经在 PC 微信里打开过这个小程序，包才会被下载。

### 2. 拷进 WSL

```bash
mkdir -p ~/wxapkg
cp "/mnt/c/Users/<你的用户名>/AppData/Roaming/Tencent/.../__APP__.wxapkg" ~/wxapkg/
```

（路径用第 1 步打印出来的 `FullName`，把 `C:\` 换成 `/mnt/c/`，反斜杠换成正斜杠。）

### 3. 解包

```bash
cd ~/bit2class-notifier
npm run wxapkg -- ~/wxapkg/*.wxapkg
```

它会打印：

- 按域名分组的所有 URL；
- 字符串字面量里的疑似接口路径（接口常写成 `base + "/activity/list"`，只抓绝对 URL 会漏）；
- 完整清单落到 `data/wxapkg/ENDPOINTS.txt`，解开的文件在 `data/wxapkg/<包名>/`。

### 4. 然后

把 `ENDPOINTS.txt` 和 `app-service.js` 里 `wx.request` 附近的几十行发我，我来判断接口怎么调、参数怎么传。

如果报「不是标准 wxapkg（首字节不是 0xbe）」，说明这个版本做了加密，回上面用 Reqable 抓包。

---

## 提醒一句

`cookie` / `token` 就是你的登录态。**别发群里、别提交 git**（项目里 `.gitignore` 已排除 `.env`），只截一条活动做样例就够了。
