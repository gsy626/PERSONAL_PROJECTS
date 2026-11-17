#include <stdio.h>
int main(){
	int line,init;	
	scanf("%d%d",&line,&init);
	int list[3*line-2];
	int i,j;
	for(i=0;i<(3*line-1)/2;i++)
		list[i]=(init+i)%10;
	for(i=0;i<(3*line -2)/2;i++)
		list[3*line- 3 -i] = list[i];
	for(i=0;i<line;i++){
		for(j=0;j<i;j++) printf("  ");
		printf("%d",list[i]);
		for(j=0;j<3*line-4-2*i;j++){
			if(i==0 || i==line-1)
				printf(" %d",list[1+i+j]);
			else
				printf("  ");
		}
		if(line !=1)	printf( " %d\n",list[3*line-3-i]);
		else printf("\n");
	}
	return 0;
}
