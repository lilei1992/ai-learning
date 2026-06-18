# Day 04：State Machine（状态机）视角理解 Agent

> 所属周：Week 01 - Agent 基础模型
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 03`](../week-01-agent-basics/day-03-react-reasoning-and-acting.md) ｜ 下一天：[`Day 05`](../week-01-agent-basics/day-05-messages-memory-transcript.md)

## 1. 今日核心目标

今天只解决一个核心问题：

> 为什么生产级 Agent 必须被看成 `State Machine（状态机）`，而不是一段随意运行的 while 循环？

学完今天，你应该能做到：

- 解释 Agent 中的 `State（状态）`、`Transition（转移）`、`Terminal State（终止状态）`。
- 设计一个最小 Agent 状态机。
- 说清楚 `maxTurns（最大轮数）`、`timeout（超时）`、`stop reason（停止原因）` 的必要性。
- 理解状态机如何约束 Agent 的不确定性。
- 用订单状态机类比 Agent 状态机。

## 2. 今日不追求掌握的内容

今天不深入：

- 多 Agent 状态合并。
- 复杂任务图调度。
- 持久化恢复协议。
- 分布式事务。
- 形式化验证。

今天先建立基础状态模型。

## 3. 学习时间安排

### Busy Mode（忙碌模式，15-20 分钟）

只完成：

- 阅读第 4、5、6 节。
- 写出 5 个 Agent 状态。
- 回答 `maxTurns` 为什么必要。

### Standard Mode（标准模式，45 分钟）

| 时间 | 内容 |
|------|------|
| 0-10 分钟 | 理解状态机基本概念 |
| 10-25 分钟 | 阅读最小 Agent 状态机 |
| 25-35 分钟 | 对照订单状态机类比 |
| 35-45 分钟 | 完成今日输出和自测 |

### Deep Mode（深度模式，90 分钟）

额外完成：

- 画一个 Agent 状态转移图。
- 写一个状态对象结构草图。
- 列出 5 条 Agent 状态不变量。

## 4. 最小心智模型

Agent 任务不是一条直线，而是多轮状态推进：

```text
READY
-> THINKING
-> TOOL_REQUESTED
-> TOOL_RUNNING
-> OBSERVING
-> THINKING
-> ANSWERING
-> DONE
```

也可能进入失败路径：

```text
TOOL_RUNNING
-> TOOL_FAILED
-> RECOVERING
-> THINKING
```

或者终止路径：

```text
THINKING
-> MAX_TURNS_REACHED
-> STOPPED
```

状态机的价值是：

> 让 Agent 的动态行为变成可约束、可记录、可恢复的工程流程。

## 5. 概念拆解

### 5.1 State（状态）

`State` 表示当前任务推进到哪里，以及继续推进需要哪些信息。

常见字段：

- `goal`：用户目标。
- `messages`：当前上下文消息。
- `trajectory`：历史行动和观察。
- `turnCount`：已经执行的轮数。
- `pendingToolCall`：待执行工具。
- `lastObservation`：最近一次观察结果。
- `stopReason`：停止原因。
- `error`：当前错误。
- `permissions`：可用权限或已授权动作。

关键点：

> State 不是把所有东西都塞进去，而是保存推进任务所必需的最小事实。

### 5.2 Transition（状态转移）

`Transition` 是从一个状态进入另一个状态的规则。

示例：

| 当前状态 | 事件 | 下一个状态 |
|----------|------|------------|
| READY | 用户提交目标 | THINKING |
| THINKING | 模型输出工具调用 | TOOL_REQUESTED |
| TOOL_REQUESTED | 权限通过 | TOOL_RUNNING |
| TOOL_RUNNING | 工具成功 | OBSERVING |
| TOOL_RUNNING | 工具失败 | TOOL_FAILED |
| OBSERVING | 需要继续 | THINKING |
| THINKING | 模型输出最终答案 | ANSWERING |
| ANSWERING | 响应完成 | DONE |

状态转移应该明确：

- 触发事件是什么。
- 前置条件是什么。
- 成功后写入哪些字段。
- 失败后如何处理。
- 是否允许重试。

### 5.3 Terminal State（终止状态）

`Terminal State` 是任务不再继续自动推进的状态。

常见终止状态：

- `DONE`：任务正常完成。
- `FAILED`：发生不可恢复错误。
- `CANCELLED`：用户中断。
- `MAX_TURNS_REACHED`：达到最大轮数。
- `TIMEOUT`：超过时间限制。
- `PERMISSION_DENIED`：权限不允许。
- `NEEDS_USER_INPUT`：需要用户确认。

生产系统里，终止状态必须记录 `stopReason`。否则你只知道 Agent 停了，不知道为什么停。

### 5.4 Invariant（不变量）

`Invariant` 是任何状态下都必须成立的规则。

示例：

- `turnCount` 不能超过 `maxTurns` 后继续自动执行。
- 未授权的写操作不能进入 `TOOL_RUNNING`。
- 同一时刻不能并发写同一个文件。
- 工具失败不能被记录成成功 Observation。
- 最终回答不能声称未验证的结果已经通过。

不变量的作用：

> 把模型的不确定性限制在 Runtime 可控制的边界内。

## 6. 最小 Agent 状态机示例

```text
READY
  用户输入目标
  -> THINKING

