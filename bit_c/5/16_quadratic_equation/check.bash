#!/usr/bin/env bash
set -u

URL="${1:-}"
INTERVAL="${2:-10}"   # 检查间隔秒数

echo "开始监控 $URL，每 ${INTERVAL}s 检查一次，按 Ctrl+C 停止"

while true; do
    code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$URL")
    now=$(date '+%Y-%m-%d %H:%M:%S')

    if [ "$code" = "200" ]; then
        echo "[$now] 恢复！HTTP $code  $URL"
        break
    else
        echo "[$now] 还没恢复，HTTP $code"
    fi:

    sleep "$INTERVAL"
done
