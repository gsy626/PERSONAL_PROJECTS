#include <stdio.h>
int main(){
	int input;
	int a,b;
	char *tens_place[]={"Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"};
	char *ones_place[]={"one","two","three","four","five","six","seven","eight","nine"};
	char *teens[]={"Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"};
	scanf("%d",&input);
	if(input<10 || input>99) printf("invalid number!\n");
	else{
		b=input%10;
		a=input/10;
		if (a==1) 	printf("%s\n",teens[b]);
		else{
			if(b==0) printf("%s\n",tens_place[a-2]);
			else printf("%s-%s\n",tens_place[a-2],ones_place[b-1]);
		}
	}
	return 0;
}
