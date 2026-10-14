#include<stdio.h>
int iszs(int a)
{
	int con;
	con=1;
	for( int i=2;i<a;i++)
	{
		if( a%i == 0 )
		{
			con=0;
			break;
		}

	}
	switch(con)
	{
		case 1:
			return(1);
			break;
		case 0:
			return(0);
			break;
	}
}
int main()
{
	int n,sum;
	sum=0;
	scanf("%d",&n);
	int f[n-1][2];
	for( int i=0;i<(n-1);i++)
	{
		f[i][1]=iszs(i+2);
	}
	for( int i=0;i<(n-1);i++)
	{
		if( f[i][1] == 1) 
		{
			printf("%-8d",i+2);
			sum += f[i][1];
			if( sum%5 == 0) printf("\n");
		}
	}

	printf("\n");
	return 0;
}

