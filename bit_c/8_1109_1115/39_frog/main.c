#include <stdio.h>
int main(){
	int n,m,x;
	scanf("%d%d%d",&n,&m,&x);
	int d,h;
	h=x;
	for (d=1;d>0;d++){
		h-= n+1-d;
		if(h<=0){
			printf("青蛙能爬出井，且第 %d 天爬出井。\n",d);
			break;
		}
		h+=m;
		if(h>x){
			printf("青蛙不能爬出井。\n");
			break;
		}
	}
	return 0;
}
