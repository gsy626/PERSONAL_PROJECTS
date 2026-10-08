#include<SDL2/SDL.h>
#include<stdio.h>
#include<time.h>
#include<stdlib.h>
#include<unistd.h>
int main(int argc,char * argv[])
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
	
	if( SDL_Init(SDL_INIT_VIDEO) < 0) {
		printf(" SDL_Init(SDL_INIT_VIDEO) error%S",SDL_GetError());
		return 1;
	}
	

	
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

	
	SDL_Event event;	
	int running=1;	
	srand((unsigned)time(NULL));
	

	int screen_w,screen_h;
	SDL_GetWindowSize(mywin,&screen_w,&screen_h);

	while(running) {
	
		while( SDL_PollEvent(&event)) {
			switch( event.type ) {
				case SDL_KEYDOWN:
					if(event.key.repeat == 0) {
						switch( event.key.keysym.sym) {
							case SDLK_ESCAPE:
							case SDLK_RETURN:
								running = 0;
								break;
				
						}
					
					}
					break;
				case SDL_MOUSEBUTTONDOWN:
						running = 0;
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

	
	
	SDL_RenderPresent(renderer);
	
	usleep(10000);
	
	}



	SDL_DestroyRenderer(renderer);
	SDL_DestroyWindow(mywin);
	SDL_Quit();
	return 0;






}
