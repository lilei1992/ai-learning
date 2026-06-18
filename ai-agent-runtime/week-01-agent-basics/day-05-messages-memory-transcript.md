# Day 05：Messages、Memory、Transcript 的区别

> 所属周：Week 01 - Agent 基础模型
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 04`](../week-01-agent-basics/day-04-state-machine-agent.md) ｜ 下一天：[`Day 06`](../week-01-agent-basics/day-06-agent-reliability-boundary.md)

## 1. 今日核心目标

今天只解决一个核心问题：

> Agent 系统里的 `Message（消息）`、`Memory（记忆）`、`Transcript（执行记录）` 到底有什么区别？

学完今天，你应该能做到：

- 分清 Message、Memory、Transcript 的用途和生命周期。
- 解释为什么不能把所有工具结果都写成长期 Memory。
- 说明 Transcript 对审计、恢复、调试的价值。
- 说清楚哪些信息适合进入模型上下文，哪些只适合留在日志里。
- 用请求上下文、配置、操作日志类比三者。

## 2. 今日不追求掌握的内容

今天不深入：

- 向量数据库记忆检索。
- 长期记忆自动写入策略。
- 上下文压缩算法。
- Trace 可观测性平台。
- 隐私和数据保留合规细节。

这些会在 Context Management 和 Evaluation 阶段展开。

## 3. 学习时间安排

### Busy Mode（忙碌模式，15-20 分钟）

只完成：

- 阅读第 4、5、6 节。
- 写一个三列表格比较 Message、Memory、Transcript。
- 回答“为什么不能把所有工具结果写入 Memory？”

### Standard Mode（标准模式，45 分钟）

| 时间 | 内容 |
|------|------|
| 0-10 分钟 | 理解三类信息的定义 |
| 10-25 分钟 | 阅读生命周期和边界 |
| 25-35 分钟 | 做 Java / 后端类比 |
| 35-45 分钟 | 完成今日输出和自测 |

### Deep Mode（深度模式，90 分钟）

额外完成：

- 设计一个 Agent 任务的数据记录结构。
- 写出 Memory 写入白名单和禁止写入清单。
- 画出 Message、Memory、Transcript 的数据流。

## 4. 最小心智模型

先记住一句话：

> Message 是给当前模型调用看的，Memory 是给未来任务复用的，Transcript 是给人和系统回放事实的。

三者对比：

| 类型 | 主要用途 | 生命周期 | 是否一定给模型看 |
|------|----------|----------|------------------|
| Message | 当前上下文 | 短期 | 通常是 |
| Memory | 长期知识 | 跨会话 | 按需检索 |
| Transcript | 事实记录 | 长期或按策略保留 | 不一定 |

## 5. Message（消息）

`Message` 是模型上下文中的一条输入。

常见 Message：

- system 指令。
- user 请求。
- assistant 回复。
- tool call 请求。
- tool result 结果。
- 开发者或项目约束。

Message 的特点：

- 直接影响模型本次输出。
- 受 context window 限制。
- 可以被裁剪、摘要或压缩。
- 不一定适合长期保存。

例子：

```text
user: 修复这个测试失败
assistant: 我先运行相关测试
tool_result: UserServiceTest failed at line 42
```

关键边界：

> Message 是当前推理材料，不等于长期事实。

## 6. Memory（记忆）

`Memory` 是跨任务、跨会话复用的信息。

适合写入 Memory 的内容：

- 用户明确偏好，例如“回答用中文”。
- 项目稳定规则，例如“这个仓库使用 Java 8”。
- 长期有效的工作流，例如“提交前需要运行某个脚本”。
- 用户确认过的命名、架构、约束。

不适合写入 Memory 的内容：

- 一次性命令输出。
- 临时错误日志。
- 未验证的模型猜测。
- 某次任务中的中间判断。
- 可能包含敏感数据的工具结果。
- 会快速过期的信息。

Memory 的风险：

- 写错后会污染未来任务。
- 过多 Memory 会干扰当前目标。
- 旧 Memory 可能和新项目事实冲突。
- 自动写入可能保存敏感信息。

一句话：

> Memory 应该是经过筛选的长期知识，不是垃圾桶。

## 7. Transcript（执行记录）

`Transcript` 是一次 Agent 会话或任务的完整事实记录。

它通常记录：

- 用户输入。
- 模型输出。
- 工具调用。
- 工具参数。
- 工具结果摘要。
- 权限决策。
- 错误和重试。
- 停止原因。
- 时间、耗时、token、成本。

Transcript 的价值：

- 审计：知道 Agent 做过什么。
- 调试：知道错误发生在哪一步。
- 恢复：中断后可以继续。
- 评估：用于回归测试和质量分析。
- 问责：区分用户指令、模型决策、工具失败和权限拒绝。

关键边界：

> Transcript 是事实日志，不一定全部进入模型上下文。

## 8. 三者的数据流

一个简化流程：

```text
User Goal
-> Message 进入当前上下文
-> Model 输出 Tool Call
-> Runtime 执行工具
-> Tool Result 作为 Message 返回模型
-> 完整过程写入 Transcript
-> 只有稳定、确认、可复用的信息才可能写入 Memory
```

注意：

- Transcript 通常最完整。
- Message 通常最贴近当前推理。
- Memory 应该最克制。

## 9. Java / 后端类比

可以这样类比：

| Agent 概念 | Java / 后端类比 |
|------------|------------------|
| Message | 当前请求上下文 / Controller 入参 / 调用链上下文 |
| Memory | 用户偏好 / 项目配置 / 知识库 |
| Transcript | 操作日志 / 审计日志 / Event Sourcing 日志 |

相似点：

- 请求上下文只服务当前请求，不应该无限保留。
- 配置和偏好会影响未来行为，所以写入必须谨慎。
- 操作日志用于排查和审计，不等于每次都参与业务计算。

不同点：

- Message 会直接影响模型生成，污染风险更高。
- Memory 可能被语义检索召回，不一定是精确匹配。
- Transcript 可能很大，需要脱敏、压缩和保留策略。

## 10. 为什么不能把所有工具结果都写成 Memory

原因：

- 工具结果通常是临时事实。
- 日志和错误可能很快过期。
- 大量低价值内容会稀释真正重要的记忆。
- 未来任务可能错误引用旧结果。
- 工具输出可能包含敏感数据。
- 未验证结果会变成长期错误。

例子：

```text
今天测试失败：UserServiceTest line 42
```

这适合进入 Transcript，也可能短期作为 Message 使用，但通常不适合成为长期 Memory。

更适合 Memory 的是：

```text
该项目新增 Java 类要求包含类级注释，author 使用 LiLei。
```

前提是它被项目文档或用户明确确认。

## 11. 今日输出

写一个对比表，至少包含：

- 定义。
- 生命周期。
- 谁使用。
- 是否进入模型上下文。
- 写入风险。
- 例子。

建议格式：

```markdown
| 类型 | 定义 | 生命周期 | 例子 | 风险 |
|------|------|----------|------|------|
| Message |  |  |  |  |
| Memory |  |  |  |  |
| Transcript |  |  |  |  |
```

Deep Mode 额外输出：

- 列出 5 条 Memory 写入规则。
- 列出 5 类必须保留在 Transcript 的事件。

## 12. 通过标准

学完今天，你应该能回答：

- Message、Memory、Transcript 的一句话区别是什么？
- 为什么 Memory 写入必须谨慎？
- Transcript 为什么不等于 Message？
- 工具结果默认应该进入哪里？
- 哪些信息适合跨会话保留？

## 13. 自测问题

1. 用户说“以后都用中文回答”，应该写入 Message、Memory 还是 Transcript？
2. 一次测试失败日志应该写入 Memory 吗？为什么？
3. 如果 Agent 误把未验证猜测写入 Memory，会有什么后果？
4. Transcript 对问题排查有什么价值？
5. 为什么不是所有 Transcript 都应该进入下一轮模型上下文？


## 1. 今日核心问题（标准化补充）

> Message、Memory、Transcript 为什么不能混用？

这一节用于和后续周的学习结构对齐，帮助你快速进入当天主题。

## 5. 核心概念拆解（标准化补充）

- Message（消息）：当前会话中模型可见的对话内容。
- Memory（记忆）：跨会话保留的长期信息。
- Transcript（执行记录）：工具调用、参数、结果和状态变化的事实账本。
- Context（上下文）：本轮模型调用精选出来的信息。

## 9. 今日实践任务（标准化补充）

把一次工具调用结果分别判断：哪些进 Transcript，哪些能进 Context，哪些不应该进 Memory。

## 10. 自测问题与参考答案（标准化补充）

### Q1：为什么 Memory 写入要保守？

Memory 会长期影响未来任务，错误写入会持续污染后续决策。

### Q2：Transcript 为什么不等于 Message？

Transcript 面向审计和恢复，Message 面向模型当前上下文。

## 11. 常见坑（标准化补充）

- 把所有历史都写入 Memory。
- 把完整 Transcript 塞回上下文。
- 把未验证猜测当长期事实。

## 12. 今日总结（标准化补充）

Memory 要保守，Transcript 要完整，Context 要精选。

## 13. 补充深度学习内容

三者的边界决定 Agent 的长期质量。Transcript 是事实源，Memory 是长期影响源，Context 是当下决策输入。混用会导致上下文膨胀、长期污染和审计缺失。

## 今日笔记

### 预习问题

- Agent 系统里的 `Message（消息）`、`Memory（记忆）`、`Transcript（执行记录）` 到底有什么区别？
- `Messages、Memory、Transcript 的区别` 在 Agent Runtime 的哪个模块落地？
- 如果忽略 `Messages、Memory、Transcript 的区别`，会造成什么工程风险？

### 主动回忆

1. 今日主题是 `Messages、Memory、Transcript 的区别`，核心问题是：Agent 系统里的 `Message（消息）`、`Memory（记忆）`、`Transcript（执行记录）` 到底有什么区别？
2. 关键概念包括：system 指令。、user 请求。、assistant 回复。。
3. 工程判断要落到 Runtime：谁负责决策、谁负责执行、谁负责记录、谁负责验证。

### 费曼输出

用 5 句话给一个 Java 后端同事讲清楚今天主题：

1. `Messages、Memory、Transcript 的区别` 不是孤立术语，它要解决的是 Agent 从“会回答”走向“可执行、可控制、可验证”的问题。
2. 模型可以参与推理和生成候选动作，但 Runtime 必须负责边界、状态、权限、工具执行和审计。
3. 如果没有结构化设计，Agent 很容易出现假成功、重复行动、上下文污染或不可追踪失败。
4. 后端视角下，可以把它类比成服务编排、状态机、权限网关、审计日志或可观测性体系中的一个环节。
5. 学完今天，至少要能说清楚它的输入、输出、失败模式、验证方式和最小实现方案。

### 3 条要点

- system 指令。：先理解定义，再追问它在 Runtime 中由哪个组件负责。
- user 请求。：不要只停留在 prompt 层，要落实到 Schema、状态、策略、日志或流程里。
- 学完今天，你应该能回答：

### Java / 后端类比

- 像后端系统先划清 Controller、Service、Gateway、DB 的职责边界；Agent 也要先划清 LLM、Runtime、Tool、State 的边界。

### 今日小练习

**练习目标**：把 `Messages、Memory、Transcript 的区别` 从概念理解推进到可落地的工程设计。

**任务说明**：把一次工具调用结果拆分到 Message、Context、Memory、Transcript 四类中。

**操作步骤**：

1. 先用 3 句话写清楚这个练习要解决的核心问题。
2. 列出涉及的关键概念：`system 指令`、`Runtime 边界`、`验证方式`。
3. 写出最小数据结构或流程图，优先使用表格、伪代码或 Mermaid。
4. 补充异常情况：失败、超时、权限不足、输入不完整、结果无法验证。
5. 写出最终输出物，并说明它如何被 Runtime 记录、验证或复用。

**建议输出物**：

```text
标题：Messages、Memory、Transcript 的区别 小练习
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

- `Messages、Memory、Transcript 的区别` 的最小可用实现需要哪些类、字段或接口？
- 这个能力上线后，失败时我应该通过哪些日志、Trace 或状态字段定位问题？

### 间隔复习

- D+1：不看资料，用 3 句话复述 `Messages、Memory、Transcript 的区别` 的核心思想。
- D+3：补画一张小图，标出它和 Runtime 其他模块的关系。
- D+7：用一个 Java 后端场景重新解释它，并检查是否能说出风险和验证方式。
