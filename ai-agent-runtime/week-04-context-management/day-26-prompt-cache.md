# Day 26：Prompt Cache（提示词缓存）

> 所属周：Week 04 - Context Management 深入
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 25`](../week-04-context-management/day-25-context-compaction.md) ｜ 下一天：[`Day 27`](../week-04-context-management/day-27-memory-write-policy.md)

核心目标：

- 理解缓存对成本和延迟的影响。

关键概念：

- `Prompt Cache（提示词缓存）`：复用相同前缀 prompt，降低成本或延迟。
- `Cache Boundary（缓存边界）`：缓存可复用的文本边界。
- `Stable Prefix（稳定前缀）`：不频繁变化的上下文前半部分。
- `Cache Invalidation（缓存失效）`：上下文变化导致缓存不能复用。

需要理解：

- 系统提示词、项目规则适合作为稳定前缀。
- 频繁变化的工具结果放前面会破坏缓存。
- Context 组织顺序会影响缓存命中。

今日输出：

- 设计一种上下文排列顺序，提高 prompt cache 命中率。

自测问题：

- 为什么系统规则适合放在上下文前部？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
