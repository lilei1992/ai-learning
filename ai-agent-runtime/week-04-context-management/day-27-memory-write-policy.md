# Day 27：Memory Write Policy（记忆写入策略）

> 所属周：Week 04 - Context Management 深入
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 26`](../week-04-context-management/day-26-prompt-cache.md) ｜ 下一天：[`Day 28`](../week-04-context-management/day-28-week-04-review.md)

核心目标：

- 理解长期记忆不能随意写。

关键概念：

- `Long-term Memory（长期记忆）`：跨会话保留的信息。
- `Memory Write Policy（记忆写入策略）`：什么信息可以写入长期记忆。
- `User Preference（用户偏好）`：用户明确表达的长期偏好。
- `Project Rule（项目规则）`：项目约定、架构边界、测试命令。

需要理解：

- 长期记忆一旦污染，会影响未来很多任务。
- 事实类信息要有来源，偏好类信息要明确来自用户。
- 临时工具结果不应该写入长期记忆。

今日输出：

- 设计 5 条 Memory 写入规则和 5 条禁止写入规则。

自测问题：

- “这次测试失败了”是否应该写入长期记忆？为什么？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
