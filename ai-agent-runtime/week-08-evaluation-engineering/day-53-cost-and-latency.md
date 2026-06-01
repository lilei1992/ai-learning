# Day 53：Cost and Latency（成本与延迟）

> 所属周：Week 08 - Evaluation 与工程落地
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 52`](../week-08-evaluation-engineering/day-52-regression-test.md) ｜ 下一天：[`Day 54`](../week-08-evaluation-engineering/day-54-human-experience.md)

核心目标：

- 理解 Agent 成本控制。

关键概念：

- `Latency（延迟）`：任务完成耗时。
- `Token Cost（token 成本）`：模型输入输出产生的成本。
- `Tool Cost（工具成本）`：外部 API、计算资源、数据库查询成本。
- `Budget Enforcement（预算执行）`：超过预算时停止或降级。

需要理解：

- Agent 多轮调用会放大成本。
- 工具并发能降低延迟，但会增加调度复杂度。
- 成本控制要前置，不应等账单异常才处理。

今日输出：

- 设计 Agent 成本指标表：input tokens、output tokens、tool calls、duration、retry count。

自测问题：

- 为什么 Multi-Agent 的成本增长不是线性的？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
