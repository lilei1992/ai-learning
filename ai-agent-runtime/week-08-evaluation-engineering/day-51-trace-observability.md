# Day 51：Trace 与 Observability（可观测性）

> 所属周：Week 08 - Evaluation 与工程落地
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 50`](../week-08-evaluation-engineering/day-50-agent-evaluation.md) ｜ 下一天：[`Day 52`](../week-08-evaluation-engineering/day-52-regression-test.md)

核心目标：

- 理解 Agent 执行过程必须可观测。

关键概念：

- `Trace（链路追踪）`：记录一次任务经过的所有步骤。
- `Span（跨度）`：trace 中一个具体操作，如模型调用、工具执行。
- `Metric（指标）`：成功率、延迟、token、错误率。
- `Log（日志）`：事件详情。
- `Observability（可观测性）`：通过日志、指标、trace 理解系统行为。

需要理解：

- Agent 出错时，必须知道是哪一轮、哪个工具、哪个输入导致。
- Trace 要串起模型调用和工具调用。
- 指标要能区分模型问题、工具问题、权限问题。

今日输出：

- 设计 Agent trace 字段结构。

自测问题：

- 如果 Agent 最终失败，trace 里至少要保留哪些信息？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
