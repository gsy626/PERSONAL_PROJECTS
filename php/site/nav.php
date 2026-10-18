<?php 
require_once __DIR__ . "/auth.php";
$user = current_user();
?>
<nav>
<a href="index.php">首页</a>
<?php if(!$user) : ?>
    <a href="login.php">登录</a>
<?php else : ?>
    <a href="logout.php">退出登录</a>
    <?php if((int)$user['level'] ===3 ) : ?>
        <a href="super_admin_center.php">管理</a>
    <?php endif; ?>
<?php endif; ?>
</nav>
