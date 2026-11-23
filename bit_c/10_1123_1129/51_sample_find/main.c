#include <stdio.h>
int main(){
	int n,m;
	scanf("%d%d",&n,&m);
	int student[n],i,count=0;
	for(i=0;i<n;i++) student[i]=0;
	for(i=0;i<m;i++){
		int index;
		scanf("%d",&index);
		student[index]++;
	}
	for(i=0;i<n;i++){
		if(student[i]==0){
			printf("%d ",i);
			count++;
		}
	}
	if(count==0) printf("Go!");
	printf("\n");
	return 0;
}
