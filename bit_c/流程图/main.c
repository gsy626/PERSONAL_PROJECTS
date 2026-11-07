#include <stdio.h>
#define NUM 10
int main(){
	int number_of_better;
	double A[NUM],sum,average;
	sum=0;
	for(int i=0;i<NUM;i++){
		scanf("%lf",&A[i]);
		sum+=A[i];
	}
	average=sum/NUM;
	for(int k=0;k<(NUM-1);k++)	
		for(int i=0;i<(NUM-1);i++){
			if(A[i]<A[i+1]){
				double temp=A[i+1];
				A[i+1]=A[i];
				A[i]=temp;
			}
		}
	number_of_better=0;
	printf("学生成绩列表:\n");
	for(int i=0;i<NUM;i++){
		if(A[i]>= average) number_of_better++;
		printf("%.2lf  ",A[i]);
	}
	printf("\n");
	printf("平均成绩：%.6lf\n大于等于平均成绩人数:%d\n",average,number_of_better);
	return 0;
}
