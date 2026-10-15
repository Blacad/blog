---
title: Agent随想
date: 2026-10-15 21:00:15
categories:
 - 实践技术
tags:
 - Agent
 - LLM
comments: true
---

本文记录自己对于 Agent 技术在工程实践上的一些随想和思考，部分观点可能已经是业界公认的
<!--more-->

## 良好的工程实践

当我们面临一个新的问题或者场景且该情况下需要使用 AI Agent 来解决问题时，较好的实践优化顺序是：

1. Context Engineering
    - naive prompt
    - target/new skills
    - target/new tools
    - target/new workflow
    - Methods without changing the model's parameters and focus on the prompts. Of course, these methods may involve training.
2. Training
    - collect data of the target task and training
    - multiple training methods (SFT、RL and so on)
        - Deepseek-R1 recipe 是一个不错的参考，当然现在的 GLM 的新 recipe 也不错，可以参考
    - Methods on the model's parameters

在常见场景中，我们往往只会做第一步 Context Engineering，只有在模型真的不行时才会考虑 Training

## AI Agent 引发的下一步思考

在计算机的语境下，模型参数的搜索空间实则是有限的(计算机精度有限)，当某个模型定义的函数集搜寻出普遍公认的最优解时(最优解的假设是基于模型目的得到的，可能在表现上看是各Benchmark的分数)，如果希望进一步优化能走的路径只有: 改变模型定义的函数集(架构更新)，所有基于 Training 的方式本质上都是在既定的函数集里搜索出最优的函数，其实即使在 meta-learning 的语境下，往往最终的落脚点也是找到最好的解，在这种情形下，我认为 Pareto 确实是一个值得参考的思想，每代模型最好都能有 多个 checkpoints 比较好，公开一个跑分高的，其余用于后续研究。

但是，在 Agent 情形下，搜索空间似乎真的无限了，它主要受制于 L(序列长度)，但 L 其实在理论上可以无限长，当然传统注意力机制对于超长建模会有问题，但是这些是模型层面的事情，并不是 Agent 层面的事情，畅想我们拥有一个 注意力建模极强以至于能处理人类世界的无限上下文(以人类的阅读速度直到宇宙热寂也无法阅读完全)以及无限计算资源，那么我们的 Agent 搜索空间大体上就是无限的(假设是基于L的无限)，因此真正在 Agent 层面的事情，确实需要聚焦于 Harness，而不是 model，至于 Agentic RL 如果依然训练 model's parameters，那么我们依然视作是在做model上的功夫。

RSI(Recursive Self improve) 和 SI(Self Improve) 技术往往会聚焦于 Agent Harness，我认为这样确实是在做 Agent 上的功夫，但是面对一个几乎无限的搜索空间，我们应该怎么才能找到最优的初始化状态(多轮对话后的Harness从本质上已经改变)？这个状态的各种子组件的配置应该是怎样的？考虑类似RAG的场景，它应该默认配置多少未载入上下文，多少载入上下文(类似OS里的虚拟内存思想或者说编译原理里的动态载入思想)？

对于 Agent 的思考其实会反馈到模型，模型作为 Agent 的子组件，它的搜索空间是有限的，但是 Agent 的子组件中包含无限子组件，因此 Agent 的搜索空间是无限的，那么单从模型的角度思考 Agent 我认为是没有什么意义的，先辨析好 Agent 的子组件组成，并辨析清楚各个子组件的搜索空间是否有限，将其拆分后再集合分析才有意义。

总结来讲，和做 model 研究不同的是，Agent 研究由于将 Harness 考虑在内，它研究的其实是最优的 Agent 初始状态，但是目的是一样的，即在通用任务上能达到最好的性能。




