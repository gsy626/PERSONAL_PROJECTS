# 在 WSL 里跑：Windows 抓包，WSL 常驻

分工很简单：

| 在哪 | 干什么 | 为什么 |
| --- | --- | --- |
| **Windows** | Reqable + PC 微信，抓接口 | 小程序在 PC 微信里是标准 HTTPS，证书也好装 |
| **WSL** | 项目本体，长期跑提醒 | Linux 环境、systemd 托管、跟你现在的开发环境一致 |

抓包只是一次性动作，抓完把 cURL 搬进 WSL 就再也不用碰 Windows 了。

---

## 1. 项目放哪儿：**别放 `/mnt/c`**

```bash
# ✅ 放 WSL 自己的文件系统
~/bit2class-notifier

# ❌ 别放这里
/mnt/c/Users/你的名字/Desktop/bit2class-notifier
```

放 `/mnt/c` 的后果：跨文件系统 IO 慢一个数量级、`node --test` 明显拖、偶尔 `EPERM`/权限位丢失。

迁移过去（任选一种）：

```bash
# 从 Windows 下载目录拷进来
cp -r /mnt/c/Users/<你的用户名>/Downloads/bit2class-notifier ~/

# 或者从另一台 Linux 机器同步
rsync -av 你的linux机:~/drafts/bit2class-notifier ~/
```

---

## 2. 装 Node

```bash
node -v   # 需要 >= 20.6，建议 22+
```

没装或版本太老：

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

> Ubuntu 自带源里的 nodejs 往往太老（16/18），别直接用。

---

## 3. 先跑一遍

```bash
cd ~/bit2class-notifier
npm test      # 15 个用例应该全绿
npm start     # 用 mock 数据，几秒内能看到提醒
```

---

## 4. 抓包结果怎么搬进来

**办法 A：WSL 直接读 Windows 剪贴板**（推荐，不会粘漏）

在 Windows 的 Reqable 里 `Copy as cURL`，然后回 WSL：

```bash
npm run from-clipboard              # 先看一眼解析结果
npm run from-clipboard -- --write   # 确认没问题再写入 .env
npm run dump
```

原理：WSL 能直接调用 `powershell.exe`，`Get-Clipboard` 把 Windows 剪贴板读出来。不用手动粘贴那一大段带换行和引号的命令。

**办法 B：手动粘贴**

```bash
npm run from-curl -- "把内容粘进来" --write
```

---

## 5. 四个 WSL 特有的坑

### ① WSL 会随终端退出而停 —— 这条最要命

WSL2 在**最后一个 Linux 进程结束约 8 秒后**关掉整个虚拟机。你把 `npm start` 挂在终端里，一关窗口，提醒就停了，而你不会知道。

→ 必须用 systemd 托管（第 6 节）。

### ② 时钟漂移

笔记本睡一晚醒来，WSL 的时钟可能偏几分钟。而「提前 5 分钟提醒」是按分钟算的，偏 5 分钟等于废掉。

```bash
date                                   # 和 Windows 右下角对一下
sudo hwclock -s                        # 偏了就同步
sudo systemctl restart systemd-timesyncd
```

建议每周顺手看一眼，或者干脆让 `npm start` 启动时打一行时间（它现在会打日志时间戳，对一眼就知道）。

### ③ Windows 睡眠 = 全部停摆

合盖睡眠期间不轮询。醒来后靠 `GRACE_MINUTES`（默认 10 分钟）补发一条「报名已开始」，超过就放弃。

这是本地方案的天花板。**如果活动很抢手，宁可把它放到云函数上**（1 分钟定时，不受你电脑开关影响）。

### ④ 网络

WSL2 默认 NAT，访问公网没问题，校园接口也能直连。

只有一种情况要动它：你想让 WSL 里的请求也经过 Reqable（比如排查为什么接口返回不一样）。在 Windows 的 `%UserProfile%\.wslconfig` 里加：

```ini
[wsl2]
networkingMode=mirrored
```

（需要 Win11 22H2+），然后 `wsl --shutdown` 重开，WSL 里就能用 `127.0.0.1:8888` 指到 Reqable 了。

---

## 6. 用 systemd 托管（推荐）

### 开启 systemd

`/etc/wsl.conf` 里加：

```ini
[boot]
systemd=true
```

然后**在 Windows 终端**执行 `wsl --shutdown`，重新进 WSL。

### 建服务

`~/.config/systemd/user/bit2class.service`：

```ini
[Unit]
Description=第二课堂报名提醒
After=network-online.target

[Service]
Type=simple
WorkingDirectory=%h/bit2class-notifier
ExecStart=/usr/bin/env node src/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=default.target
```

```bash
systemctl --user daemon-reload
systemctl --user enable --now bit2class
loginctl enable-linger $USER        # 不登录也在后台常驻
systemctl --user status bit2class
journalctl --user -u bit2class -f   # 看日志
```

### Windows 登录时自动拉起来

任务计划程序 → 创建任务：

- 触发器：**登录时**
- 操作：`wsl.exe`，参数 `-d <发行版名> -u <用户名> -e /bin/true`

`wsl -l -v` 可以看到发行版名。这一步只是「把发行版启动起来」，服务本身由 systemd + linger 负责。

---

## 7. 验收清单

- [ ] `node -v` ≥ 20.6
- [ ] `npm test` 全绿
- [ ] `date` 和 Windows 时间差 < 60 秒
- [ ] `npm run test-notify` 三项全 ✔
- [ ] `systemctl --user status bit2class` 是 `active (running)`
- [ ] **关掉终端 10 分钟，再 `journalctl --user -u bit2class -n 5`，看它还在不在轮询**

最后一条才是真正验证「不会随终端退出」的办法。
