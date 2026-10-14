#include<stdio.h>
#define ROW 20
int main()
{
	int f[ROW][ROW]={1};
	for (int i=0;i<ROW;i++)
		for(int j=0;j<i;j++)
			if(j == 0 || j == i )
			{
				f[i][j]=1;
			}
			else
			{
				f[i][j]=f[i-1][j-1]+f[i-1][j];
			}
	for(int i=0;i<ROW;i++)
	{
		for(int j=0;j<i;j++)
		{
			printf("%-8d",f[i][j]);
		}
		printf("\n");
	}

	return 0;
}
	
