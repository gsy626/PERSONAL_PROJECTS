<?php
declare(strict_types=1);

// 站点数据集中在 sites.php，新增站点只需要改那一个文件
$sites = array_map(
    static fn (array $site): array => $site + ['desc' => '', 'icon' => 'link'],
    require __DIR__ . '/sites.php'
);

$escape = static fn (string $value): string => htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#070b14">
    <meta name="description" content="GUOSYZAMZ 的个人网站索引：文章与几个自娱自乐的小项目。">
    <title>GUOSYZAMZ · 个人主页</title>
    <link rel="icon" href="favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <canvas id="bg-canvas" aria-hidden="true"></canvas>
    <div class="aurora aurora--teal" aria-hidden="true"></div>
    <div class="aurora aurora--violet" aria-hidden="true"></div>
    <div class="grain" aria-hidden="true"></div>

    <main class="page">
        <header class="hero">
            <p class="hero__eyebrow">
                <span class="pulse" aria-hidden="true"></span>
                Personal Index
            </p>
            <h1 class="hero__title">GUOSYZAMZ</h1>
            <p class="hero__subtitle">小游戏、文字，和一些不务正业的小玩意。</p>
        </header>

        <nav class="cards" aria-label="站点导航">
            <?php foreach ($sites as $site): ?>
                <a class="card" href="<?= $escape($site['href']) ?>">
                    <span class="card__icon card__icon--<?= $escape($site['icon']) ?>" aria-hidden="true"></span>
                    <span class="card__body">
                        <span class="card__title"><?= $escape($site['title']) ?></span>
                        <?php if ($site['desc'] !== ''): ?>
                            <span class="card__desc"><?= $escape($site['desc']) ?></span>
                        <?php endif; ?>
                    </span>
                    <span class="card__arrow" aria-hidden="true"></span>
                </a>
            <?php endforeach; ?>
        </nav>

        <footer class="footer">
            <span>&copy; <?= date('Y') ?> GUOSYZAMZ</span>
            <span class="footer__dot" aria-hidden="true"></span>
            <span>Built with PHP &amp; a little canvas magic</span>
        </footer>
    </main>

    <script src="script.js" defer></script>
</body>
</html>
