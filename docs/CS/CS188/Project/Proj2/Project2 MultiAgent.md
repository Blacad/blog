- 实现 minimax、alpha-beta 剪枝、期望最大search、评估函数优化


## 总结
- 本质上，search问题或者game问题都是 Plan-then-solve 的
- 有句话把反射性 Agent 和 前瞻性 Agent 写得很清楚
	- 前瞻型智能体评估未来状态，而反射型智能体评估从当前状态采取的行动
- Q1
	- 实现一个简单的 ReflexAgent，它只知道 当前状态和下一状态，由这两个信息进行抉择
- Q2
	- 实现基础的minimax 算法但是还没有剪枝
- Q3
	- 实现 阿尔法-贝塔 剪枝算法，这个是本次项目的重点
- Q4
	- 实现 Expectimax Search 算法，这个就是把不带剪枝的 minimax 算法的min逻辑改了就行
- Q5
	- 简单优化下 evaluation function