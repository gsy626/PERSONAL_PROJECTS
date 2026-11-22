#include <stdio.h>
int main(){
	int n,m,origin,current,perfect_site;
	scanf("%d%d",&n,&m);
	scanf("%d",&origin);
	int up[n-1],down[n-1],perfect[n-1];
	double rate[n-1];
	int i;
	for(i=0;i<n-1;i++) scanf("%d%d",&up[i],&down[i]);
	current=origin;
	perfect_site=1;
	for(i=0;i<n-1;i++){
		current=current+up[i]-down[i];
		rate[i]=(double)current/m;
		printf("%.3lf\n",rate[i]);
	}
	perfect_site=0;
	for(i=0;i<n-1;i++){
		if(rate[i]<rate[perfect_site]) perfect_site=i;
	}
	int count=0;
	for(i=0;i<n-1;i++){
		if(rate[i]==rate[perfect_site]){
			perfect[count]=i+1;
			count++;
		}
	}
	for(i=0;i<count;i++) printf("%d,",perfect[i]);
	printf("\n");
	return 0;
}
