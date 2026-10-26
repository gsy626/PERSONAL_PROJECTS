<?php
declare(strict_types=1);

/**
 * 站点索引数据
 *
 * 新增站点：复制一组数组，改 href / title 即可。
 * - href  必填，跳转地址
 * - title 必填，站点名称
 * - desc  可选，一句话说明
 * - icon  可选：doc | chip | school | link，默认 link
 */
return [
    [
        'href' => '/site',
        'title' => '文章',
        'desc' => '随笔、笔记和偶尔的长篇大论',
        'icon' => 'doc',
    ],
    [
        'href' => '/content/create_bit',
        'title' => '合成北理工',
        'desc' => '以 BIT 为主题的小小合成游戏',
        'icon' => 'chip',
    ],
    [
        'href' => '/content/create_qyyz',
        'title' => '合成清苑一中',
        'desc' => '以母校为主题的小小合成游戏',
        'icon' => 'school',
    ],
];
