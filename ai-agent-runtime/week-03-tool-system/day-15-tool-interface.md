# Day 15：Tool Interface（工具接口）

> 所属周：Week 03 - Tool System 工程实现  
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）  
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md) / [`本周 QA`](week-03-qa-summary.md)  
> 上一天：[`Day 14`](../week-02-agentic-loop/day-14-week-02-review.md) ｜ 下一天：[`Day 16`](../week-03-tool-system/day-16-input-schema.md)

## 1. 今日核心问题

> 一个 Agent 工具最少应该暴露哪些信息？

今天的学习目标不是背概念，而是把 `Tool Interface（工具接口）` 放到 Agent Runtime 的工程链路里理解。

学完今天，你应该能做到：

- 用自己的话解释：Tool Definition、Capability、Risk Level、Idempotency。
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

> 一个 Agent 工具最少应该暴露哪些信息？ 这个问题的答案，最终都要落到“如何让 Agent 更可控、更准确、更可验证”。

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

### 5.1 Tool Definition（工具定义）

描述工具能力、输入、输出、风险和执行约束。

进一步理解这个概念时，建议追问三件事：

- 它解决的问题：避免 Agent 在缺少结构、缺少证据或缺少边界的情况下行动。
- 工程落点：它通常会落到接口、Schema、状态字段、策略规则、日志字段或执行流程中。
- 忽略后果：模型可能继续基于错误前提行动，造成假成功、越权、上下文污染或不可追踪失败。

### 5.2 Capability（能力）

工具能做什么和不能做什么。

进一步理解这个概念时，建议追问三件事：

- 它解决的问题：避免 Agent 在缺少结构、缺少证据或缺少边界的情况下行动。
- 工程落点：它通常会落到接口、Schema、状态字段、策略规则、日志字段或执行流程中。
- 忽略后果：模型可能继续基于错误前提行动，造成假成功、越权、上下文污染或不可追踪失败。

### 5.3 Risk Level（风险等级）

只读、写入、外部副作用、高危操作的分类。

进一步理解这个概念时，建议追问三件事：

- 它解决的问题：避免 Agent 在缺少结构、缺少证据或缺少边界的情况下行动。
- 工程落点：它通常会落到接口、Schema、状态字段、策略规则、日志字段或执行流程中。
- 忽略后果：模型可能继续基于错误前提行动，造成假成功、越权、上下文污染或不可追踪失败。

### 5.4 Idempotency（幂等性）

重复执行是否安全。

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

像定义一个内部 RPC 接口：方法名、参数、超时、权限、错误码都要清楚。

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

设计 `read_file`、`search_code`、`write_file` 的 ToolDefinition。

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

### Q1：一个 Agent 工具最少应该暴露哪些信息？

先抓住本质：描述工具能力、输入、输出、风险和执行约束。 这个问题要落到工程实现上，而不是停留在术语解释。

### Q2：今天主题在 Java 后端里可以类比成什么？

像定义一个内部 RPC 接口：方法名、参数、超时、权限、错误码都要清楚。

### Q3：今天最容易出错的工程点是什么？

把模型输出当成可信事实或可直接执行动作。正确做法是让 Runtime 做校验、记录、权限和验证。

### Q4：学完今天应该产出什么？

设计 `read_file`、`search_code`、`write_file` 的 ToolDefinition。

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

### 13.1 Tool 不是普通函数

在普通后端系统里，函数调用一般发生在可信代码内部：

```java
orderService.cancel(orderId);
```

但 Agent Tool 的调用来源是模型输出。模型可能理解错目标、生成错误参数、请求危险动作。所以 Tool 不是普通函数，而是 Runtime 暴露给模型的受控能力。

一个生产级 Tool 至少要回答：

- 它能做什么？
- 它不能做什么？
- 输入参数是什么？
- 输出结果如何表达？
- 是否只读？
- 是否有副作用？
- 是否需要权限？
- 是否能重试？
- 超时多久？
- 调用结果如何审计？

### 13.2 ToolDefinition 推荐字段

```java
public class ToolDefinition {
    private String name;
    private String description;
    private JsonSchema inputSchema;
    private RiskLevel riskLevel;
    private boolean permissionRequired;
    private boolean idempotent;
    private Duration timeout;
    private List<String> scopes;
    private ToolOutputPolicy outputPolicy;
}
```

字段解释：

| 字段 | 作用 |
|------|------|
| `name` | 模型调用工具时使用的稳定标识 |
| `description` | 告诉模型什么时候该用这个工具 |
| `inputSchema` | 限制参数结构和范围 |
| `riskLevel` | Runtime 判断是否需要审批 |
| `permissionRequired` | 是否需要用户确认 |
| `idempotent` | 是否允许自动重试 |
| `timeout` | 防止工具卡死 |
| `scopes` | 限制可访问资源范围 |
| `outputPolicy` | 控制输出摘要、脱敏和 rawRef |

### 13.3 Tool description 怎么写

差的描述：

```text
Run a command.
```

问题：太宽泛，模型可能用它做任何事。

