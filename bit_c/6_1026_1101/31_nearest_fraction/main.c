#include <stdio.h>
long long absolute(long long a){
	return a>=0 ? a : -a ;
}
int  main(){
	long long x,y,n,a,b;
	scanf("%lld%lld%lld",&x,&y,&n);
	long long result[n][2];
	long long i;
	for(i=0;i<n;i++){
		//b= i+1
		//a= [x*b/y] or [x*b/y]+1
		// |xb - ay| min
		long long a1,a2;
		a1=x*(i+1)/y;
		a2=x*(i+1)/y +1;
		result[i][0] = ( absolute(x*(i+1) - a1*y) > absolute(x*(i+1) - a2*y) ) ? a2 : a1;
		result[i][1]=i+1;
	}
	a=result[0][0];
	b=result[0][1];
	for(i=1;i<n;i++){
		if( absolute(result[i][0] * b * y - b* result[i][1] * x ) < absolute( a*result[i][1] * y  - b* result[i][1]* x) ){
		a=result[i][0];
		b=result[i][1];
		}
	}
	/*
	long gcd= a>=b ? b : a;
	while(gcd >0){
		if(a%gcd==0 && b%gcd==0){
			a/=gcd;
			b/=gcd;
			break;
		}
		gcd--;
	}
	*/
	printf("%lld/%lld\n",a,b);
	return 0;
}
