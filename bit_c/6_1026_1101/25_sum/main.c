#include <stdio.h>
int main(){
	int n,m,sum,i;
	scanf("%d%d",&n,&m);
	sum=0;
	for(i=n;i<=m;i++) sum+=i;
	printf("The sum from %d to %d is %d.\n",n,m,sum);
	return 0;
}
