- 动态贝叶斯网络 DBNs
	- DBNs 本质上就是 HMMs + BNs，在每个时间步重复固定的贝叶斯网络结构，时间t的变量可以具有时间t或t-1的父母
	- 主要构成
		- 多个初始概率分布 P(X0)P(X1)....
		- 多个状态转移矩阵
		- CPTs + 网络拓扑结构
	- 形式
		- ![[DBNs.png]]
	- 一个DBNs的简单例子
		- ![[DBNsExample.png]]
	- 每个HMM都是一个单变量DBN，因此DBNs其实是更为复杂的HMMs

- Exact Inference in DBNs
	- 离线方法 --- 对T时间步，将网络展开然后消除变量以找到 $P(X_T|e_{1:T})$
	- 在线方法 --- 消除之前时间步的所有变量；仅存储当前时间的因子
	- 精确推断在DBNs里往往都太大，因此更常用 Approximate Inference

- Approximate Inference --- Particle Filters 粒子滤波算法
	- 用一组样本表示信念状态
		- 样本被称为粒子
		- 每一步的时间与样本数量成线性关系 
		- 但：所需数量可能很大
	- 表示 
		- $P(X)$ 是一系列 particles
		- predict step
			- 粒子j在状态xt直接从转移模型中采样新状态：$x_{t+1}^{(j)} \sim P(X_{t+1}|x_t^{(j)})$
		- update step - after observing et+1
			- 像likelihood weighting，我们对每个 sample 基于 evidence 加权 $w^{(j)}=P(e_{t+1}|x_{t+1}^{(j)})$
		- Resample --- 在权重分布中进行重采样


