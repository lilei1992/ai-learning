# Day 11：Tool Call Parsing（工具调用解析）

> 所属周：Week 02 - Agentic Loop 深入
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 10`](../week-02-agentic-loop/day-10-model-invocation.md) ｜ 下一天：[`Day 12`](../week-02-agentic-loop/day-12-stop-condition.md)

核心目标：

- 理解模型输出如何变成 Runtime 可执行的工具请求。

关键概念：

- `Tool Call（工具调用）`：模型请求执行某个工具。
- `Function Calling（函数调用）`：模型以结构化方式输出函数名和参数。
- `JSON Schema（JSON 结构定义）`：描述参数类型、必填字段、枚举值。
- `Validation（校验）`：执行前检查参数是否合法。

需要理解：

- 工具调用必须结构化，否则难以安全执行。
- 参数校验失败时，不应该直接执行。
- 校验错误应该反馈给模型，让模型有机会修正。

今日输出：

- 写一个 `SearchCodeTool` 的 JSON Schema 草图。

自测问题：

- 如果模型给了不存在的文件路径，Runtime 应该怎么处理？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
