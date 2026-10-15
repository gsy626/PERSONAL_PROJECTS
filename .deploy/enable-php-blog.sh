#!/usr/bin/env bash
#
# 给 nginx 装上 /PHP/ 博客的配置（需要 root）
#
#   sudo bash ~/blog-deploy/enable-php-blog.sh
#
# 做四件事：
#   1. 清掉 sites-enabled 里历史遗留的 *.bak* 文件
#      —— nginx 的 include 是 /etc/nginx/sites-enabled/*，备份放在那里
#         会被当成配置加载（default 的备份会导致 duplicate default server）
#   2. 安装 /etc/nginx/snippets/php-blog.conf
#   3. 把 include 插进真正生效的 server 块
#      —— nginx 读的是 /etc/nginx/sites-enabled/*，其中 default 是普通文件、
#         www.guosyzamz.top 是符号链接，所以按 sites-enabled 遍历并解析真实路径
#      —— 备份统一放到 /etc/nginx/backups/，不再放回 sites-enabled
#   4. nginx -t 通过后 reload，并自检一次
#
# 重复执行是安全的。
#
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
    echo "请用 sudo 运行：sudo bash $0" >&2
    exit 1
fi

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$HERE/php-blog.nginx.conf"
DST="/etc/nginx/snippets/php-blog.conf"
BACKUP_DIR="/etc/nginx/backups"
STAMP="$(date +%F-%H%M%S)"

[ -f "$SRC" ] || { echo "找不到 $SRC" >&2; exit 1; }
[ -f /etc/nginx/fastcgi_params ] || { echo "找不到 /etc/nginx/fastcgi_params" >&2; exit 1; }

# ---------------------------------------------------------------- 1. 清理遗留
stray="$(find /etc/nginx/sites-enabled -maxdepth 1 -type f \( -name '*.bak' -o -name '*.bak-*' -o -name '*~' \) 2>/dev/null || true)"
if [ -n "$stray" ]; then
    echo "• sites-enabled 里发现会被 nginx 误加载的备份，先移走："
    install -d -m 700 "$BACKUP_DIR"
    while IFS= read -r f; do
        [ -n "$f" ] || continue
        mv -f "$f" "$BACKUP_DIR/$(basename "$f")"
        echo "    $f → $BACKUP_DIR/$(basename "$f")"
    done <<< "$stray"
fi

# ------------------------------------------------------------ 2. 安装配置片段
install -d -m 755 /etc/nginx/snippets
install -m 644 "$SRC" "$DST"
echo "✔ 已安装 $DST"

# ------------------------------------------------------ 3. 插入 include
TARGETS="$(for f in /etc/nginx/sites-enabled/*; do
    [ -e "$f" ] || continue
    readlink -f "$f"
done | sort -u)"

if [ -z "$TARGETS" ]; then
    echo "!! /etc/nginx/sites-enabled 下没有配置文件" >&2
    exit 1
fi

echo "• nginx 实际加载的配置："
echo "$TARGETS" | sed 's/^/    /'

for f in $TARGETS; do
    [ -f "$f" ] || continue

    if grep -q "snippets/php-blog.conf" "$f"; then
        echo "• 已包含 include，跳过：$f"
        continue
    fi

    install -d -m 700 "$BACKUP_DIR"
    cp -a "$f" "$BACKUP_DIR/$(basename "$f").bak-$STAMP"
    echo "• 已备份 → $BACKUP_DIR/$(basename "$f").bak-$STAMP"

    python3 - "$f" <<'PY'
import re
import sys

path = sys.argv[1]
with open(path, encoding='utf-8') as fh:
    src = fh.read()


def server_blocks(text):
    """返回 [(server 关键字位置, 左花括号之后的位置, 块结束位置)]"""
    out = []
    for m in re.finditer(r'server\s*\{', text):
        brace = m.end() - 1
        depth = 0
        for j in range(brace, len(text)):
            if text[j] == '{':
                depth += 1
            elif text[j] == '}':
                depth -= 1
                if depth == 0:
                    out.append((m.start(), brace + 1, j + 1))
                    break
    return out


blocks = server_blocks(src)
if not blocks:
    sys.exit('没有找到 server 块：' + path)

targets = []
for _start, insert_at, end in blocks:
    body = src[insert_at:end]
    # 只做跳转、没有任何 location 的 server 块不需要
    if 'return 301' in body and 'location' not in body:
        continue
    if 'default_server' in body or 'listen 443' in body or 'ssl_certificate' in body:
        targets.append(insert_at)

if not targets:
    sys.exit('没有需要插入的 server 块：' + path)

marker = ('\n\n\t# PHP 博客（/PHP/），由 blog-deploy/enable-php-blog.sh 安装\n'
          '\tinclude /etc/nginx/snippets/php-blog.conf;')
for pos in sorted(targets, reverse=True):
    src = src[:pos] + marker + src[pos:]

with open(path, 'w', encoding='utf-8') as fh:
    fh.write(src)
print('✔ 已插入 include（%d 个 server 块）：%s' % (len(targets), path))
PY
done

# --------------------------------------------------------- 4. 测试并重载
echo
echo "=== nginx -t ==="
if ! nginx -t; then
    echo
    echo "!! 配置测试没通过，nginx 未重载（旧配置仍在跑）。" >&2
    echo "   备份在 $BACKUP_DIR/，需要回滚就覆盖回去再跑 nginx -t。" >&2
    exit 1
fi

echo
echo "=== reload ==="
systemctl reload nginx
sleep 1

echo
echo "=== 自检 ==="
code=$(curl -s -o /dev/null -w '%{http_code}' -H 'Host: 127.0.0.1' http://127.0.0.1/PHP/index.php || echo 000)
ctype=$(curl -s -o /dev/null -w '%{content_type}' -H 'Host: 127.0.0.1' http://127.0.0.1/PHP/index.php || echo '?')
echo "  /PHP/index.php → $code  $ctype"

leak=$(curl -s -o /dev/null -w '%{http_code}' -H 'Host: 127.0.0.1' http://127.0.0.1/PHP/data/blog.sqlite || echo 000)
echo "  /PHP/data/blog.sqlite → $leak  (应为 403)"

if [ "$ctype" = "text/html; charset=UTF-8" ] && [ "$leak" = "403" ]; then
    echo
    echo "  ✔ 完成：PHP 已由 php-fpm 渲染，源码与数据库已封堵"
else
    echo
    echo "  ✘ 结果不符合预期，请把这段输出发给我" >&2
    exit 1
fi

echo
echo "访问： http://123.57.3.39/PHP/"
echo "（域名 www.guosyzamz.top 未备案被阿里云拦截，需用 IP 访问）"
