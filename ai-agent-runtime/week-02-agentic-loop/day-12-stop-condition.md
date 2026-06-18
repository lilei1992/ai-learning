# Day 12：Stop Condition（停止条件）

> 所属周：Week 02 - Runtime 主循环实现  
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）  
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md) / [`本周 QA`](week-02-qa-summary.md)  
> 上一天：[`Day 11`](../week-02-agentic-loop/day-11-tool-call-parsing.md) ｜ 下一天：[`Day 13`](../week-02-agentic-loop/day-13-error-recovery.md)

## 1. 今日核心问题

> Agent 什么时候应该停止？

今天的学习目标不是背概念，而是把 `Stop Condition（停止条件）` 放到 Agent Runtime 的工程链路里理解。

学完今天，你应该能做到：

- 用自己的话解释：DONE、FAILED、BLOCKED、MAX_TURNS。
- 说明这个主题在 Runtime 中属于哪个模块。
- 说出至少 3 个工程风险。
- 用 Java / Spring Boot 后端系统做一个类比。
- 完成一个可以沉淀到项目设计里的小输出。

## 2. 今日不追求掌握的内容

今天先不追求完整实现生产系统，也不追求读论文。重点是建立工程判断：

- 这个模块解决什么问题。
- 它和 Runtime 其他模块如何协作。
- 如果设计不好，会造成什么线上风险。
- 最小可行版本应该做到什么程度。

## 3. 学习时间安排

| 模式 | 时间 | 做什么 |
|------|------|--------|
| Busy Mode | 15-20 分钟 | 阅读第 4、5、8 节，完成 2 个自测问题 |
| Standard Mode | 45 分钟 | 完整阅读，写 3 条要点和一个后端类比 |
| Deep Mode | 90 分钟 | 完成实践任务，补充类图、表结构或流程图 |

## 4. 最小心智模型

可以先记住这句话：

> Agent 什么时候应该停止？ 这个问题的答案，最终都要落到“如何让 Agent 更可控、更准确、更可验证”。

从 Runtime 视角看，今天主题和下面链路有关：

```text
User Goal
-> Context / State
-> Model Decision
-> Runtime Control
-> Tool / Memory / Permission / Trace
-> Observation
-> Next Step
```

不要只问“模型会不会”，要问：

- Runtime 给模型看了什么？
- 模型输出如何被解析和校验？
- 工具或状态是否真的发生变化？
- 失败时有没有记录和恢复？
- 最终结论有没有证据？

## 5. 核心概念拆解

### 5.1 DONE（完成）

目标满足且有验证证据。

它解决的问题：明确什么时候可以结束任务，而不是靠模型一句“完成了”。

工程落点：`TaskState.status = DONE` 前应检查验收条件、工具结果、文件状态或测试结果。

忽略后果：Agent 容易假完成，例如只修改了代码但没有运行测试，或者只回答了方案但没有执行。

### 5.2 FAILED（失败）

出现不可恢复错误或无法满足目标。

它解决的问题：把不可恢复失败显式暴露出来，而不是无限重试或伪成功。

工程落点：保存失败原因、失败步骤、最后 Observation、是否可重试、是否需要人工介入。

忽略后果：系统可能消耗大量资源反复尝试，也可能向用户隐藏真实失败原因。

### 5.3 BLOCKED（阻塞）

缺少用户确认、权限或外部依赖。

它解决的问题：区分“做不到”和“暂时不能继续”，例如缺少审批、账号未登录、需求不明确。

工程落点：`TaskState.status = BLOCKED`，同时记录 blocker 类型、需要谁处理、恢复条件。

忽略后果：Agent 可能在没有权限时绕路执行，或者在信息不足时继续猜测。

### 5.4 MAX_TURNS（最大轮数）

超过安全循环次数，防止无限执行。

它解决的问题：给自主循环设置硬边界，避免模型在工具失败或计划错误时无休止运行。

工程落点：`LoopController` 维护 turn count，并结合成本、时间、工具调用次数一起判断。

忽略后果：线上 Agent 可能产生不可控成本，也会让任务长时间占用资源。

## 6. 工程含义

今天主题的工程含义可以分成 5 层：

1. **边界**：明确模型、Runtime、工具、状态、用户各自负责什么。
2. **结构**：用接口、Schema、状态机、表结构或日志结构把能力固定下来。
3. **安全**：对高风险动作设置权限、审批、沙箱或只读限制。
4. **可恢复**：失败后能重试、降级、停止或交给用户处理。
5. **可验证**：最终结论必须能从工具结果、日志、状态或测试中找到证据。

