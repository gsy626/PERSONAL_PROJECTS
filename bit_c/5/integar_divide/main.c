#include <stdio.h>
int main(){
	long N,M,K;
	scanf("%ld%ld",&N,&M);
	K=0;
	int i;
	for(i=1;i<N;i++){
		if(N/M == N/i) K++;
		if(N/M > N/i) break;
	}
	printf("%ld\n",K);
	return 0;
}
