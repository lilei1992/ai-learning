# Day 37：JSON-RPC（JSON 远程过程调用）

> 所属周：Week 06 - MCP / Plugin / Extension
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 36`](../week-06-mcp-plugin-extension/day-36-mcp-basics.md) ｜ 下一天：[`Day 38`](../week-06-mcp-plugin-extension/day-38-process-isolation.md)

核心目标：

- 理解 MCP 常见通信基础。

关键概念：

- `JSON-RPC（JSON 远程过程调用）`：用 JSON 表达请求、响应和错误的 RPC 协议。
- `Request（请求）`：包含 method、params、id。
- `Response（响应）`：包含 result 或 error。
- `Notification（通知）`：不需要响应的消息。

需要理解：

- JSON-RPC 简单、跨语言、适合工具协议。
- 错误响应必须结构化，不能只给字符串。
- 请求 id 用于匹配响应。

今日输出：

- 写一个 `tools/list` 和 `tools/call` 的 JSON-RPC 示例。

自测问题：

- 为什么跨进程工具协议需要 request id？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
