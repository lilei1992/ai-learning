# Day 24：Tool Result Budget（工具结果预算）

> 所属周：Week 04 - Context Engineering 与 Memory  
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）  
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md) / [`本周 QA`](week-04-qa-summary.md)  
> 上一天：[`Day 23`](../week-04-context-management/day-23-context-pollution.md) ｜ 下一天：[`Day 25`](../week-04-context-management/day-25-context-compaction.md)

## 1. 今日核心问题

> 工具返回很长时，哪些内容应该进入上下文？

今天的学习目标不是背概念，而是把 `Tool Result Budget（工具结果预算）` 放到 Agent Runtime 的工程链路里理解。

学完今天，你应该能做到：

- 用自己的话解释：Result Budget、Summary、Citation、Diagnostic Info。
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

> 工具返回很长时，哪些内容应该进入上下文？ 这个问题的答案，最终都要落到“如何让 Agent 更可控、更准确、更可验证”。

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

### 5.1 Result Budget（结果预算）

限制工具结果进入模型的 token。

进一步理解这个概念时，建议追问三件事：

- 它解决的问题：避免 Agent 在缺少结构、缺少证据或缺少边界的情况下行动。
- 工程落点：它通常会落到接口、Schema、状态字段、策略规则、日志字段或执行流程中。
- 忽略后果：模型可能继续基于错误前提行动，造成假成功、越权、上下文污染或不可追踪失败。

### 5.2 Summary（摘要）

把长输出压缩为关键事实。

进一步理解这个概念时，建议追问三件事：

- 它解决的问题：避免 Agent 在缺少结构、缺少证据或缺少边界的情况下行动。
- 工程落点：它通常会落到接口、Schema、状态字段、策略规则、日志字段或执行流程中。
- 忽略后果：模型可能继续基于错误前提行动，造成假成功、越权、上下文污染或不可追踪失败。

### 5.3 Citation（引用）

保留来源路径、行号或 URL。

进一步理解这个概念时，建议追问三件事：

- 它解决的问题：避免 Agent 在缺少结构、缺少证据或缺少边界的情况下行动。
- 工程落点：它通常会落到接口、Schema、状态字段、策略规则、日志字段或执行流程中。
- 忽略后果：模型可能继续基于错误前提行动，造成假成功、越权、上下文污染或不可追踪失败。

### 5.4 Diagnostic Info（诊断信息）

保留排查所需错误和状态。

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

像日志平台不会把全量日志都发到报警消息，只发关键错误和 traceId。

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

把一段长测试日志压缩成 Observation。

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

### Q1：工具返回很长时，哪些内容应该进入上下文？

先抓住本质：限制工具结果进入模型的 token。 这个问题要落到工程实现上，而不是停留在术语解释。

### Q2：今天主题在 Java 后端里可以类比成什么？

像日志平台不会把全量日志都发到报警消息，只发关键错误和 traceId。

### Q3：今天最容易出错的工程点是什么？

把模型输出当成可信事实或可直接执行动作。正确做法是让 Runtime 做校验、记录、权限和验证。

### Q4：学完今天应该产出什么？

把一段长测试日志压缩成 Observation。

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

### 13.1 工具结果不等于上下文

工具返回结果可能非常长，例如：

- `mvn test` 的完整日志。
- `git diff` 的大段改动。
- `grep` 搜索出上百个匹配。
- ES 查询返回几千条记录。
- Web search 返回多篇文章。

Runtime 不应该把完整工具结果直接塞给模型。正确做法是：

```text
Raw Tool Result
-> Store in Transcript / Artifact Store
-> Extract Key Evidence
-> Summarize for Model
-> Keep rawRef
-> Put compact Observation into Context
```

也就是说，模型看到的通常应该是 `Observation Summary（观察摘要）`，而完整结果保存在执行记录里。

### 13.2 Tool Result Budget 的核心问题

`Tool Result Budget（工具结果预算）` 解决的是：

> 工具产生了大量事实，Runtime 应该选择哪些事实让模型看到？

选择标准不是“短”，而是：

- 是否影响下一步决策。
- 是否能证明任务成功或失败。
- 是否包含错误根因。
- 是否包含路径、行号、状态码、ID 等可追溯信息。
- 是否存在敏感信息。
- 是否可通过 rawRef 回看原文。

### 13.3 工具结果压缩结构

建议定义统一结构：

```java
public class ToolObservation {
    private String toolName;
    private String status;        // success, failed, timeout, denied
    private String summary;
    private List<EvidenceItem> evidence;
    private List<String> nextHints;
    private String rawRef;
    private Integer tokenEstimate;
}
```

`EvidenceItem（证据项）` 可以包含：

```java
public class EvidenceItem {
    private String type;          // error, file, line, metric, record
    private String source;
    private String locator;       // file:line, log offset, record id
    private String content;
    private Double confidence;
}
```

这样模型看到的是高信噪比内容，而不是整段噪声。

### 13.4 不同工具的压缩策略

