
- Uncertainty
	- probability theory + utility theory -> decision theory
		- 最大化期望效用 --- $a^* = argmax_{a}\sum_{s}P(s|a)U(s)$


- Basic laws
	- 样本点 $\omega$, 总样本集合 $\Omega$
	- 概率模型(probability model) 为每个世界$\omega$分配一个数$P(\omega)$
	- 事件(event) 是$\Omega$的任意子集

- Random Variables
	- 随机变量（通常用大写字母表示）是我们可能不确定的世界某个方面
	- 它本质上是一个函数
	- probability distribution
		- 随机变量X的概率分布给出了其取值范围内每个值x的概率（事件X=x的概率）
	- Marginal distribution 边缘分布
		- $P(X=x)=\sum_{y}P(X=x,Y=y)$
	- conditional probability
	- Normalize a distribution --- 就是把它们化为和为一
	- Chain Rule
		- $P(x_1,x_2,...,x_n)=\prod_{i=1}^{i=n} P(x_i|x_1,...,x_{i-1})$
		- 在处理逻辑计算时可以使用换元法或称整体法，比如
			- $P(x_1,x_2|x_3)=P(A|x_3)=P(A,x_3)/P(x_3)=P(x_1,x_2,x_3)/P(x_3)$
			- $P(x_1|x_2,x_3)=P(x_1|A)=P(x_1,A)/P(A)=P(x_1,x_2,x_3)/P(x_2,x_3)$
	- Probabilistic inference
		- 通常针对给定证据的查询变量，概率模型中计算所需的概率
		- 概率会随着新证据而改变
	- Independent --- $P(x,y)=P(x)P(y)$
