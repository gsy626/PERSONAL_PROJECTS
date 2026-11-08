#include <stdio.h>
int main(){
	int N;
	scanf("%d",&N);
	int array[N];
	int i;
	for(i=0;i<N;i++)
		scanf("%d",&array[i]);
	int start,end,draft_start,draft_end;
	start=end=draft_end=draft_start=1;
	for(i=1;i<N;i++){
		//第i个元素
		if(array[i]==array[i-1]){
			draft_end=i;
			if( (draft_end - draft_start) >( end -start ) ){
				start=draft_start;
				end=draft_end;
			}
		}
		else {
			draft_start=draft_end=i;
		}
	}
	if(start<end)
		printf("The longest equal number list is from %d to %d.\n",start,end);
	else
		printf("No equal number list.\n");
	return 0;
}
