#include <stdio.h>
int main(){
	int a,b,c;
	scanf("%d%d%d",&a,&b,&c);
	int da,db,dc;
	da=b+c-a;
	db=c+a-b;
	dc=a+b-c;
	int ea,eb,ec;
	ea=a-b;
	eb=b-c;
	ec=c-a;
	if(da>0 && db>0 && dc >0){
		if(ea*eb*ec==0)
		{
			if(ea==0 && eb==0&ec==0)
			{
				printf("equilateral triangle.\n");
			}
			else
			{
				printf("isoceles triangle.\n");
			}
		}
		else
		{
			printf("triangle.\n");
		}

	}
	else 
	{
		printf("non-triangle.\n");
	}
	return 0;
}
