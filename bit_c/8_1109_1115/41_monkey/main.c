#include <stdio.h>
int main(){
	//1 14  7  -1 6
	//2 6   3  -2 1
	//3 1
	int n,day,first_day;
	scanf("%d",&n);
	first_day=1;
	for(day=n-1;day>=1;day--){
		first_day=( first_day+day )*2;
	}
	if(first_day>1)
		printf("The monkey got %d peaches in the first day.\n",first_day);
	else
		printf("The monkey got %d peach in the first day.\n",first_day);
	return 0;
}
