#include <stdio.h>
int main(){
	int mem[10][2];
	int i,j;
	for(i=0;i<10;i++){
		scanf("%d",&mem[i][0]);
		mem[i][1]=i+1;
	}
	for(i=0;i<9;i++){
		int max_value=mem[0][0],max_index=0;
		int max_position=0;
		for(j=0;j<=9-i;j++){
			if(mem[j][0]>max_value){
				max_value=mem[j][0];
				max_index=mem[j][1];
				max_position=j;
			}
		}
		int temp1=mem[9-i][0];
		int temp2=mem[9-i][1];
		mem[9-i][0]=max_value;
		mem[9-i][1]=max_index;
		mem[max_position][0]=temp1;
		mem[max_position][1]=temp2;
	}
/*
	for(i=0;i<10;i++)printf("%4d",mem[i][0]);
	printf("\n");
	for(i=0;i<10;i++)printf("%4d",mem[i][1]);
	printf("\n");
*/
	i=9;
	do{
		printf("%d\n",mem[i][1]);
		i--;
	}while(i>=0 && mem[i][0]==mem[i+1][0]);
	return 0;
}
