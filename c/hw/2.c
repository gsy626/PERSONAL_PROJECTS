#include<stdio.h>
int max(int a, int b,int c)
{
	if(a > b)
		if(a>c)
			return(a);
		else 
			return(c);
	else
		if(b<c)
			return(c);
		else
			return(b);
}
int main (int argc,char** argv)
{
	char o[7][7];
	int in[3][3];
	int z[3],c[3];
	for(int i=0;i<7;i++)
		for(int j=0;j<7;j++)
			o[i][j]=' ';
	for(int i=0;i<3;i++)
		scanf("%d%d%d",&in[i][0],&in[i][1],&in[i][2]);
	//正视图
	for(int i=0;i<3;i++)
		z[i]=max(in[0][i],in[1][i],in[2][i]);

	for(int i=0;i<3;i++)
		for(int j=0;j<3;j++)
		{
			if(j<(3-z[i])) continue;
			o[j][i]='o';
		}
	//侧视图
	for(int i=0;i<3;i++)
		c[i]=max(in[i][0],in[i][1],in[i][2]);
	for(int i=4;i<=6;i++)
		for(int j=0;j<3;j++)
		{
			if(j<(3-c[i-4])) continue;
			o[j][i]='o';
		}

	//俯视图
	for(int i=4;i<7;i++)
	{
		for(int j=0;j<3;j++)
		{
			if(in[i-4][j] >0)
			       	o[i][j]='o';
		}
	}
	//分割线
	for(int j=0;j<7;j++) o[3][j]='-';
	for(int i=0;i<7;i++) o[i][3]='|';
	o[3][3]='+';
	//print	
	for(int i=0;i<7;i++)
	{
		for(int j=0;j<7;j++)
			printf("%c",o[i][j]);
		printf("\n");
		}
	getchar();
	return 0;

			
}
	



	

