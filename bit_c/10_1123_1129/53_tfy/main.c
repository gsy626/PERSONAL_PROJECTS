#include <complex.h>
#include <stdio.h>
int * split(int integar,int * numbers,int length){
	int i;
	for(i=0;i<length;i++){
		numbers[i]=integar%10;
		integar/=10;
	}
	return  numbers;
}
int combine(int * numbers,int length){
	int i,value=0;
	for(i=0;i<length;i++){
		value=value*10 + numbers[i];
	}
	return value;
}
int * sort(int * input,int length){
	int i,j;
	for(i=0;i<length-1;i++){
		for(j=1;j<length-i;j++){
			if(input[j]<input[j-1]){ 
				int temp=input[j];
				input[j]=input[j-1];
				input[j-1]=temp;
			}
		}
	}
	return input;
}
int * reverse_sort(int * input,int length){
	int i,j;
	for(i=0;i<length-1;i++){
		for(j=1;j<length-i;j++){
			if(input[j]>input[j-1]){ 
				int temp=input[j];
				input[j]=input[j-1];
				input[j-1]=temp;
			}
		}
	}
	return input;
}
int  Aa(int origin){
	int numbers[4];
	split(origin, numbers, 4);
	sort(numbers,4);
	return combine(numbers,4);
}
int  aA(int origin){
	int numbers[4];
	split(origin, numbers, 4);
	reverse_sort(numbers,4);
	return combine(numbers,4);
}
int main(){
	int input,count=0;
	scanf("%d",&input);
	if(aA(input)==Aa(input))
		printf("-1\n");
	else{
		int result=input;
		while(result!=6174){
			result=aA(result)-Aa(result);
			count++;
		}
		printf("%d\n",count);
	}
	return 0;
}
