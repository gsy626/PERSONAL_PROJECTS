#include <stdio.h>
#include <sys/types.h>
int main(){
	int n,c;
	scanf("%d%d",&n,&c);
	int character[3*n-2];
	int i,j;
	for(i=0;i<n+(n+1)/2;i++)
		character[i]= (c+i)%10;
	for(i=0;i<n+n/2;i++)
		character[3*n-3-i] = character[i];
	for(i=0;i<3*n-2;i++){
		if(i==3*n-3)
			printf("%d",character[i]);
		else
			printf("%d ",character[i]);
	}
	printf("\n");

	for(i=2;i<=n;i++){
		for(j=0;j<i-1;j++)
			printf("  ");
		printf("%d ",character[i-1]);
		for(j=0;j<3*n -2*i -2 ;j++){
			if(i==n)
				printf("%d ",character[3*n-2*i +j]);
			else
				printf("  ");
		}
		printf("%d",character[i-1]);
		printf("\n");
	}
	return 0;
}
