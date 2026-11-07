#include <stdio.h>
int times(int n){
	int i,out;
	out=1;
	for(i=1;i<=n;i++) out*=i;
	return out;
}
int main(){
	int x,y,z;
	scanf("%d%d%d",&x,&y,&z);
	printf("%d\n",times(x+y+z)  / ( times(x)* times(y) * times(z) )) ;
	return 0;
}
