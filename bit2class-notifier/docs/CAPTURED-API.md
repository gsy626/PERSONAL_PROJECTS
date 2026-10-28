# 抓包结果：北京理工大学「第二课堂」活动接口

> 抓包时间：2026-10-28　｜　目标：小程序「第二课堂」
> 结论先说：**接口是公开 JSON，不需要登录态、不需要 Cookie、不需要签名头**。活动列表里带
> `sign_start_time`（报名开始时间，精确到分钟），所以「报名开始前 N 分钟提醒」这条路是通的。

---

## 1. 从哪儿来的

| 项 | 值 |
| --- | --- |
| 小程序 appid | `wx89b19258915c9585` |
| 包位置 | `%APPDATA%\Tencent\xwechat\radium\users\<uid>\applet\packages\wx89b19258915c9585\32\__APP__.wxapkg` |
| 包形态 | PC 微信 4.x 的 `V1MMWX` 加密包（首字节 `0x56`，不是 `0xBE`） |
| 解开后 | 366 个文件，`app-service.js` 2MB |
| 接口域名 | `https://qcbldekt.bit.edu.cn`（`config/index.js` 里写死的「北理环境」） |

包里被注释掉的两套环境（备用）：
`https://secondclass-dev.xuejj.com`（测试）、`http://172.31.12.46:8000`（本地）。**生产只用 `qcbldekt`。**

---

## 2. 活动列表接口（核心）

```http
GET https://qcbldekt.bit.edu.cn/api/course/list?page=1&limit=100
```

| 参数 | 说明 |
| --- | --- |
| `page` | 页码，从 1 开始 |
| `limit` | 每页条数。100 / 1000 都接受（返回 `min(limit, total)`） |
| `sign_status` | 报名状态：`1` 未开始、`2` 进行中、`3` 已结束；`0` 或不传 = 全部 |
| `search` | 标题关键字 |
| `transcript_index_id` | 大类 id（`2` 科学素养、`6` 健康生活 …… 来自 `/api/type/...`） |
| `transcript_index_type_id` | 小类 id（`5` 培训会/报告会、`22` 心理 ……） |

排序：**按发布时间倒序**（`created_at desc`），新活动永远在第一页。

响应结构：

```json
{
  "data": {
    "total": 1232,
    "page": 1,
    "items": [ /* 活动数组 */ ]
  }
}
```

鉴权：小程序里会给每个请求加 `Authorization: Bearer <token>`，但**这个列表接口不带也是 200**，
实测只带默认 UA 的裸 `curl` 就能拿全量数据。详情、报名的接口才需要 token。

实测数据（2026-10-28 19:5x）：

| 查询 | total |
| --- | --- |
| 不传 `sign_status` | 1232 |
| `sign_status=1`（未开始） | 3 |
| `sign_status=2`（进行中） | 17 |
| `sign_status=3`（已结束） | 1212 |

`limit=100` 的响应约 208 KB，一次请求 0.4 秒左右。

---

## 3. 单条活动长什么样

只保留有用的字段：

```json
{
  "id": 2293,
  "title": "海豚朋辈 | 时秋拾秋饰秋——一场与自然共振的“秋日拾光”疗愈之旅",
  "department": "心理健康教育与咨询中心",

  "sign_start_time": "2026-10-30 14:00",
  "sign_end_time": "2026-10-31 10:00",

  "sign_in_start_time": "2026-10-31 14:25:00",
  "sign_in_end_time": "2026-10-31 14:30:00",
  "sign_in_address": [
    {
      "range": 300,
      "address": "北京理工大学良乡(南校区)足球场",
      "latitude": 39.72995000128199,
      "longitude": 116.16996135005684
    }
  ],

  "time_place": "2026年10月31日本周六14：30-17：00",
  "completion_flag_text": "参与时长不少于150分钟",
  "duration": 150,
  "score": "2",

  "sign_status": 1,
  "sign_status_label": "未开始",
  "status": 1,
  "status_label": "已发布",
  "course_apply_count": 0,

  "transcript_index": { "id": 6, "transcript_name": "健康生活" },
  "transcript_index_type": { "id": 22, "transcript_type_name": "心理" },

  "created_at": "2026-10-28 14:26:47",
  "updated_at": "2026-10-28 14:27:10",
  "cover_url": "https://qcbldekt.bit.edu.cn/storage/images/pZuu7ZbWgk6Uh71LB16M.png"
}
```

字段对照（`.env` 里就是这几个）：

| 字段 | 含义 | 映射到 |
| --- | --- | --- |
| `id` | 活动 id | `SOURCE_FIELD_ID` |
| `title` | 标题 | `SOURCE_FIELD_TITLE` |
| `sign_start_time` | **报名开始**（`YYYY-MM-DD HH:mm`，无秒） | `SOURCE_FIELD_SIGNUP_START` |
| `sign_end_time` | 报名截止 | `SOURCE_FIELD_SIGNUP_END` |
| `sign_in_start_time` | 签到开始＝活动开始（有活动才有，可能 `null`） | `SOURCE_FIELD_EVENT_START` |
| `time_place` | 人话版时间+地点，推送里很好用 | 暂未映射（`raw` 里有） |
| `sign_status_label` | 未开始 / 进行中 / 已结束 | 不映射 |
| `course_apply_count` | 已报名人数 | `SOURCE_FIELD_APPLY_COUNT` |
| `max` | 名额上限（和上面一起算满没满） | `SOURCE_FIELD_CAPACITY` |

`sign_status` 不是字段名，是**筛选参数**——别看串了。

---

## 4. 已经接进 `.env`

