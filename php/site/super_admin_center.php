<?php
require_once __DIR__ . '/auth.php';
$user_info = require_level(3);
?>
<h1>管理员中心</h1>
<?php include __DIR__ . "/nav.php"; ?>
<br>

<?php
$msg ='';
if($_SERVER['REQUEST_METHOD'] == "POST" && isset($_POST['delete']))
{
    verify_token();
    $delete_id = (int)$_POST['delete_id'] ?? '';
    if($delete_id==(int)$_SESSION['id'])
    {
        $msg = "couldn't delete myself";
    }
    if($delete_id<=0)
    {
        $msg = "invalid id";
    }
    if((int)$_SESSION['level'] != 3)
    {
        $msg = "无权限";
    }
    if(!db_execute($db,"DELETE FROM users WHERE id=:id",[':id' => $delete_id]))die("error");
}

?>
<?php 
$all_elements = $db->query('SELECT * FROM  users');
while ($row = $all_elements->fetchArray(SQLITE3_ASSOC))
{
?>
    //<strong>ID:</strong><?= (int)$row['id']

