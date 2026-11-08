#include <stdio.h>
int main(){
	char input,a_or_A;
	int i;
	scanf("%c",&input);
	a_or_A = input >= 'a' ? 'a' : 'A';
	for(i=0;i<26;i++){
		putchar((input + i - a_or_A)%26 +a_or_A);
	}
	printf("\n");
	return 0;
}
