#include <stdio.h>
int main(){
//kfc 麦当劳 必胜客
//20   12     8
//x    y      n-x-y
//20x+ 12y + 8(n-x-y) =m
//12x + 4y = m-8n
//4( 3x + y) = m-8n
	int n,m;
	scanf("%d%d",&n,&m);
	if( ( m - 8 *n )%4==0 && ( m - 8 * n)>=0){
		int x,y;
		printf("KFC McDonald PissaHut\n");
		for(y= (m - 8 * n) /4 ;y>=0 ;y--){
			if( ((m - 8 * n) /4 - y ) % 3 ==0 ){
				x=((m - 8 * n) /4 - y ) /3;
				if(x<0 || y<0 || n-x-y<0) continue;
				printf("%d %d %d\n",x,y,n-x-y);
			}
		}
	}
	else{
		printf("No Solution!\n");
	}
	return 0;
}
