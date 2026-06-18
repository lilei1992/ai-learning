# Day 26：Prompt Cache（提示词缓存）

> 所属周：Week 04 - Context Engineering 与 Memory  
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）  
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md) / [`本周 QA`](week-04-qa-summary.md)  
> 上一天：[`Day 25`](../week-04-context-management/day-25-context-compaction.md) ｜ 下一天：[`Day 27`](../week-04-context-management/day-27-memory-write-policy.md)

## 1. 今日核心问题

> 哪些上下文适合缓存，缓存会带来什么风险？

今天的学习目标不是背概念，而是把 `Prompt Cache（提示词缓存）` 放到 Agent Runtime 的工程链路里理解。

学完今天，你应该能做到：

- 用自己的话解释：Prompt Cache、Stable Context、Cache Invalidation、Cost Saving。
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

> 哪些上下文适合缓存，缓存会带来什么风险？ 这个问题的答案，最终都要落到“如何让 Agent 更可控、更准确、更可验证”。

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

### 5.1 Prompt Cache（提示词缓存）

复用稳定上下文降低成本和延迟。

进一步理解这个概念时，建议追问三件事：

- 它解决的问题：避免 Agent 在缺少结构、缺少证据或缺少边界的情况下行动。
- 工程落点：它通常会落到接口、Schema、状态字段、策略规则、日志字段或执行流程中。
- 忽略后果：模型可能继续基于错误前提行动，造成假成功、越权、上下文污染或不可追踪失败。

### 5.2 Stable Context（稳定上下文）

系统规则、工具定义、项目规范。

进一步理解这个概念时，建议追问三件事：

- 它解决的问题：避免 Agent 在缺少结构、缺少证据或缺少边界的情况下行动。
- 工程落点：它通常会落到接口、Schema、状态字段、策略规则、日志字段或执行流程中。
- 忽略后果：模型可能继续基于错误前提行动，造成假成功、越权、上下文污染或不可追踪失败。

### 5.3 Cache Invalidation（缓存失效）

规则或项目变更后必须更新缓存。

进一步理解这个概念时，建议追问三件事：

- 它解决的问题：避免 Agent 在缺少结构、缺少证据或缺少边界的情况下行动。
- 工程落点：它通常会落到接口、Schema、状态字段、策略规则、日志字段或执行流程中。
- 忽略后果：模型可能继续基于错误前提行动，造成假成功、越权、上下文污染或不可追踪失败。

### 5.4 Cost Saving（成本节省）

减少重复 token 输入。

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

像 Redis 缓存配置和字典数据，但必须处理过期和一致性。

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

设计项目规则和工具定义的缓存策略。

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

### Q1：哪些上下文适合缓存，缓存会带来什么风险？

先抓住本质：复用稳定上下文降低成本和延迟。 这个问题要落到工程实现上，而不是停留在术语解释。

### Q2：今天主题在 Java 后端里可以类比成什么？

像 Redis 缓存配置和字典数据，但必须处理过期和一致性。

### Q3：今天最容易出错的工程点是什么？

把模型输出当成可信事实或可直接执行动作。正确做法是让 Runtime 做校验、记录、权限和验证。

### Q4：学完今天应该产出什么？

设计项目规则和工具定义的缓存策略。

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

### 13.1 Prompt Cache 不是简单字符串缓存

`Prompt Cache（提示词缓存）` 指把稳定、重复使用、成本较高的上下文内容缓存起来，减少重复传输、降低延迟和成本。

但它不是把最终 prompt 字符串放进 Redis 就完事。Agent 上下文是分层的：

```text
Stable Instructions
Project Rules
Tool Definitions
User Goal
Task State
Retrieved Evidence
Recent Observations
```

其中只有一部分适合缓存。

### 13.2 哪些内容适合缓存

适合缓存的内容一般具备三个特征：

- 稳定：短时间内不变。
- 常用：多次请求都会用。
- 可信：来源明确，可版本化。

示例：

| 内容 | 是否适合缓存 | 原因 |
|------|--------------|------|
| System Prompt | 适合 | 稳定，几乎每次都用 |
| Tool Schema | 适合 | 版本明确，重复使用 |
| AGENTS.md / 项目规则摘要 | 适合 | 项目内多任务复用 |
| 当前用户问题 | 不适合 | 每次不同 |
| 最新工具结果 | 通常不适合 | 时效性强 |
| 召回文档片段 | 视情况 | 热点文档可缓存 |
| 权限状态 | 谨慎 | 权限变更必须及时生效 |

### 13.3 缓存失效比缓存命中更重要

Prompt Cache 最大风险是 stale cache（过期缓存）。

比如：

- 工具 schema 已更新，但缓存仍是旧参数。
- 项目规则变了，但模型还按旧规则行动。
- 用户权限被撤销，但缓存里仍认为可执行。
- 文档内容更新了，但 RAG 摘要没刷新。

所以缓存 key 必须包含版本信息。

```text
cacheKey = tenantId
         + modelId
         + instructionVersion
         + toolSchemaVersion
         + projectRuleHash
         + permissionVersion
```

