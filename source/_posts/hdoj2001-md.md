---
title: hdoj2001
date: 2026-09-13 12:07:56
categories:
 - 算法
 - hdoj
tags:
 - 输入输出
comments: true
---

[杭电OJ2001原题](https://acm.hdu.edu.cn/showproblem.php?pid=2001)
<!--more-->

题目本身描述非常简单，就是读入两个点，然后计算欧式距离。

```cpp
#include <iostream>
#include <string>
#include <iomanip>

using namespace std;

struct point{
    float x, y;
};
int main()
{
    point a,b;
    while(cin>>a.x>>a.y>>b.x>>b.y){
       float distance = sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y));
       cout<<fixed<<setprecision(2)<<distance<<endl;
    }
    return 0;
}
```

读输入的不同方式：

C++:
```cpp
cin >> x;              // 按空白符分隔读取，忽略换行、Tab
getline(cin, s);       // 按行读取，忽略换行
```

Python:
```python
a,b = map(int, input.split()) # python 中一般一行一行读然后分割 map
```


C++固定小数点输出：
```cpp
cout<<setprecision(2)<<distance<<endl; // 输出两位有效数字
cout<<fixed<<setprecision(2)<<distance<<endl; // 保留两位小数
```

