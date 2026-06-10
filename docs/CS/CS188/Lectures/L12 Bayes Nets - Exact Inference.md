
- Inference
	- 推理是从联合概率分布中计算一些有用的量
	- 更具体来讲
		- $P(Q|E_1=e1,....)$  --- 找到在目前已知条件下，查询事件的概率分布
		- $argmax_q P(Q=q|E_1=e1,....)$  --- 找到在目前已知条件下，查询事件发生概率最高的是什么(这个其实被上面那个蕴含)
	- 精确推理Exact Inference = 网络中条件概率乘积之和。本节推理都是讲 精确推理


- Inference by enumeration 通过枚举推理
	- 组成
		- 证据变量 --- E1、E2、... Ek
		- 查询变量 --- Q
		- 隐藏变量 --- H1、H2、... Hr
		- 它们合起来是所有变量 X1、X2、... Xn
	- 我们想知道
		- $P(Q|E1=e1,...,Ek=ek)$ 
	- 运算步骤
		- 利用边缘分布 $P(Q,e1,...,ek)=\sum_{h1,...,hr} P(Q,e1,...,ek,h1,...,hr)$
			- 右侧计算时会用到 Chain Rules，而Bayes Nets 可以帮忙简化 Chain Rules
		- 归一化 $Z=\sum_q P(Q|e1,..,ek)$ 和 $P(Q|e1,...,ek)=\frac{1}{Z}P(Q,e1,..,ek)$


- Variable Elimination 变量消除
	- 本质目的是减少计算次数和存储
	- 有如下几种方案
		- rewrite成只需要少量计算的形式
		- 将 summation 尽可能往里面放
		- 计算应当从里到外
	- Note --- 一般用小写字母表示具体值，大写字母表示变量本身(表)

- 因子与操作
	- Factor 因子
		- 第一类因子
			- $P(X,Y)$ 与 $P(x,Y)$
		- 第二类因子
			- $P(Y|x)$ 与 $P(Y|X)$
		- 第三类因子
			- $P(y|X)$

	- Operation 操作
		- 操作一
			- Join Factors 联合因子，类似于数据库的join
		- 操作二
			- Eliminate 消除因子，通过求和消去一个变量(边缘分布)
		- 我们可以根据 Bayes Nets 以任何顺序进行 Join 和 Eliminate 来简化计算
			- 比如 A->B->C 可以先join成 A->(B,C)，然后 Eliminate为 A->C，再join计算 (A,C) 就可以节省较多计算了
			- 一个有趣的洞见 Bayes Nets 的结构其实决定了 A->B，B的表是 P(B|A)，其实如果 A 之前还有祖先也应该放在 B的后面，但是根据 Bayes Nets特殊的条件独立性可以不要

- Evidence 证据
	- 如果有证据，就可以只选择满足证据的行，简化 Tables
	- 结果是一个选定的查询和证据的结合，然后进行 归一化操作，例如
		- 我们的证据是 $+r$，查询是 $L$，那么我们需要先得到结合$P(+r,L)$ ，然后进行归一化后就是 $P(L|+r)$，当然也可以基于Bayes Nets直接进行计算
	- 具体来讲，有证据的推理过程如下
		- 简化![简化.png](assets/简化.png)
		- Join、Eliminate and Normalization![归一化.png](assets/归一化.png)


- General Variable Elimination 通用变量消除
	- 该方法是将上述的因子、操作和证据应用到变量消除中，得到更好的inference pipeline(Inference by Variable Elimination)
	- inference pipeline
		- Query：$P(Q|E1=e1,...,Ek=ek)$ 
		- 从初始因子开始
			- 即本地CPTs（但由证据实例化）
		- 当仍有隐藏变量（非Q或证据）
			- 选择一个隐藏变量H
			- 将所有提及H的因子join
			- 消除（求和）H
		- 将所有剩余的因子join并归一化
	- Order Maters
		- 变量消除的顺序是很重要的，它会影响计算量和存储
		- 但是我们不总是能在多项式时间完成变量消除inference，这是NP-hard问题(由SAT(求解CNF某个可能世界)是NP-hard规约证明)
		- Polytrees --- 有向图且没有无向环
			- 对于Polytrees，你从叶节点到根节点顺序消除变量，复杂度与网络大小是线性关系
			- 对于部分有无向环图可以找到cut-set并去除，变成多个Polytrees分别算