---
title: vivado 基础
date: 2026-09-18 21:00:29
categories:
  - 实践技术
  - verilog&VIVADO
tags:
  - 计组助教
comments: true
---

本文介绍 vivado 的基础知识，看完本文应该基本能够使用 vivado 进行编码

<!--more-->
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

对于一个Verilog项目，我们需要指定 Top Module，可以理解为整个项目只关心 Top Module 以及其使用的 子 Module。


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

要使用时，就将其添加到工程文件中，然后在 IP Catalog 中选择它，然后就可以在代码里实例化它了。
当然，IP Catalog 中也可以添加其他 IP，比如官方的 IP，比如 lab0中就添加了 Distributed Memory 和 Block Memory。
Xilinx IP 就可以理解为：Xilinx 提供的、已经设计并验证好的硬件功能模块。
Xilinx IP 有：
- ROM / RAM / Block Memory
- FIFO
- Clock Wizard（时钟管理）
- 乘法器、除法器
- BRAM Controller
- AXI 接口模块
- 各种通信接口等

IP 封装可以选择 带源文件的版本，也可以选择 不带源文件的版本，
带源文件时比较方便，不带源文件时配置起来会比较麻烦，需要跑综合，然后得到 .edf 和 .v 端口文件

带源文件 - xgui、component、source
不带源文件 - xgui、component、.edf、.v
- .edf：真正的电路实现。它是综合后的网表，已经从 RTL 变成了门级/逻辑级的连接关系。
- .v：这里通常不是原始源码，而是 stub 空壳文件，只保留 module 名称和输入输出端口，让 Vivado 和其他 Verilog 模块知道“这个 IP 有哪些接口”。
- component.xml：描述这个 IP 的名称、版本、端口、文件等封装信息。
- xgui：描述 Vivado 中 IP 配置界面的相关信息。

```tcl
write_verilog -mode synth_stub .../xxx.v
write_edif .../xxx.edf
```