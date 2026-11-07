#include <stdio.h>
int main(){
	int input;
	scanf("%d",&input);
	int num=0;
	unsigned result=(unsigned int)input;
	while(result>0){
		result &= result-1;
		num++;
	}
	printf("%d\n",num);
	return 0;
}
