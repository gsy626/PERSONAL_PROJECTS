<!DOCTYPE html>
<body>
<?php
echo "jjjjj";
$a=1;
$b=2;
$c=$a+$b;
echo $c;

function test()
{
		$a=1111;
		global $a;
		echo $a;
		$b=2222;
		$b=$GLOBALS['b'];
		echo "<p>$b<p>";
};
function ddd($y)
{
		static $x=0;
		echo "<h3>$x<h3>";
		$x+=$y;
}
ddd(5);
ddd(5);
ddd(5);
ddd(5);
ddd(5);
ddd(5);
ddd(5);
ddd(5);
ddd(5);
ddd(5);
ddd(5);
ddd(5);
test();
echo $b;
echo "<h1>$a 哈哈哈哈<h1>";
?>
<h1>888</h1>

<?php
$cars =array();
for($i=0;$i<10;$i++)
{
		$cars[$i]=10*$i;
		echo $cars[$i] . $i .  PHP_EOL;
}
echo <<<EOF
	<h1>wwwwwwww</h1>
	<h2>hhhh</h2>
EOF;
class C
{
		var $color;
		function con($color)
		{
				$this->color=$color;
		}
		function pt()
		{
				echo "<h1>$this->color</h1>";
		}
}
$wwww=new C();
$wwww->con("red");
$wwww->pt();

$vars=array(111,1.111,-100,"hhjjj1w2333","hhhhlljih","true",false,$cars,NULL);
for($i=0;$i<10;$i++)
{
		var_dump($vars[$i]);
}
echo "<br>";
echo "jjj";




?>

</body>
