# Day 33：Audit Log（审计日志）

> 所属周：Week 05 - Permission System 深入
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 32`](../week-05-permission-system/day-32-hooks.md) ｜ 下一天：[`Day 34`](../week-05-permission-system/day-34-security-failure-modes.md)

核心目标：

- 理解 Agent 动作必须可追溯。

关键概念：

- `Audit Log（审计日志）`：记录关键动作、操作者、时间、结果和原因。
- `Trace ID（链路 ID）`：串联一次任务中的所有事件。
- `Decision Record（决策记录）`：记录为什么允许或拒绝某动作。
- `Redaction（脱敏）`：日志中隐藏敏感信息。

审计字段建议：

```text
traceId
sessionId
toolName
inputSummary
riskLevel
permissionDecision
userApproval
startTime
endTime
resultStatus
errorCode
```

今日输出：

- 设计一个工具调用审计日志结构。

自测问题：

- 为什么不能把完整 Authorization header 写入审计日志？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
