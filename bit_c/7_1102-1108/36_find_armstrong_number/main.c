#include <stdio.h>
int square(int x,int n){
	int i;
	int out=1;
	for(i=0;i<n;i++) out*=x;
	return out;
}
int main(){
	int n,i,not_exist;
	not_exist=1;
	scanf("%d",&n);
	for(i=square(10, n-1);i<square(10,n);i++){
		int num[n];
		int j;
		for(j=0;j<(n-1);j++) num[j]= i /square(10, j) % 10;
		num[n-1]= i/square(10,n-1);
		int sum=0;
		for(j=0;j<n;j++) sum+=square(num[j], n);
		if(sum==i){
			printf("%d\n",i);
			not_exist=0;
		}
	}
	if(not_exist) printf("No output.\n");
	return 0;
}
