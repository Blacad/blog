
- Bellman Equation 贝尔曼等式 --- 相当于 mini-expectimax搜索
	- 选择正确的第一个action，继续保持最优
	- 上节提到的等式即是Bellman等式
		- $V^*(s)=max_a Q^*(s,a)$
		- $Q^*(s,a)=\sum_{s'} T(s,a,s')[R(s,a,s')+\gamma V^*(s')]$
		- $V^*(s)=max_a\sum_{s'} T(s,a,s')[R(s,a,s')+\gamma V^*(s')]$

- Fixed Policy 固定策略
	- 期望最大化树对所有动作进行最大化以计算最优值
	- 如果我们固定一些策略，那么树就会更简单——每个状态只有一个动作
	- Utility for a fixed policy
		- 在固定（通常非最优）策略下计算状态s的效用
		- 定义在固定策略下状态s的效用
			- $V^\pi (s)$ = 预计从s开始并以 $\pi$ 策略的随后的总折扣奖励
		- 递归关系
			- $V^\pi (s) =\sum_{s'} T(s,\pi(s),s')[R(s,\pi(s),s')+\gamma V^\pi(s')]$

- Policy Evaluation策略评估
	- 贝尔曼递归
		- $V_0^\pi(s) = 0$
		- $V_{k+1}^\pi(s)=\sum_{s'} T(s,\pi(s),s')[R(s,\pi(s),s')+\gamma V_k^\pi(s')]$

- Policy Extraction 策略提取 --- value iteration 收敛后可通过该方法得到策略
	- 相当于做一个mini-expectimax 搜索
	- $\pi^*(s)=argmax_a \sum_{s'} T(s,a,s')[R(s,a,s')+\gamma V^*(s')]=argmax_a Q^*(s,a)$ 

- Policy Iteration 策略迭代
	-  Policy Iteration在某些情况下能有更快的收敛速度
	- Policy Iteration得过程
		- 第一步进行 Policy evaluation 直到效用收敛
			- $V_{k+1}^{\pi_{i}}(s)=\sum_{s'} T(s,\pi_{i}(s),s')[R(s,\pi_i(s),s')+\gamma V_k^{\pi_{i}}(s')]$
		- 第二步 进行 Policy improvement(policy extraction) --- mini-expectimax
			- $\pi_{i+1}(s)=argmax_a \sum_{s'} T(s,a,s')[R(s,a,s')+\gamma V^{\pi_i}(s')]$


- Value Iteration 和 Policy Iteration
	- 价值迭代和政策迭代计算相同的内容（所有最优值），两者都是用于解决MDPs的动态程序
	- 价值迭代
		- 每次迭代都会更新价值和（隐式地）策略
		- 我们不跟踪策略，但通过取动作的最大值隐式地重新计算它
	- 策略迭代
		- 我们进行多次遍历，使用固定策略更新效用（每次遍历都很快，因为我们只考虑一个动作，而不是所有动作）
		-  在评估策略后，选择一个新的策略（像价值迭代遍历一样慢）
		- 新策略将更好（或者我们完成）


- 小结
	- 从 BNs 开始 直到 DBNs，一直解决的问题是 某个变量或者某些变量联合状态的概率分布问题
		- BNs 提供固定的多变量概率结构
		- MKMs 提供变量多个时刻的状态转移关系
		- 两者结合形成 DBNs(HMMs是单变量DBNs)

	- MDP 在概念上继承上述的模型，但是解决的问题改变了，它需要找到 效用最优 sequence，本质上讲是指导 agent 该如何行动以达成最优，因此可以说是上述方法的经典集成应用之一
		- 通过 Value Iteration，找到 效用最优 sequence --- 像 mini-expectimax
		- 通过 Policy Iteration，找到 效用最优 sequence --- policy + mini-expectimax
	