<?php
require_once __DIR__ . "/auth.php";
$user = current_user();
?>
<?php include __DIR__ . "/nav.php"; ?>

<?php   
    $articles_info = db_query($db,"SELECT * FROM articles ORDER BY id DESC");
    foreach($articles_info as $each_article )
    {
?>
<strong>ID:</strong> <?= htmlspecialchars((int)$each_article['id']) ?> | 
<strong>TITLE:</strong> <?= htmlspecialchars((string)$each_article['title']) ?> | 
<strong>OWNER:</strong> <?= htmlspecialchars((int)$each_article['user_id']) ?> 

<?php if(isset($user)) : ?>
<?php if((int)$user['level'] === 3) : ?>
<a href="article_edit.php?id=<?= $each_article['id'] ?>">edit</a>
<?php elseif((int)$user['level'] >= 2 && (int)$each_article['user_id'] === (int)$user['id'] ) : ?>
<a href="article_edit.php?id=<?= $each_article['id'] ?>">edit</a>
<?php endif; ?>
<?php endif; ?>
<br>
<?php } ?>