THINKING
  模型决定需要工具
  -> TOOL_REQUESTED

TOOL_REQUESTED
  权限通过
  -> TOOL_RUNNING

TOOL_RUNNING
  工具返回结果
  -> OBSERVING

OBSERVING
  结果不足以完成目标
  -> THINKING

THINKING
  模型输出最终答案
  -> DONE
```

失败路径：

```text
TOOL_RUNNING
  工具超时
  -> TOOL_FAILED
  -> RECOVERING
  -> THINKING / FAILED
```

停止路径：

```text
THINKING
  turnCount >= maxTurns
  -> MAX_TURNS_REACHED
  -> STOPPED
```

## 7. 为什么不能只是 while 循环

一个天真的 Agent Loop 可能长这样：

```text
while not done:
  ask_model()
  run_tool()
```

问题是：

- 不知道当前到底处于哪一步。
- 工具失败时没有明确恢复策略。
- 权限拒绝后可能继续尝试危险动作。
- 没有最大轮数可能无限循环。
- 半更新状态可能导致重复执行副作用。
- 无法解释为什么停止。

状态机不是为了复杂，而是为了把这些问题显式化。

## 8. Java / 后端类比

最直接的类比是订单状态机：

```text
CREATED
-> PAID
-> FULFILLING
-> FULFILLED
-> CLOSED
```

订单系统不会允许：

- 未支付直接发货。
- 已关闭订单再次支付。
- 退款成功后仍然履约。
- 状态更新失败但通知下游成功。

Agent 也一样，不应该允许：

- 未授权直接执行写工具。
- 达到最大轮数还继续行动。
- 工具失败却输出“已完成”。
- 上下文缺失还继续做高风险判断。

相似点：

- 都需要明确状态、事件、转移和终止状态。
- 都要保护关键不变量。
- 都要记录状态变化原因。

不同点：

- 订单状态通常由业务规则驱动。
- Agent 状态中有一部分转移来自模型输出，更不稳定。
- Agent Runtime 需要额外处理模型输出解析失败、工具权限和上下文预算。

## 9. 状态设计原则

设计 Agent 状态时，优先遵守：

- 状态名要表达业务含义，不要只叫 `RUNNING`。
- 每个状态只允许有限的下一步。
- 所有终止都要有 `stopReason`。
- 写操作前必须经过权限状态。
- 工具执行结果必须原子写入轨迹。
- 重试次数和最大轮数要进入状态。
- 用户中断要能打断自动推进。

一个好的状态机应该让你能回答：

- 当前在哪一步？
- 为什么到了这里？
- 下一步允许做什么？
- 什么情况下必须停？
- 出错后怎么恢复？

## 10. 今日输出

设计一个简单 Agent 状态机，至少包含：

- 5 个状态。
- 6 条转移。
- 3 个终止状态。
- 3 条不变量。
- 1 个失败恢复路径。

建议格式：

```markdown
### 状态

- READY
- THINKING
- TOOL_REQUESTED
- TOOL_RUNNING
- OBSERVING
- DONE

### 转移

| 当前状态 | 事件 | 下一个状态 |
|----------|------|------------|
| READY | receive_goal | THINKING |

### 不变量

