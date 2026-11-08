//a divided by b
//n1: a/b
//n2: a%b * 10 /b
//n3: a%b *10 %b *10 /b
//...
//
//n1: a/b a=a%b *10
//n2: a/b a=a%b *10
//n3: a/b ...
//
#include<stdio.h>
int main(){
	int a,b,place;
	scanf("%d/%d",&a,&b);
	place=-1;
	while(a>0 && place<200){
		place++;
		printf("%d",a/b);
		if(place==0)printf(".");
		a= a%b *10;
	}
	printf("\n");
	return 0;
}
