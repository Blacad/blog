---
title: Shell 介绍
date: 2026-09-10 23:30:33
categories:
 - 实践技术
 - missing-semester
tags:
 - shell
comments: true
---
## Source
---
英文课程[笔记](https://missing.csail.mit.edu/2020/course-shell/)
中文课程[笔记](https://missing-semester-cn.github.io/2020/course-shell/)
## Shell
---
### Shell 是什么
- ❓shell的工作原理
	- shell 基于空格分割命令并进行解析，然后执行第一个单词代表的程序，并将后续的单词作为程序可以访问的参数。如果您希望传递的参数中包含空格（例如一个名为 My Photos 的文件夹），您要么用使用单引号，双引号将其包裹起来，要么使用转义符号 `\` 进行处理（`My\ Photos`）。
	- shell 是如何知道去哪里寻找 `date` 或 `echo` 的呢？其实，类似于 Python 或 Ruby，shell 是一个编程环境，所以它具备变量、条件、循环和函数（下一课进行讲解）。当你在 shell 中执行命令时，您实际上是在执行一段 shell 可以解释执行的简短代码。如果你要求 shell 执行某个指令，但是该指令并不是 shell 所了解的编程关键字，那么它会去咨询 _环境变量_ `$PATH`
### Shell 怎么使用
- echo -打印
- date -显示当前日期
- touch -新建文件
- cat -显示文件内容
### 在Shell中导航
- pwd -获取当前目录
- cd -切换目录
	- cd . -当前目录
	- cd .. -上级目录
- ls -显示目录文件
	- -l -使得文件
- mv -重命名或移动文件
- cp -拷贝文件
- mkdir -新建文件夹
	- eg. mkdir ～/Desktop/temp
- man -查看对应程序的操作手册
	- man ls -查看`ls`程序的操作手册
### 在程序间创建连接
- ❓输入输出流的重定向
	- 在 shell 中，程序有两个主要的“流”：它们的输入流和输出流。 当程序尝试读取信息时，它们会从输入流中进行读取，当程序打印信息时，它们会将信息输出到输出流中。 通常，一个程序的输入输出流都是您的终端。也就是，您的键盘作为输入，显示器作为输出。 但是，我们也可以重定向这些流！
	- 最简单的重定向是 `< file` 和 `> file`。这两个命令可以将程序的输入输出流分别重定向到文件
	- 您还可以使用 `>>` 来向一个文件追加内容。使用管道（ _pipes_ ），我们能够更好的利用文件重定向。 `|` 操作符允许我们将一个程序的输出和另外一个程序的输入连接起来
### Shell的权限
- sudo -前缀用来说明执行命令的权限是root
	- 当您遇到拒绝访问（permission denied）的错误时，通常是因为此时您必须是根用户才能操作
```shell
	$ sudo find -L /sys/class/backlight -maxdepth 2 -name '*brightness*'
	/sys/class/backlight/thinkpad_screen/brightness
	$ cd /sys/class/backlight/thinkpad_screen
	$ sudo echo 3 > brightness
	An error occurred while redirecting file 'brightness'
	open: Permission denied	
```
- 💡关于 shell，有件事我们必须要知道。`|`、`>`、和 `<` 是通过 shell 执行的，而不是被各个程序单独执行。 `echo` 等程序并不知道 `|` 的存在，它们只知道从自己的输入输出流中进行读写。 对于上面这种情况， _shell_ (权限为您的当前用户) 在设置 `sudo echo` 前尝试打开 brightness 文件并写入，但是系统拒绝了 shell 的操作因为此时 shell 不是根用户
- 我们可以这样操作：
```shell
	$ echo 3 | sudo tee brightness
```
---
## 本节课作业重点
---

- 💡chmod的使用方法
	- csdn[博客](https://blog.csdn.net/ichen820/article/details/115524278?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522171957012816800180688600%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=171957012816800180688600&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~top_positive~default-1-115524278-null-null.142^v100^pc_search_result_base2&utm_term=chmod&spm=1018.2226.3001.4187)
- ❓为什么程序知道使用sh来执行
	- [shebang](https://zh.wikipedia.org/wiki/Shebang)