---
title: 
date: 2026-09-13 13:58:32
categories:
  - 实践技术
  - verilog
tags:
  - 计组助教
comments: true
---

verilog 的介绍以及vivado的基本使用

<!--more-->
## 基本对象

### 模块
```verilog
module MUX2T1_5(
  input [4:0] I0,
  input [4:0] I1,
  input       s,
  output [4:0] o
);
assign o = s ? I1 : I0;

endmodule
```

两个 5 bit 输入，一个 1 bit 输入，一个 5 bit 输出
内部功能是依据 s，决定 o 的输出，是典型的 MUX
这里可以把所有的这些量看成 MUX 的 接口

assign 连续赋值，o 永远由右边这个逻辑决定，只要输入改变输出o就会变

Verilog 是描述硬件，而不是执行代码，因此要将一个模块以完整的视角看待

### 数据
```verilog
5'b00101 
8'hAF
```
5 bit 二进制表示
8 bit 十六进制表示

### 实例
在testbench里面需要创建实例来验证电路是否正确
```verilog
reg [4:0] I0;
reg [4:0] I1;
reg       s;
MUX2T1_5 uut (
    .I0(I0),
    .I1(I1),
    .s(s),
    .o(o)
);
initial begin

    I0 = 5'b00101;
    I1 = 5'b11010;

    s = 0;
    #10;

    s = 1;
    #10;

end
```
实例中，左侧是接口，括号里的是传入接口的信号
initial  可以视作仿真开始时执行一次这段测试过程
#10 表示延时10个clock

## 组合逻辑与时序逻辑

组合逻辑和时序逻辑总览：
```verilog
组合逻辑：
  assign
  always @(*)
时序逻辑：
  always @(posedge clk)
```

之前的MUX也可以写成:

```verilog
module MUX2T1_5(
    input  [4:0] I0,
    input  [4:0] I1,
    input        s,
    output reg [4:0] o
);

always @(*) begin
    if (s == 1'b0)
        o = I0;
    else
        o = I1;
end

endmodule
```
### always @(*)
always @(*) 可以暂时解读为 只要这个代码块依赖的任何输入发生变化，就重新计算这个组合逻辑

相比assign，它主要可以更复杂的组合逻辑：

```verilog
always @(*) begin
    case (ALU_operation)
        3'b000: result = A & B;
        3'b001: result = A | B;
        3'b010: result = A + B;
        3'b110: result = A - B;
        ...
    endcase
end
```

always 过程块中被赋值的对象需要声明为 reg

### 寄存器: always @(posedge clk)

```verilog
always @(posedge clk) begin
    Q <= D;
end
```
所谓上升沿就是 跳变 的一下，时钟从0->1
posedge 就是 上升沿，上述时序逻辑解释为：
```
D 可以随便改变
只有当 clk 出现上升沿时：
Q ← 当前 D
```
也就是说 每次 clk 从 0 跳到 1 时执行一次这个过程块

### 漏赋值

如果组合逻辑，你漏掉了情况，比如
```verilog
always @(*) begin
    if (s == 1'b0)
        o = I0;
end
```
那么它会变成 存储逻辑，因为 如果没有触发条件，那么 o 的值需要被保留，因此需要记住 o
变成了 Latch 锁存器

因此，组合逻辑不许覆盖所有情况，当然如下写法是正确的，先给默认值：

```verilog
always @(*) begin
    o = I0;

    if (s == 1)
        o = I1;
end
```

### = 与 <=

= 是 blocking assignment
<= 是 non-blocking assignment

```verilog
always @(posedge clk) begin
    A <= B;
    B <= A;
end

always @(posedge clk) begin
    A = B;
    B = A;
end
```
前者，每个上升沿，A、B交换值
后者，每个上升沿，A、B都会变成B的值
随后第二条中的 A，按照 blocking assignment 的语义，已经代表前一条赋值得到的值



## 完整的vivado过程

```text
Verilog -> Behavioral Simulation(testbench) -> Synthesis -> Constraints -> Implementation -> Bitstream -> FPGA
```
Verilog 描述硬件设计 .v
Behavioral simulation 在逻辑层面上测试硬件设计是否正确 .v
(RTL Analysis) -> 可以看vivado认为你的硬件到底描述了什么，是否把mux写成latch了
Synthesis  回答 需要什么逻辑资源？和 逻辑上谁和谁连接？
Constraints  回答 实现必须满足哪些外部/时序要求？和 哪些顶层端口对应哪些 Pin？ .xdc
Implementation 布局 + 布线
  - synthesis 后逻辑连接关系确认，但是AND 对应哪个具体 LUT？两个 LUT 在芯片哪里？x 这根 net 使用哪组物理 routing wire？等由该部分负责
  - 布线主要是指中间线怎么走，比如你约束了端口，但是内部两个端口相接可能需要routing，而routing就有该部分负责
  - 回答具体用 FPGA 哪些物理资源？放哪里？物理线路具体怎么走？
(Timing) 时钟周期 < 数据传播时间 可能出错
Bitstream：把最终设计变成 FPGA 配置数据
Program Device：把 bitstream 写进 FPGA

## 简单时序逻辑

