#include <stdio.h>
int leap_num(int year)
{
	int leapnum = year / 4 + year /400 -year/100;
	return leapnum;
}
int main()
{
	int date,year,day,y,d;
	scanf("%d",&year);
	y = 2024;
	d = 3;
	day = ( ( d + year - y + leap_num(year)-leap_num(y) ) %7 +7 )%7;
	date = 1 + 7 - day + ( day + 6 ) / 7 * 7 ;
	printf("%d年的母亲节是5月%d日。\n",year,date);
	return 0;
}
