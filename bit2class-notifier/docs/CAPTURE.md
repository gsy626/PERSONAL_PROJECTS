# 抓包指南：从「小程序里的活动列表」到「.env 里的一行配置」

目标只有一个：**找到返回活动数组的那个 HTTP 请求**，把它的 URL、请求头、字段名抄下来。

全程大约 20 分钟。卡住的地方直接跳到文末「发我什么」。

---

## 0. 先花 3 分钟侦察

打开小程序，点右上角 `···` → **关于**，记下两件事：

| 看什么 | 为什么要看 |
| --- | --- |
| **主体名称 / 开发方** | 是「北京理工大学」自建，还是「到梦空间」这类第三方平台。第三方平台通常有网页版，能省掉整个抓包环节 |
| **版本号** | 以后接口变了方便对照 |

再找一下有没有网页版，三条线索：

- 学院/团委的通知里，报名链接是不是 `https://` 开头而不是小程序卡片；
- 学校信息门户（`i.bit.edu.cn` 之类）里有没有「第二课堂」入口；
- 直接问一句辅导员或学长：这活动是在网页上报还是在手机上点。

**有网页版就直接走路线 C，不用抓包。**

---

## 1. 选路线

| 你手上有什么 | 走哪条 | 难度 |
| --- | --- | --- |
| Windows / macOS 电脑，且装了 PC 版微信 | **路线 A**（推荐） | ★★ |
| 只有手机 | 路线 B | ★★★ |
| 平台有网页版 | **路线 C**（最省事） | ★ |

> 你在 Linux 上开发不影响，抓包只是「拿到一次请求」，拿到之后所有事都在 Linux 上做。

---

## 2. 路线 A：PC 微信 + Reqable

> 如果你用的是 Windows 电脑，直接看 **[WINDOWS.md](WINDOWS.md)** —— 那份是逐步骤的，还带了「PC 微信搜不到小程序怎么办」。

**为什么推荐**：PC 版微信里的小程序本质是个 Chromium 容器，请求是标准的 HTTPS，明文可见；手机端反而经常只能看到微信自己的长连接。

### 步骤

