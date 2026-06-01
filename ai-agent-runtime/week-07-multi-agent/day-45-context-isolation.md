# Day 45：Context Isolation（上下文隔离）

> 所属周：Week 07 - Multi-Agent 深入
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 44`](../week-07-multi-agent/day-44-task-decomposition.md) ｜ 下一天：[`Day 46`](../week-07-multi-agent/day-46-result-aggregation.md)

核心目标：

- 理解子 Agent 为什么不能继承全部上下文。

关键概念：

- `Context Isolation（上下文隔离）`：每个子 Agent 只获得完成任务所需上下文。
- `Least Context Principle（最小上下文原则）`：给足必要信息，但不暴露无关内容。
- `Context Leakage（上下文泄漏）`：子 Agent 获得不该看到的信息。
- `Sidechain Transcript（旁路执行记录）`：子 Agent 独立记录执行轨迹。

需要理解：

- 全量上下文会增加成本，也会引入干扰。
- 子 Agent 权限和上下文都要最小化。
- 子 Agent 的执行记录应独立保存，主 Agent 只接收摘要结果。

今日输出：

- 为 3 类子 Agent 设计不同上下文输入。

自测问题：

- 为什么安全扫描 Agent 不需要完整业务需求上下文？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
