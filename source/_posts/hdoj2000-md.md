---
title: hdoj2000
date: 2026-09-11 16:47:35
categories:
 - 算法
 - hdoj
tags:
 - 排序
 - 输入输出
 - string
comments: true
---

[杭电OJ2000原题](https://acm.hdu.edu.cn/showproblem.php?pid=2000)

<!--more-->

题目本身描述非常简单，就是多行3字符输入，需要把每行字符按ASCII码排序，从小到大输出。
我的实现如下:
```cpp
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    string result;
    while (getline(cin, s)) {
        for(int i = 0; i < s.size(); i++) {
            char c = s[i];
            int index = i;
           for(int j = i+1; j < s.size(); j++) {
               if(s[j] < c) {
                   c = s[j];
                   index = j;
               }
           }
           s[index] = s[i];
           result += c;
        }
        result += "\n";
    }
    for (int i = 0; i < result.size(); i++) {
            if((i>0 && result[i-1] == '\n')|| i==0) {
                cout << result[i];
            } else {
                cout << " " << result[i];
            }
        }
    return 0;
}
```

排序选了最简单的选择排序，因为题目中的排序要求比较小，因此对时间复杂度要求并不高，选排的 worst case 是 $O(n^2)$

读输入流：
```cpp
while (getline(cin, s)) {} // 读输入行，读入字符串
```

```python
for line in sys.stdin: #读输入行，读入字符串
for line in sys.stdin.buffer: #读入行，读入字节序列，相比stdin少了很多额外步骤，往往更快，更常用
input = sys.stdin.buffer.readline # 重写 input 函数，读入一行，返回字节序列
``` 

string 的不同：

```cpp
string s = ""; // 可变对象
s[0] = 'a'; // 正确
```

```python
s = "" # 不可变对象
s[0]=a # 报错
```