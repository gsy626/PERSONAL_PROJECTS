#include <stdio.h>
int main(){
	int x,y,gcd;
	scanf("%d%d",&x,&y);
	gcd=x>=y ? y : x ;
	while(gcd >0){
		if(x%gcd==0 && y%gcd==0) break;
		gcd--;
	}
	printf("GCD(%d,%d)=%d\n",x,y,gcd);
	return 0;
}
