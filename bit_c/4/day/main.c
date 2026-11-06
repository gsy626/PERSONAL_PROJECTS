#include <stdio.h>
int main()
{
	//W=( 1+d+ 2m +3(m+1)/5 +y +y/4 -y/100 +y/400)mod 7
	int y,m,d,w;
	scanf("%d%d%d",&y,&m,&d);
	if(m==1 || m==2)
	{
		m+=12;
		y-=1;
	}
	w = (1+ d+ 2*m +3*(m+1)/5 +y +y/4 -y/100 +y/400) %7;
	printf("%d\n",w);
	return 0;
}

