char *subString(char *s, int index, int n)
{
    char *res = new char[n + 1];
    memcpy(res, s + index, n);
    res[n] = 0;
    return res;
}