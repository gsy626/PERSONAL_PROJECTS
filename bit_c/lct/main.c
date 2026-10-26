#include <stdio.h>
int main()
{
		double input[10],output[10],average,sum;
		int num;
		for(int i=0;i<10;i++)
			scanf("%lf",&input[i]);
		sum = 0;
		for(int i=0;i<10;i++)
			sum+=input[i];
		average = sum / 10;
		printf("average:%lf",average);
		return 0;
}
	
