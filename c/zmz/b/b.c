#include <stdio.h>
int main()
{
	int a,aa;
	int i=0;
	scanf("%d",&a);
	aa=a;
	do {
		i++;
		a=a/2;
	}while (a!=0);
	int b[i];
	a=aa;
	for(int j=0;j<i;j++)
	{
		b[j]=a%2;
		a=a/2;
	}
	for(int j=(i-1);j>=0;j--)
		printf("%d",b[j]);
}
