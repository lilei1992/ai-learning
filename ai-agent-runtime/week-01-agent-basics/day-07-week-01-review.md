# Day 07：Week 1 复盘

> 所属周：Week 01 - Agent 基础模型
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 06`](../week-01-agent-basics/day-06-agent-reliability-boundary.md) ｜ 下一天：[`Day 08`](../week-02-agentic-loop/day-08-agentic-loop-structure.md)

## 1. 今日核心目标

今天不学新概念，只做一件事：

> 把 Week 1 的 Agent 基础模型串成一个完整 mental model（心智模型）。

复盘完成后，你应该能做到：

- 不看资料解释 Chat API、Workflow、Agent、Runtime 的区别。
- 写出一个最小 Agentic Loop 伪代码。
- 画出 `User Goal -> Runtime -> Model -> Tool -> Observation -> Answer` 的主流程。
- 说清楚 Message、Memory、Transcript 的区别。
- 总结生产级 Agent Runtime 至少需要哪些工程边界。

## 2. 本周知识地图

Week 1 的 6 个主题不是平铺关系，而是逐层搭建：

```text
Day 01：Agent Runtime 是什么
  -> 建立 Application / LLM / Runtime / Agent 的职责边界

Day 02：Chat API、Workflow、Agent 的区别
  -> 分清一次性回答、固定流程、动态行动

Day 03：ReAct 模型
  -> 理解 Agent 如何通过 Thought / Action / Observation 推进

Day 04：状态机视角
  -> 用 State / Transition / Terminal State 约束 Agent 行为

Day 05：Messages、Memory、Transcript
  -> 分清当前上下文、长期知识、执行记录

Day 06：可靠性边界
  -> 理解 Guardrail / Fallback / Idempotency / Verification / Audit
```

一句话串起来：

> Agent Runtime 是一个围绕目标持续推进任务的执行内核，它通过 ReAct 循环调用工具，通过状态机控制流程，通过上下文和记录系统管理信息，通过可靠性边界防止模型不确定性变成生产事故。

## 3. 一张总图

建议你手画或用文本画出下面的结构：

```text
User Goal
  |
  v
Application
  |
  v
Agent Runtime
  |
  +-- Context Assembly
  |     +-- Messages
  |     +-- Retrieved Memory
  |     +-- Relevant Transcript Summary
  |
  +-- Model Invocation
  |     +-- Reasoning
  |     +-- Tool Call / Final Answer
  |
  +-- Permission Control
  |     +-- Guardrail
  |     +-- Human Confirmation
  |
  +-- Tool Execution
  |     +-- Read / Search / Run / Write
  |     +-- Timeout / Retry / Idempotency
  |
  +-- Observation
  |     +-- Tool Result
  |     +-- Error Summary
  |
  +-- State Management
  |     +-- turnCount
  |     +-- stopReason
  |     +-- terminal state
  |
  +-- Transcript / Audit
        +-- actions
        +-- permissions
        +-- errors
        +-- verification evidence
```

## 4. 核心概念对照表

| 概念 | 一句话解释 | 后端类比 | 关键风险 |
|------|------------|----------|----------|
| LLM | 语言理解、推理、生成引擎 | 不可信的决策组件 | 幻觉、输出不稳定 |
| Application | 面向用户的产品入口 | Web 应用 / 控制台 | 体验和业务规则混杂 |
| Runtime | 控制 Agent 执行的内核 | 应用服务编排 + 基础设施 | 权限、状态、上下文失控 |
| Agent | 面向目标持续行动的执行者 | 长任务处理器 | 无边界行动 |
| Workflow | 预设步骤的流程 | 审批流 / 状态流 | 灵活性不足 |
| ReAct | 推理、行动、观察循环 | 外部调用后决策下一步 | 重复行动、观察污染 |
| State Machine | 状态和转移规则 | 订单状态机 | 死循环、半更新 |
| Message | 当前模型上下文 | 请求上下文 | 上下文污染 |
| Memory | 跨会话长期知识 | 用户偏好 / 项目配置 | 错误长期化 |
| Transcript | 完整执行记录 | 操作日志 / Event Sourcing | 敏感信息和体积 |
| Guardrail | 行为护栏 | 权限校验 / 参数校验 | 规则缺失 |
| Idempotency | 重复执行不产生额外副作用 | MQ / 支付幂等 | 重试导致重复写 |

## 5. 最小 Agent Runtime 伪代码

复盘时尝试默写下面的结构，再对照修正：

```text
state = init(goal)

