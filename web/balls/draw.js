
console.log("hh");
   /** @type {HTMLCanvasElement} */
const canvas=document.getElementById("canvas");
const ctx= canvas.getContext("2d");
const W=2;
const R=20;
const BACKGROUND="rgba(0,0,0,0.05)";
const BALLCOL="yellow";
const trail=Array();
const LEFT=2;
const DELTA_T=14;
function ClearAll()
{
	ctx.fillStyle=BACKGROUND;
	ctx.fillRect(0,0,canvas.width,canvas.height);
}
function Ball(x,y,r,color,alpha)
{
	ctx.globalAlpha=alpha;
	ctx.fillStyle=color;
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.arc(x, y, r, 0, Math.PI*2);
	ctx.closePath();
	ctx.fill();
	ctx.globalAlpha=1;
}
function Trail(x,y,r)
{
	trail.push({X:x,Y:y});
	if(trail.length >= LEFT)var shift = trail.shift();
	console.log(shift);
	for(let a=(trail.length-1);a>=0;a--)
	{
		Ball(trail[a].X,trail[a].Y,R,BALLCOL,1);
	}
}
let i=0;
const timer=setInterval(function(){
	ClearAll();
	i+=W;
	Trail(i,i,R);
	if(i >= (canvas.width+200))clearInterval(timer);
},DELTA_T);

