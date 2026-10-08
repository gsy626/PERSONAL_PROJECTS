#include<stdio.h>
int main(int argc , char** argv)
{
	int *p1,*p2,a,b;
	scanf("%d%d",&a,&b);
	if ( a>b )
	{
		p1=&a;
		p2=&b;
	}
	else
	{
		p1=&b;
		p2=&a;
	}
	printf("%d>%d\n",*p1,*p2);
	return 0;
}
