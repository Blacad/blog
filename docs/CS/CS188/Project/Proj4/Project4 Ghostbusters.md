- 在这个项目中，你将设计使用传感器定位并吃掉隐形鬼魂的Pacman智能体。你将从定位单个静止的鬼魂进步到以无情的效率猎杀多只移动的鬼魂猎人

- 本项目是利用Bayes Nets、MKMs、HMMs 以及 DBNs 实现鬼魂定位以及追杀
- 实现上述模型的 Inference 方法，能让你对条件概率和上述模型结构和用法有充分认识

### basic 以及 BNs 的 Factor 操作以及 Variable Elimination Inference
- 首先熟悉 `bayesNet.py` 中的两个类(BayesNet & Factor)的基本用法，`printStarterBayesNet` 是示例函数可以看看bayesNet是怎样构建起来的，其中就是两个类的基本用法
- Q1 ---  Bayes Net Structure
	- 就是实现简单的 网络构建，如果看了上面的示例非常简单

- Q2 --- Join Factors
	- 实现 Factor 的 Join 操作
	- 注意到 将多个 CPTs 表合并时，$join[P(X,Z|Y,W),P(X,Y|Z)]=P(X,Y,Z|W)$，它的构型就是先把前面的合并，然后再把后面的合并同时去除前面本身有的
		- 这里会用到 python 的 set 操作
			- `set1 | set2` --- set 取并集
			- `set1 & set2` --- set 取交集
			- `set1 - set2` --- set 取差集, 属于 set1 但不属于 set2 的元素
			- `set1 ^ set2` --- set 取对称差集，不同时存在于 A 和 B 中的元素
	- 然后新的 prob 就是原先的prob直接相乘即可，非常简单
		- getProbability --- 如果有多的，只看匹配的；不能少
		- setProbability --- 如果有多的，只看匹配的；不能少


- Q3 --- Eliminate
	- 实现 Factor的 Eliminate 操作，就是将原先除消除变量外其它均相同的概率相加得到新CPT


- Q4 --- Variable Elimination
	- 实现 变量消除 Inference，算法逻辑在课堂上讲过
		-  Query：$P(Q|E1=e1,...,Ek=ek)$ 
		- 从初始因子开始
			- 即本地CPTs（但由证据实例化）
		- 当仍有隐藏变量（非Q或证据）
			- 选择一个隐藏变量H
			- 将所有含H的因子join
			-  如果join的结果的只有唯一非条件变量且就是要消除的变量(其实唯一就足够判断了)
				- 则忽略该factor(最终不用于Join)
			- 否则
				- 消除（求和）H
		- 将所有剩余的因子join并归一化(归一化就是将证据变量变成条件变量)
			- 归一化 --- $P(L,T=+t)$ -> $P(L|+t)$. 
	- 本题的==核心点==在于  `将所有含H的因子join` 的 join 结果的分情况处理(这里卡了很久)
		-  为什么只有唯一非条件变量的就可以直接忽略 --- 我们join factor的目的就是想通过factor的非条件变量将条件变量消除，但是你的非条件变量只有你自己含有且是不需要的隐藏变量，因此我们不需要你来join就可以直接忽略
		- 那么为什么不是唯一非条件变量的就要保留 --- 不是唯一非条件变量证明已经join了多个，我们的目的是消除 隐藏变量，如果直接忽略可能把需要的变量忽略了，因此我们在 eliminate 后需要将其放回去


### 随机变量分布模拟以及HMMs(DBNs)
- Q5
	- Q5a --- DiscreteDistribution Class
		- 很遗憾，拥有时间步长会使我们的图变得过于庞大，以至于变量消除变得不可行。相反，我们将使用HMM(DBNs)的前向算法进行精确推理，并使用粒子滤波进行更快但近似的推理。
		- 在项目的剩余部分，我们使用 DiscreteDistribution 类来模拟信念分布和权重分布，其中键是我们分布的不同离散元素，相应的值与分布分配给该元素的信念或权重。

		- 简单来说，DiscreteDistribution 类 是用于模拟出一个随机变量的分布，为之后的HMM做准备
		- 本问题是实现该类的 normalize 方法 和 sample 方法
			- 该类继承自 python 的 dict 类，对于python 类实例的判空非常简单 `not dict` 即可，第一个方法简单
			-  python 的 `random.random()` 方法直接可以适配第二个方法
				- 它是生成 `[0,1)` 之间的浮点数，那么先将其扩大 `[0,total)`，这样我们按照字典的顺序遍历，小于第一个值的属于第一类，大于等于第一个值但小于第一个值+第二个值的属于第二类，以此类推
	- Q5b --- Observation Probability
		- 实现 getObservationProb 方法。该方法接收一个观察值（即对鬼魂距离的噪声读数）、Pac-Man 的位置、鬼魂的位置以及鬼魂监狱的位置，并返回给定 Pac-Man 的位置和鬼魂的位置的噪声距离读数的概率 $P(noisyDistance∣pacmanPosition,ghostPosition)$
		- `busters.getObservationProbability(noisyDistance, trueDistance)` 返回 $P(noisyDistance∣trueDistance)$
		- `manhattanDistance` 函数 返回 ghost 和 pac-man 之间的距离
		- 当我们捕捉到鬼魂并将其发送到监狱位置时，我们的距离传感器确定性返回None
		
		- 除了特殊情况之外，本质上就是概率问题(你需要弄成 查询变量+证据变量+隐藏变量)，本题就是 nd 查询、td 隐藏、pp和gp是证据
			- 基于Bayes Nets(`nd<-td<-(pp,gp)`) $$P(ND|PP=pp,GP=gp)=\sum_{td}P(ND|TD)P(TD|PP=pp,GP=gp)=P(ND|TD=|pp-gp|)$$
			- 由于 $P(TD|PP,GP)$ 是一个退化分布，它在 $td = |pp-gp|$ 时为1，其它为0，因此上式求和就是后式

