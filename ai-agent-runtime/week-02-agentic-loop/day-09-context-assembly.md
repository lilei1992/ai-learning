# Day 09：Context Assembly（上下文组装）

> 所属周：Week 02 - Agentic Loop 深入
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 08`](../week-02-agentic-loop/day-08-agentic-loop-structure.md) ｜ 下一天：[`Day 10`](../week-02-agentic-loop/day-10-model-invocation.md)

核心目标：

- 理解每一轮模型调用前，Runtime 如何组装上下文。

关键概念：

- `System Prompt（系统提示词）`：定义模型角色、行为边界和全局规则。
- `Developer Instruction（开发者指令）`：工程约束、工具使用规则、输出格式。
- `User Message（用户消息）`：用户当前目标。
- `Conversation History（对话历史）`：之前轮次的消息。
- `Tool Result（工具结果）`：工具执行返回的观察信息。
- `Project Context（项目上下文）`：代码库规则、文档、配置。

需要理解：

- 上下文组装决定模型“看见什么”。
- 错误或过量上下文会直接影响 Agent 质量。
- 上下文不是越多越好，而是越相关越好。

今日输出：

- 设计一个 `ContextBuilder` 的输入和输出。

自测问题：

- 为什么系统提示词不应该频繁变化？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