1. 装 [Reqable](https://reqable.com/)（免费版够用）。
2. 打开 Reqable，**同时开启「系统代理」和「增强模式 / TUN 模式」**。
   > 关键：PC 微信**不走系统代理**，只开系统代理会什么都抓不到，必须用 TUN。
3. 安装根证书：Reqable 界面里点「安装证书」→ 装到 **「受信任的根证书颁发机构」**（Windows）或 **钥匙串 → 系统 → 始终信任**（macOS）。
4. **完全退出并重启微信**（托盘里也要退），再登录。
5. 在 PC 微信里打开小程序，按这个顺序操作一遍：
   活动列表 → 下拉刷新 → 点进任意一个活动 → 返回列表 → 再刷新一次。
6. 回到 Reqable，按 **活动标题**搜索响应内容（最快），或者按域名过滤。

### 找哪个请求

符合下面全部特征的，就是目标：

- 响应是 **JSON**（不是 HTML）；
- 里面能搜到活动标题；
- 是一个**数组**，每条有 `id`、`title` 之类的字段；
- URL 里常带 `list` / `page` / `activity` / `apply` / `act`。

同时把**详情页**那个请求也看一眼，记下活动 id 的字段名，以后能做「点通知直接跳活动」。

---

## 3. 路线 B：手机

### Android

1. 装 Reqable 手机版或 HttpCanary。
2. 装 CA 证书。
   - Android 7 以上，**用户证书对大部分 App 不生效**，需要 root + Magisk 的 `Move Certificates` 模块把证书挪进系统区；
   - 没有 root 的话成功率看运气，可以试 VirtualXposed / 平行空间这类方案；
   - Android 6 及以下直接装用户证书就能用。
3. 手机 Wi-Fi 代理指向电脑的 Reqable，或直接用 App 的本地 VPN 模式。

### iOS

1. Shadowrocket / Quantumult X / Loon 开 MITM，域名填 `*`。
2. 装描述文件后，去 **设置 → 通用 → 关于本机 → 证书信任设置** 里把根证书打开（这一步不做必然一片红）。
3. 手机代理指向电脑。

### 手机上的常见死路

如果你抓到的全是 `short.weixin.qq.com`、`dns.weixin.qq.com`，**没有学校域名**，说明请求走了微信自己的加密长连接（mmtls），手机端拿不到明文。

→ 别恋战，回路线 A 或 C。

---

## 4. 路线 C：网页版 + 浏览器 F12

最适合你现在这台 Linux。

1. Chrome 打开网页版，登录。
2. `F12` → **Network** → 选 **Fetch/XHR** → 勾上 **Preserve log**。
3. 刷新活动列表页。
4. 逐个点开请求，看 **Response** 里有没有 JSON 数组和活动标题。
5. 找到后右键 → **Copy** → **Copy as cURL (bash)**。

---

## 4.5 路线 D：直接读小程序包（不用证书、不用代理）

PC 微信打开过小程序后，包会落在本地磁盘。解开它就能看到 `wx.request` 里写的接口地址、参数和字段名——比抓包还全，而且不折腾证书。

```bash
npm run wxapkg -- ~/wxapkg/*.wxapkg
```

怎么在 Windows 上找到包、怎么拷进 WSL，见 [WINDOWS.md 的附录](WINDOWS.md#附连证书都不想装直接读小程序包)。

只有当包被加密（报「首字节不是 0xbe」）时，才需要回上面的抓包路线。

> PC 微信 4.x 落盘的包都是 `V1MMWX` 加密壳，`npm run wxapkg` 会按 appId 自动解开；
> 认不出 appId 就加 `--appid wx...`（目录名即 appId）。详见
> [CAPTURED-API.md](CAPTURED-API.md#6-小程序包是怎么解开的下次接口变了照着来)。

---

## 5. 一条命令变成配置

在项目目录里，把刚才复制的内容整个贴进去（用双引号包住）：

```bash
npm run from-curl -- "curl 'https://xxx/api/activity/list?page=1&size=20' -H 'cookie: SESSION=abc' -H 'referer: https://xxx/'"
```

它会解析出 URL、请求方法、所有请求头，并告诉你「有没有看到鉴权头」。

确认没问题就写入 `.env`：

```bash
npm run from-curl -- "curl '...' " --write
npm run dump
```

> `from-curl` 不做任何网络请求，纯文本转换，可以放心跑。

---

## 6. `dump` 之后看两个地方

```bash
npm run dump
```

**第一处：响应顶层有哪些 key。** 用它填 `SOURCE_ITEMS_PATH`：

```
{ "code": 0, "data": { "list": [...], "total": 120 } }
                    └── SOURCE_ITEMS_PATH=data.list
```

**第二处：单条活动长什么样。** 用它填字段映射，重点是**报名开始时间**：

```json
{
  "id": 1024,
  "title": "院士讲堂：xxx",
  "applyStartTime": "2026-11-01 20:00:00",   ← 这个
  "applyEndTime": "2026-11-02 12:00:00",
  "activityStartTime": "2026-11-05 14:00:00",
  "status": 2
}
```

对应配置：

```dotenv
SOURCE_ITEMS_PATH=data.list
SOURCE_FIELD_ID=id
SOURCE_FIELD_TITLE=title
SOURCE_FIELD_SIGNUP_START=applyStartTime
SOURCE_FIELD_SIGNUP_END=applyEndTime
SOURCE_FIELD_EVENT_START=activityStartTime
SOURCE_FIELD_URL=
```

字段名常见叫法：`applyStartTime`、`signupStartTime`、`enrollStartTime`、`baomingStartTime`、`startTime`、`signStartTime`。**别猜，直接看 JSON。**

时间格式不用管，`2026-11-01 20:00:00`、`2026/11/01 20:00`、秒级时间戳、带时区的 ISO 都能解析。

---

## 7. 常见问题

| 现象 | 原因 | 怎么办 |
| --- | --- | --- |
| `dump` 返回一段 HTML | 被重定向到登录页 / 撞了 WAF | 补 `cookie`、`referer`、`user-agent`，和抓包时保持一致 |
| HTTP 401 / 403 | token 过期，或少了签名字段 | 重新抓一次，**请求头一个都别漏** |
| 返回 `[]` 空数组 | query 参数不对（学期、状态、分页） | 对比抓包 URL 里的每个参数 |
| 响应是一串乱码/密文 | 接口做了加密 | 换网页版，或告诉我，我上 Playwright 让浏览器自己算 |
| 只有 20 条，翻页还有 | 分页 | 告诉我分页参数名，我加多页拉取 |
| 列表里没有「报名开始时间」 | 平台不给这个字段 | 退回「发布即提醒」模式，缩短轮询间隔 |
| 什么请求都抓不到 | TUN 没开 / 证书没信任 / 微信没重启 | 按顺序重来一遍，先拿浏览器验证代理是通的 |

---

## 8. 抓完之后发我三样东西

1. **请求**：`GET/POST` + 域名 + 路径（query 里的 token 可以打码）；
2. **一条活动的完整 JSON**（标题可以改掉，结构保留）；
3. **请求头名字列表**（值全部打码，只要名字，我看有没有签名头）。

有这三样，我就能把 `src/sources/` 里的适配器写完、加分页、加详情页深链，然后直接用真实数据跑。

---

## 9. 安全提醒

- `cookie` / `token` 等于你的登录态，**别发到群里、别提交到 git**（`.gitignore` 已排除 `.env`）。
- 只截「一条活动」做样例，别把整页数据贴出来。
- 抓包只用于自己看活动，别做成公开服务，也别高频轰炸接口 —— 1 分钟一次足够了。
