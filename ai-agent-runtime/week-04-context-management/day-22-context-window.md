# Day 22：Context Window（上下文窗口）

> 所属周：Week 04 - Context Engineering 与 Memory  
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）  
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md) / [`本周 QA`](week-04-qa-summary.md)  
> 上一天：[`Day 21`](../week-03-tool-system/day-21-week-03-review.md) ｜ 下一天：[`Day 23`](../week-04-context-management/day-23-context-pollution.md)

## 1. 今日核心问题

> 模型一次能看多少信息，为什么这是一种稀缺资源？

今天的学习目标不是背概念，而是把 `Context Window（上下文窗口）` 放到 Agent Runtime 的工程链路里理解。

学完今天，你应该能做到：

- 用自己的话解释：Token、Context Window、Token Budget、Truncation。
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

> 模型一次能看多少信息，为什么这是一种稀缺资源？ 这个问题的答案，最终都要落到“如何让 Agent 更可控、更准确、更可验证”。

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

### 5.1 Token（词元）

模型计算文本的基本单位。

进一步理解这个概念时，建议追问三件事：

- 它解决的问题：避免 Agent 在缺少结构、缺少证据或缺少边界的情况下行动。
- 工程落点：它通常会落到接口、Schema、状态字段、策略规则、日志字段或执行流程中。
- 忽略后果：模型可能继续基于错误前提行动，造成假成功、越权、上下文污染或不可追踪失败。

### 5.2 Context Window（上下文窗口）

一次请求可容纳的输入和输出总量。

进一步理解这个概念时，建议追问三件事：

- 它解决的问题：避免 Agent 在缺少结构、缺少证据或缺少边界的情况下行动。
- 工程落点：它通常会落到接口、Schema、状态字段、策略规则、日志字段或执行流程中。
- 忽略后果：模型可能继续基于错误前提行动，造成假成功、越权、上下文污染或不可追踪失败。

### 5.3 Token Budget（Token 预算）

为规则、历史、工具结果、输出预留空间。

进一步理解这个概念时，建议追问三件事：

- 它解决的问题：避免 Agent 在缺少结构、缺少证据或缺少边界的情况下行动。
- 工程落点：它通常会落到接口、Schema、状态字段、策略规则、日志字段或执行流程中。
- 忽略后果：模型可能继续基于错误前提行动，造成假成功、越权、上下文污染或不可追踪失败。

### 5.4 Truncation（截断）

超限后信息被裁剪，可能丢失关键事实。

进一步理解这个概念时，建议追问三件事：

- 它解决的问题：避免 Agent 在缺少结构、缺少证据或缺少边界的情况下行动。
- 工程落点：它通常会落到接口、Schema、状态字段、策略规则、日志字段或执行流程中。
- 忽略后果：模型可能继续基于错误前提行动，造成假成功、越权、上下文污染或不可追踪失败。

## 6. 工程含义

今天主题的工程含义可以分成 5 层：

1. **边界**：明确模型、Runtime、工具、状态、用户各自负责什么。
2. **结构**：用接口、Schema、状态机、表结构或日志结构把能力固定下来。
3. **安全**：对高风险动作设置权限、审批、沙箱或只读限制。
4. **可恢复**：失败后能重试、降级、停止或交给用户处理。
5. **可验证**：最终结论必须能从工具结果、日志、状态或测试中找到证据。

## 7. Java / 后端类比

像 JVM 内存不是越大越可以乱放对象，堆满后仍会影响性能和稳定性。

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

给一次 Agent 调用设计 token 预算比例。

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

### Q1：模型一次能看多少信息，为什么这是一种稀缺资源？

先抓住本质：模型计算文本的基本单位。 这个问题要落到工程实现上，而不是停留在术语解释。

### Q2：今天主题在 Java 后端里可以类比成什么？

像 JVM 内存不是越大越可以乱放对象，堆满后仍会影响性能和稳定性。

### Q3：今天最容易出错的工程点是什么？

把模型输出当成可信事实或可直接执行动作。正确做法是让 Runtime 做校验、记录、权限和验证。

