#include <stdio.h>
int main()
{
		int year,a,b,c,d;
		scanf("%d",&year);
		a = 1 - ( year % 4 + 3 ) / 4;
		b =  ( year % 100 +99 ) / 100;
		c = 1 - (year % 400 +399) / 400;
		d = a*b+c;
		if(d == 1)
		{
				printf("%d is a leap year.\n" , year);
		}
		else
		{
				printf("%d is not a leap year.\n" , year);
		}
		return 0;
}