- 未授权工具不能进入 TOOL_RUNNING。
```

## 11. 通过标准

学完今天，你应该能回答：

- Agent 的 State 里至少应该保存哪些信息？
- `maxTurns` 为什么是必要的？
- 什么是 Terminal State？
- 为什么工具失败不能被吞掉？
- 状态机如何减少 Agent 的不可控行为？

## 12. 自测问题

1. 如果 Agent 正在执行写文件工具，用户点击取消，状态机应该如何转移？
2. 如果模型输出了非法工具参数，应该进入什么状态？
3. 为什么 `DONE` 和 `FAILED` 都是终止状态，但含义完全不同？
4. Agent 的状态不变量和订单系统的不变量有什么相似点？
5. 如果没有 `stopReason`，排查 Agent 失败会遇到什么问题？


## 1. 今日核心问题（标准化补充）

> 为什么要用 State Machine 理解 Agent？

这一节用于和后续周的学习结构对齐，帮助你快速进入当天主题。

## 5. 核心概念拆解（标准化补充）

- State（状态）：任务当前所处阶段和关键事实。
- Transition（状态转移）：从一个状态进入另一个状态的合法路径。
- Terminal State（终止状态）：DONE、FAILED、BLOCKED、CANCELLED 等不会继续推进的状态。
- Invariant（不变量）：任何状态下都不能被破坏的规则。

## 9. 今日实践任务（标准化补充）

设计一个最小 Agent 状态机，包含 RUNNING、WAITING_APPROVAL、DONE、FAILED、BLOCKED。

## 10. 自测问题与参考答案（标准化补充）

### Q1：maxTurns 为什么必要？

防止 Agent 无限循环、重复调用工具和成本失控。

### Q2：工具失败为什么不能吞掉？

失败是状态变化和下一轮决策依据，吞掉会制造假成功。

## 11. 常见坑（标准化补充）

- 把 Agent Loop 写成没有状态的 while 循环。
- 没有 stopReason。
- 失败后继续执行高风险动作。

## 12. 今日总结（标准化补充）

状态机把模型的不确定性限制在 Runtime 可控边界内。

## 13. 补充深度学习内容

后端开发者可以把 Agent State 类比成订单状态。模型输出类似事件建议，Runtime 状态机决定事件是否合法、状态能否转移、是否进入终止状态。

## 今日笔记

### 预习问题

- 为什么生产级 Agent 必须被看成 `State Machine（状态机）`，而不是一段随意运行的 while 循环？
- `State Machine（状态机）视角理解 Agent` 在 Agent Runtime 的哪个模块落地？
- 如果忽略 `State Machine（状态机）视角理解 Agent`，会造成什么工程风险？

### 主动回忆

1. 今日主题是 `State Machine（状态机）视角理解 Agent`，核心问题是：为什么生产级 Agent 必须被看成 `State Machine（状态机）`，而不是一段随意运行的 while 循环？
2. 关键概念包括：State（状态）、Transition（状态转移）、Terminal State（终止状态）。
3. 工程判断要落到 Runtime：谁负责决策、谁负责执行、谁负责记录、谁负责验证。

### 费曼输出

用 5 句话给一个 Java 后端同事讲清楚今天主题：

1. `State Machine（状态机）视角理解 Agent` 不是孤立术语，它要解决的是 Agent 从“会回答”走向“可执行、可控制、可验证”的问题。
2. 模型可以参与推理和生成候选动作，但 Runtime 必须负责边界、状态、权限、工具执行和审计。
3. 如果没有结构化设计，Agent 很容易出现假成功、重复行动、上下文污染或不可追踪失败。
4. 后端视角下，可以把它类比成服务编排、状态机、权限网关、审计日志或可观测性体系中的一个环节。
5. 学完今天，至少要能说清楚它的输入、输出、失败模式、验证方式和最小实现方案。

### 3 条要点

- State（状态）：先理解定义，再追问它在 Runtime 中由哪个组件负责。
- Transition（状态转移）：不要只停留在 prompt 层，要落实到 Schema、状态、策略、日志或流程里。
- 1. 如果 Agent 正在执行写文件工具，用户点击取消，状态机应该如何转移？

### Java / 后端类比

- 像后端系统先划清 Controller、Service、Gateway、DB 的职责边界；Agent 也要先划清 LLM、Runtime、Tool、State 的边界。

### 今日小练习

**练习目标**：把 `State Machine（状态机）视角理解 Agent` 从概念理解推进到可落地的工程设计。

**任务说明**：设计一个最小 Agent 状态机，包含 RUNNING、WAITING_APPROVAL、DONE、FAILED、BLOCKED。

**操作步骤**：

1. 先用 3 句话写清楚这个练习要解决的核心问题。
2. 列出涉及的关键概念：`State（状态）`、`Transition（状态转移）`、`Terminal State（终止状态）`。
3. 写出最小数据结构或流程图，优先使用表格、伪代码或 Mermaid。
4. 补充异常情况：失败、超时、权限不足、输入不完整、结果无法验证。
5. 写出最终输出物，并说明它如何被 Runtime 记录、验证或复用。

**建议输出物**：

```text
标题：State Machine（状态机）视角理解 Agent 小练习
目标：
输入：
核心流程：
关键数据结构：
失败场景：
验证方式：
还需要补充的问题：
```

**自检标准**：

- 能说清楚这个设计属于 Runtime 的哪个模块。
- 能区分模型建议、Runtime 决策、工具执行和状态变化。
- 至少包含 1 个失败场景和 1 个验证方式。
- 输出物能在 10 分钟内复述给一个 Java 后端同事。

### 还没想清楚的问题

- `State Machine（状态机）视角理解 Agent` 的最小可用实现需要哪些类、字段或接口？
- 这个能力上线后，失败时我应该通过哪些日志、Trace 或状态字段定位问题？

### 间隔复习

- D+1：不看资料，用 3 句话复述 `State Machine（状态机）视角理解 Agent` 的核心思想。
- D+3：补画一张小图，标出它和 Runtime 其他模块的关系。
- D+7：用一个 Java 后端场景重新解释它，并检查是否能说出风险和验证方式。
