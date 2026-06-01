# Day 52：Regression Test（回归测试）

> 所属周：Week 08 - Evaluation 与工程落地
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 51`](../week-08-evaluation-engineering/day-51-trace-observability.md) ｜ 下一天：[`Day 53`](../week-08-evaluation-engineering/day-53-cost-and-latency.md)

核心目标：

- 理解 Agent 如何做回归测试。

关键概念：

- `Regression Test（回归测试）`：防止已修复能力再次坏掉。
- `Deterministic Assertion（确定性断言）`：能用程序判断对错。
- `LLM-as-Judge（LLM 作为评审）`：用另一个模型评估输出质量。
- `Flaky Test（不稳定测试）`：结果随机波动的测试。

需要理解：

- Agent 测试天然更容易 flaky。
- 应尽量把关键结果结构化，减少主观判断。
- LLM-as-Judge 可以辅助，但不能完全替代确定性断言。

今日输出：

- 为“代码审查 Agent”设计 5 个回归测试用例。

自测问题：

- 哪些 Agent 测试可以用确定性断言？哪些不能？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
