#include<SDL2/SDL.h>
#include<stdio.h>
#include<time.h>
#include<stdlib.h>
#include<unistd.h>
#include<stdbool.h>
#include<SDL2/SDL_image.h>
#include<SDL2/SDL_mixer.h>
//f() image set.
#define MAX(a,b) (((a)>(b))?(a):(b))
#define MIN(a,b) (((a)<(b))?(a):(b))
#define RESTART running_main=1;\
		running_game=0;\
		running_end=0;\
		running_start=0;
#define QUIT    running_main=0;\
		running_game=0;\
		running_end=0;\
		running_start=0;
#define RESET	running_main=1;\
		running_game=0;\
		running_end=0;\
		running_start=1;
#define KEYEVENT(event) switch((event).key.keysym.sym)\
					{\
						case SDLK_ESCAPE:\
							QUIT\
							break;\
						case SDLK_RETURN:\
							RESTART\
							break;\
						case SDLK_BACKSPACE:\
							RESET\
							break;\
					}

void imagesetMAX(SDL_Texture* texture,SDL_Window* window,SDL_Renderer* renderer);
void imagesetMIN(SDL_Texture* texture,SDL_Window* window,SDL_Renderer* renderer);
int Static();
//f() Box struct.
typedef struct
{
	uint8_t isMine;
	uint8_t isClicked;
	uint8_t wantClick;
	uint8_t hasNeighbour;
	uint8_t mines;
}
Box;

//f() init box.
void InitBox(int box_xnum,int box_ynum,Box box[][box_ynum+2])
{
	for(int i=0;i<=(box_xnum+1);i++)
	{

		for(int j=0;j<=(box_ynum+1);j++)
		{
			box[i][j].isClicked=0;
			box[i][j].wantClick=0;
			box[i][j].hasNeighbour=0;
			box[i][j].isMine=0;
			box[i][j].mines=0;
		}
	}
}

//f() init mine.
void InitMine(int box_xnum,int box_ynum,Box box[][box_ynum+2],int Mine_sumnum)
{
	int Mine_presentnum=0;	
	
	srand((unsigned)time(NULL));
	while(Mine_presentnum<=Mine_sumnum)
	{
		int rand_xnum=(rand()%box_xnum)+1;
		int rand_ynum=(rand()%box_ynum)+1;
		if(box[rand_xnum][rand_ynum].isMine==0)
		{
			box[rand_xnum][rand_ynum].isMine=1;
			Mine_presentnum++;
		}
	}
}

