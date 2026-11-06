#include <stdio.h>
#include <math.h>
int main(){
	int a,b,c;
	//ax^2+bx+c=0;
	int delta;
	double result;
	scanf("%d%d%d",&a,&b,&c);
	delta = b*b -4*a*c;
	if(a==0)
	{
		if(b==0)
			printf("Input error!\n");
		else
			if(c==0)
				printf("x=%.6lf\n",0.0);
			else
				printf("x=%.6lf\n",-1.0*c/b);
	}
	else
	{
		if(delta == 0)
		{
			 result=-b / ( 2.0 * a);
			 printf("x1=x2=%.6lf\n",result,result);
		}
		else if (delta > 0) {
			double x1=( -1.0* b + sqrt( delta) )/(2*a);
			double x2=( -1.0* b - sqrt( delta) )/(2*a);
			printf("x1=%.6lf\nx2=%.6lf\n",x1,x2);
		}
		else
		{
			printf("delta<0");
		}
	}
}
