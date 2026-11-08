#include <stdio.h>
//lift's level up stop  down  x's level
//lift's level = x's level:
//	stop: sure time=0;
//	move: not sure
//lift !=
//	stop: sure time=|deta level|
//  move:
//		pass and same direction: sure time;
//		not pass:not sure
typedef struct{
	int sure_reach;
	int time;
} Estimation;
int absolute(int input){
	return input>=0 ? input : -input;
}
Estimation estimate(int e_level,int status,int x_level,int x_destination){
	Estimation result = {0,0};
	if(e_level==x_level){
		if(status==0) {
			result.sure_reach=1;
			result.time=0;
		}
		else{
			result.sure_reach=0;
		}
	}
	else {
		if(status==0){
			result.sure_reach=1;
			result.time= absolute(e_level - x_level);
		}
		else{
			int e_direction = status==1 ? 1 : -1;
			int x_direction = x_destination > x_level ? 1 : -1;
			if(e_direction ==1  && e_level<x_level || (e_direction==-1 && e_level > x_level ) ){
				result.sure_reach=1;
				if(e_direction * x_direction >0){
					result.time=absolute(e_level-x_level);
				}
				else{
					if(e_direction==1)result.time= absolute(e_level-10) + 10 - x_level;
					else result.time= absolute(e_level - 1) + x_level - 1;
				}
			}
		}
	}
	return result;
}


int main(){
	int a,b,c,d,e,f;
	int result;
	char *string[]={"left one","right one","left one or right one"};
	scanf("%d%d%d%d%d%d",&a,&b,&c,&d,&e,&f);
	Estimation left=estimate(a,b,e,f);
	Estimation right=estimate(c,d,e,f);
	if(left.sure_reach==1 && right.sure_reach==1){
		if(left.time>right.time) result=2; //2:right one
		else if(left.time==right.time) result=3;//3: left one or right one
		else result=1;//1: left one
	}
	else if(left.sure_reach==1 && right.sure_reach==0) result=1;
	else if(left.sure_reach==0 && right.sure_reach==1) result=2;
	else if(left.sure_reach==0 && right.sure_reach==0) result=3;
	printf("%s\n",string[result-1]);
	return 0;
}
