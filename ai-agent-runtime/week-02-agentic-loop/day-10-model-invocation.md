# Day 10：Model Invocation（模型调用）

> 所属周：Week 02 - Runtime 主循环实现  
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）  
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md) / [`本周 QA`](week-02-qa-summary.md)  
> 上一天：[`Day 09`](../week-02-agentic-loop/day-09-context-assembly.md) ｜ 下一天：[`Day 11`](../week-02-agentic-loop/day-11-tool-call-parsing.md)

## 1. 今日核心问题

> Runtime 如何稳定调用不同模型？

今天的学习目标不是背概念，而是把 `Model Invocation（模型调用）` 放到 Agent Runtime 的工程链路里理解。

学完今天，你应该能做到：

- 用自己的话解释：Model Adapter、Reasoning Model、Chat Model、Streaming。
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

> Runtime 如何稳定调用不同模型？ 这个问题的答案，最终都要落到“如何让 Agent 更可控、更准确、更可验证”。

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

### 5.1 Model Adapter（模型适配器）

统一不同模型厂商的请求、响应、工具调用和错误处理。

它解决的问题：不同模型厂商的消息格式、工具调用格式、流式协议、错误码都不同，Runtime 不应该被具体 API 绑死。

工程落点：定义 `ModelAdapter` 接口，统一 `invoke()`、`stream()`、`parseToolCall()`、`mapError()` 等行为。

忽略后果：业务代码会散落大量厂商兼容逻辑，后续切模型、降级、多模型路由都会很痛苦。

### 5.2 Reasoning Model（推理模型）

适合复杂规划、代码推理、长链路排障。

它解决的问题：复杂任务需要分解、权衡、验证和修正，普通聊天模型可能更容易停留在表面回答。

工程落点：Planner、复杂代码修改、故障排查、方案评审等场景可以路由到 reasoning model。

忽略后果：把所有任务都交给同一种模型，会在复杂任务上不稳定，也会在简单任务上浪费成本。

### 5.3 Chat Model（聊天模型）

适合摘要、分类、改写、低风险生成。

它解决的问题：大量低风险、低复杂度任务不需要昂贵推理模型，例如摘要、格式转换、简单解释。

工程落点：可以作为默认模型或 fallback 模型，用于轻量响应、普通 RAG 问答和结果润色。

忽略后果：如果用聊天模型承担高风险执行决策，可能出现计划不完整、工具调用不严谨、验证不足。

### 5.4 Streaming（流式输出）

边生成边返回，提高交互体验，但要处理中断和部分输出。

它解决的问题：长回答或长任务状态可以更快反馈给用户，降低等待感。

工程落点：`ModelStreamHandler` 需要处理增量文本、工具调用片段、取消、超时和最终消息合并。

忽略后果：如果只把 streaming 当文本展示，可能会在工具调用 JSON 尚未完整时提前解析，导致错误执行。

## 6. 工程含义

今天主题的工程含义可以分成 5 层：

1. **边界**：明确模型、Runtime、工具、状态、用户各自负责什么。
2. **结构**：用接口、Schema、状态机、表结构或日志结构把能力固定下来。
3. **安全**：对高风险动作设置权限、审批、沙箱或只读限制。
4. **可恢复**：失败后能重试、降级、停止或交给用户处理。
5. **可验证**：最终结论必须能从工具结果、日志、状态或测试中找到证据。

## 7. Java / 后端类比

像封装多个支付渠道：上层只调用统一接口，底层适配不同协议、错误码和回调格式。

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

设计 `ModelClient`、`ModelRequest`、`ModelResponse`、`ModelError` 四个核心类。

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

### Q1：Runtime 如何稳定调用不同模型？

先抓住本质：统一不同模型厂商的请求、响应、工具调用和错误处理。 这个问题要落到工程实现上，而不是停留在术语解释。

### Q2：今天主题在 Java 后端里可以类比成什么？

像封装多个支付渠道：上层只调用统一接口，底层适配不同协议、错误码和回调格式。

### Q3：今天最容易出错的工程点是什么？

把模型输出当成可信事实或可直接执行动作。正确做法是让 Runtime 做校验、记录、权限和验证。

### Q4：学完今天应该产出什么？

设计 `ModelClient`、`ModelRequest`、`ModelResponse`、`ModelError` 四个核心类。

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

### 13.1 Model Invocation 不是简单 HTTP 调用

调用模型看起来像调用一个 HTTP API，但 Agent Runtime 里它更像“决策服务”：

```text
AgentContext
-> ModelRequest
-> LLM Provider
-> ModelOutput
-> Decision Parser
```

Runtime 需要处理：

- 选择哪个模型。
- 是否启用工具调用。
- 是否需要流式输出。
- 最大输出 token。
- 超时和重试。
- 模型错误映射。
- 成本和延迟记录。
- 输出是否符合协议。

### 13.2 Reasoning Model 和 Chat Model 的工程选择

| 任务 | 推荐模型类型 | 原因 |
|------|--------------|------|
| 总结一段日志 | Chat Model | 简单生成，成本优先 |
| 判断代码改动风险 | Reasoning Model | 需要多步推理 |
| 路由到某个工具 | Chat Model / 小模型 | 分类任务，低成本 |
| 设计修复方案 | Reasoning Model | 需要分析约束和影响 |
| 生成最终周报 | Chat Model | 文本生成 |
| 判断是否要执行高风险动作 | 不只靠模型 | 必须由 Runtime 策略判断 |

不要把所有任务都交给最强模型。生产系统里通常需要 `Model Routing（模型路由）`。

### 13.3 Model Adapter 接口设计