以LED灯的实现为例，描述电路逻辑：

```verilog
module Water_LED(
    input         clk,
    input         RSTn,
    output reg [15:0] LED_o
);

reg [26:0] counter;

always @(posedge clk) begin

    if (!RSTn) begin
        counter <= 0;
        LED_o   <= 16'b0000_0000_0000_0001;
    end
    else begin

        if (counter == 27'd99_999_999) begin
            counter <= 0;
            LED_o   <= {LED_o[14:0], LED_o[15]};
        end
        else begin
            counter <= counter + 1;
        end

    end

end

endmodule
```
RSTn 是 0 为 有效即需要reset，因此起名 RSTn

{} 是进行拼接，`{2'b01,2'b10}` -> `4'b0110`，之所以要进行拼接而非左移是因为担心 1 溢出丢失了
counter 的作用更像是让变换尽量慢下来，因为主频是100MHz，也就是10ns一个周期，人眼观察不了，因此需要它达到一定值的时候再变

它的testbench：

```verilog
`timescale 1ns / 1ps

module Water_LED_tb;

reg clk;
reg RSTn;

wire [15:0] LED_o;

Water_LED uut (
    .clk(clk),
    .RSTn(RSTn),
    .LED_o(LED_o)
);

initial begin
    clk = 0;
    always #5 clk = ~clk;
end

initial begin

    RSTn = 0;

    #20;

    RSTn = 1;

end

endmodule
```

`timescale 1ns / 1ps 可以先理解为 仿真的主要时间单位 = 1 ns
always #5 clk = ~clk; 每过5ns，clk取反

快速仿真小技巧：使用参数
```verilog
module Water_LED #(
    parameter LIMIT = 99_999_999
)(
    input clk,
    input RSTn,
    output reg [15:0] LED_o
);

tb
Water_LED #(
    .LIMIT(9)
) uut (
    .clk(clk),
    .RSTn(RSTn),
    .LED_o(LED_o)
);
```

Verilog 的四值逻辑：

0 1 x z
x=unknow
z是高阻态，常出现于三态总线 或 IO pin

## Top Module、Hierarchy

Top Module 示例：
```verilog
module top(
    input [10:0] SW,
    output [4:0] LED
);

MUX2T1_5 u_mux (
    .I0(SW[4:0]),
    .I1(SW[9:5]),
    .s(SW[10]),
    .o(LED)
);

endmodule
```
Top Module 是整个设计的最外层模块，约束文件 .xdc 只用关注最外层模块，用Top Module 的端口。
只有顶层 ports 才构成整个设计与 FPGA 外部引脚之间的边界
相对复杂一些的Top Module：
```verilog
module top(
    input a,
    input b,
    input c,
    output y
);

wire w;

AND2 u1(
    .a(a),
    .b(b),
    .y(w)
);

AND2 u2(
    .a(w),
    .b(c),
    .y(y)
);

endmodule
```
不是有一个 .v 就有一个硬件，硬件真实对应实例化


Hierarchy 示例：

```verilog
CPU_TOP
├── PC
├── InstructionMemory
├── Controller
├── RegFile
├── ALU
├── DataMemory
└── MUXes
```
利用 Top Module 来构成相对复杂的硬件结构。

## vivado 组件

```text
Design Sources
→ 真正准备综合成硬件的 RTL

Constraints
→ FPGA pin / timing 等约束

Simulation Sources
→ testbench
```

### IP 封装

IP 封装可以理解成：

> **把你写好的一个 Verilog 模块，包装成一个“可重复调用的标准硬件组件”。**

比如你原本有：

```verilog
module MUX2T1_5(
    input  [4:0] I0,
    input  [4:0] I1,
    input        s,
    output [4:0] o
);
```

封装成 IP 后，Vivado 会把它当成一个独立模块保存到 IP Repository。之后别的工程里可以像调用官方 IP 一样调用它，而不用每次都手动复制源码。

大致流程是：

```text
自己写的 Verilog 模块
        ↓
验证功能正确
        ↓
Create and Package New IP
        ↓
设置 IP 名称、版本、接口等信息
        ↓
加入 IP Repository
        ↓
以后可在 IP Catalog 中重复使用
```

在 Lab0 里，slides 让你先完成 `MUX2T1_5` 的 Behavioral Simulation，确认正确之后，再使用 `Tools → Create and Package New IP` 进行封装。

你可以把它和“普通子模块”区分一下：

```text
普通 .v 子模块
→ 当前工程里直接实例化

封装后的 IP
→ 变成一个标准化、可复用、可放入 IP Catalog 的组件
```

本质上它**没有把 MUX 变成另一种硬件**，只是增加了一层工程管理和复用的包装。

后面课程这么做的目的很明显：先把 `MUX2T1_5`、`MUX2T1_8`、`MUX2T1_32` 等基础模块封装好，后续 CPU datapath 里就可以重复使用，而不必每次重新写。

```
普通 module
→ 当前工程源码里直接定义
→ 直接实例化

封装 IP
→ 放进 IP Repository
→ 当前工程识别这个 Repository
→ 在 IP Catalog 里加入/生成 IP
→ 再在其他 module 中实例化
```
