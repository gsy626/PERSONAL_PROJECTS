#include <stdio.h>
#include <unistd.h>
int main()
{
	for(int i=0;i<1000;i++)
	{
		for(int j=0;j<i%10;j++)printf(" ");
	printf("%s\n","hhhhh");
	usleep(10000);
	}

}

