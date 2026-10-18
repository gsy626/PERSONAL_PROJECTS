#include <stdio.h>
int main()
{
    int a,b;
    scanf("%d%d",&a,&b);
    if(a>b) printf("%d 大于 %d.\n",a,b);
    else if(a==b) printf("两个数相等，均为 %d.\n",a);
    else printf("%d 小于 %d.\n",a,b);
    return 0;
}
