# Day 02：Chat API、Workflow、Agent 的区别

> 所属周：Week 01 - Agent 基础模型
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 01`](../week-01-agent-basics/day-01-ai-agent-runtime.md) ｜ 下一天：[`Day 03`](../week-01-agent-basics/day-03-react-reasoning-and-acting.md)

核心目标：

- 分清 `Chat API（聊天接口）`、`Workflow（工作流）`、`Agent（智能体）`。

关键概念：

- `Chat API（聊天接口）`：一次请求一次响应，控制流主要由调用方决定。
- `Workflow（工作流）`：预先定义好步骤，例如 `A -> B -> C`，模型只在某些节点做判断。
- `Agent（智能体）`：步骤不完全预设，模型可以根据观察结果决定下一步动作。
- `Deterministic Flow（确定性流程）`：流程路径主要由程序规则决定。
- `Dynamic Planning（动态规划）`：下一步由模型根据当前状态和目标推断。

需要理解：

- Workflow 更可控，适合稳定业务流程。
- Agent 更灵活，适合开放式任务，但更难测试和控制。
- 生产系统常常不是纯 Agent，而是 `Workflow + Agent` 混合架构。

Java / 后端类比：

- Workflow 类似审批流、订单状态流、定时任务管道。
- Agent 类似一个会根据外部结果动态选择服务调用路径的应用服务。

今日输出：

- 画一个三列表格：`Chat API`、`Workflow`、`Agent` 的输入、控制流、适用场景、风险。

自测问题：

- “自动生成周报”更适合 Workflow 还是 Agent？为什么？
- “分析一个陌生代码库并提出重构建议”更适合 Workflow 还是 Agent？为什么？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
