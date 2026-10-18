<?php
require_once __DIR__ . "/auth.php";
$user = current_user();
?>
<?php include __DIR__ . "/nav.php"; ?>

<?php   
    $all_elements = $db->query('SELECT * FROM articles');
    while ($row = $all_elements->fetchArray(SQLITE3_ASSOC))
    {
?>
<strong>ID:</strong> <?= htmlspecialchars((int)$row['id']) ?> | 
<strong>TITLE:</strong> <?= htmlspecialchars((string)$row['title']) ?> | 
<strong>OWNER:</strong> <?= htmlspecialchars((int)$row['user_id']) ?> 

<?php if(isset($user)) : ?>
<?php if((int)$user['level'] === 3) : ?>
<a href="article_edit.php?id=<?= $row['id'] ?>">edit</a>
<?php elseif((int)$user['level'] >= 2 && (int)$row['user_id'] === (int)$user['id'] ) : ?>
<a href="article_edit.php?id=<?= $row['id'] ?>">edit</a>
<?php endif; ?>
<?php endif; ?>
<br>
<?php } ?>
