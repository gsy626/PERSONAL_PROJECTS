#include <stdio.h>
int main()
{
		char d;
		double temp,out;
		scanf("%c%lf",&d,&temp);
		if( d == 'F' )
		{
			out = ( temp * 9 / 5 ) +32 ;
			printf("The Fahrenheit is %.2lf\n",out);
		}
		else if ( d == 'C') 
		{
			out = ( temp -32 ) * 5 /9;
			printf("The Centigrade is %.2lf\n",out);
		}
		return 0;
}
