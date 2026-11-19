#include <stdio.h>
int main(){
	int w,h;
	char ch;
	scanf("%c%d%d",&ch,&w,&h);
	//底层宽度:
	//w+2*h-2
	//只需定义字符数组元素个数:
	//w+2*h-1/ 2
	//0------w+2*h/2
	//另一半对称
	int i,j,num=w+2*h-2;
	char brick[num];
	//前num+1/2个
	for(i=0;i<(num+1)/2;i++){
		brick[i]= ch>'Z' ?  'z' - ('z' -  ch +i )%26 : 'Z' - ('Z' -  ch +i )%26;
	}
	//后num/2个
	for(i=0;i<num/2;i++){
		brick[num-1-i]=brick[i];
	}
	int count=0;
	for(i=0;i<h;i++){
		for(j=0;j<h-1-i;j++) printf(" ");
		for(j=0;j< (w+1)/2+i ;j++) {
			printf("%c",brick[j]);
			if(brick[j]=='z' || brick[j]=='Z') count++;
		}
		for(j=0;j< w/2+i  ;j++){
			printf("%c",brick[num-w/2-i+j]);
			if(brick[num-w/2-i+j]=='z' || brick[num-w/2-i+j]=='Z') count++;
		}
		printf("\n");
	}
	printf("所建金字塔共使用%d个字母砖块%c\n",count, ch>'Z' ? 'z' : 'Z');
	return 0;
}
