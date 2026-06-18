# Day 16：Input Schema（输入结构定义）

> 所属周：Week 03 - Tool System 工程实现  
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）  
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md) / [`本周 QA`](week-03-qa-summary.md)  
> 上一天：[`Day 15`](../week-03-tool-system/day-15-tool-interface.md) ｜ 下一天：[`Day 17`](../week-03-tool-system/day-17-tool-result-design.md)

## 1. 今日核心问题

> 如何防止模型传入危险参数？

今天的学习目标不是背概念，而是把 `Input Schema（输入结构定义）` 放到 Agent Runtime 的工程链路里理解。

学完今天，你应该能做到：

- 用自己的话解释：Input Schema、Required Fields、Enum、Path Constraint。
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

> 如何防止模型传入危险参数？ 这个问题的答案，最终都要落到“如何让 Agent 更可控、更准确、更可验证”。

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

### 5.1 Input Schema（输入结构）

用结构化规则限制参数类型和范围。

进一步理解这个概念时，建议追问三件事：

- 它解决的问题：避免 Agent 在缺少结构、缺少证据或缺少边界的情况下行动。
- 工程落点：它通常会落到接口、Schema、状态字段、策略规则、日志字段或执行流程中。
- 忽略后果：模型可能继续基于错误前提行动，造成假成功、越权、上下文污染或不可追踪失败。

### 5.2 Required Fields（必填字段）

缺失参数应拒绝执行。

进一步理解这个概念时，建议追问三件事：

- 它解决的问题：避免 Agent 在缺少结构、缺少证据或缺少边界的情况下行动。
- 工程落点：它通常会落到接口、Schema、状态字段、策略规则、日志字段或执行流程中。
- 忽略后果：模型可能继续基于错误前提行动，造成假成功、越权、上下文污染或不可追踪失败。

### 5.3 Enum（枚举）

限制模型只能选择允许值。

进一步理解这个概念时，建议追问三件事：

- 它解决的问题：避免 Agent 在缺少结构、缺少证据或缺少边界的情况下行动。
- 工程落点：它通常会落到接口、Schema、状态字段、策略规则、日志字段或执行流程中。
- 忽略后果：模型可能继续基于错误前提行动，造成假成功、越权、上下文污染或不可追踪失败。

### 5.4 Path Constraint（路径约束）

防止路径穿越和越权读取。

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

像 API Param 校验：不能直接相信调用方传入的 path、status、amount。

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

为 `run_command` 写一个安全 Schema，限制 cwd、命令和超时。

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

### Q1：如何防止模型传入危险参数？

先抓住本质：用结构化规则限制参数类型和范围。 这个问题要落到工程实现上，而不是停留在术语解释。

### Q2：今天主题在 Java 后端里可以类比成什么？

像 API Param 校验：不能直接相信调用方传入的 path、status、amount。

### Q3：今天最容易出错的工程点是什么？

把模型输出当成可信事实或可直接执行动作。正确做法是让 Runtime 做校验、记录、权限和验证。

### Q4：学完今天应该产出什么？

为 `run_command` 写一个安全 Schema，限制 cwd、命令和超时。

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

### 13.1 Input Schema 是 Tool 的第一道护栏

模型生成工具参数时，可能出现：

- 少传参数。
- 参数类型错误。
- 传入越权路径。
- 传入危险命令。
- 传入过大的 limit。
- 把自然语言塞进结构化字段。

`Input Schema（输入结构定义）` 的作用是把这些问题在执行前拦住。

### 13.2 一个安全的 read_file Schema

```json
{
  "type": "object",
  "properties": {
    "path": {
      "type": "string",
      "description": "Relative path under the workspace. Absolute paths and '..' are not allowed."
    },
    "startLine": {
      "type": "integer",
      "minimum": 1
    },
    "maxLines": {
      "type": "integer",
      "minimum": 1,
      "maximum": 200
    }
  },
  "required": ["path"]
}
```

关键设计：

- `path` 使用 workspace 相对路径。
- 禁止绝对路径。
- 禁止 `..` 路径穿越。
- `maxLines` 设置上限，防止大文件污染上下文。

### 13.3 一个危险的 run_command Schema

差的设计：

```json
{
  "command": "string"
}
```

问题是模型可以传入任何命令。

更安全的设计：

```json
{
  "type": "object",
  "properties": {
    "command": {
      "type": "string",
      "description": "Command to run. Must be read-only or test command."
    },
    "cwd": {
      "type": "string",
      "description": "Relative workspace directory."
    },
    "purpose": {
      "type": "string",
      "enum": ["inspect", "test", "build", "diagnose"]
    }
  },
  "required": ["command", "cwd", "purpose"]
}
```

