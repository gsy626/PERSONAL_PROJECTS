#include <stdio.h>
int main(){
	int A,B,x,y;
	double k,m;
	scanf("%d%d\n%d%d",&A,&B,&x,&y);
	if( A*B != B * x*x + A* y*y){
		printf("Input error!\n");
	}
	else {
		if(y==0){
			printf("x=%.6lf\n",1.0* A /x);
		}
		else {
			k=-1.0* x * B / ( A * y);
			m=1.0 * B / y;
			if(k==0)
				printf("y=%.6f\n",m);
			else{
				if(m>0){
					printf("y=%.6lfx+%.6lf\n",k,m);
				}
				else if(m==0){
					printf("y=%.6lfx",k);
				}
				else {
					printf("y=%.6lfx%.6lf\n",k,m);
				}
			}

		}
	}
	return 0;
}
