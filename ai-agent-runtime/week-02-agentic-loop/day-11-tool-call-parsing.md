# Day 11：Tool Call Parsing（工具调用解析）

> 所属周：Week 02 - Runtime 主循环实现  
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）  
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md) / [`本周 QA`](week-02-qa-summary.md)  
> 上一天：[`Day 10`](../week-02-agentic-loop/day-10-model-invocation.md) ｜ 下一天：[`Day 12`](../week-02-agentic-loop/day-12-stop-condition.md)

## 1. 今日核心问题

> 模型输出如何变成可执行动作？

今天的学习目标不是背概念，而是把 `Tool Call Parsing（工具调用解析）` 放到 Agent Runtime 的工程链路里理解。

学完今天，你应该能做到：

- 用自己的话解释：Action Parsing、Validation、Invalid Action、Observation on Rejection。
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

> 模型输出如何变成可执行动作？ 这个问题的答案，最终都要落到“如何让 Agent 更可控、更准确、更可验证”。

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

### 5.1 Action Parsing（动作解析）

把模型输出转成结构化 `AgentAction`。

它解决的问题：模型输出是概率生成结果，Runtime 必须把它转成确定的 `Action` 才能执行。

工程落点：`ActionParser` 负责解析 tool name、arguments、reason、callId，并产出结构化对象。

忽略后果：把自然语言当命令执行会非常危险，模型一句“我会删除文件”不等于 Runtime 应该真的删除。

### 5.2 Validation（校验）

校验工具名、参数类型、路径、枚举和风险等级。

它解决的问题：保证模型选择的动作在当前环境、权限和参数约束下是合法的。

工程落点：`ActionValidator` 检查工具是否存在、参数是否满足 schema、路径是否越界、风险是否需要审批。

忽略后果：错误参数可能造成工具失败，高风险参数可能造成误删、越权、误发消息或错误写库。

### 5.3 Invalid Action（非法动作）

不存在的工具、缺参数、越权路径或危险命令。

它解决的问题：模型会犯错，Runtime 必须把非法动作转成可处理的失败，而不是崩溃或强行执行。

工程落点：定义 `InvalidActionException` 或 `ActionValidationResult`，包含错误类型、字段路径、可恢复建议。

忽略后果：Agent 可能在同一个错误动作上反复尝试，或者跳过校验直接执行危险操作。

### 5.4 Observation on Rejection（拒绝观察）

拒绝执行后也要把原因反馈给模型。

它解决的问题：拒绝不是静默失败，模型需要知道动作为什么被拦截，才能选择更安全的下一步。

工程落点：生成 `Observation(status=DENIED, reason=..., recoverable=...)`，写入 Transcript，并进入下一轮上下文。

忽略后果：如果只丢弃非法动作，模型会缺少反馈，可能继续重复同样的工具调用。

## 6. 工程含义

今天主题的工程含义可以分成 5 层：

1. **边界**：明确模型、Runtime、工具、状态、用户各自负责什么。
2. **结构**：用接口、Schema、状态机、表结构或日志结构把能力固定下来。
3. **安全**：对高风险动作设置权限、审批、沙箱或只读限制。
4. **可恢复**：失败后能重试、降级、停止或交给用户处理。
5. **可验证**：最终结论必须能从工具结果、日志、状态或测试中找到证据。

## 7. Java / 后端类比

像 Controller 入参校验：不能因为前端传了字段就直接执行，必须校验 DTO、权限和业务规则。

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

设计 `AgentAction` 数据结构，并写出 5 种非法动作处理策略。

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

### Q1：模型输出如何变成可执行动作？

先抓住本质：把模型输出转成结构化 `AgentAction`。 这个问题要落到工程实现上，而不是停留在术语解释。

### Q2：今天主题在 Java 后端里可以类比成什么？

像 Controller 入参校验：不能因为前端传了字段就直接执行，必须校验 DTO、权限和业务规则。

### Q3：今天最容易出错的工程点是什么？

把模型输出当成可信事实或可直接执行动作。正确做法是让 Runtime 做校验、记录、权限和验证。

### Q4：学完今天应该产出什么？

设计 `AgentAction` 数据结构，并写出 5 种非法动作处理策略。

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

### 13.1 模型输出不是动作本身

模型可能输出：

```json
{
  "tool": "run_command",
  "arguments": {
    "command": "rm -rf .",
    "cwd": "/Users/lilei/code/study"
  }
}
```

这只是一个 `Action Proposal（动作提案）`，不是授权动作。Runtime 必须经过：

```text
Parse
-> Validate
-> Normalize
-> Risk Classify
-> Permission Check
-> Execute or Reject
```

### 13.2 AgentAction 推荐结构

```java
public class AgentAction {
    private String actionId;
    private ActionType type;
    private String toolName;
    private Map<String, Object> arguments;
    private RiskLevel riskLevel;
    private String reason;
    private Integer turn;
}
```

关键点：

- `toolName` 必须在 Tool Registry 中存在。
- `arguments` 必须符合 Tool Schema。
- `riskLevel` 最好由 Runtime 计算，不完全相信模型。
- `reason` 可以帮助审计，但不能作为授权依据。

### 13.3 解析失败类型

