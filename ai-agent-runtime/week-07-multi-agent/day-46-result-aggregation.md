# Day 46：Result Aggregation（结果汇总）

> 所属周：Week 07 - Multi-Agent 深入
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 45`](../week-07-multi-agent/day-45-context-isolation.md) ｜ 下一天：[`Day 47`](../week-07-multi-agent/day-47-cost-control.md)

核心目标：

- 理解多个子 Agent 结果如何合并。

关键概念：

- `Aggregation（汇总）`：把多个子结果合成最终答案。
- `Conflict Resolution（冲突解决）`：处理子 Agent 结论不一致。
- `Confidence（置信度）`：结果可信程度。
- `Evidence（证据）`：支持结论的文件、日志、测试结果。

需要理解：

- 子 Agent 输出必须带证据，否则主 Agent 难以判断可信度。
- 冲突不能简单平均，要回到证据。
- 汇总结果要区分事实、推断和建议。

今日输出：

- 设计一个子 Agent 返回结果模板：summary、evidence、risk、confidence、nextAction。

自测问题：

- 两个子 Agent 对同一代码风险判断相反时，主 Agent 怎么办？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
