#include<SDL2/SDL.h>
#include<stdio.h>
#include<time.h>
#include<stdlib.h>
#include<unistd.h>
int main(int argc,char * argv[])
{
	
	SDL_Window *mywin =NULL;
	SDL_Renderer* renderer  =NULL;
	
	if( SDL_Init(SDL_INIT_VIDEO) < 0) {
		printf(" SDL_Init(SDL_INIT_VIDEO) error%S",SDL_GetError());
		return 1;
	}
	

	
	mywin= SDL_CreateWindow("mywin",SDL_WINDOWPOS_CENTERED,SDL_WINDOWPOS_CENTERED,800,800,SDL_WINDOW_FULLSCREEN_DESKTOP);
	

	if( mywin == NULL ) {
		printf(" SDL_CreateWindow error%S",SDL_GetError());
		SDL_Quit;
		return 1;
	}


	renderer = SDL_CreateRenderer(mywin,-1,SDL_RENDERER_ACCELERATED | SDL_RENDERER_PRESENTVSYNC);
	if( renderer ==NULL ) {
		printf("SDL_CreateRenderer error%S",SDL_GetError());
		SDL_Quit;
		return 1;
	}

	
	SDL_Event event;	
	int running=1;	
	srand((unsigned)time(NULL));



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

	SDL_SetRenderDrawColor(renderer,rand() % 256,rand() %256,rand()%256,255);
	SDL_RenderClear(renderer);
	
	SDL_RenderPresent(renderer);
	
	usleep(100000);
	
	}




	SDL_DestroyRenderer(renderer);
	SDL_DestroyWindow(mywin);
	SDL_Quit;
	return 0;






}
