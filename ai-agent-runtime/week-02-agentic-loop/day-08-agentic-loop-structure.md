# Day 08：Agentic Loop（智能体主循环）结构

> 所属周：Week 02 - Agentic Loop 深入
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 07`](../week-01-agent-basics/day-07-week-01-review.md) ｜ 下一天：[`Day 09`](../week-02-agentic-loop/day-09-context-assembly.md)

核心目标：

- 拆解 Agentic Loop 的完整步骤。

关键概念：

- `Pre-processing（前置处理）`：加载规则、检查上下文预算、准备消息。
- `Model Invocation（模型调用）`：向 LLM 发送请求并接收输出。
- `Tool Call Parsing（工具调用解析）`：从模型输出中识别工具请求。
- `Tool Execution（工具执行）`：Runtime 执行工具并返回结果。
- `Post-processing（后置处理）`：更新状态、判断停止、记录日志。

标准循环：

```text
buildContext()
-> callModel()
-> parseToolCalls()
-> authorizeTools()
-> executeTools()
-> appendObservations()
-> checkStopCondition()
```

今日输出：

- 写一段 20 行以内的 Agentic Loop 伪代码。

自测问题：

- 哪些步骤必须由 Runtime 控制，而不能交给模型自由发挥？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
