#include<stdio.h>
int min(int a, int b)
{	if(a > b)
	{
		return(b);
	}
	else
	{
		return(a);
	}
}

int max(int a, int b)
{	if(a > b)
	{
		return(a);
	}
	else
	{
		return(b);
	}
}
int main(int argc,char** argv)
{

	int a,b,c,result;
	scanf("%d%d",&a,&b);
	if(min(a,b) >= 0 && max(a,b) <= 1000000000 && min(a,b) <= 1000000)
	{
		c=min(a,b);
		for(int i=c;i>=1;i--)
		{
			if( a%i ==  0 && b%i == 0 )
			{
				result=i;
				break;
			}
		}
		printf("result=%d",result);
	}
	else{
		printf("输入超出范围");
	}
	return 0;
}

