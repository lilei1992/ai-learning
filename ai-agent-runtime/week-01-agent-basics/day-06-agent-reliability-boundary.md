# Day 06：Agent 的可靠性边界

> 所属周：Week 01 - Agent 基础模型
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 05`](../week-01-agent-basics/day-05-messages-memory-transcript.md) ｜ 下一天：[`Day 07`](../week-01-agent-basics/day-07-week-01-review.md)

核心目标：

- 理解 Agent 的可靠性不是只靠模型能力，而是靠工程边界。

关键概念：

- `Reliability（可靠性）`：系统稳定完成目标的能力。
- `Guardrail（护栏）`：限制模型行为、防止危险动作的规则和机制。
- `Fallback（降级）`：失败后切换到更保守策略。
- `Idempotency（幂等性）`：重复执行不会造成额外副作用。

需要理解：

- 模型输出不稳定，Runtime 必须承担稳定性责任。
- 工具执行要考虑超时、重试、幂等和失败恢复。
- Agent 应避免“看起来完成了，但实际失败”的假成功。

Java / 后端类比：

- Guardrail 类似参数校验、权限校验、状态机约束。
- Fallback 类似 Feign fallback、熔断降级。
- Idempotency 类似 MQ 消费幂等。

今日输出：

- 总结 Agent 可靠性的 5 个工程手段。

自测问题：

- 为什么 Agent 执行写操作时必须考虑幂等？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
