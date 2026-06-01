# Day 29：AI Action Authorization（AI 动作授权）

> 所属周：Week 05 - Permission System 深入
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 28`](../week-04-context-management/day-28-week-04-review.md) ｜ 下一天：[`Day 30`](../week-05-permission-system/day-30-permission-pipeline.md)

核心目标：

- 理解 Agent 安全的核心对象是“模型即将执行的动作”。

关键概念：

- `Authorization（授权）`：判断某个动作是否允许执行。
- `AI Action（AI 动作）`：模型提出的工具调用、文件修改、命令执行。
- `Risk Level（风险等级）`：动作可能造成损害的程度。
- `Human-in-the-loop（人在环路中）`：关键动作需要用户确认。

需要理解：

- 传统 Web 系统鉴权 HTTP 请求。
- Agent 系统鉴权模型动作。
- 高风险动作必须可解释、可确认、可审计。

今日输出：

- 列出 10 个 AI Action，并按低/中/高风险分类。

自测问题：

- “读取文件”和“上传文件到外部服务”的风险为什么不同？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
