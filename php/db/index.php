<?php
$q = isset($_GET['q']) ? $_GET['q'] : '';
if($q)
{
		switch($q)
		{
		case "bit.edu.cn":
				header("Location: https://www.bit.edu.cn");
				exit;
				break;
		}
}
else 
{
?>
<form action="" method="get">
	<select name="q">
		<option value="">select sth.</option>
		<option value="bit.edu.cn">bit</option>
		<option value="baidu.com">baudu</option>
	</select>
<input name="input" type="search">
<input type="submit" value="submit">
</form>
<?php
}
?>