//f() draw lines.
void DrawLines(SDL_Renderer * renderer,int box_xnum,int box_ynum,int boxwidth,int field_coordinates_x,int field_coordinates_y)
{
	SDL_SetRenderDrawColor(renderer,0,0,0,0);
	for(int i=0;i<=box_xnum;i++)
	{
		SDL_RenderDrawLine(renderer,i*boxwidth+field_coordinates_x,0+field_coordinates_y,i*boxwidth+field_coordinates_x,box_ynum*boxwidth+field_coordinates_y);
	}

	for(int i=0;i<=box_ynum;i++)
	{
		SDL_RenderDrawLine(renderer,0+field_coordinates_x,i*boxwidth+field_coordinates_y,box_xnum*boxwidth+field_coordinates_x,i*boxwidth+field_coordinates_y);
	}
}
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
int main(int argc,char * argv[])
{
	//init video and audio.
	if( SDL_Init(SDL_INIT_VIDEO|SDL_INIT_AUDIO) < 0) 
	{
		printf(" SDL_Init(SDL_INIT_VIDEO) error%S",SDL_GetError());
		return 1;
	}
	
	//basic settings.	
	int boxwidth=35;
	int box_xnum=30;
	int box_ynum=20;
	int gap_width=50;
	int gap_height=50;
	int field_coordinates_x=gap_width;
	int field_coordinates_y=gap_height;
	int field_width=box_xnum*boxwidth;
	int field_height=box_ynum*boxwidth;
		
	//create window 'window'.
	char *window_title = "MineSweeper勇闯雷区      			<ESC>退出游戏;<Backspace>重新设置;<Return>重新开始";
	int window_width=field_width+gap_width*2;
	int window_height=field_height+gap_height*2;
	SDL_Window * window = SDL_CreateWindow(window_title,SDL_WINDOWPOS_CENTERED,SDL_WINDOWPOS_CENTERED,window_width,window_height,SDL_WINDOW_SHOWN);
	if( window == NULL ) 
	{
		printf(" SDL_CreateWindow error%S",SDL_GetError());
		SDL_Quit();
		return 1;
	}

	//create renderer 'renderer'.
	SDL_Renderer * renderer = SDL_CreateRenderer(window,-1,SDL_RENDERER_ACCELERATED | SDL_RENDERER_PRESENTVSYNC);
	if( renderer ==NULL ) 
	{
		printf("SDL_CreateRenderer error%S",SDL_GetError());
		SDL_Quit();
		return 1;
	}

	
	//init image.
	int imgFlags = IMG_INIT_JPG|IMG_INIT_PNG;
        if( !( IMG_Init( imgFlags ) & imgFlags ) )
	{
		printf( "SDL_image could not initialize! SDL_image Error: %s\n", IMG_GetError() );
	}
	SDL_Texture * texture_end_fail[3]={NULL};
	SDL_Texture * texture_end_succeed[2]={NULL};
	SDL_Texture * texture_start=NULL;
	SDL_Texture * texture_pre[2]={NULL};
	SDL_Texture * texture_mine[9]={NULL};
	SDL_Texture * texture_grass=NULL;
	texture_end_fail[0]=IMG_LoadTexture(renderer,"IMG/1.jpg");
	if(texture_end_fail[0] == NULL){printf("IMG_LoadTexture%s",SDL_GetError());}
	texture_end_fail[1]=IMG_LoadTexture(renderer,"IMG/2.jpg");
	if(texture_end_fail[1] == NULL){printf("IMG_LoadTexture%s",SDL_GetError());}
	texture_end_fail[2]=IMG_LoadTexture(renderer,"IMG/3.jpg");
	if(texture_end_fail[2] == NULL){printf("IMG_LoadTexture%s",SDL_GetError());}
	
	texture_end_succeed[0]=IMG_LoadTexture(renderer,"IMG/succeed1.png");
	if(texture_end_succeed[0] == NULL){printf("IMG_LoadTexture%s",SDL_GetError());}
	texture_end_succeed[1]=IMG_LoadTexture(renderer,"IMG/succeed2.png");
	if(texture_end_succeed[1] == NULL){printf("IMG_LoadTexture%s",SDL_GetError());}
	
	texture_start=IMG_LoadTexture(renderer,"IMG/start.png");
	if(texture_start == NULL){printf("IMG_LoadTexture%s",SDL_GetError());}
	
	texture_grass=IMG_LoadTexture(renderer,"IMG/grass.jpg");
	if(texture_grass == NULL){printf("IMG_LoadTexture%s",SDL_GetError());}
	
	texture_pre[0]=IMG_LoadTexture(renderer,"IMG/pre1.png");
	if(texture_pre[0] == NULL){printf("IMG_LoadTexture%s",SDL_GetError());}
	texture_pre[1]=IMG_LoadTexture(renderer,"IMG/pre2.png");
	if(texture_pre[1] == NULL){printf("IMG_LoadTexture%s",SDL_GetError());}
	
	texture_mine[0]=IMG_LoadTexture(renderer,"IMG/mine0.png");
	if(texture_mine[0] == NULL){printf("IMG_LoadTexture%s",SDL_GetError());}
	texture_mine[1]=IMG_LoadTexture(renderer,"IMG/mine1.png");
	if(texture_mine[1] == NULL){printf("IMG_LoadTexture%s",SDL_GetError());}
	texture_mine[2]=IMG_LoadTexture(renderer,"IMG/mine2.png");
	if(texture_mine[2] == NULL){printf("IMG_LoadTexture%s",SDL_GetError());}
	texture_mine[3]=IMG_LoadTexture(renderer,"IMG/mine3.png");
	if(texture_mine[3] == NULL){printf("IMG_LoadTexture%s",SDL_GetError());}
	texture_mine[4]=IMG_LoadTexture(renderer,"IMG/mine4.png");
	if(texture_mine[4] == NULL){printf("IMG_LoadTexture%s",SDL_GetError());}
	texture_mine[5]=IMG_LoadTexture(renderer,"IMG/mine5.png");
	if(texture_mine[5] == NULL){printf("IMG_LoadTexture%s",SDL_GetError());}
	texture_mine[6]=IMG_LoadTexture(renderer,"IMG/mine6.png");
	if(texture_mine[6] == NULL){printf("IMG_LoadTexture%s",SDL_GetError());}
	texture_mine[7]=IMG_LoadTexture(renderer,"IMG/mine7.png");
	if(texture_mine[7] == NULL){printf("IMG_LoadTexture%s",SDL_GetError());}
	texture_mine[8]=IMG_LoadTexture(renderer,"IMG/mine8.png");
	if(texture_mine[8] == NULL){printf("IMG_LoadTexture%s",SDL_GetError());}

	//init audio effect.
	if(Mix_OpenAudio(44100,MIX_DEFAULT_FORMAT,2,2048)<0)
	{
		printf("Mix_OpenAudio error%s",Mix_GetError());
	}
	Mix_Chunk *  bomb[3]={NULL};
	bomb[0]=Mix_LoadWAV("AUDIO/bomb_1.wav");
	if(bomb[0] ==NULL)
	{
		printf("Mix_LoadWAV error%s",Mix_GetError());
	}
	bomb[1]=Mix_LoadWAV("AUDIO/bomb_2.wav");
	if(bomb[1] ==NULL)
	{
		printf("Mix_LoadWAV error%s",Mix_GetError());
	}
	bomb[2]=Mix_LoadWAV("AUDIO/bomb_3.wav");
	if(bomb[2] ==NULL)
	{
		printf("Mix_LoadWAV error%s",Mix_GetError());
	}

	
	//begin{event_pre}
	
		uint8_t running_main=1;
		
		SDL_Event event_pre;
		uint8_t running_pre=1;
		imagesetMAX(texture_pre[0],window,renderer);
		SDL_Delay(3000);	
		
		while(running_pre)
		{
			imagesetMAX(texture_pre[1],window,renderer);
			while(SDL_WaitEvent(&event_pre))
			{
				if(event_pre.type==SDL_KEYDOWN  )
				{
					running_pre=0;
				}
				else if(event_pre.type==SDL_MOUSEBUTTONDOWN )
				{
					running_pre=0;
				}
				else if(event_pre.type==SDL_QUIT)
				{
					running_main=0;
					running_pre=0;
				}
				if(running_pre==0)
				{
					break;
				}
			}
		}
	
	//begin{event_main}
	uint8_t running_start=1;
	uint8_t bombed=0;
	while(running_main)
	{
		
		//init running;
		uint8_t running_game=1;	
		uint8_t running_end=1;	
		//begin{event_start}
		SDL_Event event_start;
		int Mine_sumnum;

		while(running_start)
		{
			imagesetMAX(texture_start,window,renderer);
			while(SDL_WaitEvent(&event_start))
			{
				if(event_start.type==SDL_KEYDOWN)
				{
					switch(event_start.key.keysym.sym)
					{
						//quit.
						case SDLK_ESCAPE:
							QUIT
							break;
						case SDLK_1:
							Mine_sumnum=10;
							running_start=0;
							break;
						case SDLK_2:
							Mine_sumnum=50;
							running_start=0;
							break;
						case SDLK_3:
							Mine_sumnum=100;
							running_start=0;
							break;
						case SDLK_4:
							Mine_sumnum=200;
							running_start=0;
							break;
						case SDLK_5:
							Mine_sumnum=250;
							running_start=0;
							break;
						case SDLK_6:
							Mine_sumnum=300;
							running_start=0;
							break;
						case SDLK_7:
							Mine_sumnum=500;
							running_start=0;
							break;

					}
				}
				//quit.
				else if(event_start.type==SDL_QUIT)
				{
					QUIT
				}
				if(running_start==0)
				{
					break;
				}

			}
		}
		//end{event_start}

	
		//init box struct.
		Box box[box_xnum+2][box_ynum+2];
		InitBox(box_xnum,box_ynum,box);
		for(int j=1;j<=box_ynum;j++)
		{
			box[0][j].isClicked=1;
		}

		//init mine.
		InitMine(box_xnum,box_ynum,box,Mine_sumnum);
		
		//init gapimage
		/*SDL_RenderClear(renderer);
		SDL_Texture* gap=NULL;
		gap=IMG_LoadTexture(renderer,"gap1.jpg");
		if(gap == NULL){printf("IMG_LoadTexture%s",SDL_GetError());}
		int dstrect_x,dstrect_y,dstrect_w,dstrect_h;
		dstrect_w=gap_width-5;
		dstrect_h=gap_height-5;
		dstrect_x=1;
		dstrect_y=1;
		SDL_Rect dstrect={dstrect_x,dstrect_y,dstrect_w,dstrect_h};
		SDL_RenderCopy(renderer,gap,NULL,&dstrect);
*/
	
		//begin{event_game}
		SDL_Event event_game;	
		int result=0;
		int max_xnum=1;	
		while(running_game)
		{
			//event handle.
			while( SDL_PollEvent(&event_game))
			{
				switch( event_game.type )
				{
					case SDL_KEYDOWN:
						KEYEVENT(event_game)
					case SDL_MOUSEBUTTONDOWN://select.
						int click_relativecoordinates_x=event_game.button.x-field_coordinates_x;
						int click_relativecoordinates_y=event_game.button.y-field_coordinates_y;
						int click_relativecoordinates_nx=click_relativecoordinates_x/boxwidth+1;
						int click_relativecoordinates_ny=click_relativecoordinates_y/boxwidth+1;
						if(click_relativecoordinates_nx > 0 && click_relativecoordinates_nx <= box_xnum && click_relativecoordinates_ny >0 && click_relativecoordinates_ny <= box_ynum)
						{
							box[click_relativecoordinates_nx][click_relativecoordinates_ny].wantClick=1;
						}
						break;
					case SDL_QUIT://quit.
						QUIT
						break;	
				
				}

			}	
				

			//draw lines and render.
			SDL_SetRenderDrawColor
			(renderer,255,255,255,0);
			SDL_RenderClear(renderer);
			DrawLines(renderer,box_xnum,box_ynum,boxwidth,field_coordinates_x,field_coordinates_y);	
			
			//begin{scan}
			for(int j=1;j<=box_ynum;j++)
				for(int i=1;i<=box_xnum;i++)
				{
					//caculate neighbours.	
					int x=field_coordinates_x+( i - 1 )*boxwidth+1;
					int y=field_coordinates_y+( j - 1 )*boxwidth+1;
						
					box[i][j].hasNeighbour=box[i-1][j-1].isClicked+box[i][j-1].isClicked+box[i+1][j-1].isClicked+box[i-1][j].isClicked+box[i+1][j].isClicked+box[i-1][j+1].isClicked+box[i][j+1].isClicked+box[i+1][j+1].isClicked;
					box[i][j].mines=box[i-1][j-1].isMine+box[i][j-1].isMine+box[i+1][j-1].isMine+box[i-1][j].isMine+box[i+1][j].isMine+box[i-1][j+1].isMine+box[i][j+1].isMine+box[i+1][j+1].isMine;
					
				//	SDL_Rect rect={x,y,boxwidth-1,boxwidth-1};
					SDL_Rect dstrect={x,y,boxwidth-1,boxwidth-1};
						//begin{click result}	
						//clicked without bomb.
						if(box[i][j].wantClick ==1 && box[i][j].hasNeighbour >0 && box[i][j].isMine==0)
						{
				//			SDL_SetRenderDrawColor(renderer,0,250,0,0);
							SDL_RenderCopy(renderer,texture_mine[box[i][j].mines],NULL,&dstrect);
							box[i][j].isClicked=1;
							if(i > max_xnum)
							{
								max_xnum=i;
							}
							if( max_xnum>=box_xnum)
							{
								running_game=0;
								result=1;
							}



						}
						//clicked with bomb.
						else if(box[i][j].wantClick ==1  && box[i][j].hasNeighbour >0 && box[i][j].isMine==1)
						{
							running_game = 0;
							result=-1;
				//			SDL_SetRenderDrawColor(renderer,255,0,0,0);
							SDL_RenderCopy(renderer,texture_grass,NULL,&dstrect);
							box[i][j].isClicked=1;
							box[i][j].wantClick=0;


						}
						//already be clicked so cannot be clicked.
						else
						{
				//			SDL_SetRenderDrawColor(renderer,192,192,192,0);
							SDL_RenderCopy(renderer,texture_grass,NULL,&dstrect);
							box[i][j].wantClick=0;
						}
						//end{click result}
						//draw rects.	
				//	SDL_RenderFillRect(renderer,&rect);
				}
			
				//end{scan}
			
			
			SDL_RenderPresent(renderer);
			usleep(1000);
		}
		//end{event_game}
	
		//begin{event_end}
		SDL_Event event_end;
		while(running_end)
		{
			//succeed image.
			if(result>0)
			{
				imagesetMAX(texture_end_succeed[rand()%2],window,renderer);
			}
			//fail image and audio.
			else
			{
				imagesetMAX(texture_end_fail[rand()%3],window,renderer);
				Mix_PlayChannel(-1,bomb[rand()%3],0);
				SDL_Delay(10);
				bombed++;
				if(bombed>=3 )
				{
					bombed=0;
				Static();
				}
			}
			//quit or restart.
			while(SDL_WaitEvent(&event_end))
			{
				if(event_end.type==SDL_KEYDOWN)
				{
					KEYEVENT(event_end)				}
				//quit.
				else if(event_end.type==SDL_QUIT)
				{
					QUIT
				}
				if(running_end==0)
				{
					break;
				}
			}
		}
		//end{event_end}

	}
	//end{event_main}




	for(int i=0;i<=2;i++)
	{
		Mix_FreeChunk(bomb[i]);
	}
	for(int i=0;i<=8;i++)
	{
		SDL_DestroyTexture(texture_mine[i]);
	}
	SDL_DestroyTexture(texture_end_fail[0]);
	SDL_DestroyTexture(texture_end_fail[1]);
	SDL_DestroyTexture(texture_end_fail[2]);
	SDL_DestroyTexture(texture_end_succeed[0]);
	SDL_DestroyTexture(texture_end_succeed[1]);
	SDL_DestroyTexture(texture_start);
	SDL_DestroyTexture(texture_start);
	SDL_DestroyTexture(texture_pre[0]);
	SDL_DestroyTexture(texture_pre[1]);
	Mix_CloseAudio();
	SDL_DestroyRenderer(renderer);
	SDL_DestroyWindow(window);
	SDL_Quit();
	return 0;



}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
void imagesetMAX(SDL_Texture* texture,SDL_Window* window,SDL_Renderer* renderer)
{
	SDL_RenderClear(renderer);
	int texture_w,texture_h;
	SDL_QueryTexture(texture,NULL,NULL,&texture_w,&texture_h);
	int window_w,window_h;
	SDL_GetWindowSize(window,&window_w,&window_h);
	int dstrect_x,dstrect_y,dstrect_w,dstrect_h;
	float times=MAX((float)window_w/texture_w,(float)window_h/texture_h);
	dstrect_w=(int)(texture_w*times);
	dstrect_h=(int)(texture_h*times);
	dstrect_x=(window_w-dstrect_w)/2;
	dstrect_y=(window_h-dstrect_h)/2;
	SDL_Rect dstrect={dstrect_x,dstrect_y,dstrect_w,dstrect_h};
	SDL_RenderCopy(renderer,texture,NULL,&dstrect);
	SDL_RenderPresent(renderer);
}