```dotenv
SOURCE=http
SOURCE_URL=https://qcbldekt.bit.edu.cn/api/course/list?page=1&limit=100
SOURCE_METHOD=GET
SOURCE_HEADERS=
SOURCE_ITEMS_PATH=data.items
SOURCE_FIELD_ID=id
SOURCE_FIELD_TITLE=title
SOURCE_FIELD_SIGNUP_START=sign_start_time
SOURCE_FIELD_SIGNUP_END=sign_end_time
SOURCE_FIELD_EVENT_START=sign_in_start_time
SOURCE_FIELD_APPLY_COUNT=course_apply_count
SOURCE_FIELD_CAPACITY=max
SOURCE_FIELD_URL=
```

验证：

```bash
npm run dump   # 打印原始响应 + 按映射解析的结果
npm run once   # 跑一轮真实轮询，首次运行只建基线
npm run demo   # 不等真活动：拿「已报满」的真实活动把提醒链路演一遍
```

实测：`dump` 拿到 100 条活动，映射全部对得上；`once` 把 100 个活动记为基线、0 条提醒退出。
当前库里 `sign_start_time` 在未来的有 3 条（10-28 21:30、10-29 08:00、10-30 14:00），
到点前 5 分钟就会推。

**为什么用 `limit=100` 而不是 `sign_status=1`：** 未开始的活动只有几条，但绝大多数活动
一发布就是「进行中」，用 `sign_status=1` 会漏掉「刚发布就能报名」的那批。拉最近 100 条
（约两周的量）既能第一时间发现新活动，也不会让「报名时间设在几天后」的活动掉出视野。
嫌费流量就把 `limit` 调到 50、`POLL_INTERVAL_SECONDS` 调到 120。

---

## 5. 其它接口（备用，不一定都能匿名调）

| 接口 | 方法 | 用途 | 匿名可用 |
| --- | --- | --- | --- |
| `/api/course/info/{id}` | GET | 活动详情（含 `body` 富文本、签到经纬度） | ✅ 实测可用 |
| `/api/course/list/my` | GET | 我报名的活动 | ❌ 要 token |
| `/api/course/apply` | POST | 报名 | ❌ 要 token |
| `/api/type/{type}` | GET | 分类树（页面 tab 来源） | 未验证 |
| `/api/carousel` | GET | 首页轮播 | 未验证 |
| `/api/news/list` | GET | 通知公告（可以顺带监控） | 未验证 |
| `/api/login` | POST | 登录（要微信 `code`，外部拿不到） | ❌ |
| `/api/user/info` | GET | 用户信息 | ❌ 要 token |

**做不了的两个：**
1. **没有网页版。** `https://qcbldekt.bit.edu.cn/` 直接 404，只有小程序。
2. **没有可点的详情链接。** 小程序码接口 `/qrcode/second/?course_id=xx`
   匿名访问 404（要登录态），所以 `.env` 里 `SOURCE_FIELD_URL` 先留空；推送里先用
   「标题 + 报名时间」定位，够用。

---

## 6. 小程序包是怎么解开的（下次接口变了照着来）

PC 微信 4.x 落盘的 `__APP__.wxapkg` 不是标准格式，是一层 `V1MMWX` 加密壳：

```
6 字节 "V1MMWX"
+ 1024 字节 AES-256-CBC（明文前 1023 字节 + PKCS7 补齐）
+ 其余字节逐个异或 xorKey
```

- AES key = `PBKDF2-SHA1(appId, "saltiest", 1000 次, 32 字节)`
- IV = `the iv: 16 bytes`
- **xorKey = appId 倒数第 2 个字符的 ASCII**（`wx89b19258915c9585` → `'8'` → `0x38`）
- appId 就是包所在目录名

项目里已经内置，不用再手搓：

```bash
# appId 从路径（packages/wx89b.../32/__APP__.wxapkg）或文件名前缀自动认
npm run wxapkg -- "%APPDATA%\Tencent\xwechat\radium\users\<uid>\applet\packages\wx89b19258915c9585\32\__APP__.wxapkg"

# 认不出来时手动指定
npm run wxapkg -- --appid wx89b19258915c9585 <包路径>
```

输出：按域名分组的 URL、字符串里的疑似接口路径、完整清单 `data/wxapkg/ENDPOINTS.txt`、
解开的源码在 `data/wxapkg/<包名>/`。这次就是靠 `config/index.js` + `api/app.js` +
`utils/http.js` 三个文件把域名、接口清单、鉴权头（`Authorization: Bearer`）一次看全的。

> 直接读包比装证书抓包省事得多，也不用开 TUN。接口以后变了，重新走一遍这条就行。

---

## 7. 复核用的裸命令

```bash
# 全量最新 100 条
curl "https://qcbldekt.bit.edu.cn/api/course/list?page=1&limit=100"

# 只看还没开始报名的
curl "https://qcbldekt.bit.edu.cn/api/course/list?page=1&limit=100&sign_status=1"

# 单个活动详情
curl "https://qcbldekt.bit.edu.cn/api/course/info/2293"
```

---

## 8. 注意事项

- **频率**：`limit=100` 一次约 208 KB，一分钟一次约 300 MB/天。校内网无所谓，但别把间隔
  压到 15 秒以内；`POLL_INTERVAL_SECONDS=60~120` 足够了（报名时间精确到分钟）。
- **时间格式**：`2026-10-30 14:00` 没有秒、没有时区，项目按北京时间解析，别改。
- **活动会被改**：`updated_at` 变了、`sign_start_time` 被挪了，去重 key 里带了报名时间，
  会重新提醒一次——这是有意的。
- **别抓 token**：列表接口不需要登录态，也就没有把凭据写进 `.env` 的风险。真要抓 `course/apply`
  之类的写接口时才用得上 token，那时候同样别提交进 git。
