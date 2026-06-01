# Day 05：Messages、Memory、Transcript 的区别

> 所属周：Week 01 - Agent 基础模型
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 04`](../week-01-agent-basics/day-04-state-machine-agent.md) ｜ 下一天：[`Day 06`](../week-01-agent-basics/day-06-agent-reliability-boundary.md)

核心目标：

- 分清 Agent 系统里的几种“记忆”。

关键概念：

- `Message（消息）`：模型上下文中的一条对话或工具结果。
- `Memory（记忆）`：跨会话保留的偏好、规则、项目知识。
- `Transcript（执行记录）`：完整记录一次会话发生过什么，通常用于审计和恢复。
- `Append-only Log（追加式日志）`：只追加不覆盖的记录方式，便于回放和审计。

需要理解：

- Message 是给模型看的，不一定永久保存。
- Memory 是长期知识，但必须谨慎写入，避免污染未来任务。
- Transcript 是事实记录，应该尽量完整。

Java / 后端类比：

- Message 类似当前请求上下文。
- Memory 类似配置、用户偏好、知识库。
- Transcript 类似操作日志 / Event Sourcing（事件溯源）。

今日输出：

- 写一个表格比较 Message、Memory、Transcript。

自测问题：

- 为什么不能把所有工具结果都写成长期 Memory？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
