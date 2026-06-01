# Day 13：Error Recovery（错误恢复）

> 所属周：Week 02 - Agentic Loop 深入
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 12`](../week-02-agentic-loop/day-12-stop-condition.md) ｜ 下一天：[`Day 14`](../week-02-agentic-loop/day-14-week-02-review.md)

核心目标：

- 理解 Agent Loop 中错误如何分类和恢复。

关键概念：

- `Transient Error（瞬时错误）`：网络抖动、临时超时，可重试。
- `Permanent Error（永久错误）`：参数错误、权限不足、文件不存在。
- `Retry Policy（重试策略）`：什么时候重试、重试几次、间隔多久。
- `Backoff（退避）`：失败后延迟更久再试，避免放大故障。
- `Circuit Breaker（熔断器）`：连续失败时停止调用某能力。

需要理解：

- 不是所有错误都应该重试。
- 工具错误要反馈给模型，但不能让模型无限试错。
- 恢复策略应该保守，尤其是写操作和外部副作用。

今日输出：

- 写一张错误分类表：错误类型、是否重试、是否反馈模型、是否停止。

自测问题：

- Bash 执行失败时，模型可以自动修改命令重试几次？边界在哪里？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
