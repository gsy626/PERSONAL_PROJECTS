#include <stdio.h>
int main(){
	int input,S,R;
	scanf("%d",&input);
	S = input % 10;
	R = input /10;
	char * r[]={
		"unreadable","barely readable, occasional words distinguishable","readable with considerable difficulty","readable with practically no difficulty","perfectly readable"};
	char * s[]={
		"Faint signals, barely perceptible","Very weak signals","Weak signals","Fair signals","Fairly good signals","Good signals","Moderately strong signals","Strong signals","Extremely strong signals"};
	printf("%s, %s.\n",s[S-1],r[R-1]);
	return 0;
}
