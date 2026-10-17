<?php
require_once __DIR__ . '\db.php';
if(session_status()==PHP_SESSION_NONE)
{
    session_start();
}
function current_user()
{
    global $db;
    if (empty($_SESSION['id'])) return NULL;
    $pre = $db -> prepare("SELECT * FROM users WHERE id= :id");
    $pre -> bindValue(':id',(int)$_SESSION['id'],SQLITE3_INTEGER);
    $src = $pre -> execute();
    return $src ? $src -> fetchArray(SQLITE3_ASSOC) : NULL;
}
function require_login()
{
    $user=current_user();
    if(!$user)
    {
        header("Location:index.php");
        exit;
    }
    return $user;
}
function require_level($min_level)
{
    $user=require_login();
    if((int)$_SESSION['level'] < $min_level) die("no accessible");
    return $user;
}
