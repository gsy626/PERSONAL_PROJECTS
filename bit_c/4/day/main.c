#include <complex.h>
#include <stdio.h>
int leap_year(int year)
{	
	int leapnum = year / 4 + year /400 - year/100;
	return  leapnum;
}
int main()
{
	int year , month , day, week , y , m ,d ,w;
	scanf("%d%d%d",year,month,day);
	if(month > 2)
		w =  d + year - y + leap_year(year) - leap_year(y);
	else
		w = d + year - y + leap_year(year-1)- leap_year(y);
	printf("%d",w);	
}
