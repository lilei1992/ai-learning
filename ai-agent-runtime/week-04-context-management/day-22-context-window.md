# Day 22：Context Window（上下文窗口）

> 所属周：Week 04 - Context Management 深入
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 21`](../week-03-tool-system/day-21-week-03-review.md) ｜ 下一天：[`Day 23`](../week-04-context-management/day-23-context-pollution.md)

核心目标：

- 理解 LLM 的上下文窗口是有限资源。

关键概念：

- `Context Window（上下文窗口）`：模型一次请求能处理的最大 token 数。
- `Token（词元）`：模型处理文本的基本单位。
- `Prompt（提示词）`：发送给模型的输入。
- `Completion（补全内容）`：模型生成的输出。
- `Token Budget（token 预算）`：对输入和输出 token 的规划。

需要理解：

- 上下文窗口不是长期记忆。
- Token 越多，成本和延迟通常越高。
- 上下文满了以后，必须裁剪、压缩或摘要。

今日输出：

- 画出一次模型调用中 system、history、tool result、user message 的 token 占比图。

自测问题：

- 为什么“把整个项目代码都塞给模型”不是好方案？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