## 7. Java / 后端类比

像订单状态机必须有终态：成功、失败、取消、超时都要明确，不能一直处理中。

你可以用下面的问题检查自己是否真的理解：

- 如果把它做成一个 Spring Bean，它的输入输出是什么？
- 它应该依赖哪些组件，不应该依赖哪些组件？
- 它的失败异常应该抛出、重试、降级还是记录？
- 它会不会影响数据库、Redis、MQ、ES 或外部系统状态？

## 8. 设计清单

学习今天主题时，至少检查这些设计点：

- 是否有清晰的输入和输出。
- 是否有结构化数据，而不是只靠自然语言。
- 是否能被记录到 Transcript / Trace。
- 是否能区分成功、失败、拒绝、超时和部分成功。
- 是否需要权限控制。
- 是否需要幂等或重试。
- 是否会污染上下文或 Memory。
- 是否能被测试和回放。

## 9. 今日实践任务

列出 8 种停止原因，并说明最终回答应该如何表达。

建议输出格式：

```text
目标：
输入：
输出：
核心流程：
异常情况：
需要记录的日志：
需要用户确认的场景：
```

## 10. 自测问题与参考答案

### Q1：Agent 什么时候应该停止？

先抓住本质：目标满足且有验证证据。 这个问题要落到工程实现上，而不是停留在术语解释。

### Q2：今天主题在 Java 后端里可以类比成什么？

像订单状态机必须有终态：成功、失败、取消、超时都要明确，不能一直处理中。

### Q3：今天最容易出错的工程点是什么？

把模型输出当成可信事实或可直接执行动作。正确做法是让 Runtime 做校验、记录、权限和验证。

### Q4：学完今天应该产出什么？

列出 8 种停止原因，并说明最终回答应该如何表达。

## 11. 常见坑

- 只会解释概念，但说不出它在 Runtime 里的位置。
- 只相信模型输出，没有结构化校验。
- 没有考虑失败、超时、权限和审计。
- 把所有信息都塞进上下文，导致模型被噪声干扰。
- 没有最终验证，却在回答里声称任务完成。

## 12. 今日总结

今天真正要记住的是：

> Agent 工程化不是让模型“更自由”，而是让模型的推理能力被 Runtime 安全、结构化、可追踪地使用。

## 13. 补充深度学习内容

### 13.1 Stop Condition 是 Agent 的刹车系统

没有停止条件的 Agent 很容易出现：

- 无限搜索。
- 重复读取同一个文件。
- 反复调用失败工具。
- 已经失败还继续执行。
- 用户取消后仍然写文件。
- 没有验证就声称完成。

所以停止条件不是附属功能，而是 Runtime 的基础安全机制。

### 13.2 常见停止原因

| stopReason | 含义 | 最终回答应该怎么说 |
|------------|------|-------------------|
| `DONE_VERIFIED` | 已完成并验证 | 明确说明验证证据 |
| `DONE_UNVERIFIED` | 完成但未验证 | 说明未验证原因 |
| `FAILED` | 不可恢复失败 | 说明失败原因和证据 |
| `BLOCKED_PERMISSION` | 权限不足 | 说明缺少什么权限 |
| `BLOCKED_USER_INPUT` | 需要用户确认 | 提出具体问题 |
| `CANCELLED` | 用户取消 | 说明已停止和已完成部分 |
| `TIMEOUT` | 超时 | 说明最后状态和建议 |
| `MAX_TURNS_REACHED` | 达到最大轮数 | 说明可能循环或无进展 |

### 13.3 Stop Policy 伪代码

```java
public StopDecision check(AgentState state) {
    if (state.isCancelled()) {
        return StopDecision.cancelled();
    }
    if (state.getTurn() >= maxTurns) {
        return StopDecision.maxTurnsReached();
    }
    if (state.hasUnrecoverableError()) {
        return StopDecision.failed(state.getLastError());
    }
    if (state.requiresUserInput()) {
        return StopDecision.blocked("Need user confirmation");
    }
    if (completionVerifier.isVerified(state)) {
        return StopDecision.doneVerified();
    }
    return StopDecision.continueRun();
}
```

注意：`DONE` 最好区分 verified 和 unverified。Agent 没跑测试就不能说“测试通过”。

### 13.4 Terminal State 设计

```text
RUNNING
-> DONE_VERIFIED
-> DONE_UNVERIFIED
-> FAILED
-> BLOCKED
-> CANCELLED
-> TIMEOUT
-> MAX_TURNS_REACHED
```

