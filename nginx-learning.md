# nginx 配置学习笔记（对着你的博客站学）

> 目标：读懂并改得动 nginx 配置，而不是抄一份能跑的。
> 全部示例基于你的站点 `~/GIT/WEB_ROOT/PHP`，本地端口用 8080，避免和 Apache 抢 80。

---

## 1. 先建立心智模型：五层上下文

nginx 配置是一棵**指令树**，不是脚本。

```
main                      ← 全局：user / worker_processes / pid
├── events { }            ← 连接模型：worker_connections
└── http {                ← 所有 HTTP 相关
    ├── (upstream / map / log_format ...)
    └── server { }        ← 一个"虚拟主机"= 一组 listen + server_name
        └── location { }  ← 按 URI 分流，可以嵌套
```

**继承规则**：子层不写就继承父层；写了就**整体覆盖**，不是合并。

经典坑：`add_header` 在 `location` 里写一条，`http` 层的所有 `add_header` 就全丢了。
所以要么在每层重复写，要么用 `include` 统一管理。

**读官方文档的技巧**：每页右上角都有 `Context: http, server, location`。
这告诉你这条指令**能写在哪一层**，比正文还重要。

---

## 2. 一个请求走过的四道门

```
请求 GET /category.php?c=math
 │
 ├─① 谁接？   listen 8080        → 匹配端口
 ├─② 哪个站？ server_name        → 匹配域名（不匹配就用 default_server）
 ├─③ 哪个 location？            → URI 匹配，这是核心
 └─④ 怎么回？ root/try_files/return/fastcgi_pass/...
```

前两门靠 `listen` + `server_name`，第③门是唯一需要背规则的地方，第④门是"内容处理器"。

---

## 3. location 匹配算法（必须吃透）

匹配按**固定顺序**进行，不是按书写顺序：

1. `=` 精确匹配 → 命中即停，最高优先级
2. `^~` 前缀匹配 → 命中即停，**不再看正则**
3. `~` / `~*` 正则匹配 → **按书写顺序**，第一个命中即停
4. 普通前缀 `/xxx` → 记住**最长**的那个，但如果第 3 步有正则命中，正则会赢

用你的站点举例：

```nginx
location = /about.php      { }   # 只匹配完全等于 /about.php
location ^~ /assets/       { }   # 以 /assets/ 开头，且不进正则
location ~ \.php$          { }   # 正则：以 .php 结尾
location /                 { }   # 兜底
```

- `/about.php` → 命中第 1 条（精确优先）
- `/assets/logo.png` → 命中第 2 条，**即使它不匹配任何正则**
- `/post.php` → 第 1、2 条都不中，正则 `\.php$` 命中
- `/category.php?c=math` → 匹配时**只看 `?` 之前**，所以是 `/category.php` → 正则命中

两个反直觉点：

- `~` 区分大小写，`~*` 不区分。`\.php$` 匹配不到 `/INDEX.PHP`。
- 正则一旦命中，普通前缀的最长匹配**作废**。想保护某个目录不被正则抢走，就用 `^~`。

---

## 4. root 与 alias

```nginx
root /home/guosh/GIT/WEB_ROOT/PHP;     # 最终路径 = root + URI
# 请求 /about.php → /home/guosh/GIT/WEB_ROOT/PHP/about.php
```

```nginx
location /static/ {
    alias /home/guosh/GIT/WEB_ROOT/PHP/assets/;   # 最终路径 = alias + (URI 去掉 /static/)
    # 请求 /static/css/math.css → .../assets/css/math.css
}
```

口诀：`root` 是**前缀拼接**，`alias` 是**替换匹配部分**，且 `alias` 结尾带 `/`。
`alias` 只能写在 `location`，`root` 可以写在 `server` 继承下去。

---

## 5. try_files：把"文件不存在"从 404 变成可控行为

```nginx
try_files $uri $uri/ /index.php?$query_string;
```
依次尝试：文件 → 目录 → 最后**内部跳转**到 `/index.php?原查询串`。

你的站是"多入口 .php + 查询字符串"（`index.php?c=math`、`post.php?slug=...`），
没有伪静态需求，所以**不需要**这条美化规则，保持简单：

```nginx
location / { try_files $uri $uri/ =404; }
```

`try_files` 也是安全手段：`location ~ \.php$ { try_files $uri =404; }`
能挡住 `/about.php/xxx.php` 这种路径拼接攻击。

---

## 6. 与 PHP-FPM 对接：为什么是 fastcgi_pass

nginx 自己不执行 PHP，它把请求通过 FastCGI 协议转给 php-fpm：

```nginx
location ~ \.php$ {
    try_files $uri =404;
    include snippets/fastcgi-php.conf;      # Debian 自带，内含 SCRIPT_FILENAME 等
    fastcgi_pass unix:/run/php/php8.4-fpm.sock;
}
```

关键变量：

| 变量 | 作用 |
|---|---|
| `fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name` | 告诉 fpm 要执行哪个文件，**502/404 的元凶** |
| `fastcgi_param QUERY_STRING $query_string` | 透传 `?c=math` |
| `fastcgi_read_timeout 60s` | fpm 处理超时，默认 60 |

`fastcgi_pass` 可以写 `unix:/run/php/php8.4-fpm.sock`（本机，快）或
`127.0.0.1:9000`（TCP，跨机/容器）。

---

## 7. 你的博客站可用的完整配置（本地 8080）

