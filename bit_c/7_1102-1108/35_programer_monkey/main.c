#include <stdio.h>
long long c(int n,int m){
	int i;
	long long out=1;
	for(i=1;i<=m;i++) out= out * (n-i+1)/i;
	return out;
}
int main(){
	int x,y,z;
	scanf("%d%d%d",&x,&y,&z);
	printf("%lld\n",c(x+y+z,x) * c(y+z,y)) ;
	return 0;
}
