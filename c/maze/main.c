#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
//在MAZE_FILE里输入迷宫
#define MAX 40		//最大边长
#define START '*'  //起点字符
#define END '@'		//终点字符
#define WALL '#'	//障碍的字符
#define PATH 'O'	//输出的路径
#define MAZE_FILE "maze.map" //迷宫文件的路径(默认文件为maze.map）
typedef struct{
	int lx,ly;
	char ch;
	char type;
	int F;
	int G;
	int in_open;
	int closed;
} Unit;
int main(){
	FILE * fptr;
	fptr = fopen(MAZE_FILE,"r+");
	Unit unit[MAX][MAX];
	int openlist[MAX*MAX][2];
	int open_count=0;
	char ch;
	int x,y;
	int mx,my;
	int start_x,start_y,end_x,end_y;
	x=y=0;
	mx=my=-1;
	while ((ch=fgetc(fptr )) != EOF) {
		if(ch == '\r' || ch=='\n'){
			if(x>0){
				x=0;y++;
			}
			continue;
		}
		else{
			unit[y][x].ch=ch;
			unit[y][x].in_open=0;
			unit[y][x].closed=0;
			unit[y][x].F=MAX+MAX;
			unit[y][x].G=MAX+MAX;
			unit[y][x].lx=-1;
			unit[y][x].ly=-1;
			switch (ch) {
				case START :
					unit[y][x].type='s'; //start Point
					openlist[0][0]=start_y=y;
					openlist[0][1]=start_x=x;
					open_count++;
					unit[y][x].F=0;
					unit[y][x].G=0;
					break;
				case END : 
					unit[y][x].type='e';//end Point
					end_x=x;
					end_y=y;
					break;
				case WALL  : 
					unit[y][x].type='w';//wall Point
					break;	
				default: unit[y][x].type='b';//blank Point
					break;
			}
			mx = (x>mx) ? x : mx;
			my = (y>my) ? y : my;
			x++;
		}
	}
	fclose(fptr);

	int dx[4]={1,-1,0,0};
	int dy[4]={0,0,1,-1};

	while(open_count>0){
		int current_F=MAX+MAX;
		int best_open_index=0;
		for(int i=0;i<open_count;i++){
			int current_y=openlist[i][0];
			int current_x=openlist[i][1];
			if(unit[current_y][current_x].F < current_F){
				best_open_index=i;
				current_F=unit[current_y][current_x].F;
			}
		}
		int current_y=openlist[best_open_index][0];
		int current_x=openlist[best_open_index][1];
		if(unit[current_y][current_x].closed==1) continue;
		unit[current_y][current_x].in_open=0;
		unit[current_y][current_x].closed=1;
		openlist[best_open_index][0]=openlist[open_count-1][0];
		openlist[best_open_index][1]=openlist[open_count-1][1];
		open_count--;
		
		if(unit[current_y][current_x].type=='e'){
			printf("结束\n");
			break;
		}
		for(int i=0;i<4;i++){
			int new_x=current_x + dx[i];
			int new_y=current_y + dy[i];
			if(new_x<0 || new_x > mx || new_y <0 || new_y> my) continue;
			if(unit[new_y][new_x].type=='w' || unit[new_y][new_x].closed==1) continue;
			int new_G=unit[current_y][current_x].G + 1;
			if(new_G < unit[new_y][new_x].G){
				unit[new_y][new_x].G=new_G;
				unit[new_y][new_x].F=unit[new_y][new_x].G + abs(end_x-new_x)+ abs(end_y - new_y);
				if(unit[new_y][new_x].in_open==0){
					openlist[open_count][0]=new_y;
					openlist[open_count][1]=new_x;
					unit[new_y][new_x].in_open=1;
					open_count++;
				}
				unit[new_y][new_x].lx=current_x;
				unit[new_y][new_x].ly=current_y;
			}
		}

	}
	//打印迷宫
	printf("迷宫:\n");
	for(int y=0;y<=my;y++){
		for(int x=0;x<=mx;x++){
			printf("%c",unit[y][x].ch);
		}
		printf("\n");
	}
	//回溯路径
	int px=end_x;
	int py=end_y;
	int success=1;
	while(unit[py][px].type!='s'){
		if(unit[py][px].type=='b' || unit[py][px].type=='e')	unit[py][px].ch=PATH;
		int tempx=px;
		int tempy=py;
		px=unit[tempy][tempx].lx;
		py=unit[tempy][tempx].ly;
		if(px==-1 || py == -1){
			success=0;
			break;
		}
	}
	
	//打印路径
	printf("\n路径：\n");	
	if(success){
		for(int y=0;y<=my;y++){
			for(int x=0;x<=mx;x++){
				printf("%c",unit[y][x].ch);
			}
			printf("\n");
		}
	}
	else {
		printf("失败\n");
	}
	return 0;
}
