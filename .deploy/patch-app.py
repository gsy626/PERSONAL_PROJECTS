#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
在服务器上给站点打补丁（部署相关，不影响本地默认行为）：

1. lib/Config.php   —— 内容目录可用环境变量 / data/content-path.php 覆盖；新增 debug()
2. lib/bootstrap.php —— 生产环境不再强制把错误打到页面上（用 BLOG_DEBUG 或 data/.debug 打开）
3. 创建 data/content-path.php 指向 Web 根目录之外的内容目录
"""
import io
import os
import re
import sys

ROOT = os.path.expanduser('~/WEB_ROOT/PHP')
CONTENT = os.path.expanduser('~/blog-content/qd')

changed = []


def read(path):
    with io.open(path, encoding='utf-8') as fh:
        return fh.read()


def write(path, text):
    with io.open(path, 'w', encoding='utf-8') as fh:
        fh.write(text)


# ---------------------------------------------------------------- Config.php
p = os.path.join(ROOT, 'lib/Config.php')
s = read(p)

old = """    /** 已有博客内容目录（qd/ 中的旧站点） */
    public static function contentDir(): string
    {
        return dirname(self::root()) . DIRECTORY_SEPARATOR . 'qd';
    }
"""

new = """    /**
     * 已有博客内容目录（qd/ 中的旧站点）
     *
     * 默认是本站上一级的 qd/。部署到服务器时内容一般放在 Web 根目录之外，
     * 可以用环境变量 BLOG_CONTENT_DIR，或在 data/content-path.php 里写一行路径覆盖。
     */
    public static function contentDir(): string
    {
        static $dir = null;
        if ($dir !== null) {
            return $dir;
        }

        $env = getenv('BLOG_CONTENT_DIR');
        if (is_string($env) && trim($env) !== '') {
            return $dir = rtrim(trim($env), '/');
        }

        $override = self::path('data', 'content-path.php');
        if (is_file($override)) {
            $value = require $override;
            if (is_string($value) && trim($value) !== '') {
                return $dir = rtrim(trim($value), '/');
            }
        }

        return $dir = dirname(self::root()) . DIRECTORY_SEPARATOR . 'qd';
    }

    /** 是否处于调试模式：是否把错误细节显示到页面上 */
    public static function debug(): bool
    {
        static $debug = null;
        if ($debug === null) {
            $env   = getenv('BLOG_DEBUG');
            $debug = ($env !== false && $env !== '' && $env !== '0')
                || is_file(self::path('data', '.debug'));
        }
        return $debug;
    }
"""

if old in s:
    s = s.replace(old, new, 1)
    write(p, s)
    changed.append('lib/Config.php')
elif 'BLOG_CONTENT_DIR' in s:
    print('lib/Config.php 已经打过补丁，跳过')
else:
    print('!! lib/Config.php 没找到要替换的片段', file=sys.stderr)
    sys.exit(1)

# ------------------------------------------------------------ bootstrap.php
p = os.path.join(ROOT, 'lib/bootstrap.php')
s = read(p)

old = """mb_internal_encoding('UTF-8');
date_default_timezone_set('Asia/Shanghai');

error_reporting(E_ALL);
ini_set('display_errors', '1');

require_once __DIR__ . '/Config.php';
"""

new = """require_once __DIR__ . '/Config.php';

mb_internal_encoding('UTF-8');
date_default_timezone_set('Asia/Shanghai');

// 生产环境不把错误细节打到页面上；需要排查时
// 设置环境变量 BLOG_DEBUG=1 或创建 data/.debug 文件
error_reporting(E_ALL);
ini_set('display_errors', Config::debug() ? '1' : '0');
ini_set('log_errors', '1');
"""

if old in s:
    s = s.replace(old, new, 1)
    write(p, s)
    changed.append('lib/bootstrap.php')
elif 'Config::debug()' in s:
    print('lib/bootstrap.php 已经打过补丁，跳过')
else:
    print('!! lib/bootstrap.php 没找到要替换的片段', file=sys.stderr)
    sys.exit(1)

# ------------------------------------------------------- data/content-path.php
p = os.path.join(ROOT, 'data/content-path.php')
write(p, """<?php
/**
 * 博客正文所在目录（Web 根目录之外，避免 .qd 源文件和图片被直接下载）
 * 删掉这个文件就会退回默认值：本站上一级的 qd/
 */
return '%s';
""" % CONTENT)
changed.append('data/content-path.php')

print('已修改：' + ', '.join(changed))