| 工具类型 | 保留内容 | 丢弃内容 |
|----------|----------|----------|
| Test Runner | 失败测试名、错误栈关键行、断言差异 | 重复依赖下载日志、无关 INFO |
| Build Tool | 编译错误文件、行号、错误类型 | 成功模块的完整日志 |
| Search Tool | top K 相关文件、匹配行、上下文片段 | 大量重复匹配 |
| SQL Tool | SQL、行数、关键字段、异常信息 | 大结果集原文 |
| HTTP Tool | URL、状态码、响应摘要、错误字段 | 大响应 body |
| File Read | 相关函数、类、注释、行号 | 整个大文件 |

这和后端日志采集很像：线上排障时你不会把所有日志都贴给同事，而是给错误摘要、traceId、关键时间点和异常栈。

### 13.5 rawRef 很关键

`rawRef（原始结果引用）` 是压缩后仍能追溯原文的关键。

示例：

```json
{
  "toolName": "run_tests",
  "status": "failed",
  "summary": "OrderServiceTest has 1 failed test: cancelPaidOrderShouldRefund.",
  "evidence": [
    {
      "type": "stacktrace",
      "source": "mvn-test.log",
      "locator": "line 482",
      "content": "Expected status REFUNDING but was CANCELED"
    }
  ],
  "rawRef": "transcript://run-20260608-001/tool-5/output"
}
```

好处：

- 上下文短。
- 证据可查。
- 最终报告能引用来源。
- Debug 时能回放。

### 13.6 今日输出模板：工具结果压缩规则

```text
工具：run_tests

原始结果：
- 完整 stdout / stderr 写入 Transcript
- 保存 rawRef

进入上下文：
- exitCode
- failed test count
- failed test names
- first root cause stacktrace
- assertion diff
- suspected related file

不进入上下文：
- 依赖下载日志
- 成功测试列表
- 重复 stacktrace
- 超过 N 行的完整日志
```

## 今日笔记

### 预习问题

- 工具返回很长时，哪些内容应该进入上下文？
- `Tool Result Budget（工具结果预算）` 在 Agent Runtime 的哪个模块落地？
- 如果忽略 `Tool Result Budget（工具结果预算）`，会造成什么工程风险？

### 主动回忆

1. 今日主题是 `Tool Result Budget（工具结果预算）`，核心问题是：工具返回很长时，哪些内容应该进入上下文？
2. 关键概念包括：Result Budget（结果预算）、Summary（摘要）、Citation（引用）。
3. 工程判断要落到 Runtime：谁负责决策、谁负责执行、谁负责记录、谁负责验证。

### 费曼输出

用 5 句话给一个 Java 后端同事讲清楚今天主题：

1. `Tool Result Budget（工具结果预算）` 不是孤立术语，它要解决的是 Agent 从“会回答”走向“可执行、可控制、可验证”的问题。
2. 模型可以参与推理和生成候选动作，但 Runtime 必须负责边界、状态、权限、工具执行和审计。
3. 如果没有结构化设计，Agent 很容易出现假成功、重复行动、上下文污染或不可追踪失败。
4. 后端视角下，可以把它类比成服务编排、状态机、权限网关、审计日志或可观测性体系中的一个环节。
5. 学完今天，至少要能说清楚它的输入、输出、失败模式、验证方式和最小实现方案。

### 3 条要点

- Result Budget（结果预算）：先理解定义，再追问它在 Runtime 中由哪个组件负责。
- Summary（摘要）：不要只停留在 prompt 层，要落实到 Schema、状态、策略、日志或流程里。
- Agent 工程化不是让模型“更自由”，而是让模型的推理能力被 Runtime 安全、结构化、可追踪地使用。

### Java / 后端类比

- 像查询系统做数据选择和缓存：不是数据越多越好，而是相关、可信、最新、可追溯最重要。

### 今日小练习

**练习目标**：把 `Tool Result Budget（工具结果预算）` 从概念理解推进到可落地的工程设计。

**任务说明**：为 run_tests 的长日志设计压缩规则：保留什么、丢弃什么、rawRef 怎么保存。

**操作步骤**：

1. 先用 3 句话写清楚这个练习要解决的核心问题。
2. 列出涉及的关键概念：`Result Budget（结果预算）`、`Summary（摘要）`、`Citation（引用）`。
3. 写出最小数据结构或流程图，优先使用表格、伪代码或 Mermaid。
4. 补充异常情况：失败、超时、权限不足、输入不完整、结果无法验证。
5. 写出最终输出物，并说明它如何被 Runtime 记录、验证或复用。

**建议输出物**：

```text
标题：Tool Result Budget（工具结果预算） 小练习
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

- `Tool Result Budget（工具结果预算）` 的最小可用实现需要哪些类、字段或接口？
- 这个能力上线后，失败时我应该通过哪些日志、Trace 或状态字段定位问题？

### 间隔复习

- D+1：不看资料，用 3 句话复述 `Tool Result Budget（工具结果预算）` 的核心思想。
- D+3：补画一张小图，标出它和 Runtime 其他模块的关系。
- D+7：用一个 Java 后端场景重新解释它，并检查是否能说出风险和验证方式。