```nginx
server {
    listen 8080;
    server_name localhost;

    root /home/guosh/GIT/WEB_ROOT/PHP;
    index index.php index.html;
    charset utf-8;

    access_log /var/log/nginx/blog.access.log;
    error_log  /var/log/nginx/blog.error.log warn;

    client_max_body_size 20m;          # submit.php 若带附件上传

    # ① 静态资源：长缓存 + 不打日志
    location ~* \.(css|js|png|jpe?g|gif|svg|ico|woff2?)$ {
        expires 7d;
        access_log off;
        try_files $uri =404;
    }

    # ② 数据库/缓存目录绝对不能让外部访问
    location ^~ /data/ { deny all; return 404; }
    location ^~ /vendor/ { deny all; return 404; }

    # ③ PHP 入口
    location ~ \.php$ {
        try_files $uri =404;
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.4-fpm.sock;
    }

    # ④ 隐藏文件
    location ~ /\. { deny all; return 404; }

    # ⑤ 兜底
    location / { try_files $uri $uri/ =404; }
}
```

注意第②条对你的站很关键：`data/blog.sqlite` 如果能被 `GET /data/blog.sqlite` 下载，
整站评论数据就泄露了。Apache 默认也不给 `.sqlite` 加保护，换成 nginx 时顺手补上。

---

## 8. 调试四件套

```bash
sudo nginx -t                 # 语法检查（改完必跑，reload 前必跑）
sudo nginx -T                 # 把 include 展开，打印最终生效配置（排查"配置没生效"）
sudo nginx -s reload          # 平滑重载，不断连接；改 listen/端口才需要 restart
sudo tail -f /var/log/nginx/error.log
curl -I http://127.0.0.1:8080/index.php    # 看状态码和响应头
curl -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8080/
```

`nginx -T | grep -n 'location'` 是定位"我写的那条为什么没生效"的最快方式。

想看实时连接数，加：

```nginx
location = /status { stub_status; allow 127.0.0.1; deny all; }
```

---

## 9. 五个必踩的坑（对照你的环境）

1. **403 Forbidden**：`/home/guosh` 是 `700`，`www-data` 进不去。
   `chmod o+x /home/guosh` 或把站点挪到 `/var/www`。
2. **404 但文件确实在**：`root` 拼多了一层（比如 `root .../PHP/;` 又写了 `location /PHP/`）。
   用 `error.log` 里的 "open() ... failed" 看真实路径。
3. **502 Bad Gateway**：`fastcgi_pass` 的 socket 路径和实际不符。
   `ls /run/php/` 确认真名，或 `systemctl status php8.4-fpm` 看它监听在哪。
4. **PHP 被当纯文本下载**：`location ~ \.php$` 没写或被前面的正则抢走（用 `^~` 修正）。
5. **`add_header` 消失**：子层 `location` 里再写一条 `add_header`，父层全部失效。

---

## 10. 练习阶梯（每步都能独立验证）

1. **静态站**：`location / { return 200 "hello"; }`，`curl` 看结果，理解 `return`。
2. **跑起来**：换成 `root` + `index`，访问 `index.php`，先让 502 出现，再修好 socket。
3. **精确匹配**：加 `location = /about { return 301 /about.php; }`，验证 `/about` 跳转、`/about.php` 不受影响。
4. **优先级实验**：同时写 `^~ /assets/` 和 `~ \.png$`，在 `assets/` 下放个 png，用 `curl -I` 看命中哪条（日志里加 `$uri` 观察）。
5. **缓存头**：给 css/js 加 `expires 7d`，`curl -I` 看 `Cache-Control` 和 `Expires` 变化。
6. **限流**：`limit_req_zone $binary_remote_addr zone=one:10m rate=5r/s;` + `limit_req zone=one burst=10 nodelay;`，用 `for i in $(seq 20); do curl -s -o /dev/null -w '%{http_code} ' localhost:8080/; done` 看 503。
7. **HTTPS**：自签证书 `openssl req -x509 -newkey rsa:2048 -nodes -keyout k.pem -out c.pem -days 30 -subj /CN=localhost`，配 `listen 8443 ssl`，`curl -k` 验证。

每步都遵守同一个循环：**改配置 → `nginx -t` → `reload` → `curl` → 看 `error.log`**。

---

## 11. 下一步该读的

- 官方 Beginner's Guide: <https://nginx.org/en/docs/beginners_guide.html>
- 指令索引：<https://nginx.org/en/docs/dirindex.html>（按 Context 筛选）
- `ngx_http_core_module` 里的 `location` 一节：匹配规则的**权威定义**
- 真实项目参考：`/etc/nginx/nginx.conf`（发行版默认配置本身就是很好的样例）

---

## 12. 没有 root 也想跑起来？

nginx 允许非 root 运行，只要监听 ≥1024 的端口：

```bash
cd /tmp && curl -fsSLO https://nginx.org/download/nginx-1.28.0.tar.gz
tar xf nginx-1.28.0.tar.gz && cd nginx-1.28.0
./configure --prefix=$HOME/nginx --with-http_ssl_module
make -j4 && make install
```

然后把 `~/nginx/conf/nginx.conf` 的 `listen` 改成 `8080`，
`~/nginx/sbin/nginx -p ~/nginx -c ~/nginx/conf/nginx.conf` 启动。
自己的 nginx 跑在自己的用户下，也就不存在 `www-data` 读不了 `700` 目录的问题。
