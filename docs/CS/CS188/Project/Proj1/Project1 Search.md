- 各种基础 search 算法实现

## 1
- 新的python 语法知识 ---- 类型说明
	- 益处
		- 在python帮助文档中显示类型
		- 帮助我们看属性名
	- 形式与说明
		- `def my_function(a: int, b: Tuple[int, int], c: List[List], d: Any, e: float=1.0): -> int`
		- 这是注释Python应该期望此函数的参数类型。在下面的示例中，a 应该是 int（整数），b 应该是 2 个整数的元组，c 应该是任何内容的列表的列表，因此是任何内容的二维数组，d 实质上与未注释相同，可以是任何内容，而 e 应该是 float。如果未传入 e，则将其设置为 1.0
		- 上述调用符合类型注解，没有为 e 传递任何内容。类型注解旨在作为文档字符串的补充，帮助你了解函数正在处理的内容。Python 本身并不强制执行这些。当你编写自己的函数时，是否要注解类型取决于你；它们可能有助于保持组织，也可能不是你想要花费时间的事情。

## 2
- 我们实现的都是 Graph 版本的各种搜索算法且基本代码形式一致，只是 fringe不同以及出入的规则有些许不同，但是 ==A\* 算法需要格外注意==
	-  DFS、BFS、UCS，它们的Graph版本实现`closed_set`直接用的就是python的`set` ，同时只需要将已经 `pop` 出来的 state记录进入`set`，然后之后拓展到已经在 `set` 的 state直接跳过即可(由于没有heuristic一切衡量都是real-cost)
	- A\* 不同，如果要保证它是 Optimal 的，就需要 heuristic 保证 consistent，但是有时不能保证，因此与传统的Graph A\* 不同，我们不能再用单纯的 `set` 只记录已经经过 state，我们创建一个 `dict` 记录 state + 最小实际成本，当我们需要拓展 state 时，如果它在`dict`中 且 这里计算它的实际cost要比记录的大，则跳过否则拓展并更新`dict`

## 3
- `search.py` 中除了关注各种search算法的具体实现，还有几个引人注目的内容 --- 不得不说这个项目的封装和整体代码架构让人一看就赏心悦目
	- fringe的实现
		- 在 `util` 里实现了各种 fringe
	- State的实现和结构 ---- 记录游戏关注的状态信息即某个状态需要知道的信息来define状态(节点)
		- 在 `pacman` 里记录了 GameState类，其中主要信息放在 GameStateData类里(`game`文件中)，我们要通过 GameState的inference访问信息更好，在`game`文件中还有个Game类用来游戏管理控制流，从代理那里征求行动。
		- `pacman` 文件也是我们这个项目的一个重要文件，它其中记录着我们项目的`启动历程`，其中`读参数、解析参数、运行完整历程`都很有意思
	- problem的实现和结构  --- 总览记录游戏的整体信息即 costs、actions、successor、state、layout 等等（状态图）
		- 在 `search` 文件中有一个 searchProblem的抽象类，同时在 `searchTestClasses` 文件中有继承自 searchProblem抽象类的 GraphSearch类，当然其他文件中可能还有其它继承自searchProblem抽象类的类。我们本次项目的 problem基本都是 GraphSearch类，用基类作为函数参数能够有效提升函数的适用范围，基类能够接收其子类(当然对于python而言只是为了看得方便用得方便). 
		- problem 的三个重要方法
			- isGoalState( )
			- getSuccessors( )
			- getStartState( )
		- Q5 就是让我们自己写一个`searchProblem子类的实现`，其中最有意思的是自己`重新弄一个 State`而不用 GameState类的实例，这样能够节省空间+时间，当然它提示我State需要保留哪些信息了。如果food被吞会从corners中删掉
		- Q6 中还专门为启发式算法的配置了一个字典


## 4 
- `searchAgent.py` 里最引人注目的就是 `Agent` 类的定义了可以看看 `SearchAgent` 的具体实现，有两个重要方法 ---- 作为Action的执行和规划个体（将 problem(、state)、search算法集成为完整流程并为Agent运动图形化显示搭建桥梁）--- 构成了 解决各种问题的Agents
	- `registerInitialState()` --- 向下封装
		- 这是代理第一次看到游戏棋盘布局。在这里，我们选择通往目标的路。在这个阶段，代理应该计算通往目标的路并将其存储在局部变量中。所有的工作都在这个方法中完成！
	- getAction( ) --- 向上接口
		- 返回之前选择的路径中的下一个动作（在registerInitialState中）。如果没有进一步的动作可执行，则返回Directions.STOP。
	- 初始化方法也写得不错

## 5
- 设计启发式算法时
	- 一定要先满足 `admissiable` 
	- 然后考虑几个场景 看看是不是 `consistent` 的 --- 最好理论推导一下，应该也不难
	- 同时 h 一定是越接近 `goal state` 越小
	- 同时要记住 h 的相对优势，h越大越好，但是要满足上述基本条件（consistent + admissible）
	- Q7 最终设计的启发式算法，其实本质上是一个最傻的解法，就是时间 换 空间，我们直接用 `mazeDistance` 的方法计算出 两点间的实际迷宫距离，然后用它到最远点的实际迷宫距离作 h 即可（当然还可以优化，比如说还有距离最远点最远的点的距离算出来充当拔高h的值，可以更快)



##  总结
- Q1 --- Q4 依次实现 DFS、BFS、UCS 和 Astar --- Graph Search 版本
- Q5 完成一个 searchProblem 的子类定义 即 cornersProblem
- Q6 设计一个 consistent的启发式算法 针对 cornersProblem
- Q7 设计一个consistent的启发式算法 针对 DotsProblem
- Q8 设计新的searchAgent 的一个重要方法

