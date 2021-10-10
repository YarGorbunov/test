#include <iostream>
using namespace std;
int main () {
    int a,b;
    bool f=1;
    cin >> a >> b;
    while (b!=0) {
          if (a*b>0) f=0;
          a=b;
          cin >> b;
          }
    if (f) cout << "Y";
    else cout << "N";
    system ("pause");
    return 0;
}
