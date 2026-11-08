#include <stdio.h>
int main()
{
    int n,a,b,c,m;
    scanf("%d",&n);
    a = n % 10;
    b = n / 10 % 10;
    c = n / 100;
    m = a *100 + b * 10 + c;
    printf("%.3d\n",m);
    return 0;
}