对于权限、风控、审批状态，不建议只依赖 prompt cache。Runtime 执行工具前仍然必须实时校验。

### 13.4 Java 后端缓存设计类比

Prompt Cache 和后端缓存很像，但缓存对象不是数据库记录，而是上下文块。

可以设计：

```java
public class ContextCacheEntry {
    private String cacheKey;
    private String blockType;
    private String content;
    private String contentHash;
    private Integer tokenEstimate;
    private Instant expiresAt;
    private String version;
}
```

缓存策略：

- `System Instruction`：长 TTL，版本变更失效。
- `Tool Definition`：按工具版本失效。
- `Project Rules`：按文件 hash 失效。
- `Document Summary`：按文档 hash 失效。
- `Permission Context`：短 TTL 或不缓存。

### 13.5 Prompt Cache 与 Context Engineering 的关系

缓存不应该决定“放什么上下文”，它只是优化“取上下文的成本”。

正确顺序：

```text
Decide What Context Is Needed
-> Check Cache
-> Load Missing Blocks
-> Validate Freshness
-> Assemble Context
```

错误顺序：

```text
Cache Hit
-> Blindly Use Cached Context
-> Model Acts on Old Rules
```

缓存必须服从上下文选择策略。

### 13.6 今日输出模板：缓存分层

```text
缓存对象：AI Coding Agent 项目规则上下文

缓存内容：
- AGENTS.md 摘要
- README 技术栈摘要
- 工具定义列表
- 代码风格规则

cacheKey：
- repoPath
- gitCommit
- agentsFileHash
- toolSchemaVersion
- modelId

失效条件：
- AGENTS.md 变更
- 当前分支切换
- 工具 schema 变更
- 用户权限变更时重新校验

不缓存：
- 最新测试结果
- 当前用户目标
- 未验证推测
- 高风险权限判断
```

## 今日笔记

### 预习问题

- 哪些上下文适合缓存，缓存会带来什么风险？
- `Prompt Cache（提示词缓存）` 在 Agent Runtime 的哪个模块落地？
- 如果忽略 `Prompt Cache（提示词缓存）`，会造成什么工程风险？

### 主动回忆

1. 今日主题是 `Prompt Cache（提示词缓存）`，核心问题是：哪些上下文适合缓存，缓存会带来什么风险？
2. 关键概念包括：Prompt Cache（提示词缓存）、Stable Context（稳定上下文）、Cache Invalidation（缓存失效）。
3. 工程判断要落到 Runtime：谁负责决策、谁负责执行、谁负责记录、谁负责验证。

### 费曼输出

用 5 句话给一个 Java 后端同事讲清楚今天主题：

1. `Prompt Cache（提示词缓存）` 不是孤立术语，它要解决的是 Agent 从“会回答”走向“可执行、可控制、可验证”的问题。
2. 模型可以参与推理和生成候选动作，但 Runtime 必须负责边界、状态、权限、工具执行和审计。
3. 如果没有结构化设计，Agent 很容易出现假成功、重复行动、上下文污染或不可追踪失败。
4. 后端视角下，可以把它类比成服务编排、状态机、权限网关、审计日志或可观测性体系中的一个环节。
5. 学完今天，至少要能说清楚它的输入、输出、失败模式、验证方式和最小实现方案。

### 3 条要点

- Prompt Cache（提示词缓存）：先理解定义，再追问它在 Runtime 中由哪个组件负责。
- Stable Context（稳定上下文）：不要只停留在 prompt 层，要落实到 Schema、状态、策略、日志或流程里。
- Agent 工程化不是让模型“更自由”，而是让模型的推理能力被 Runtime 安全、结构化、可追踪地使用。

### Java / 后端类比

- 像查询系统做数据选择和缓存：不是数据越多越好，而是相关、可信、最新、可追溯最重要。

### 今日小练习

**练习目标**：把 `Prompt Cache（提示词缓存）` 从概念理解推进到可落地的工程设计。

**任务说明**：设计 Prompt Cache 分层策略，包括缓存 key、失效条件和禁止缓存内容。

**操作步骤**：

1. 先用 3 句话写清楚这个练习要解决的核心问题。
2. 列出涉及的关键概念：`Prompt Cache（提示词缓存）`、`Stable Context（稳定上下文）`、`Cache Invalidation（缓存失效）`。
3. 写出最小数据结构或流程图，优先使用表格、伪代码或 Mermaid。
4. 补充异常情况：失败、超时、权限不足、输入不完整、结果无法验证。
5. 写出最终输出物，并说明它如何被 Runtime 记录、验证或复用。

**建议输出物**：

```text
标题：Prompt Cache（提示词缓存） 小练习
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

- `Prompt Cache（提示词缓存）` 的最小可用实现需要哪些类、字段或接口？
- 这个能力上线后，失败时我应该通过哪些日志、Trace 或状态字段定位问题？

### 间隔复习

- D+1：不看资料，用 3 句话复述 `Prompt Cache（提示词缓存）` 的核心思想。
- D+3：补画一张小图，标出它和 Runtime 其他模块的关系。
- D+7：用一个 Java 后端场景重新解释它，并检查是否能说出风险和验证方式。
