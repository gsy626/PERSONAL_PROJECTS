#include <stdio.h>
int main(){
	long long n;
	int step=0;
	scanf("%lld",&n);
	while(n>1 && step<20){
		step++;
		if(n%2 != 0){
			printf("%lld*3+1=%lld\n",n,3*n+1);
			n=n*3+1;
		}
		else{
			printf("%lld/2=%lld\n",n,n/2);
			n/=2;
		}
	}
	return 0;
}