void imagesetMIN(SDL_Texture* texture,SDL_Window* window,SDL_Renderer* renderer)
{
	SDL_RenderClear(renderer);
	int texture_w,texture_h;
	SDL_QueryTexture(texture,NULL,NULL,&texture_w,&texture_h);
	int window_w,window_h;
	SDL_GetWindowSize(window,&window_w,&window_h);
	int dstrect_x,dstrect_y,dstrect_w,dstrect_h;
	float times=MIN((float)window_w/texture_w,(float)window_h/texture_h);
	dstrect_w=(int)(texture_w*times);
	dstrect_h=(int)(texture_h*times);
	dstrect_x=(window_w-dstrect_w)/2;
	dstrect_y=(window_h-dstrect_h)/2;
	SDL_Rect dstrect={dstrect_x,dstrect_y,dstrect_w,dstrect_h};
	SDL_RenderCopy(renderer,texture,NULL,&dstrect);
	SDL_RenderPresent(renderer);
}

int Static(void)
{
	SDL_Color colors[]={
		{0,0,0,0},
		{255,255,255,0},
		{255,0,0,0},
		{0,255,0,0},
		{0,0,255,0},
		{255,255,0,0}
	};

	int rect_w;
	rect_w=10;	
	SDL_Window *mywin =NULL;
	SDL_Renderer* renderer  =NULL;
	
	mywin= SDL_CreateWindow("mywin",SDL_WINDOWPOS_CENTERED,SDL_WINDOWPOS_CENTERED,800,800,SDL_WINDOW_FULLSCREEN_DESKTOP);

	if( mywin == NULL ) {
		printf(" SDL_CreateWindow error%S",SDL_GetError());
		SDL_Quit();
		return 1;
	}
	renderer = SDL_CreateRenderer(mywin,-1,SDL_RENDERER_ACCELERATED | SDL_RENDERER_PRESENTVSYNC);
	if( renderer ==NULL ) {
		printf("SDL_CreateRenderer error%S",SDL_GetError());
		SDL_Quit();
		return 1;
	}
	SDL_RaiseWindow(mywin);
	SDL_SetWindowInputFocus(mywin);
	
	SDL_Event event;	
	int running=1;	
	srand((unsigned)time(NULL));
	

	int screen_w,screen_h;
	SDL_GetWindowSize(mywin,&screen_w,&screen_h);

	while(running) {
	
		while( SDL_PollEvent(&event)) {
			switch( event.type ) {
				case SDL_KEYDOWN:
				case SDL_MOUSEBUTTONDOWN:
					running=0;
					break;
			}
		}
	
	SDL_SetRenderDrawColor
		(renderer,
		 0,0,0,0);
	SDL_RenderClear(renderer);
	
	for( int i=1;i<screen_w;i=i+rect_w) {
		for( int j=1;j<screen_h;j=j+rect_w) {
			SDL_Rect rect;
			rect.x=rand()%(screen_w-rect_w+1);
			rect.y=rand()%(screen_h-rect_w+1);
			rect.w=rect_w;
			rect.h=rect_w;
			

			SDL_Color color=colors[rand()%5];
			SDL_SetRenderDrawColor
				(renderer,color.r,color.g,color.b,255);
			SDL_RenderFillRect(renderer,&rect);
			}
		}

	SDL_RenderPresent(renderer);
	
	usleep(10000);
	
	}

	SDL_DestroyRenderer(renderer);
	SDL_DestroyWindow(mywin);
}
