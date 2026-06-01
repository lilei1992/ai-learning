# Day 48：Failure Handling（失败处理）

> 所属周：Week 07 - Multi-Agent 深入
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 47`](../week-07-multi-agent/day-47-cost-control.md) ｜ 下一天：[`Day 49`](../week-07-multi-agent/day-49-week-07-review.md)

核心目标：

- 理解 Multi-Agent 的失败模式。

关键概念：

- `Partial Failure（部分失败）`：部分子任务失败。
- `Timeout（超时）`：子 Agent 未及时完成。
- `Inconsistent Output（不一致输出）`：结果格式或结论不一致。
- `Cancellation Propagation（取消传播）`：主任务取消后，子任务也要取消。

需要理解：

- Multi-Agent 要允许部分成功。
- 子 Agent 失败不能直接导致主任务假成功。
- 失败信息应进入最终报告，而不是被隐藏。

今日输出：

- 设计 Multi-Agent 失败处理表。

自测问题：

- 3 个子 Agent 中 1 个失败，最终结果应该如何表达？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
