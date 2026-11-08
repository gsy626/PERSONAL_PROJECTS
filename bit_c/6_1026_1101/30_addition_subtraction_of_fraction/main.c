#include <stdio.h>
int absolute(int a){
	return a>=0 ? a : -a;
}
int main(){
	int fz1,fz2,fm1,fm2;
	int a,b;
	int positive=1;
	scanf("%d%d%d%d",&fz1,&fm1,&fz2,&fm2);
	b= fm1*fm2;
	a= fz1*fm2 + fz2*fm1;
	if(a*b<0) positive=0;
	a=absolute(a);
	b=absolute(b);
	int gcd= a>=b ? b :a;
	while(gcd>0){
		if(a%gcd==0 && b%gcd==0){
			a/=gcd;
			b/=gcd;
			break;
		}
		gcd--;
	}
	if(positive) printf("%d/%d\n",a,b);
	else printf("-%d/%d\n",a,b);
	return 0;
}
