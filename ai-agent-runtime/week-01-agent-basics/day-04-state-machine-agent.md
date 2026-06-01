# Day 04：State Machine（状态机）视角理解 Agent

> 所属周：Week 01 - Agent 基础模型
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 03`](../week-01-agent-basics/day-03-react-reasoning-and-acting.md) ｜ 下一天：[`Day 05`](../week-01-agent-basics/day-05-messages-memory-transcript.md)

核心目标：

- 用 `State Machine（状态机）` 理解 Agentic Loop。

关键概念：

- `State（状态）`：当前任务的所有必要信息，如 messages、turn count、tool results、stop reason。
- `Transition（状态转移）`：根据模型输出和工具结果，生成下一个状态。
- `Terminal State（终止状态）`：任务完成、用户中断、达到最大轮数、发生不可恢复错误。
- `Invariant（不变量）`：任何时候都必须成立的规则，例如工具执行中不能并发写同一文件。

需要理解：

- Agent 不是“随便聊”，而是一个不断转移状态的系统。
- 状态要尽量原子更新，避免半更新导致不一致。
- 停止条件必须明确，否则 Agent 可能无限循环。

Java / 后端类比：

- 订单状态机：`CREATED -> PAID -> FULFILLED -> CLOSED`。
- Agent 状态机：`PLANNING -> TOOL_CALLING -> OBSERVING -> ANSWERING -> DONE`。

今日输出：

- 设计一个简单 Agent 状态机，至少包含 5 个状态和 6 条转移。

自测问题：

- Agent 的 `maxTurns（最大轮数）` 为什么是必要的？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