更好的描述：

```text
Run a read-only diagnostic shell command in the workspace.
Use this tool only for commands like ls, pwd, rg, git status, or test commands.
Do not use it for deleting files, network exfiltration, credential access, or production operations.
```

描述要包含：

- 适用场景。
- 不适用场景。
- 安全边界。
- 输出期望。

### 13.4 基础工具分层

| 工具 | 风险 | 是否可自动执行 | 示例 |
|------|------|----------------|------|
| `read_file` | 低 | 是 | 读取项目文件 |
| `search_code` | 低 | 是 | 搜索关键词 |
| `list_directory` | 低 | 是 | 查看目录结构 |
| `run_test` | 中 | 通常是 | 运行测试 |
| `run_command` | 中高 | 视命令而定 | 执行 shell |
| `write_file` | 高 | 需要确认 | 修改文件 |
| `delete_file` | 高 | 必须确认 | 删除文件 |
| `send_email` | 高 | 必须确认 | 对外发送 |
| `update_database` | 极高 | 默认禁止 | 修改数据库 |

### 13.5 Tool Interface 的 Java 类比

可以把 Tool System 类比成企业内部开放平台：

- ToolDefinition = API 文档 + 权限元数据。
- ToolRegistry = API 网关注册中心。
- ToolExecutor = 实际调用后端服务的执行器。
- PermissionService = 鉴权中心。
- TraceRecorder = 调用日志。

模型只是“调用方”，不能越过网关直接访问底层系统。

### 13.6 今日实践输出方向

请设计三个 ToolDefinition：

```text
read_file:
  riskLevel: low
  idempotent: true
  permissionRequired: false

write_file:
  riskLevel: high
  idempotent: false
  permissionRequired: true

run_command:
  riskLevel: medium/high
  idempotent: depends on command
  permissionRequired: depends on command
```

重点不是字段写全，而是能解释为什么这么分级。

## 今日笔记

### 预习问题

- 一个 Agent 工具最少应该暴露哪些信息？
- `Tool Interface（工具接口）` 在 Agent Runtime 的哪个模块落地？
- 如果忽略 `Tool Interface（工具接口）`，会造成什么工程风险？

### 主动回忆

1. 今日主题是 `Tool Interface（工具接口）`，核心问题是：一个 Agent 工具最少应该暴露哪些信息？
2. 关键概念包括：Tool Definition（工具定义）、Capability（能力）、Risk Level（风险等级）。
3. 工程判断要落到 Runtime：谁负责决策、谁负责执行、谁负责记录、谁负责验证。

### 费曼输出

用 5 句话给一个 Java 后端同事讲清楚今天主题：

1. `Tool Interface（工具接口）` 不是孤立术语，它要解决的是 Agent 从“会回答”走向“可执行、可控制、可验证”的问题。
2. 模型可以参与推理和生成候选动作，但 Runtime 必须负责边界、状态、权限、工具执行和审计。
3. 如果没有结构化设计，Agent 很容易出现假成功、重复行动、上下文污染或不可追踪失败。
4. 后端视角下，可以把它类比成服务编排、状态机、权限网关、审计日志或可观测性体系中的一个环节。
5. 学完今天，至少要能说清楚它的输入、输出、失败模式、验证方式和最小实现方案。

### 3 条要点

- Tool Definition（工具定义）：先理解定义，再追问它在 Runtime 中由哪个组件负责。
- Capability（能力）：不要只停留在 prompt 层，要落实到 Schema、状态、策略、日志或流程里。
- Agent 工程化不是让模型“更自由”，而是让模型的推理能力被 Runtime 安全、结构化、可追踪地使用。

### Java / 后端类比

- 像给内部服务设计 API：接口、参数、返回值、错误码、权限和审计都要清楚。

### 今日小练习

**练习目标**：把 `Tool Interface（工具接口）` 从概念理解推进到可落地的工程设计。

**任务说明**：设计 read_file、search_code、write_file 三个 ToolDefinition。

**操作步骤**：

1. 先用 3 句话写清楚这个练习要解决的核心问题。
2. 列出涉及的关键概念：`Tool Definition（工具定义）`、`Capability（能力）`、`Risk Level（风险等级）`。
3. 写出最小数据结构或流程图，优先使用表格、伪代码或 Mermaid。
4. 补充异常情况：失败、超时、权限不足、输入不完整、结果无法验证。
5. 写出最终输出物，并说明它如何被 Runtime 记录、验证或复用。

**建议输出物**：

```text
标题：Tool Interface（工具接口） 小练习
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

- `Tool Interface（工具接口）` 的最小可用实现需要哪些类、字段或接口？
- 这个能力上线后，失败时我应该通过哪些日志、Trace 或状态字段定位问题？

### 间隔复习

- D+1：不看资料，用 3 句话复述 `Tool Interface（工具接口）` 的核心思想。
- D+3：补画一张小图，标出它和 Runtime 其他模块的关系。
- D+7：用一个 Java 后端场景重新解释它，并检查是否能说出风险和验证方式。
