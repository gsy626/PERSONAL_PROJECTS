#include <stdio.h>
long long o_to_now(int y,int m,int d){
	long long out;
	if( m==1 || m==2) {
		m +=12;
		y--;
	}
	out = 365 * y + y / 4 - y/100 + y/400 + (153 * ( m-3) +2 ) /5 + d;
	return out;
}
int main(){
	int y1,m1,d1;
	int y2,m2,d2;
	scanf("%d%d%d",&y1,&m1,&d1);
	scanf("%d%d%d",&y2,&m2,&d2);
	long long difference;
	difference = o_to_now(y2, m2, d2)- o_to_now(y1, m1, d1);
	printf("%lld days\n",difference);
	return 0;
}
//m     sum of day before m
//3		0
//4		31
//5		61
//6		92
//7		122
//8		153
//9		184
//10	214
//11	245
//12	275
//13	306
//14	337
//
//3
//4
//5
//6....