while not terminal(state):
  if state.turnCount >= maxTurns:
    state.stopReason = "MAX_TURNS_REACHED"
    break

  context = assembleContext(
    goal,
    state.messages,
    relevantMemory,
    recentTrajectory
  )

  modelOutput = invokeModel(context)

  if modelOutput is finalAnswer:
    state.answer = modelOutput.answer
    state.stopReason = "DONE"
    break

  toolCall = parseToolCall(modelOutput)
  permission = checkPermission(toolCall)

  if permission denied:
    state.stopReason = "PERMISSION_DENIED"
    break

  observation = executeTool(toolCall)
  appendTranscript(toolCall, observation)
  updateState(state, observation)

  if observation failed and cannotRecover:
    state.stopReason = "FAILED"
    break

return finalResponse(state)
```

你需要能解释：

- 哪一步对应 Context Assembly。
- 哪一步对应 ReAct。
- 哪一步对应 Permission Control。
- 哪一步对应 Transcript。
- 哪一步防止无限循环。

## 6. 本周关键判断题

逐条判断，并写出理由：

1. Agent 本质上就是 Chat API 外面套一个循环。
2. Workflow 比 Agent 更低级。
3. 工具调用成功等于任务成功。
4. Memory 应该尽可能多写，方便未来使用。
5. Transcript 不需要进入模型上下文，也仍然有价值。
6. `maxTurns` 是可靠性机制，不只是成本控制。
7. Agent 最终回答“已完成”前，应该有验证证据。
8. Runtime 比模型更适合负责权限和审计。

建议答案方向：

- 1：不准确，循环只是表象，Runtime 还要处理状态、权限、上下文、工具、审计。
- 2：不准确，Workflow 更可控，Agent 更灵活，适用场景不同。
- 3：错误，工具成功只是步骤成功。
- 4：错误，Memory 写入必须克制。
- 5：正确，Transcript 是事实记录和审计基础。
- 6：正确，它同时防死循环、控成本、提升可诊断性。
- 7：正确，否则容易假成功。
- 8：正确，权限和审计应由确定性系统负责。

## 7. 今日输出

完成 3 个复盘产出。

### 7.1 总图

画出：

```text
User Goal -> Agent Runtime -> Context -> Model -> Tool -> Observation -> State Update -> Answer
```

要求标出：

- Message 在哪里进入。
- Memory 在哪里被检索。
- Transcript 在哪里写入。
- Permission 在哪里检查。
- stopReason 在哪里产生。

### 7.2 10 句话解释生产级 Agent Runtime

用 10 句话以内解释：

> 一个生产级 Agent Runtime 至少需要哪些模块，为什么？

必须包含：

- Context Assembly。
- Model Invocation。
- Tool System。
- Permission Control。
- State Management。
- Transcript / Audit。
- Error Recovery。
- Verification。

### 7.3 Week 2 问题清单

写下 3 个进入 Week 2 前最想搞清楚的问题。

示例：

- Agentic Loop 每一轮的输入输出边界是什么？
- 工具调用解析失败时应该如何恢复？
- 停止条件应该由模型决定，还是由 Runtime 决定？

## 8. 通过标准

你能做到下面 5 件事，就可以进入 Week 2：

- 不看资料解释 Chat API、Workflow、Agent 的区别。
- 用伪代码写出最小 Agent Loop。
- 说出 ReAct 的 3 个环节。
- 分清 Message、Memory、Transcript。
- 说出至少 5 个 Runtime 必须负责的工程问题。

如果做不到，不需要重学整周，只回看对应 Day：

| 卡住的问题 | 回看 |
|------------|------|
| 不知道 Runtime 是什么 | Day 01 |
| 分不清 Workflow 和 Agent | Day 02 |
| 不理解工具结果如何影响下一步 | Day 03 |
| 不知道 Agent 怎么停止 | Day 04 |
| 分不清记忆和日志 | Day 05 |
| 不知道为什么 Agent 会假成功 | Day 06 |

## 9. 自测问题

1. 为什么说 Runtime 是 Agent 系统的执行内核？
2. Workflow 和 Agent 各适合什么场景？
3. ReAct 中 Observation 质量差会造成什么问题？
4. Agent 状态机至少需要哪些终止状态？
5. Memory 写入策略为什么要保守？
6. Transcript 对审计和恢复有什么价值？
7. 写操作为什么需要权限、幂等和验证？
8. 一个 Agent 声称“任务完成”前，应该提供什么证据？


## 1. 今日核心问题（标准化补充）

> 第一周如何形成 Agent Runtime 的基础心智模型？

这一节用于和后续周的学习结构对齐，帮助你快速进入当天主题。

## 5. 核心概念拆解（标准化补充）

- Boundary Sense（边界感）：分清模型、Runtime、工具、状态、记忆和业务系统职责。
- Execution Kernel（执行内核）：Runtime 控制动作发生。
- Evidence（证据）：完成必须有工具结果或状态变化。
- Reliability Boundary（可靠性边界）：把模型不确定性限制在工程系统内。

## 9. 今日实践任务（标准化补充）

用 10 句话解释一个生产级 Agent Runtime 至少需要哪些模块。

## 10. 自测问题与参考答案（标准化补充）

### Q1：第一周最重要的一句话是什么？

Agent = LLM 的推理能力 + Runtime 的执行控制 + Tool 的外部能力 + State / Trace 的工程约束。

### Q2：为什么先学边界再学实现？

边界不清会导致模型、工具、状态和权限职责混乱，后续实现越复杂越危险。

## 11. 常见坑（标准化补充）

- 只记术语，不会判断职责边界。
- 把 Agent 当成更会聊天的模型。
- 忽略证据、状态和审计。

## 12. 今日总结（标准化补充）

第一周的目标是建立认知坐标系：哪些事让模型做，哪些事必须由 Runtime 控制。

## 13. 补充深度学习内容

复盘时不要追求背完整定义，而要能做工程判断：一个需求来了，是 Chat API、Workflow、Agent，还是 Workflow + Agent？一个动作来了，是模型建议、Runtime 授权，还是业务系统状态机执行？

## 今日笔记

### 预习问题

- 把 Week 1 的 Agent 基础模型串成一个完整 mental model（心智模型）。
- `Week 1 复盘` 在 Agent Runtime 的哪个模块落地？
- 如果忽略 `Week 1 复盘`，会造成什么工程风险？

### 主动回忆

1. 今日主题是 `Week 1 复盘`，核心问题是：把 Week 1 的 Agent 基础模型串成一个完整 mental model（心智模型）。
2. 关键概念包括：哪一步对应 Context Assembly。、哪一步对应 ReAct。、哪一步对应 Permission Control。。
3. 工程判断要落到 Runtime：谁负责决策、谁负责执行、谁负责记录、谁负责验证。

### 费曼输出

用 5 句话给一个 Java 后端同事讲清楚今天主题：

1. `Week 1 复盘` 不是孤立术语，它要解决的是 Agent 从“会回答”走向“可执行、可控制、可验证”的问题。
2. 模型可以参与推理和生成候选动作，但 Runtime 必须负责边界、状态、权限、工具执行和审计。
3. 如果没有结构化设计，Agent 很容易出现假成功、重复行动、上下文污染或不可追踪失败。
4. 后端视角下，可以把它类比成服务编排、状态机、权限网关、审计日志或可观测性体系中的一个环节。
5. 学完今天，至少要能说清楚它的输入、输出、失败模式、验证方式和最小实现方案。

### 3 条要点

- 哪一步对应 Context Assembly。：先理解定义，再追问它在 Runtime 中由哪个组件负责。
- 哪一步对应 ReAct。：不要只停留在 prompt 层，要落实到 Schema、状态、策略、日志或流程里。
- 第一周的目标是建立认知坐标系：哪些事让模型做，哪些事必须由 Runtime 控制。

### Java / 后端类比

- 像后端系统先划清 Controller、Service、Gateway、DB 的职责边界；Agent 也要先划清 LLM、Runtime、Tool、State 的边界。

### 今日小练习

**练习目标**：把 `Week 1 复盘` 从概念理解推进到可落地的工程设计。

**任务说明**：用 10 句话说明生产级 Agent Runtime 至少需要哪些模块，以及每个模块为什么必要。

**操作步骤**：

1. 先用 3 句话写清楚这个练习要解决的核心问题。
2. 列出涉及的关键概念：`哪一步对应 Context Assembly`、`Runtime 边界`、`验证方式`。
3. 写出最小数据结构或流程图，优先使用表格、伪代码或 Mermaid。
4. 补充异常情况：失败、超时、权限不足、输入不完整、结果无法验证。
5. 写出最终输出物，并说明它如何被 Runtime 记录、验证或复用。

**建议输出物**：

```text
标题：Week 1 复盘 小练习
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

- `Week 1 复盘` 的最小可用实现需要哪些类、字段或接口？
- 这个能力上线后，失败时我应该通过哪些日志、Trace 或状态字段定位问题？

### 间隔复习

- D+1：不看资料，用 3 句话复述 `Week 1 复盘` 的核心思想。
- D+3：补画一张小图，标出它和 Runtime 其他模块的关系。
- D+7：用一个 Java 后端场景重新解释它，并检查是否能说出风险和验证方式。
