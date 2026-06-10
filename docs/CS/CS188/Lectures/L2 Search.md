- Search Problems
	- ==一个 Search Problem 由如下部分组成==
		- A state space 状态空间
		- A successor function(with actions，costs) 后继函数(Action) --- transition model (执行后的状态)
		- A start state and a goal test(Init and Goal)
	- 一个 Solution 是一系列 actions 使得 从 start state 变为 goal state
	- 本质上 search problem 也只是对真实世界的模拟，我们不可能涵盖所有state 和 action
	- search state 仅保持用于 plan 的细节（因此肯定不是完全等同于世界状态），一个 Pathing 问题的search state如下：
		- States --- (X,Y) location
		- Action --- NSEW
		- Successor --- update location
		- Goal test --- is (X,Y)=END

- ==State Space Sizes==
	-  在不同的搜索问题下，state space的大小是可以不同的，完整的world space是很大的，而如果只是Pathing问题就可以缩小 state space



- State Space Graphs and Search Trees
	- ==状态空间图：搜索问题的数学表示==
		- 节点是（抽象的）世界配置
		- 弧表示后继（动作结果）
		- 目标测试是一组目标节点（可能只有一个）
	- 在状态空间图中，每个状态只出现一次！
	- ==搜索树==
		- 初始状态是根节点
		- 子节点对应后续状态
		- 节点表示状态，但对应实现这些状态的计划
		- 对于大多数问题，我们实际上永远无法构建整个树
	- 在搜索树中，同一状态可以多次出现！


	- 在有环状态空间图中构建的Search Tree是无限大的

- Searching with a Search Tree
	- 我们需要考虑几个关键 ideas --- Fringe(边缘)、Expansion(拓展)、Exploration strategy(探索策略)
	- 几种常见算法
		- DFS --- not Complete and not Optimal
			- 策略：首先扩展最深的节点 
			- 实现方法：Fringe是一个后进先出（LIFO）栈
		- BFS --- Complete and Optimal
			- 策略：首先扩展最浅的节点 
			- 实现方式：Fringe是一个先进先出队列
	- Search 算法的特征
		- Complete --- 是否一定能找到目标
		- Optimal --- 是否一定是最优的
		- Time and Space complexity
	- ==Iterative Deepening (IDS)== --- 结合了DFS和BFS的优势、DFS的空间优势以及BFS的时间优势 --- Complete and Optimal
		- 运行DFS，但是限制DFS的深度，第一次深度 limit 1，第二次 深度 limit 2，以此类推(相当于多次使用DFS)
		- 虽然会增加BFS的time，但是可以极大节省空间(对Fringe来讲，DFS只需要深度的空间，而BFS需要层node的空间)

- Cost-Sensitive Search
	- 一般的搜索过程中其实不同路径的cost是不同的，这样我们采用上述的算法一般不会是Optimal的，上述的Search 算法一般针对的是cost 一致的情形
	- ==Uniform Cost Search (UCS)== -- 一种解决 Cost-Sensitive Search的方法  Complete and Optimal (cost is positive)(其实你会发现BFS是UCS的一种特例)
		- 策略：首先扩展累积成本最低的节点
		- 实现方式：Fringe是一个优先队列（优先级：累积成本）