### Q4：学完今天应该产出什么？

给一次 Agent 调用设计 token 预算比例。

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

### 13.1 Context Window 不是“大输入框”

`Context Window（上下文窗口）` 很容易被误解成“模型一次能塞多少字”。工程上更准确的理解是：

> Context Window 是 Agent Runtime 每次调用模型时可支配的有限认知资源。

它不仅包括用户问题，还包括：

- `System Prompt（系统提示词）`
- `Developer Message（开发者消息）`
- `User Message（用户消息）`
- `Conversation History（对话历史）`
- `Tool Definitions（工具定义）`
- `Retrieved Documents（检索文档）`
- `Tool Observations（工具观察结果）`
- `State Summary（状态摘要）`
- `Memory（记忆）`
- `Output Budget（输出预留空间）`

所以一次模型调用不是“把问题发给模型”，而是 Runtime 做了一次上下文装配：

```text
Context = Instructions + Goal + State + Evidence + Tools + Memory + OutputBudget
```

如果上下文装配质量差，即使模型能力很强，也会做出错误判断。

### 13.2 Token Budget（Token 预算）应该显式设计

不要等到模型报超限才开始处理 token。Runtime 应该在请求前就有预算模型。

一个简化预算可以这样拆：

| 内容区域 | 建议优先级 | 示例占比 | 说明 |
|----------|------------|----------|------|
| System / Developer Instructions | 最高 | 10%-20% | 安全规则、角色边界、输出格式 |
| Current User Goal | 最高 | 5%-10% | 当前任务目标，必须保留 |
| Active State | 高 | 10%-15% | 当前步骤、计划、约束、未完成项 |
| Relevant Evidence | 高 | 25%-40% | 检索片段、工具摘要、错误证据 |
| Tool Definitions | 中高 | 10%-20% | 只放当前可能用到的工具 |
| Conversation Summary | 中 | 5%-15% | 历史摘要，不放完整历史 |
| Memory | 中 | 5%-10% | 只放相关且可信的长期记忆 |
| Output Budget | 必须预留 | 10%-20% | 给模型生成答案或工具调用参数 |

关键点：

- `Output Budget（输出预算）` 也占上下文窗口。
- 工具定义不是越全越好，只应放当前任务可能使用的工具。
- 历史对话应优先压缩成事实、决策和未完成事项。
- 大日志、大文件、大 diff 不应该直接进入上下文。

### 13.3 Runtime 可以如何实现预算控制

可以把上下文组装做成一个独立组件：

```java
public class ContextAssembler {

    public AssembledContext assemble(ContextRequest request) {
        TokenBudget budget = budgetPlanner.plan(request);
        List<ContextBlock> blocks = new ArrayList<>();

        blocks.add(instructionProvider.load(request, budget));
        blocks.add(goalProvider.load(request, budget));
        blocks.add(stateProvider.load(request, budget));
        blocks.add(evidenceProvider.load(request, budget));
        blocks.add(memoryProvider.load(request, budget));

        return contextCompressor.fit(blocks, budget);
    }
}
```

核心不是代码长什么样，而是职责分离：

- `BudgetPlanner`：决定每类内容最多占多少 token。
- `ContextProvider`：负责从不同来源取内容。
- `ContextRanker`：按相关性、可信度、时效性排序。
- `ContextCompressor`：超预算时压缩或丢弃。
- `ContextTrace`：记录最终到底放了什么。

这和后端接口聚合很像：Controller 不应该直接拼所有数据，而是由应用层根据业务优先级选择数据。

### 13.4 上下文块应该有元数据

不要把所有内容拼成一个大字符串。更好的方式是先维护结构化块：

```json
{
  "type": "tool_observation",
  "source": "run_tests",
  "priority": "high",
  "trustLevel": "verified",
  "createdAt": "2026-06-08T10:00:00+08:00",
  "tokenEstimate": 320,
  "content": "OrderServiceTest failed at testCancelPaidOrder..."
}
```

