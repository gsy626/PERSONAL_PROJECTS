#include <stdio.h>
#include <stdbool.h>
int main()
{
	//W=( 1+d+ 2m +3(m+1)/5 +y +y/4 -y/100 +y/400)mod 7
	int y,m,d,w;
	bool is_valid=false;
	scanf("%d%d%d",&y,&m,&d);
	int is_leap= y/4 -y/100 +y/400;
	int days[12] ={31,28,31,30,31,30,31,31,30,31,30,31};
	if(is_leap) days[1]=29;

	if(m>0 && m<=12){
		if(d<=0 || d> days[m-1] )printf("day is wrong.\n");
		else is_valid=true;
	}
	else {
		if(d>0 && d<=31) printf("month is wrong.\n");
		else printf("month and day are wrong.\n");
	}
	if(is_valid){
		if(m==1 || m==2)
		{
			m+=12;
			y-=1;
		}
		w = (1+ d+ 2*m +3*(m+1)/5 +y +y/4 -y/100 +y/400) %7;
		printf("%d\n",w);
	}
	return 0;
}

