
- 本项目，你将实现 MDPs的 Value Iteration 和 RL 的 Q-learning。首先，你将在Gridworld上测试你的智能体，然后将它们应用于模拟机器人控制器（爬行者）和Pacman。


 - 和上一个项目一样，本项目有两个版本，一个版本是 项目自己提供的 `nn`，另一个版本是 `torch` 版本。这里我依然选择做  `torch` 版本的。它们除了最后一题不同外，其余都相同，最后一题是要训练一个深度Q学习模型


### MDPs Value Iteration

- Q1 --- Value Iteration
	- 编写一个Value Iteration代理，在valueIterationAgents.py中已部分指定。您的Value Iteration代理是一个离线规划器，而不是强化学习代理，因此相关的训练选项是它在初始规划阶段应该运行的值迭代的迭代次数（选项-i）。ValueIterationAgent在构造时接收一个MDP，并在构造函数返回之前运行指定次数的值迭代。

	- 按照MDPs的值迭代公式做就好
	- 这里需要注意的一个点就是它是离线更新而非在线更新。
		- 何意味，我们用 values 存储状态价值，同时更新时也是更新values这就导致一个问题，我们values中部分是当前轮次的结果、部分是之后轮次的结果，这样就不是离线更新而是在线更新了。
		- 正确的离线方式，应当不是 inplace 的改动 values，而是先将 values copy 一份，然后改副本这样副本就是下一轮次的，而values中就是上一轮次的，在轮次最后赋值即可
	- `Counter` 类是项目提供的一个很好的类，它用法类似于字典，但是不会有 no-key error

- Q2 --- Policies
	- 在这个问题中，你需要为这个MDP(项目中给出的带有危险边缘的MDP)选择折扣、噪声和存活奖励参数的设置，以产生几种不同类型的最佳策略
	- 你对每个部分的参数值设置应具有这样的属性：如果您的代理在没有任何噪声的情况下遵循其最佳策略，它将表现出给定的行为。如果对于任何参数设置都无法实现特定行为，则通过返回字符串'不可能'来断言该策略是不可能的
	- 它提供了总共5种策略让我们通过调参实现，或者返回策略不可能

	- 本题其实就是典型的整活炼丹题，我们通过 尝试参数并积累经验得到各自策略的参数设置
		- 注意 `noise` 是很有用的参数，它能衡量不确定性损失


### Q-learning

- Q3 --- Q-Learning + Q4 --- Epsilon Greedy + Q5 --- Q-Learning and Pacman
	- 您现在将编写一个Q学习智能体，它在构建时几乎不做任何事情，而是通过与环境交互的update(state, action, nextState, reward)方法通过试错来学习
	- 对于这个问题，您必须实现update、computeValueFromQValues、getQValue和computeActionFromQValues方法

	- `random.choice()` 函数可以用来随机从list中选择一个
	- 本题中其实是带有 `epsilon` 的贪心算法去选择 action 
	- Pacman 就是 Q-Learning 的应用
	- 只要按照 Q-Learning 的公式做难度不高

- Q6 --- Approximate Q-Learning
	- 近似Q学习假设存在一个特征函数 $f(s,a)$。
	- 我们在featureExtractors.py中为您提供了功能函数。特征向量是util.Counter（类似于字典）对象，包含非零特征和值的对；所有省略的特征值都为零。因此，我们不是通过向量中的索引来定义哪个特征是哪个，而是通过字典中的键来定义特征的标识。
	- 在你的代码中，你应该将权重向量实现为一个将特征（特征提取器将返回的特征）映射到权重值的字典。

	- 依然是按照 Approximate Q-Learning 的公式做就很简单
	- 有一个点很重要就是我们要遍历 `feature` 而不是 `weights`，因为weights是空的，要靠 `feature` 丰富


- Q7 --- Deep Q-Learning
	- 本学期的最终项目问题，你将结合本项目中早期Q-learning的概念和上一个项目中的机器学习。在model.py中，你将实现DeepQNetwork，这是一个神经网络，它根据给定状态预测所有可能动作的Q值

	- 就是简单的网络训练
		- 这里我们使用 `layer = nn.Linear()`, 我们只用输入 input 和 output 的维度即可，它会自动创建对应的 weights 和 bias 并将其放入 `parameters()` 中，同时它的参数初始化是使用了特定初始化方法的，然后调用 `layer(x)` 就行
		- 当然还有`Sequence` 可用，但是这里就不用了

	- 这里我们先把工作流搭好，然后就是调各种超参数了，超参数的调节需要结合经验(大致的数值范围) + 网格尝试，主要参数是学习率、隐藏层大小、batch 和训练轮次，学习率是最重要

- 至此为止，我们完成了所有cs188的项目✅