| 类型 | 示例 | 处理方式 |
|------|------|----------|
| 非 JSON | 模型输出自然语言 | 要求模型重发结构化动作 |
| 工具不存在 | `delete_database` | 拒绝并记录 |
| 缺少参数 | 没有 `path` | 返回参数错误 Observation |
| 参数类型错误 | `limit = "many"` | Schema 校验失败 |
| 路径越界 | `../../secret` | 权限拒绝 |
| 危险命令 | `rm -rf .` | 高风险拦截 |

### 13.4 解析和校验伪代码

```java
public ParseResult parse(ModelOutput output) {
    RawToolCall raw = rawParser.extract(output);

    ToolDefinition tool = toolRegistry.find(raw.getName())
        .orElseThrow(() -> new InvalidActionException("Unknown tool"));

    SchemaValidationResult validation = schemaValidator.validate(
        tool.getInputSchema(),
        raw.getArguments()
    );

    if (!validation.isValid()) {
        return ParseResult.invalid(validation.toObservation());
    }

    AgentAction action = actionNormalizer.normalize(tool, raw);
    RiskLevel risk = riskClassifier.classify(action);
    action.setRiskLevel(risk);

    return ParseResult.valid(action);
}
```

### 13.5 为什么需要 Normalize

模型传参可能不稳定：

```json
{"path": "./src/../src/UserService.java"}
```

Runtime 应规范化为：

```text
src/UserService.java
```

但规范化不能越权。如果规范化后路径跑出 workspace，必须拒绝。

### 13.6 拒绝动作也要形成 Observation

不要只在日志里写“拒绝”。模型下一轮也需要知道：

```text
Observation:
Tool call rejected.

Reason:
  Path traversal is not allowed.

Rejected input:
  ../../secret.txt

Allowed scope:
  /Users/lilei/code/study

Next:
  Choose a file under the workspace.
```

这样模型才有机会修正，而不是重复犯错。

### 13.7 今日实践输出方向

设计 5 种非法动作：

1. 不存在的工具。
2. 参数缺失。
3. 参数类型错误。
4. 路径越界。
5. 高风险命令。

每种都写出：

- 是否允许重试。
- 是否需要用户确认。
- Observation 如何表达。

## 今日笔记

### 预习问题

- 模型输出如何变成可执行动作？
- `Tool Call Parsing（工具调用解析）` 在 Agent Runtime 的哪个模块落地？
- 如果忽略 `Tool Call Parsing（工具调用解析）`，会造成什么工程风险？

### 主动回忆

1. 今日主题是 `Tool Call Parsing（工具调用解析）`，核心问题是：模型输出如何变成可执行动作？
2. 关键概念包括：Action Parsing（动作解析）、Validation（校验）、Invalid Action（非法动作）。
3. 工程判断要落到 Runtime：谁负责决策、谁负责执行、谁负责记录、谁负责验证。

### 费曼输出

用 5 句话给一个 Java 后端同事讲清楚今天主题：

1. `Tool Call Parsing（工具调用解析）` 不是孤立术语，它要解决的是 Agent 从“会回答”走向“可执行、可控制、可验证”的问题。
2. 模型可以参与推理和生成候选动作，但 Runtime 必须负责边界、状态、权限、工具执行和审计。
3. 如果没有结构化设计，Agent 很容易出现假成功、重复行动、上下文污染或不可追踪失败。
4. 后端视角下，可以把它类比成服务编排、状态机、权限网关、审计日志或可观测性体系中的一个环节。
5. 学完今天，至少要能说清楚它的输入、输出、失败模式、验证方式和最小实现方案。

### 3 条要点

- Action Parsing（动作解析）：先理解定义，再追问它在 Runtime 中由哪个组件负责。
- Validation（校验）：不要只停留在 prompt 层，要落实到 Schema、状态、策略、日志或流程里。
- Agent 工程化不是让模型“更自由”，而是让模型的推理能力被 Runtime 安全、结构化、可追踪地使用。

### Java / 后端类比

- 像一个带状态的 Spring Batch / Saga 流程：每一步根据上一步结果决定下一步，并且必须有停止条件。

### 今日小练习

**练习目标**：把 `Tool Call Parsing（工具调用解析）` 从概念理解推进到可落地的工程设计。

**任务说明**：设计 AgentAction 数据结构，并写出 5 种非法动作处理策略。

**操作步骤**：

1. 先用 3 句话写清楚这个练习要解决的核心问题。
2. 列出涉及的关键概念：`Action Parsing（动作解析）`、`Validation（校验）`、`Invalid Action（非法动作）`。
3. 写出最小数据结构或流程图，优先使用表格、伪代码或 Mermaid。
4. 补充异常情况：失败、超时、权限不足、输入不完整、结果无法验证。
5. 写出最终输出物，并说明它如何被 Runtime 记录、验证或复用。

**建议输出物**：

```text
标题：Tool Call Parsing（工具调用解析） 小练习
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

- `Tool Call Parsing（工具调用解析）` 的最小可用实现需要哪些类、字段或接口？
- 这个能力上线后，失败时我应该通过哪些日志、Trace 或状态字段定位问题？

### 间隔复习

- D+1：不看资料，用 3 句话复述 `Tool Call Parsing（工具调用解析）` 的核心思想。
- D+3：补画一张小图，标出它和 Runtime 其他模块的关系。
- D+7：用一个 Java 后端场景重新解释它，并检查是否能说出风险和验证方式。