### HMMs(DBNs) Exact Inference
- Q6 --- Exact Inference Observation
	- 在这个问题中，你需要在 inference.py 文件中的 Exact Inference 类中实现 observeUpdate 方法，以正确更新 Pacman 传感器观察到的鬼魂位置给定的信念分布。你正在实现在线信念更新以观察新的证据。对于这个问题，observeUpdate 方法应该在接收到传感器读数后更新地图上每个位置的信念。你应该遍历变量 self.allPositions，它包括所有合法位置以及特殊监狱位置。信念代表鬼魂在特定位置的概率，存储在名为 self.beliefs 的字段中，你应该更新这个字段。
	- 在编写任何代码之前，写下你要解决的推理问题的方程。你应该使用你在上一个问题中编写的 self.getObservationProb 函数，该函数返回给定 Pacman 的位置、一个潜在的幽灵位置和监狱位置时观察到的概率。你可以使用 gameState.getPacmanPosition() 获取 Pacman 的位置，使用 self.getJailPosition() 获取监狱位置。

	- 本处的BNs和Q5的一致，但是我们可以把 td 给去掉 `nd<-(pp,gp)`
	- 公式 $P(GP|nd,pp)=normalnize(P(GP)P(PP=pp)P(ND=nd|GP,PP=pp))$
		- 其中，$P(PP=pp)=1$
	- 因此，$P(GP=gp|nd,pp)=normalnize(P(GP=gp)P(PP=pp)P(ND=nd|GP=gp,PP=pp))$


- Q7 --- Exact Inference with Time Elapse
	- 在前一个问题中，你实现了基于Pacman观察的信念更新。幸运的是，Pacman的观察并不是他了解鬼魂可能位置的唯一知识来源。Pacman还了解鬼魂可能移动的方式；也就是说，鬼魂不能穿过墙壁或在一次时间步中移动超过一个空间。
	- 在这个问题中，你需要在ExactInference中实现elapseTime方法。对于这个问题，elapseTime步骤应该在经过一个时间步后更新地图上每个位置的信念。你的智能体可以通过self.getPositionDistribution访问幽灵的动作分布。


	- 本题给出了BNs或者说HMMs或者说DBNs
		- 我们利用 HMMs的公式 
		- predict -> update
			- 乘 T 相加 --- predict
			- 再用observation相乘归一化 --- update(这是Q6实现的，Q7这里只需要实现第一步predict)


- Q8 ---- Exact Inference Full Test
	- 在bustersAgents.py中实现GreedyBustersAgent的chooseAction方法。您的智能体应首先找到每个剩余未被捕获的幽灵最可能的位置，然后选择一个动作，以最小化迷宫距离到最近的幽灵。(最可能的位置是由Q6和Q7的方法决定的)
	- 提供了一个名为livingGhostPositionDistributions的列表，其中包含代表每个未捕获的幽灵的位置信念分布的离散分布对象。
	- successorPosition = Actions.getSuccessor(position, action)
	- 要找到任意两个位置pos1和pos2之间的迷宫距离，请使用self.distancer.getDistance(pos1, pos2)

	- 就是很简单的业务逻辑实现

### HMMs(DBNs) Approximate Inference(粒子滤波)
- Q9 --- Approximate Inference Initialization and Beliefs
	- 在inference.py类中实现ParticleFilter类的initializeUniformly和getBeliefDistribution函数。在这个推理问题中，粒子（样本）是一个幽灵位置。请注意，为了初始化，粒子应该在合法位置上均匀分布（而不是随机分布），以确保均匀先验。我们建议思考mod运算符在initializeUniformly中的有用性。


	- 这个简单，就是先采样多个粒子，然后得到每个粒子的概率(粒子出现次数/总粒子数)

- Q10 --- Approximate Inference Observation
	- 我们将在inference.py中的ParticleFilter类中实现observeUpdate方法。该方法在self.particles上构建一个权重分布，其中粒子的权重是观察结果在Pac-man位置和该粒子位置给定的概率。然后，我们从这个加权分布中重新采样，以构建我们新的粒子列表。

	- HMMs的update
		- 我们先根据Observation 更新分布的概率，然后根据新概率进行重采样得到新的粒子列表，这样可以得到新的概率(和之前差不多，就是多一个重新采样粒子的过程)

- Q11 --- Approximate Inference with Time Elapse
	- 在 inference.py 类的 ParticleFilter 中实现 elapseTime 函数。此函数应构建一个新列表，其中包含对应于 self.particles 中每个现有粒子的粒子，并将时间步长向前推进，然后将此新列表重新分配给 self.particles。完成后，你应该能够几乎像使用精确推理一样有效地追踪幽灵

	- HMMs的predcit
		- 乘 T 相加 --- predict (和之前差不多，就是多一个重新采样粒子的过程)