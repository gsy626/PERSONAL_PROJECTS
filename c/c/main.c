#include <stdio.h>
typedef struct {
	int x;
	int y;
} Point;
typedef struct{
	Point now;
	Point last;
	char ch;
	int F;
} Unit;
int main(){
	FILE * fptr;
	fptr = fopen("f.txt","r+");
//	fputc('A', fptr);
//	fprintf(fptr,"qqq\n");
//	printf("%c\n",fgetc(fptr));
//	char  buff[20];
//	//fgets(buff, 20,fptr);
//	//printf("%s",buff);
//	char content[20];
//	fscanf(fptr,"%s",content);
//	fscanf(fptr,"%s",content);
//	fscanf(fptr,"%s",content);
//	printf("%s\n",content);
	Unit unit[10][10];
	char ch;
	int x,y;
	int mx,my;
	x=y=mx=my=0;
	while ((ch=fgetc(fptr )) != EOF) {
		if(ch == '\r' || ch=='\n'){
			x=0;y++;
		}
		else{
			unit[y][x].now.x=x;
			unit[y][x].now.y=y;
			unit[y][x].ch=ch;
			x++;
		}
		mx = (x>mx) ? x : mx;
		my = (y>my) ? y : my;
	}
	fclose(fptr);
	for(int y=0;y<=my;y++){
		for(int x=0;x<=mx;x++){
			printf("%c",unit[y][x].ch);
		}
		printf("\n");
	}
	return 0;
}
