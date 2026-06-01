# Day 47：Cost Control（成本控制）

> 所属周：Week 07 - Multi-Agent 深入
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 46`](../week-07-multi-agent/day-46-result-aggregation.md) ｜ 下一天：[`Day 48`](../week-07-multi-agent/day-48-failure-handling.md)

核心目标：

- 理解 Multi-Agent 为什么容易成本失控。

关键概念：

- `Cost Control（成本控制）`：限制 token、模型调用次数、工具调用次数。
- `Budget（预算）`：为任务设定最大资源消耗。
- `Fan-out（扇出）`：一个任务拆出多个并行子任务。
- `Runaway Agent（失控 Agent）`：持续调用模型或工具无法停止。

需要理解：

- 子 Agent 数量越多，token 和工具成本增长越快。
- 每个子 Agent 都需要 maxTurns、timeout、tool budget。
- 主 Agent 要能取消低价值子任务。

今日输出：

- 设计 Multi-Agent 预算策略：最大子 Agent 数、每个子 Agent 最大轮数、总 token 限制。

自测问题：

- 为什么不能让子 Agent 再无限派生子 Agent？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
