# Day 39：Resource 与 Tool 的区别

> 所属周：Week 06 - MCP / Plugin / Extension
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 38`](../week-06-mcp-plugin-extension/day-38-process-isolation.md) ｜ 下一天：[`Day 40`](../week-06-mcp-plugin-extension/day-40-plugin-architecture.md)

核心目标：

- 分清 MCP / Agent 里的资源和工具。

关键概念：

- `Resource（资源）`：可读取的信息，如文件、文档、数据库 schema。
- `Tool（工具）`：可执行动作，如查询、写入、调用 API。
- `Read-only Capability（只读能力）`：不会修改外部状态。
- `Mutation Capability（变更能力）`：会产生副作用。

需要理解：

- Resource 通常风险较低，但可能涉及敏感数据。
- Tool 风险更高，因为可能修改状态或触发外部动作。
- 能设计成 Resource 的，不一定要设计成 Tool。

今日输出：

- 给数据库场景设计 3 个 Resource 和 3 个 Tool。

自测问题：

- “查看订单表结构”和“修改订单状态”为什么应该是不同能力？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
