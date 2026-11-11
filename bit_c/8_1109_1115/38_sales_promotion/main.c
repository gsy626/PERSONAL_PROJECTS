#include <stdio.h>
int main(){
	int a,b,c,d,sum;
	// 价格 a b c d sum
	//数量  x y z p 
	scanf("%d,%d,%d,%d\n%d",&a,&b,&c,&d,&sum);
	int x,y,z,p;
	for (x=1;x<= sum / a;x++){
		for(y=1;y<=(sum -x*a)/b;y++){
			for(z=1;z<= (sum -x*a -y*b)/c ; z++){
				if( (sum -x*a - y*b-z*c ) % d ==0 ){
					p=(sum -x*a - y*b-z*c ) / d;
					if(x<=y && y<=z && z<=p)
						printf ("%d,%d,%d,%d\n",x,y,z,(sum -x*a - y*b-z*c ) / d);
				}
			}
		}
	}
	return 0;
}
