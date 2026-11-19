#include <stdio.h>
int main(){
	int w;
	char start;
	scanf("%d %c",&w,&start);
	if(start>= 'A' && start <='Z' || ( start>='a' && start <='z')){
		if(start>'Z') start-='a'-'A';
		int num=2*w-1,i;
		char list[num];
		for(i=0;i<num;i++){
			list[i]=( start+i-'A')%26 + 'A';
		}
		//1st
		for(i=0;i<w-1;i++) printf("%c ",list[i]);
		printf("%c\n",list[w-1]);
		for (i=1;i<w-1;i++){
			printf("%c ",list[i]);
			int j;
			for(j=0;j<w-2;j++) printf("  ");
			printf("%c\n",list[w-1+i]);
		}
		if(w>1){
			for(i=0;i<w-1;i++) printf("%c ",list[w-1+i]);
			printf("%c\n",list[num-1]);
		}
	}
	else {
		printf("Input error!\n");
	}
	return 0;
}
