# Day 41：MCP Error Handling（MCP 错误处理）

> 所属周：Week 06 - MCP / Plugin / Extension
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 40`](../week-06-mcp-plugin-extension/day-40-plugin-architecture.md) ｜ 下一天：[`Day 42`](../week-06-mcp-plugin-extension/day-42-week-06-review.md)

核心目标：

- 理解跨进程工具调用如何处理错误。

关键概念：

- `Transport Error（传输错误）`：连接断开、协议解析失败。
- `Protocol Error（协议错误）`：JSON-RPC 格式不合法。
- `Tool Error（工具错误）`：工具执行失败。
- `Timeout（超时）`：Server 未在预期时间返回。
- `Health Check（健康检查）`：检测 Server 是否可用。

需要理解：

- 不同错误层级处理方式不同。
- Runtime 要区分 Server 崩溃和工具业务失败。
- 错误必须映射成模型可理解、用户可审计的信息。

今日输出：

- 设计 MCP 调用错误分类表。

自测问题：

- MCP Server 启动失败，Agent 应该继续任务还是停止？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
