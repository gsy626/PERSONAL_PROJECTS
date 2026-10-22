#include <stdio.h>
int main()
{
		int hour , min ;
		double degree_h , degree_m , degree, out;
		scanf("%d%d",&hour,&min);
		degree_h = hour * 30 + min / 2.;
		degree_m = min * 6;
		degree = ((degree_m - degree_h) >= 0) ? (degree_m - degree_h) : (degree_h - degree_m);
		out = (degree >= 180) ? (360 - degree) : degree;
		printf("At %d:%.2d the angle is %.1lf degrees.\n",hour,min,out);
		return 0;
}
