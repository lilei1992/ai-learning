# Day 20：Tool Error Handling（工具错误处理）

> 所属周：Week 03 - Tool System 深入
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 19`](../week-03-tool-system/day-19-tool-scheduler.md) ｜ 下一天：[`Day 21`](../week-03-tool-system/day-21-week-03-review.md)

核心目标：

- 理解工具失败如何反馈、重试和终止。

关键概念：

- `Recoverable Error（可恢复错误）`：模型可修正参数或换方法。
- `Non-recoverable Error（不可恢复错误）`：权限不足、危险操作、系统故障。
- `Error Mapping（错误映射）`：把底层异常转换成模型可理解的错误。
- `Partial Failure（部分失败）`：多个工具中部分成功、部分失败。

需要理解：

- 不应把底层 stack trace 原样塞给模型。
- 错误要足够明确，让模型知道如何修正。
- 对写操作，失败后要考虑是否产生了部分副作用。

今日输出：

- 写一个工具错误映射表：IOException、Timeout、PermissionDenied、InvalidInput。

自测问题：

- 工具执行部分成功时，Agent 是否还能继续？需要哪些信息？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
