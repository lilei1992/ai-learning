# Day 17：Tool Result（工具结果）设计

> 所属周：Week 03 - Tool System 深入
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 16`](../week-03-tool-system/day-16-input-schema.md) ｜ 下一天：[`Day 18`](../week-03-tool-system/day-18-concurrency-safe.md)

核心目标：

- 理解工具结果如何返回给模型和用户。

关键概念：

- `Structured Result（结构化结果）`：JSON、字段明确，便于解析。
- `Natural Language Result（自然语言结果）`：模型容易读，但程序难处理。
- `Error Result（错误结果）`：工具失败时的结构化错误。
- `Observation（观察结果）`：进入下一轮上下文的工具结果。

需要理解：

- 工具结果不是越完整越好，要控制长度。
- 大结果需要摘要、分页或引用文件。
- 错误结果要包含足够上下文，但不能泄露敏感信息。

今日输出：

- 设计一个统一 `ToolResult` 结构：success、data、errorCode、message、metadata。

自测问题：

- 为什么工具错误不能只返回 `"failed"`？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
