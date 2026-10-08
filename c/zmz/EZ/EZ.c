#include <stdio.h>
int main(int argc,char** argv)
{
	int n;
	scanf("%d",&n);
	     for(int i=0;i<n;i++)
	     {
		     if(i==0 || i==(n-1))
		     {
			     for(int kk=0;kk<n;kk++)printf("%c",'E');
			     printf("%c",' ');
			     for(int hh=0;hh<n;hh++)printf("%c",'Z');
			     printf("\n");
		     }
		     else if (i==(n-1)/2) {

			     for(int k=0;k<n;k++)printf("%c",'E');
			     for(int h=0;h<((n+1)/2);h++)printf("%c",' ');
			     printf("%c",'Z');
			     for(int g=0;g<((n-1)/2);g++)printf("%c",' ');
		     printf("\n");
		     }

		     else{

		     printf("%c",'E');
		     for(int j=0;j<(2*n-1-i);j++)printf("%c",' ');
		     printf("%c",'Z');
		     printf("\n");
	     }
	
	     }
}

