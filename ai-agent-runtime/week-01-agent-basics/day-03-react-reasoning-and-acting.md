# Day 03：ReAct（推理与行动）模型

> 所属周：Week 01 - Agent 基础模型
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 02`](../week-01-agent-basics/day-02-chat-api-workflow-agent.md) ｜ 下一天：[`Day 04`](../week-01-agent-basics/day-04-state-machine-agent.md)

核心目标：

- 理解 `ReAct（Reasoning and Acting，推理与行动）` 是 Agent 的基础思想。

关键概念：

- `Reasoning（推理）`：模型根据目标和上下文判断下一步。
- `Acting（行动）`：模型请求执行工具，例如读文件、搜索、运行测试。
- `Observation（观察）`：Runtime 把工具执行结果反馈给模型。
- `Trajectory（轨迹）`：一次任务中所有推理、行动、观察组成的路径。

基本循环：

```text
Thought（思考）
-> Action（行动 / 工具调用）
-> Observation（观察 / 工具结果）
-> Thought（继续思考）
```

需要理解：

- ReAct 不是具体框架，而是一种 Agent 交互范式。
- 工具结果必须进入下一轮上下文，否则模型无法基于真实世界反馈继续推理。
- Runtime 应该记录完整轨迹，便于调试和审计。

Java / 后端类比：

- `Observation` 类似外部服务调用结果。
- `Trajectory` 类似一次业务流程的 trace log。

今日输出：

- 写出一个“Agent 修复单元测试失败”的 ReAct 轨迹示例。

自测问题：

- 如果工具执行失败，Observation 应该如何表达给模型？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
