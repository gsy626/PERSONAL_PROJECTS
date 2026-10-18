#include <stdio.h>
int main()
{
    char c,out;
    scanf("%c",&c);
    out = ( c >= 'a' && c<='z' ) ? ( c-32) : ( (c >= 'A' && c<='Z') ? ( c+32) : c );
    printf("%C\n",out);
    return 0;
}
