# Day 24：Tool Result Budget（工具结果预算）

> 所属周：Week 04 - Context Management 深入
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 23`](../week-04-context-management/day-23-context-pollution.md) ｜ 下一天：[`Day 25`](../week-04-context-management/day-25-context-compaction.md)

核心目标：

- 掌握工具结果进入上下文前的预算控制。

关键概念：

- `Result Truncation（结果截断）`：超过预算时保留前后关键片段。
- `Summarization（摘要）`：用更短内容表达主要信息。
- `Pagination（分页）`：只返回一部分结果，需要时继续请求。
- `Reference（引用）`：结果存文件或缓存，上下文只放引用位置。

需要理解：

- Grep/Search 类工具最容易产生大量结果。
- 大文件读取应该限制行数或范围。
- 工具结果要保留“可继续定位”的信息，如文件路径、行号、错误码。

今日输出：

- 设计一个 `ToolResultBudgetPolicy`：按工具类型限制最大 token。

自测问题：

- 如果搜索命中 500 个结果，应该怎样返回给模型？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
