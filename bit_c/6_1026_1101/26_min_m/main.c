#include <stdio.h>
int main(){
	int n,m;
	scanf("%d",&n);
	m=1;
	while (m* (m+1) / 2 < n)
		m++;
	printf("%d\n",m);
	return 0;
}
