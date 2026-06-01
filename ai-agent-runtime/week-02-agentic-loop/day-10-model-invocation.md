# Day 10：Model Invocation（模型调用）

> 所属周：Week 02 - Agentic Loop 深入
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 09`](../week-02-agentic-loop/day-09-context-assembly.md) ｜ 下一天：[`Day 11`](../week-02-agentic-loop/day-11-tool-call-parsing.md)

核心目标：

- 理解 Runtime 调用 LLM 时需要考虑哪些参数。

关键概念：

- `Model（模型）`：具体使用的 LLM。
- `Temperature（温度）`：控制输出随机性。
- `Max Tokens（最大输出 token）`：限制模型本轮输出长度。
- `Streaming（流式输出）`：模型边生成边返回。
- `Tool Choice（工具选择策略）`：允许、强制或禁止模型调用工具。

需要理解：

- Agent 场景通常更重视稳定性，不能盲目提高随机性。
- Streaming 可以降低等待感，也可以提前发现工具调用。
- 模型调用失败要有超时、重试和错误分类。

今日输出：

- 列出模型调用需要记录到 trace 的 8 个字段。

自测问题：

- 为什么 Agent 的模型调用日志不能记录敏感 prompt 原文？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
