#include <stdio.h>
int main(){
	int i,grade[10],max;
	for(i=0;i<10;i++) scanf("%d",&grade[i]);
	max=grade[0];
	for(i=0;i<10;i++){
		if(grade[i]>max) max=grade[i];
	}
	for(i=0;i<10;i++){
		if(grade[i]==max) printf("%d\n",i+1);
	}	
	return 0;
}
