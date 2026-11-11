#include <stdio.h>
int main(){
	int n,m;
	scanf("%d%d",&n,&m);
	int k,times;
	times=0;
	for(k=n;k<=m;k++){
		int j;
		if(k%7==0)
			times++;
		else{
			//0: a%10
			//1: a/10 %10
			//2: a/100 %10
			//3: ...
			//n-1 a/10^(n-1)%10
			//n: a/10^n   %10
			//最多7位数
			//n max=6
			int i= (k>=0) ? k :-k ;
			int x=i*10;
			for(j=0;j<=6;j++){
				x/=10;
				if( x%10 == 7){
					times++;
					break;
				}
			}
		}
	}
			printf("%d\n",times);
	return 0;
}
