#include <stdio.h>
int main(){
	int input,d,h,m,s;
	scanf("%d",&input);
	d= input/86400;
	h= input%86400 /3600;
	m= input%86400 %3600 /60;
	s= input%86400 %3600 %60;
	printf("%d天%d小时%d分%d秒\n",d,h,m,s);
	return 0;
}
