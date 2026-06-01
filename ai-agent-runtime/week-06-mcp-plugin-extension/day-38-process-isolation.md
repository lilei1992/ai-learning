# Day 38：Process Isolation（进程隔离）

> 所属周：Week 06 - MCP / Plugin / Extension
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 37`](../week-06-mcp-plugin-extension/day-37-json-rpc.md) ｜ 下一天：[`Day 39`](../week-06-mcp-plugin-extension/day-39-resource-vs-tool.md)

核心目标：

- 理解为什么 MCP Server 常作为独立进程运行。

关键概念：

- `Process Isolation（进程隔离）`：不同能力运行在独立进程，降低互相影响。
- `Stdio（标准输入输出）`：通过 stdin/stdout 通信。
- `HTTP SSE（Server-Sent Events，服务端事件流）`：服务端持续推送事件。
- `Failure Containment（故障隔离）`：一个工具进程崩溃不应拖垮主 Runtime。

需要理解：

- 独立进程便于语言无关扩展。
- 进程隔离可以降低依赖冲突和崩溃影响。
- 但进程通信也引入超时、启动、心跳和清理问题。

今日输出：

- 总结 stdio 和 HTTP SSE 的适用场景。

自测问题：

- MCP Server 卡死时，Runtime 应该如何处理？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
