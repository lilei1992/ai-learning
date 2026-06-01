# Day 25：Context Compaction（上下文压缩）

> 所属周：Week 04 - Context Management 深入
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 24`](../week-04-context-management/day-24-tool-result-budget.md) ｜ 下一天：[`Day 26`](../week-04-context-management/day-26-prompt-cache.md)

核心目标：

- 理解多级压缩策略。

关键概念：

- `Compaction（压缩）`：减少上下文体积，同时保留关键语义。
- `Cheapest-first（成本最低优先）`：先做便宜、确定性强的压缩。
- `Lossy Compression（有损压缩）`：摘要可能丢失细节。
- `Lossless Reference（无损引用）`：正文不放上下文，但保留可追溯位置。

建议层级：

```text
L1: 限制工具结果长度
L2: 删除重复/过期消息
L3: 折叠中间步骤
L4: 结构化摘要
L5: LLM 摘要
```

今日输出：

- 设计一个 cheapest-first 压缩流程。

自测问题：

- 为什么 LLM 摘要应该放在最后，而不是第一步？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
