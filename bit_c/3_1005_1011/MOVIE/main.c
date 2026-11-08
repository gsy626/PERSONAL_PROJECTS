#include <limits.h>
#include <stdio.h>
int main ()
{
    long long width,height,time,out;
    scanf("%lld*%lld%lld",&width,&height,&time);
    out = height * width * time * 60 * 30 * 3 / 1024 ;
    printf("%lld\n",out);
    return 0;
}
