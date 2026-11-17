#include <stdio.h>
int main(){
	int n,i;
	scanf("%d",&n);
	int count=1;
	for(i=1;i<=n*n;i++){
		count++;
		printf("%3d",i);
		if( i%n==0 ) printf("\n");
	}
	return 0;
}

