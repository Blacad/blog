---
title: verilog 基础
date: 2026-09-13 13:58:32
categories:
  - 实践技术
  - verilog&VIVADO
tags:
  - 计组助教
comments: true
---

verilog 的基本介绍

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

Verilog 要以 ==模块== 的视角思考问题，

### net&variable

assign 的 左值，需声明为 wire(net)(wire\tri\wand\wor等)

always 块、initial 块 中 的左值，需声明为 reg(variable)(reg\integer\time\real等)

reg 不是真实的硬件寄存器，而是可用于赋值的变量

input、output 只是说明端口方向，并不说明类型，默认为 wire
inout 是特殊的端口方向说明，默认也是wire，且不能被声明为 reg

input 一般就是声明为 wire，默认可以不管

net 表示“谁在驱动这根线”；variable 表示“过程执行时这个对象被更新”


### 数据
```verilog
5'b00101 
8'hAF
reg a;
wire b;
reg [31:0] a;
wire [31:0] b;
reg [31:0] a [1:31];
wire [31:0] b [1:31]; // 通常不会这么用的
```
5 bit 二进制表示
8 bit 十六进制表示
或者称为 constant

reg a 就是 定义一个 1 位变量 a
wire b 就是 定义一根 1 位网络线 b
reg [31:0] a 就是 定义一个 32 位变量 a
wire [31:0] b 就是 定义一个32位网络线 b
reg [31:0] a [1:31] 就是 定义一个 reg 数组，包含 a[1] 到 a[31] 共 31 个元素，每个元素都是 32 位。





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

### IP

IP 的全称是 Intellectual Property，通常翻译为 知识产权核，简称 IP 核。
其实就是将 设计封装，于是可以复用。

## 组合逻辑与时序逻辑

组合逻辑和时序逻辑总览：
```verilog
组合逻辑：
  assign
  always @(*)
  always @(a or b or c) // 必须包含所有依赖值
时序逻辑：
  always @(posedge clk)
  always @(negedge clk)
  always @(posedge clk or negedge rst)
其他：
    always @(a)
不合法：
    always @(a and b)
意义不同：
    always @(a&b) // 表示 a&b 整体变化触发
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

除了上述的说明外，连续赋值(assign) 与 过程赋值(always/initial) 也需要区分

连续赋值不必多说，需要使用 =，且只能表示组合逻辑

过程赋值，可以表示组合逻辑亦可表示时序逻辑
- 对于=，类似于 c 语言执行过程，可以视为一行行执行(阻塞)
- 对于 <=, 则是 右值同时计算出来(用旧的值)，然后赋给左值





### 简单时序逻辑

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



## 其他技巧

### 快速仿真小技巧：使用参数
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

### Verilog 的四值逻辑

0 1 x z
x=unknow
z是高阻态，常出现于三态总线 或 IO pin



