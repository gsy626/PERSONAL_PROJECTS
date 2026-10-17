<?php
require_once __DIR__ . "/auth.php";
$user_info = require_level(2);
$article = [ 'title' => '' , 'content' => ''];
$titleErr=$contentErr='';
if($_SERVER['REQUEST_METHOD']=='POST')
{
    if(isset($_POST['submit']))
    {
        $title=$_POST['title'];
        $content=$_POST['content'];
        $article = [ 'title' => $title , 'content' => $content];
        if(empty($title)) $titleErr="标题不能为空";
        if(empty($content)) $contentErr="内容不能为空";
        if($titleErr==='' && $contentErr==='')
        {
            $pre = $db -> prepare("INSERT INTO articles (user_id,title,content) VALUES (:user_id,:title,:content)");
            $pre -> bindValue(':user_id',(int)$user_info['id'],SQLITE3_INTEGER);
            $pre -> bindValue(':title',$title,SQLITE3_TEXT);
            $pre -> bindValue(':content',$content,SQLITE3_TEXT);
            $src = $pre -> execute();
            header("Location:" . __FILE__);
            exit;
        }
    }
    if(isset($_POST['restart']))
    {
        header("Location:" . __FILE__);
        exit;
    }
}
?>
<form action="" method="post">
<input type="text" name="title" value="<?php echo htmlspecialchars($article['title']) ?>">
<span><?php echo htmlspecialchars($titleErr) ?></span>
<br>
<textarea rows="10" cols="40" name="content"><?php echo htmlspecialchars($article['content']) ?></textarea>
<span><?php echo htmlspecialchars($contentErr) ?></span>
<br>
<input type="submit" name="submit" value="发布文章">
<input type="submit" name="restart" value="再写一篇">

</form>
<?php   
    $all_elements = $db->query('SELECT * FROM articles');
    while ($row = $all_elements->fetchArray(SQLITE3_ASSOC))
    {
        foreach($row as $key => $value)
            echo "| " . htmlspecialchars($key) .":" . htmlspecialchars((string)$value);
        echo "<br>";
    }
?>