这样 Runtime 才能做：

- 超预算时先丢低优先级内容。
- 发现过期内容时自动降权。
- 最终回答时追溯证据来源。
- Debug 时知道模型当时看到了什么。

### 13.5 今日输出模板：Token 预算表

你可以为一个 AI Coding Agent 设计预算：

```text
任务：修复一个 Java 单测失败

总窗口：假设 32k tokens
输出预算：4k

输入预算：
- 系统规则：3k
- 用户目标：1k
- 当前计划：1k
- 相关文件片段：10k
- 测试失败摘要：3k
- Git diff：4k
- 工具定义：3k
- 历史摘要：2k
- 预留 buffer：1k

丢弃策略：
- 完整 build log 不直接进入上下文
- 无关文件不进入上下文
- 旧失败结果被新测试结果覆盖
- 只保留最近一次有效 observation
```

## 今日笔记

### 预习问题

- 模型一次能看多少信息，为什么这是一种稀缺资源？
- `Context Window（上下文窗口）` 在 Agent Runtime 的哪个模块落地？
- 如果忽略 `Context Window（上下文窗口）`，会造成什么工程风险？

### 主动回忆

1. 今日主题是 `Context Window（上下文窗口）`，核心问题是：模型一次能看多少信息，为什么这是一种稀缺资源？
2. 关键概念包括：Token（词元）、Context Window（上下文窗口）、Token Budget（Token 预算）。
3. 工程判断要落到 Runtime：谁负责决策、谁负责执行、谁负责记录、谁负责验证。

### 费曼输出

用 5 句话给一个 Java 后端同事讲清楚今天主题：

1. `Context Window（上下文窗口）` 不是孤立术语，它要解决的是 Agent 从“会回答”走向“可执行、可控制、可验证”的问题。
2. 模型可以参与推理和生成候选动作，但 Runtime 必须负责边界、状态、权限、工具执行和审计。
3. 如果没有结构化设计，Agent 很容易出现假成功、重复行动、上下文污染或不可追踪失败。
4. 后端视角下，可以把它类比成服务编排、状态机、权限网关、审计日志或可观测性体系中的一个环节。
5. 学完今天，至少要能说清楚它的输入、输出、失败模式、验证方式和最小实现方案。

### 3 条要点

- Token（词元）：先理解定义，再追问它在 Runtime 中由哪个组件负责。
- Context Window（上下文窗口）：不要只停留在 prompt 层，要落实到 Schema、状态、策略、日志或流程里。
- Agent 工程化不是让模型“更自由”，而是让模型的推理能力被 Runtime 安全、结构化、可追踪地使用。

### Java / 后端类比

- 像查询系统做数据选择和缓存：不是数据越多越好，而是相关、可信、最新、可追溯最重要。

### 今日小练习

**练习目标**：把 `Context Window（上下文窗口）` 从概念理解推进到可落地的工程设计。

**任务说明**：为一次 AI Coding 任务设计 token 预算表。

**操作步骤**：

1. 先用 3 句话写清楚这个练习要解决的核心问题。
2. 列出涉及的关键概念：`Token（词元）`、`Context Window（上下文窗口）`、`Token Budget（Token 预算）`。
3. 写出最小数据结构或流程图，优先使用表格、伪代码或 Mermaid。
4. 补充异常情况：失败、超时、权限不足、输入不完整、结果无法验证。
5. 写出最终输出物，并说明它如何被 Runtime 记录、验证或复用。

**建议输出物**：

```text
标题：Context Window（上下文窗口） 小练习
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

- `Context Window（上下文窗口）` 的最小可用实现需要哪些类、字段或接口？
- 这个能力上线后，失败时我应该通过哪些日志、Trace 或状态字段定位问题？

### 间隔复习

- D+1：不看资料，用 3 句话复述 `Context Window（上下文窗口）` 的核心思想。
- D+3：补画一张小图，标出它和 Runtime 其他模块的关系。
- D+7：用一个 Java 后端场景重新解释它，并检查是否能说出风险和验证方式。
