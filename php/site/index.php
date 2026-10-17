<?php
session_start();
require_once __DIR__ . "/db.php";
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
//POST:
if ($_SERVER["REQUEST_METHOD"] == "POST")
{
    $name=trim($_POST['name'] ?? '');
    $password=$_POST['password'];
    if($name === '' || $password === '') die("用户名和密码不能为空");
    if(isset($_POST['submit']))
    {
        $Login_Find_User=login_find_user($db,$name,$password);
        if($Login_Find_User['exist']==0)
            echo "用户不存在,请先注册";
        elseif($Login_Find_User['exist']==2)
            echo "密码错误";
        elseif($Login_Find_User['exist']==1)
        {   
            $_SESSION['id']=(int)$Login_Find_User['user_info']['id'];
            $_SESSION['name']=$Login_Find_User['user_info']['name'];
            $_SESSION['level']=(int)$Login_Find_User['user_info']['level'];
            session_regenerate_id(true);
            switch($_SESSION['level'])
            {
            case 1:header("Location:1.php");exit;
            case 2:header("Location:2.php");exit;
            case 3:header("Location:3.php");exit;
            }
        }
    }
    if(isset($_POST['register']))
    {
        $hash = password_hash($password,PASSWORD_DEFAULT);
        if(register_find_user($db,$name)==0)
        {
            $pre = $db -> prepare("INSERT INTO users (name,password,level) VALUES (:name,:password,:level)");
            $pre -> bindValue(':name',$name,SQLITE3_TEXT);
            $pre -> bindValue(':password',$hash,SQLITE3_TEXT);
            $pre -> bindValue(':level',1,SQLITE3_INTEGER);
            $pre -> execute();
            echo '注册成功,请<a href="index.php">登录</a>';
        }
        else
            echo "该用户名已存在,请重新注册";
    }
    if(isset($_POST['visitor']))
    {
        header("Location:0.php");
        exit;
    }
    $db->close();
}
?>
<form method="post" action="" >
name:<input type="text" name="name">
password:<input type="password" name="password">
<input type="submit" name="submit" value="登录">
<input type="submit" name="register" value="注册">
<input type="submit" name="visitor" value="直接浏览">
</form>

