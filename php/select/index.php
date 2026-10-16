<?php
session_start();
?>

<form method="post" action="" >
name:<input type="text" name="name">
password:<input type="password" name="password">
<input type="submit" name="submit" value="submit">
<input type="submit" name="clean" value="clean database">
</form>
<?php
$db = new SQLite3("user.db");
$db -> exec("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY , name TEXT)");
$info = $db -> query("PRAGMA table_info(users)");
$has_password = false;
while($row = $info->fetchArray(SQLITE3_ASSOC))
{
		if($row['name'] == 'password')
		{
				$has_password = true;
				break;
		}
}
if(!$has_password)
{
		$db -> exec("ALTER TABLE users ADD COLUMN password TEXT");
}	
if ($_SERVER["REQUEST_METHOD"] == "POST")
{
		if(isset($_POST['submit']))
		{
				$data = $_POST['name'] . $_POST['password'];
				if(!isset($_SESSION['last_submit'] ) || $_SESSION['last_submit'] !== $data)
				{
						$_SESSION['last_submit']  = $data;
						$db ->exec("INSERT INTO users (name,password) VALUES (  '{$_POST['name']}','{$_POST['password']}' )");
				}
				$result = $db->query('SELECT * FROM users');
				while ($row = $result->fetchArray(SQLITE3_ASSOC)) 
				{
						echo $row['id'] . 'name: ' . $row['name'] . "	|	password:" .$row['password'] . '<br>';
				}
				$db->close();
		}
		elseif(isset($_POST['clean']))
		{
				$db -> exec("DELETE FROM users");
		}

}
?>


