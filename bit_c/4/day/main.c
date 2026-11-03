#include <stdio.h>
int leap_year(int year)
{	
	int leapnum = year / 4 + year /400 - year/100;
	return  leapnum;
}
int main()
{
	int year , month , day, week , y , m ,d ,w;
	y=2013;m=3;d=11;w=1;
	scanf("%d%d%d",year,month,day);
	if(month > 2)
		week =  (w  + year - y + leap_year(year) - leap_year(y) )%7;
	else
		week = (w +  year - y + leap_year(year-1)- leap_year(y) )%7;
	printf("%d",week);	
}
