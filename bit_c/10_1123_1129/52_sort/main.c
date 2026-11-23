#include <stdio.h>
int main(){
	int max;
	scanf("%d",&max);
	int arr[max],i,j;
	for(i=0;i<max;i++) scanf("%d",&arr[i]);
	for(i=0;i<max-1;i++){
		int great=0;
		for(j=1;j<max-i;j++){
			if(arr[j]>arr[great]){
				great=j;
			}
		}
		int temp=arr[great];
		arr[great]=arr[max-i-1];
		arr[max-i-1]=temp;
	}
	if(max>1)
		for(i=0;i<max-1;i++) printf("%d ",arr[i]);
	printf("%d\n",arr[max-1]);
	return 0;
}