这些终态都表示“不再继续执行”，但业务含义完全不同。

后端类比：

- `PAY_SUCCESS` 和 `PAY_FAILED` 都是终态，但含义不同。
- `ORDER_CANCELLED` 和 `ORDER_FINISHED` 都不再流转，但不能混用。

### 13.5 Stop Condition 和最终回答

最终回答必须和停止原因一致：

```text
stopReason = DONE_VERIFIED
回答：已完成，并通过 mvn test 验证。

stopReason = DONE_UNVERIFIED
回答：代码已修改，但未运行测试，需要后续验证。

stopReason = BLOCKED_USER_INPUT
回答：发现两种业务语义，需要你确认 A 还是 B。

stopReason = MAX_TURNS_REACHED
回答：已达到最大执行轮数，目前证据如下，建议下一步人工确认。
```

### 13.6 今日实践输出方向

请写一个停止条件清单：

```text
1. 任务完成且验证通过 -> DONE_VERIFIED
2. 任务完成但无法验证 -> DONE_UNVERIFIED
3. 工具连续失败 -> FAILED
4. 缺少权限 -> BLOCKED_PERMISSION
5. 需要业务确认 -> BLOCKED_USER_INPUT
6. 用户取消 -> CANCELLED
7. 执行超时 -> TIMEOUT
8. 达到最大轮数 -> MAX_TURNS_REACHED
```

这份清单后续可以直接变成 `AgentStatus` 和 `stopReason` 枚举。

## 今日笔记

### 预习问题

- Agent 什么时候应该停止？
- `Stop Condition（停止条件）` 在 Agent Runtime 的哪个模块落地？
- 如果忽略 `Stop Condition（停止条件）`，会造成什么工程风险？

### 主动回忆

1. 今日主题是 `Stop Condition（停止条件）`，核心问题是：Agent 什么时候应该停止？
2. 关键概念包括：DONE（完成）、FAILED（失败）、BLOCKED（阻塞）。
3. 工程判断要落到 Runtime：谁负责决策、谁负责执行、谁负责记录、谁负责验证。

### 费曼输出

用 5 句话给一个 Java 后端同事讲清楚今天主题：

1. `Stop Condition（停止条件）` 不是孤立术语，它要解决的是 Agent 从“会回答”走向“可执行、可控制、可验证”的问题。
2. 模型可以参与推理和生成候选动作，但 Runtime 必须负责边界、状态、权限、工具执行和审计。
3. 如果没有结构化设计，Agent 很容易出现假成功、重复行动、上下文污染或不可追踪失败。
4. 后端视角下，可以把它类比成服务编排、状态机、权限网关、审计日志或可观测性体系中的一个环节。
5. 学完今天，至少要能说清楚它的输入、输出、失败模式、验证方式和最小实现方案。

### 3 条要点

- DONE（完成）：先理解定义，再追问它在 Runtime 中由哪个组件负责。
- FAILED（失败）：不要只停留在 prompt 层，要落实到 Schema、状态、策略、日志或流程里。
- Agent 工程化不是让模型“更自由”，而是让模型的推理能力被 Runtime 安全、结构化、可追踪地使用。

### Java / 后端类比

- 像一个带状态的 Spring Batch / Saga 流程：每一步根据上一步结果决定下一步，并且必须有停止条件。

### 今日小练习

**练习目标**：把 `Stop Condition（停止条件）` 从概念理解推进到可落地的工程设计。

**任务说明**：列出 8 种停止原因，并说明每种停止原因下最终回答应该如何表达。

**操作步骤**：

1. 先用 3 句话写清楚这个练习要解决的核心问题。
2. 列出涉及的关键概念：`DONE（完成）`、`FAILED（失败）`、`BLOCKED（阻塞）`。
3. 写出最小数据结构或流程图，优先使用表格、伪代码或 Mermaid。
4. 补充异常情况：失败、超时、权限不足、输入不完整、结果无法验证。
5. 写出最终输出物，并说明它如何被 Runtime 记录、验证或复用。

**建议输出物**：

```text
标题：Stop Condition（停止条件） 小练习
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

- `Stop Condition（停止条件）` 的最小可用实现需要哪些类、字段或接口？
- 这个能力上线后，失败时我应该通过哪些日志、Trace 或状态字段定位问题？

### 间隔复习

- D+1：不看资料，用 3 句话复述 `Stop Condition（停止条件）` 的核心思想。
- D+3：补画一张小图，标出它和 Runtime 其他模块的关系。
- D+7：用一个 Java 后端场景重新解释它，并检查是否能说出风险和验证方式。