```java
public interface ModelClient {
    ModelResponse invoke(ModelRequest request);
    Flux<ModelChunk> stream(ModelRequest request);
}

public class ModelRequest {
    private String model;
    private List<ModelMessage> messages;
    private List<ToolDefinition> tools;
    private Integer maxOutputTokens;
    private Double temperature;
    private Duration timeout;
}

public class ModelResponse {
    private String responseId;
    private String text;
    private List<ToolCall> toolCalls;
    private TokenUsage usage;
    private String finishReason;
}
```

`ModelClient` 不应该暴露厂商细节给 Runtime 主循环。Runtime 只关心统一的 `ModelResponse`。

### 13.4 调用模型时要记录什么

每次模型调用都应该写 Trace：

| 字段 | 说明 |
|------|------|
| `taskId` | 所属任务 |
| `stepNo` | 第几轮 |
| `model` | 使用的模型 |
| `inputToken` | 输入 token |
| `outputToken` | 输出 token |
| `latencyMs` | 耗时 |
| `finishReason` | 停止原因 |
| `toolCallCount` | 工具调用数量 |
| `errorCode` | 错误码 |

这对成本分析、失败排查、模型切换都很关键。

### 13.5 常见模型调用失败

| 失败类型 | 处理方式 |
|----------|----------|
| 超时 | 可重试，但要限制次数 |
| 限流 | 等待或切换模型 |
| 上下文超限 | 触发 Context Compaction |
| 输出格式错误 | 要求模型修正或进入解析失败 |
| 模型服务不可用 | fallback 到备用模型 |
| 工具调用格式不合法 | 不执行，返回 Observation |

### 13.6 Prompt 分层在调用中的作用

```text
System Message:
  定义最高优先级安全规则。

Developer Message:
  定义产品、工程、Runtime 行为约束。

User Message:
  表达当前任务目标。

Tool Result Message:
  提供工具执行后的观察结果。
```

工程上必须保证：

- 不可信工具输出不能覆盖 System / Developer 规则。
- 用户要求不能绕过权限策略。
- Tool Result 要标明来源。

### 13.7 今日实践输出方向

设计 `ModelClient` 时，不要只写：

```java
String chat(String prompt);
```

而应该考虑：

```java
ModelResponse invoke(ModelRequest request);
```

因为 Agent Runtime 需要的不只是文本，还需要工具调用、usage、finish reason、错误信息和 trace 关联。

## 今日笔记

### 预习问题

- Runtime 如何稳定调用不同模型？
- `Model Invocation（模型调用）` 在 Agent Runtime 的哪个模块落地？
- 如果忽略 `Model Invocation（模型调用）`，会造成什么工程风险？

### 主动回忆

1. 今日主题是 `Model Invocation（模型调用）`，核心问题是：Runtime 如何稳定调用不同模型？
2. 关键概念包括：Model Adapter（模型适配器）、Reasoning Model（推理模型）、Chat Model（聊天模型）。
3. 工程判断要落到 Runtime：谁负责决策、谁负责执行、谁负责记录、谁负责验证。

### 费曼输出

用 5 句话给一个 Java 后端同事讲清楚今天主题：

1. `Model Invocation（模型调用）` 不是孤立术语，它要解决的是 Agent 从“会回答”走向“可执行、可控制、可验证”的问题。
2. 模型可以参与推理和生成候选动作，但 Runtime 必须负责边界、状态、权限、工具执行和审计。
3. 如果没有结构化设计，Agent 很容易出现假成功、重复行动、上下文污染或不可追踪失败。
4. 后端视角下，可以把它类比成服务编排、状态机、权限网关、审计日志或可观测性体系中的一个环节。
5. 学完今天，至少要能说清楚它的输入、输出、失败模式、验证方式和最小实现方案。

### 3 条要点

- Model Adapter（模型适配器）：先理解定义，再追问它在 Runtime 中由哪个组件负责。
- Reasoning Model（推理模型）：不要只停留在 prompt 层，要落实到 Schema、状态、策略、日志或流程里。
- Agent 工程化不是让模型“更自由”，而是让模型的推理能力被 Runtime 安全、结构化、可追踪地使用。

### Java / 后端类比

- 像一个带状态的 Spring Batch / Saga 流程：每一步根据上一步结果决定下一步，并且必须有停止条件。

### 今日小练习

**练习目标**：把 `Model Invocation（模型调用）` 从概念理解推进到可落地的工程设计。

**任务说明**：设计 ModelClient、ModelRequest、ModelResponse、ModelError 四个核心类。

**操作步骤**：

1. 先用 3 句话写清楚这个练习要解决的核心问题。
2. 列出涉及的关键概念：`Model Adapter（模型适配器）`、`Reasoning Model（推理模型）`、`Chat Model（聊天模型）`。
3. 写出最小数据结构或流程图，优先使用表格、伪代码或 Mermaid。
4. 补充异常情况：失败、超时、权限不足、输入不完整、结果无法验证。
5. 写出最终输出物，并说明它如何被 Runtime 记录、验证或复用。

**建议输出物**：

```text
标题：Model Invocation（模型调用） 小练习
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

- `Model Invocation（模型调用）` 的最小可用实现需要哪些类、字段或接口？
- 这个能力上线后，失败时我应该通过哪些日志、Trace 或状态字段定位问题？

### 间隔复习

- D+1：不看资料，用 3 句话复述 `Model Invocation（模型调用）` 的核心思想。
- D+3：补画一张小图，标出它和 Runtime 其他模块的关系。
- D+7：用一个 Java 后端场景重新解释它，并检查是否能说出风险和验证方式。
