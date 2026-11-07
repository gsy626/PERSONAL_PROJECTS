#include <stdio.h>
#define MAX 20
int main(){
	int start[MAX],end[MAX];
	int i,num;
	num=-1;
	for(i=0;i<MAX;i++){
		num++;
		scanf("%d%d",&start[i],&end[i]);
		if(start[i]==0 || end[i]==0)break;
	}
	for(i=0;i<num;i++){
		if(start[i]<end[i] && end[i] > 1000 && start[i] < 9999){
			int j,counter;
			counter=0;
			for(j=start[i];j<=end[i];j++){
				if(j%2 !=0 ) continue;
				int a,b,c,d;
				d=j%10;
				c=j/10%10;
				b=j/100%10;
				a=j/1000;
				if( (a-b)*(a-c)*(a-d)*(b-c)*(b-d)*(c-d) ==0) continue;
				printf("%d  ",j);
				counter++;
			}
			printf("\ncounter=%d\n",counter);
		}
		else{
			printf("Error\n");
		}
	}

	return 0;
}
