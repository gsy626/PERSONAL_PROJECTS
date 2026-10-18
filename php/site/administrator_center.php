<?php
require_once __DIR__ . '/auth.php';
$user_info = require_level(3);
function print_table($db,$table)
{
    $all_elements = $db->query('SELECT * FROM ' .$table);
    while ($row = $all_elements->fetchArray(SQLITE3_ASSOC))
    {
        foreach($row as $key => $value)
            echo "| " . htmlspecialchars($key) .":" . htmlspecialchars((string)$value);
        if($row['id']!=$_SESSION['id'])
        {
            echo 
                '<form action="" method="POST">
                    <input type="hidden" name="delete_id" value="' . (int)$row['id'] . '">
                    <button type="submit" name="delete" value="1">删除用户</button>
                </form>';
        }
        echo "<br>";
    }
}
?>
<h1>管理员中心</h1>
<?php include __DIR__ . "/nav.php"; ?>
<br>

<?php
if($_SERVER['REQUEST_METHOD'] == "POST" && isset($_POST['delete']))
{
    $delete_id = (int)$_POST['delete_id'];
    if($delete_id==(int)$_SESSION['id'])
    {
        die("couldn't delete myself");
    }
    if($delete_id<=0)
    {
        die("invalid id");
    }
    if((int)$_SESSION['level'] != 3)
    {
        die("无权限");
    }
    $pre = $db -> prepare("DELETE FROM users WHERE id=:id");
    $pre -> bindValue(':id',$delete_id,SQLITE3_INTEGER);
    $pre -> execute();
}
print_table($db,"users");
?>
