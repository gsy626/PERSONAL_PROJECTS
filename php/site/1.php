<?php
session_start();
if(empty($_SESSION['id']) || (int)$_SESSION['level'] !== 1)
{
		header("Location:index.php");
		exit;
}
?>
<body>
<h1>游客中心</h1>
Hello!<?php echo htmlspecialchars($_SESSION['name']) ?>
<button ><a href="logout.php">logout</a></button>
</body>
