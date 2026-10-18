<?php
require_once __DIR__ . "/auth.php";// $self -> PATH/TO/FILE
function login_find_user($db,$name,$password)
{
        $pre=$db -> prepare("SELECT * FROM users WHERE name = :name");
        $pre -> bindValue(':name',$name,SQLITE3_TEXT);
        $src = $pre -> execute(); 
        $user_search_result = $src ? $src -> fetchArray(SQLITE3_ASSOC) : false;
        if(!$user_search_result)
            return ['exist'=>0,'user_info'=>NULL];
        else
        {
            if(password_verify($password,$user_search_result['password']))
                return ['exist'=>1,'user_info'=>$user_search_result];
            else
                return ['exist'=>2,'user_info'=>NULL];
        }
}
function register_find_user($db,$name)
{
        $pre=$db -> prepare("SELECT * FROM users WHERE name = :name");
        $pre -> bindValue(':name',$name,SQLITE3_TEXT);
        $src = $pre -> execute(); 
        $user_search_result = $src ? $src -> fetchArray(SQLITE3_ASSOC) : false;
        if(!$user_search_result)
            return 0;
        else
            return 1;
}
$msg = '';
//POST:
if ($_SERVER["REQUEST_METHOD"] == "POST")
{
    verify_token();
    $name=trim($_POST['name'] ?? '');
    $password=$_POST['password'] ?? '';
    if($name === '' || $password === '')
    {
        $msg = "用户名和密码不能为空";
    }
    if($msg === '')
    {
        if(isset($_POST['submit']))
        {
            $Login_Find_User=login_find_user($db,$name,$password);
            if($Login_Find_User['exist']==0)
                $msg =  "用户不存在,请先注册";
            elseif($Login_Find_User['exist']==2)
                $msg = "密码错误";
            elseif($Login_Find_User['exist']==1)
            {   
                session_regenerate_id(true);
                $_SESSION['id']=(int)$Login_Find_User['user_info']['id'];
                $_SESSION['name']=$Login_Find_User['user_info']['name'];
                $_SESSION['level']=(int)$Login_Find_User['user_info']['level'];
                header("Location:article.php");
                exit;
            }
        }
        if(isset($_POST['register']))
        {
            if(register_find_user($db,$name)==0)
            {
                $hash = password_hash($password,PASSWORD_DEFAULT);
                $pre = $db -> prepare("INSERT INTO users (name,password,level) VALUES (:name,:password,:level)");
                $pre -> bindValue(':name',$name,SQLITE3_TEXT);
                $pre -> bindValue(':password',$hash,SQLITE3_TEXT);
                $pre -> bindValue(':level',1,SQLITE3_INTEGER);
                if($pre -> execute() !== false)
                {
                    $msg =  "注册成功,请再次登录";
                }
                else{
                    $msg = "数据库请求失败";
                }
            }
            else
                $msg =  "该用户名已存在,请重新注册";
        }
    }
}
?>
<form method="post" action="" >
<input type="hidden" name="token" value="<?= htmlspecialchars($_SESSION['token']) ?>">
name:<input type="text" name="name">
password:<input type="password" name="password">
<span><?= htmlspecialchars($msg) ?></span>
<input type="submit" name="submit" value="登录">
<input type="submit" name="register" value="注册">
</form>
<a href="index.php">直接浏览</a>
