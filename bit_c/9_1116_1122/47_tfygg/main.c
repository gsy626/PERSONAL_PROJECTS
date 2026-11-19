#include <stdio.h>
int main(){
	int n,m;
	scanf("%d%d",&n,&m);
	//有n元,m个换一个，3块买一个
	int empty_count=0,drunk_count=0;
	drunk_count=empty_count=n/3;
	if(n>=3 && m==1) printf("可以无限喝下去\n");
	else{
		while(empty_count>=m){
			drunk_count+=empty_count/m;	
			empty_count= empty_count +  empty_count/m - empty_count/m *m;
		}
		printf("%d\n",drunk_count);
	}
	return 0;
}
