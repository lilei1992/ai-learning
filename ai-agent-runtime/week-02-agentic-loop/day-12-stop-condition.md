# Day 12：Stop Condition（停止条件）

> 所属周：Week 02 - Agentic Loop 深入
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 11`](../week-02-agentic-loop/day-11-tool-call-parsing.md) ｜ 下一天：[`Day 13`](../week-02-agentic-loop/day-13-error-recovery.md)

核心目标：

- 理解 Agent 什么时候应该停止。

关键概念：

- `Stop Condition（停止条件）`：判断任务结束的规则。
- `Max Turns（最大轮数）`：限制最多执行多少轮。
- `End Turn（结束轮次）`：模型明确表示不再需要工具。
- `User Interrupt（用户中断）`：用户要求停止。
- `Unrecoverable Error（不可恢复错误）`：继续执行没有意义或有风险。

需要理解：

- 没有停止条件，Agent 可能无限调用工具。
- 停止不是只看模型说“完成”，还要看工具结果和任务目标。
- 对高风险操作，宁可停下来请求确认。

今日输出：

- 设计 6 条停止条件，并说明优先级。

自测问题：

- 为什么 `maxTurns` 不能设置得无限大？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