但仅靠 Schema 不够，Runtime 还要做命令白名单和风险分类。

### 13.4 Schema 校验和业务校验的区别

Schema 校验：

```text
path 是 string
maxLines 是 integer
purpose 属于 enum
```

业务 / 安全校验：

```text
path 是否在 workspace 内
command 是否包含 rm -rf
cwd 是否允许访问
用户是否有权限运行测试
```

两者都需要。Schema 只解决结构问题，不解决全部安全问题。

### 13.5 SchemaValidationResult 设计

```java
public class SchemaValidationResult {
    private boolean valid;
    private List<FieldError> fieldErrors;
    private String normalizedInput;
}

public class FieldError {
    private String field;
    private String code;
    private String message;
}
```

错误要结构化，这样 Observation 才能清楚告诉模型如何修正。

### 13.6 今日实践输出方向

为 `search_code` 设计 Schema：

```json
{
  "keyword": "required string, max length 100",
  "path": "required string, workspace relative",
  "filePattern": "optional enum: java/md/xml/yml",
  "maxResults": "integer, max 50"
}
```

再补充校验规则：

- keyword 不能为空。
- path 不能越界。
- maxResults 不能超过 50。
- filePattern 不能任意传正则。

## 今日笔记

### 预习问题

- 如何防止模型传入危险参数？
- `Input Schema（输入结构定义）` 在 Agent Runtime 的哪个模块落地？
- 如果忽略 `Input Schema（输入结构定义）`，会造成什么工程风险？

### 主动回忆

1. 今日主题是 `Input Schema（输入结构定义）`，核心问题是：如何防止模型传入危险参数？
2. 关键概念包括：Input Schema（输入结构）、Required Fields（必填字段）、Enum（枚举）。
3. 工程判断要落到 Runtime：谁负责决策、谁负责执行、谁负责记录、谁负责验证。

### 费曼输出

用 5 句话给一个 Java 后端同事讲清楚今天主题：

1. `Input Schema（输入结构定义）` 不是孤立术语，它要解决的是 Agent 从“会回答”走向“可执行、可控制、可验证”的问题。
2. 模型可以参与推理和生成候选动作，但 Runtime 必须负责边界、状态、权限、工具执行和审计。
3. 如果没有结构化设计，Agent 很容易出现假成功、重复行动、上下文污染或不可追踪失败。
4. 后端视角下，可以把它类比成服务编排、状态机、权限网关、审计日志或可观测性体系中的一个环节。
5. 学完今天，至少要能说清楚它的输入、输出、失败模式、验证方式和最小实现方案。

### 3 条要点

- Input Schema（输入结构）：先理解定义，再追问它在 Runtime 中由哪个组件负责。
- Required Fields（必填字段）：不要只停留在 prompt 层，要落实到 Schema、状态、策略、日志或流程里。
- Agent 工程化不是让模型“更自由”，而是让模型的推理能力被 Runtime 安全、结构化、可追踪地使用。

### Java / 后端类比

- 像给内部服务设计 API：接口、参数、返回值、错误码、权限和审计都要清楚。

### 今日小练习

**练习目标**：把 `Input Schema（输入结构定义）` 从概念理解推进到可落地的工程设计。

**任务说明**：为 run_command 写一个安全 Schema，限制 cwd、命令、参数、超时和输出大小。

**操作步骤**：

1. 先用 3 句话写清楚这个练习要解决的核心问题。
2. 列出涉及的关键概念：`Input Schema（输入结构）`、`Required Fields（必填字段）`、`Enum（枚举）`。
3. 写出最小数据结构或流程图，优先使用表格、伪代码或 Mermaid。
4. 补充异常情况：失败、超时、权限不足、输入不完整、结果无法验证。
5. 写出最终输出物，并说明它如何被 Runtime 记录、验证或复用。

**建议输出物**：

```text
标题：Input Schema（输入结构定义） 小练习
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

- `Input Schema（输入结构定义）` 的最小可用实现需要哪些类、字段或接口？
- 这个能力上线后，失败时我应该通过哪些日志、Trace 或状态字段定位问题？

### 间隔复习

- D+1：不看资料，用 3 句话复述 `Input Schema（输入结构定义）` 的核心思想。
- D+3：补画一张小图，标出它和 Runtime 其他模块的关系。
- D+7：用一个 Java 后端场景重新解释它，并检查是否能说出风险和验证方式。
