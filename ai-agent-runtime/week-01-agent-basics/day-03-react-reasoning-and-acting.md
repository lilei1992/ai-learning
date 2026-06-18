# Day 03：ReAct（推理与行动）模型

> 所属周：Week 01 - Agent 基础模型
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 02`](../week-01-agent-basics/day-02-chat-api-workflow-agent.md) ｜ 下一天：[`Day 04`](../week-01-agent-basics/day-04-state-machine-agent.md)

## 1. 今日核心目标

今天只解决一个核心问题：

> `ReAct（Reasoning and Acting，推理与行动）` 为什么是 Agent 能够持续推进任务的基础模型？

学完今天，你应该能做到：

- 解释 `Reasoning（推理）`、`Acting（行动）`、`Observation（观察）` 的关系。
- 说清楚为什么 Agent 不是一次性回答，而是一个多轮闭环。
- 写出一个“修复测试失败”的 ReAct 轨迹。
- 解释为什么工具结果必须回到下一轮上下文。
- 区分 ReAct 思想和具体 Agent 框架。

## 2. 今日不追求掌握的内容

这些内容后面会单独展开，今天只知道它们和 ReAct 有关系：

- Tool Schema（工具参数结构）
- Tool Scheduler（工具调度）
- Context Compaction（上下文压缩）
- Permission Pipeline（权限管线）
- Multi-Agent Orchestration（多智能体编排）

## 3. 学习时间安排

### Busy Mode（忙碌模式，15-20 分钟）

只完成：

- 阅读第 4、5、6 节。
- 写 3 条 ReAct 要点。
- 回答第 12 节前 2 个自测问题。

### Standard Mode（标准模式，45 分钟）

建议节奏：

| 时间 | 内容 |
|------|------|
| 0-10 分钟 | 理解 ReAct 的基本循环 |
| 10-25 分钟 | 阅读测试修复示例 |
| 25-35 分钟 | 对照 Java / 后端类比 |
| 35-45 分钟 | 完成今日输出和主动回忆 |

### Deep Mode（深度模式，90 分钟）

额外完成：

- 画出 ReAct 轨迹图。
- 写一个简化 Agent Loop 伪代码。
- 列出 5 个 ReAct 在生产环境中的风险点。

## 4. 最小心智模型

ReAct 的核心不是“模型先想再做”这么简单，而是：

```text
Thought（推理当前应该做什么）
-> Action（请求执行一个工具或输出答案）
-> Observation（接收真实执行结果）
-> Thought（基于真实结果修正下一步）
```

如果没有 `Action`，模型只能回答文本。

如果没有 `Observation`，模型不知道真实世界发生了什么。

如果没有下一轮 `Thought`，工具结果不会变成新的决策依据。

所以 ReAct 的本质是：

> 让模型在真实反馈中持续修正行为。

## 5. 概念拆解

### 5.1 Reasoning（推理）

`Reasoning` 是模型根据目标、上下文、历史步骤和工具结果，判断下一步该做什么。

它通常回答这些问题：

- 当前目标是什么？
- 已经知道哪些事实？
- 缺少哪些信息？
- 下一步应该调用哪个工具？
- 是否已经满足停止条件？

注意：

> 推理不是事实本身。模型推理出来的判断，必须通过工具或用户反馈验证。

### 5.2 Acting（行动）

`Acting` 是模型向 Runtime 请求执行某个动作。

常见动作：

- 读取文件。
- 搜索代码。
- 执行测试。
- 调用 HTTP API。
- 打开浏览器。
- 写入文件。
- 给用户最终回答。

在生产级 Agent 中，模型通常不能直接执行动作。它只能产生一个结构化请求，由 Runtime 校验、授权、调度和执行。

### 5.3 Observation（观察）

`Observation` 是 Runtime 把工具执行结果反馈给 Agent。

它可能包含：

- 命令输出。
- 文件内容。
- 错误堆栈。
- HTTP 响应。
- 浏览器截图摘要。
- 权限拒绝结果。
- 超时或重试信息。

好的 Observation 应该满足：

- 事实清楚。
- 错误可诊断。
- 不隐藏失败。
- 不塞入无关大段输出。
- 能支撑下一轮决策。

### 5.4 Trajectory（轨迹）

`Trajectory` 是一次任务中所有 `Thought -> Action -> Observation` 的完整路径。

它的价值：

- 调试：知道 Agent 为什么走到这一步。
- 审计：知道执行过哪些动作。
- 复盘：知道失败是模型判断错、工具失败、权限拒绝，还是上下文缺失。
- 评估：可以把轨迹用于回归测试和行为分析。

## 6. 示例：Agent 修复单元测试失败

一个简化 ReAct 轨迹：

```text
Goal:
  修复 UserServiceTest 中失败的测试。

Thought:
  我需要先查看失败信息，确认是断言失败、编译失败还是环境失败。

Action:
  run_tests(UserServiceTest)

Observation:
  testCreateUser failed. Expected status ACTIVE, but actual status PENDING.

Thought:
  失败和默认用户状态有关。我需要查看测试和 UserService 的创建逻辑。

Action:
  read_file(UserServiceTest.java)

Observation:
  测试期望 createUser 后状态为 ACTIVE。

Action:
  read_file(UserService.java)

Observation:
  createUser 默认状态设置为 PENDING。

Thought:
  需要确认业务规则。可能是测试过期，也可能是实现错误。继续搜索状态变更规则。

Action:
  search_code("setStatus(UserStatus.ACTIVE)")

Observation:
  只有审核通过流程会设置 ACTIVE。

Thought:
  业务规则显示新用户应为 PENDING，测试期望可能过期。应该修改测试，或向用户确认需求。

Action:
  final_answer("发现测试期望与当前业务状态流不一致，建议确认新用户默认状态规则。")
```

这个例子说明：

- Agent 不应该看到一个失败就直接改代码。
- 每一步行动都应该有观察结果支撑。
- 当发现业务语义不确定时，停止并请求确认比盲改更安全。

## 7. Runtime 在 ReAct 中的职责

ReAct 不是模型自己完成的。Runtime 至少要负责：

- 把用户目标和历史轨迹组装成上下文。
- 把模型输出解析成工具调用或最终回答。
- 校验工具参数。
- 判断工具调用是否被允许。
- 执行工具并收集 Observation。
- 控制最大轮数和超时。
- 记录完整轨迹。
- 在错误时决定重试、降级、停止还是询问用户。

一句话：

> ReAct 是 Agent 的行为模式，Runtime 是让这个模式可执行、可控制、可审计的系统。

## 8. Java / 后端类比

可以把 ReAct 类比为一个有外部反馈的任务编排流程：

```text
Application Service
-> 调用外部服务
-> 根据返回结果更新状态
-> 决定下一步调用
-> 直到流程完成或失败
```

相似点：

- 都不是一次函数调用解决所有问题。
- 都依赖外部调用结果决定下一步。
- 都需要状态、日志、错误处理和停止条件。

不同点：

- 后端流程通常由代码规则决定下一步。
- Agent 的下一步可能由模型根据上下文动态判断。
- 因为模型输出不稳定，Runtime 必须增加更多护栏。

## 9. 常见误区

- 误区 1：ReAct 等于让模型暴露完整思考过程。
  - 更准确：工程上关注的是可执行的推理-行动-观察结构，不一定暴露内部推理细节。

- 误区 2：工具调用越多，Agent 越智能。
  - 更准确：工具调用要服务目标。无效搜索、重复读取、盲目执行会增加成本和风险。

- 误区 3：工具成功就代表任务成功。
  - 更准确：工具成功只是一步成功，任务是否完成还要看目标是否满足。

- 误区 4：Observation 可以随便塞完整日志。
  - 更准确：Observation 需要保留关键事实，避免污染上下文。

## 10. 今日输出

完成一个“Agent 修复单元测试失败”的 ReAct 轨迹，至少包含：

- 1 个 Goal。
- 4 轮以上 `Thought -> Action -> Observation`。
- 1 个停止原因。
- 1 个风险判断，例如业务语义不确定、测试环境失败、权限不足。

可选 Deep Mode 输出：

```text
while not stop:
  context = assemble(goal, trajectory)
  model_output = invoke_model(context)
  action = parse(model_output)
  observation = execute_tool(action)
  trajectory.append(action, observation)
```

补充说明每一行可能失败在哪里。

## 11. 通过标准

学完今天，你应该能回答：

- ReAct 的三个核心环节是什么？
- 为什么 Observation 必须进入下一轮上下文？
- Runtime 在 ReAct 中至少负责哪些事情？
- 为什么 Agent 不应该一看到错误就直接修改代码？
- ReAct 和固定 Workflow 的核心区别是什么？

### 11.1 ReAct 的三个核心环节是什么？

ReAct 的三个核心环节是：

```text
Reasoning（推理）
-> Acting（行动）
-> Observation（观察）
```

更完整地说，它通常表现为：

```text
Thought（思考 / 推理）
-> Action（行动 / 工具调用）
-> Observation（观察结果）
-> Next Thought（基于观察结果继续推理）
```

三个环节的职责：

| 环节 | 作用 |
|------|------|
| `Reasoning（推理）` | 判断当前目标、已知事实、缺失信息和下一步策略 |
| `Acting（行动）` | 请求 Runtime 执行工具、查询信息、修改文件或给出最终回答 |
| `Observation（观察）` | 把工具执行后的真实结果反馈给下一轮决策 |

关键点：

> ReAct 不是一次性“想完再做完”，而是通过真实反馈不断修正下一步。

### 11.2 为什么 Observation 必须进入下一轮上下文？

因为 Agent 的下一步决策必须基于真实世界反馈，而不是只基于模型猜测。

如果 Observation 不进入下一轮上下文，模型就不知道：

- 工具是否执行成功。
- 命令输出是什么。
- 文件内容是否符合预期。
- 测试失败的具体原因是什么。
- 权限是否被拒绝。
- 当前任务是否已经完成。

例如：

```text
Action:
  run_tests(UserServiceTest)

Observation:
  testCreateUser failed. Expected ACTIVE, actual PENDING.
```

下一轮模型看到这个 Observation，才能判断：

```text
需要检查用户状态初始化逻辑，而不是随机修改其他代码。
```

如果没有 Observation，Agent 就会变成“盲目行动”：

```text
执行了工具，但不知道结果；
不知道结果，却继续推理；
继续推理，只能靠猜。
```

所以 Observation 是 ReAct 闭环成立的基础。

### 11.3 Runtime 在 ReAct 中至少负责哪些事情？

Runtime 在 ReAct 中不是旁观者，而是执行控制层。

至少负责：

- `Context Assembly（上下文组装）`：把目标、历史轨迹、关键工具结果放入上下文。
- `Model Invocation（模型调用）`：调用模型，让模型给出下一步决策。
- `Action Parsing（动作解析）`：把模型输出解析成结构化工具调用或最终回答。
- `Permission Control（权限控制）`：判断动作是否允许执行。
- `Tool Execution（工具执行）`：真正执行读文件、跑命令、搜索、浏览器操作等工具。
- `Observation Mapping（观察结果映射）`：把工具原始输出整理成可用于下一轮决策的 Observation。
- `State Store（状态存储）`：保存任务状态、轨迹、已执行动作和中间结果。
- `Stop Condition（停止条件）`：控制最大轮数、超时、完成条件和失败退出。
- `Trace / Log（链路与日志）`：记录执行过程，方便审计、调试和复盘。

一句话：

> 模型负责提出下一步，Runtime 负责让下一步安全、可控、可追踪地发生。

### 11.4 为什么 Agent 不应该一看到错误就直接修改代码？

因为错误现象不等于根因。

例如测试失败：

```text
Expected ACTIVE, actual PENDING
```

可能有几种原因：

- 代码实现错了。
- 测试期望过期了。
- 业务规则变了。
- 测试数据构造错了。
- 环境状态不一致。
- Mock 配置不正确。

如果 Agent 一看到错误就直接修改实现，可能会：

- 改坏正确业务逻辑。
- 为了让测试通过而破坏真实行为。
- 忽略状态流转规则。
- 修改无关代码。
- 掩盖真正的问题。

更安全的 ReAct 路径应该是：

```text
先复现错误
-> 读取失败测试
-> 读取相关实现
-> 搜索业务规则
-> 判断根因
-> 必要时询问用户
-> 再决定是否修改
-> 修改后重新验证
```

尤其在订单、支付、库存、退款这类业务中，不能为了修一个测试就随意改变状态语义。

### 11.5 ReAct 和固定 Workflow 的核心区别是什么？

核心区别是控制流来源不同。

`Workflow（工作流）` 的下一步主要由预设流程决定：

```text
Step A
-> if condition then Step B
-> else Step C
```

它适合规则明确、流程稳定、风险较高的业务。

`ReAct` 的下一步主要由模型根据当前上下文和 Observation 动态决定：

```text
Goal
-> Thought
-> Action
-> Observation
-> Next Thought
```

它适合路径不明确、需要探索、需要根据工具结果不断调整的任务。

对比：

| 维度 | 固定 Workflow | ReAct |
|------|---------------|-------|
| 控制流 | 代码和规则预设 | 模型根据上下文动态决策 |
| 可预测性 | 高 | 中低 |
| 灵活性 | 中低 | 高 |
| 适合场景 | 审批、支付、履约、CI/CD | 代码修复、故障排查、资料研究 |
| 风险 | 流程设计错误 | 错误推理、错误工具调用、循环 |
| 验证方式 | 状态机测试、集成测试 | 轨迹评估、工具结果验证、回归测试 |

一句话：

> Workflow 是“按预设路线执行”，ReAct 是“边观察边决定路线”。

## 12. 自测问题

1. 如果工具执行失败，Observation 应该如何表达给模型？
2. 如果模型连续 3 次搜索同一个关键词，Runtime 应该怎么处理？
3. ReAct 为什么比单次 Chat API 更适合代码修复任务？
4. ReAct 的轨迹对审计和回归测试有什么价值？
5. 什么情况下 Agent 应该停止并询问用户，而不是继续行动？

## 13. 自测问题参考答案

### 13.1 如果工具执行失败，Observation 应该如何表达给模型？

Observation 不应该只写一句“失败了”，也不应该把几千行原始日志全部塞回上下文。

好的 Observation 应该表达清楚 5 件事：

- `status（状态）`：工具调用是 failed、timeout、permission_denied，还是 partial_success。
- `action（动作）`：刚才执行了什么工具和关键参数。
- `error（错误）`：关键错误信息是什么。
- `evidence（证据）`：必要的日志片段、文件路径、行号、命令输出摘要。
- `next_constraint（下一步约束）`：是否允许重试，是否需要换工具，是否需要用户确认。

示例：

```text
Observation:
Tool execution failed.

Tool:
  run_tests

Command:
  mvn test -Dtest=UserServiceTest

Status:
  failed

Key error:
  testCreateUser failed.
  Expected status ACTIVE, but actual status PENDING.

Evidence:
  File: UserServiceTest.java
  Test: testCreateUser

Next hint:
  Inspect UserService.createUser and current user status rules before changing code.
```

这个 Observation 的价值是：模型下一轮可以基于真实失败原因继续行动，而不是重新猜。

更差的写法：

```text
Observation:
测试失败。
```

问题是信息太少，模型不知道失败类型、失败位置和下一步该查什么。

另一种差写法：

```text
Observation:
直接粘贴 5000 行 Maven 日志。
```

问题是噪声太高，会占用 Context Window（上下文窗口），还可能让模型抓错重点。

### 13.2 如果模型连续 3 次搜索同一个关键词，Runtime 应该怎么处理？

Runtime 应该把这识别为可能的 `Looping（循环）` 或低效行为，而不是继续无限执行。

合理处理方式：

1. 记录重复行为。
2. 检查三次搜索的输入是否完全相同。
3. 检查搜索结果是否提供了新信息。
4. 如果没有新增信息，阻止继续重复搜索。
5. 把“重复搜索无新增结果”的 Observation 返回给模型。
6. 要求模型换策略，例如换关键词、读取已找到文件、总结当前证据，或询问用户。

示例 Observation：

```text
Observation:
Repeated search blocked.

Reason:
  The same keyword "createUser status" was searched 3 times.
  The latest search returned no new files or facts.

Constraint:
  Do not repeat the same search again.

Next options:
  - Open one of the matched files.
  - Search a different keyword.
  - Summarize current findings.
  - Ask the user for missing business context.
```

这里体现了 Runtime 的职责：

- 控制最大轮数。
- 防止无效循环。
- 降低成本。
- 避免 Agent 看起来“很忙”，但实际上没有推进任务。

从后端角度看，这类似于任务重试不能无限重试。连续失败或无进展时，需要进入熔断、降级或人工确认。

### 13.3 ReAct 为什么比单次 Chat API 更适合代码修复任务？

因为代码修复通常不是一次回答就能完成的任务，而是需要“边观察边行动”。

单次 Chat API 通常只能做到：

```text
输入错误信息 -> 输出可能原因和修改建议
```

但真实代码修复需要：

- 运行测试。
- 获取失败日志。
- 定位失败文件。
- 阅读相关代码。
- 判断业务规则。
- 修改实现或测试。
- 再次运行测试。
- 根据新结果继续调整。
- 最后确认是否真的修复。

这正好符合 ReAct：

```text
Thought:
  我需要先确认失败类型。

Action:
  run_tests

Observation:
  UserServiceTest 断言失败。

Thought:
  需要读取测试和实现。

Action:
  read_file

Observation:
  测试期望 ACTIVE，实现返回 PENDING。

Thought:
  需要确认业务规则，不能直接改。
```

核心差异：

| 维度 | 单次 Chat API | ReAct |
|------|---------------|-------|
| 输入 | 用户提供的信息 | 用户目标 + 工具观察结果 |
| 行为 | 生成回答 | 多轮决策和工具调用 |
| 是否能验证 | 默认不能 | 可以通过工具验证 |
| 是否能修正 | 需要用户再次输入 | 可以根据 Observation 自动调整 |
| 适合代码修复 | 只适合给建议 | 更适合真实执行和验证 |

一句话：

> 代码修复需要真实反馈，ReAct 把真实反馈变成下一步决策的一部分。

### 13.4 ReAct 的轨迹对审计和回归测试有什么价值？

`Trajectory（轨迹）` 记录了 Agent 从目标到结果的完整路径。

它对审计的价值：

- 能看到 Agent 执行了哪些工具。
- 能看到每个工具的输入参数。
- 能看到工具返回了什么 Observation。
- 能判断是否有未授权动作。
- 能判断最终结论是否有证据支撑。
- 能复盘 Agent 为什么做出某个决策。

例如：

```text
Goal:
  修复测试失败。

Action 1:
  run_tests(UserServiceTest)

Observation 1:
  testCreateUser failed, expected ACTIVE but got PENDING.

Action 2:
  read_file(UserService.java)

Observation 2:
  createUser sets status to PENDING.
```

有了这条轨迹，审计者可以判断：

- Agent 是否真的运行过测试。
- 是否真的读过相关代码。
- 是否在没有证据时乱改。
- 是否跳过了关键验证步骤。

它对回归测试的价值：

- 可以把成功轨迹转成测试用例。
- 可以比较新版本 Agent 是否走了更差路径。
- 可以检查是否出现重复搜索、跳过验证、错误工具调用。
- 可以评估模型或 Prompt 变更后行为是否退化。

例如评估一个代码修复 Agent，可以要求：

```text
必须先复现失败。
必须读取失败测试文件。
必须读取相关实现文件。
修改后必须再次运行测试。
不能直接声称完成。
```

这些规则都可以基于轨迹检查。

### 13.5 什么情况下 Agent 应该停止并询问用户，而不是继续行动？

Agent 应该在“不确定性已经影响安全或正确性”时停止，而不是继续猜。

常见停止场景：

1. 业务语义不明确。

例如：

```text
测试期望新用户状态是 ACTIVE，但代码当前逻辑是 PENDING。
```

如果无法从代码、文档、历史提交中确认规则，Agent 不应该直接改。

2. 操作风险较高。

例如模型想执行：

```bash
rm -rf .
```

或者要修改大量文件、删除数据、变更数据库 schema、修改支付退款逻辑。

3. 权限不足。

例如需要访问生产数据库、私有 API、GitHub 推送权限，但当前 Runtime 没有授权。

4. 多次尝试没有进展。

例如连续多轮搜索、测试、修改都没有新信息，继续执行只会浪费成本并增加风险。

5. 目标本身冲突。

例如用户要求“保持兼容”，但修复方案必须改变 API 合约。

6. 外部系统状态不稳定。

例如测试失败来自网络超时、依赖服务不可用、数据库连接失败，而不是代码逻辑错误。

7. 需要用户做价值判断。

例如两个方案都可行：

- 保持旧行为，修改测试。
- 改变实现逻辑，满足新测试。

如果这涉及业务含义，应该问用户。

停止时不要只说“我不知道”，而要给出结构化信息：

```text
当前发现：
  新用户默认状态存在冲突。

证据：
  - UserServiceTest 期望 ACTIVE。
  - UserService.createUser 当前设置 PENDING。
  - 审核流程中才会设置 ACTIVE。

风险：
  直接修改实现可能改变用户状态流转。

需要确认：
  新用户创建后应该是 ACTIVE 还是 PENDING？
```

一句话：

> 当继续行动需要猜业务规则、突破权限、执行高风险操作，或多轮无进展时，Agent 应该停止并询问用户。


## 1. 今日核心问题（标准化补充）

> ReAct 为什么能让 Agent 从回答走向行动？

这一节用于和后续周的学习结构对齐，帮助你快速进入当天主题。

## 5. 核心概念拆解（标准化补充）

- Reasoning（推理）：模型分析当前目标和上下文。
- Acting（行动）：模型提出工具调用请求。
- Observation（观察结果）：Runtime 把工具结果反馈给模型。
- Trajectory（轨迹）：推理、动作、结果组成的可审计链路。

## 9. 今日实践任务（标准化补充）

写出一个“测试失败 -> 搜索代码 -> 修改 -> 运行测试”的 ReAct 轨迹。

## 10. 自测问题与参考答案（标准化补充）

### Q1：为什么 Observation 必须进入下一轮上下文？

因为下一步决策必须基于真实工具反馈，而不是模型猜测。

### Q2：ReAct 和 Workflow 的区别是什么？

ReAct 边观察边决定路线；Workflow 按预设路线执行。

## 11. 常见坑（标准化补充）

- 把 Thought 当成事实。
- 工具失败后不反馈 Observation。
- 模型重复执行同一动作没有被 Runtime 阻止。

## 12. 今日总结（标准化补充）

ReAct 的关键不是模型会思考，而是每次行动后都有现实反馈，并由 Runtime 记录和控制。

## 13. 补充深度学习内容

ReAct 在工程中必须被 Runtime 包住：模型只能提出 Action，Runtime 负责解析、权限、执行和 Observation 映射。否则 ReAct 会变成模型自由行动，风险不可控。

## 今日笔记

### 预习问题

- `ReAct（Reasoning and Acting，推理与行动）` 为什么是 Agent 能够持续推进任务的基础模型？
- `ReAct（推理与行动）模型` 在 Agent Runtime 的哪个模块落地？
- 如果忽略 `ReAct（推理与行动）模型`，会造成什么工程风险？

### 主动回忆

1. 今日主题是 `ReAct（推理与行动）模型`，核心问题是：`ReAct（Reasoning and Acting，推理与行动）` 为什么是 Agent 能够持续推进任务的基础模型？
2. 关键概念包括：Reasoning（推理）、Acting（行动）、Observation（观察）。
3. 工程判断要落到 Runtime：谁负责决策、谁负责执行、谁负责记录、谁负责验证。

### 费曼输出

用 5 句话给一个 Java 后端同事讲清楚今天主题：

1. `ReAct（推理与行动）模型` 不是孤立术语，它要解决的是 Agent 从“会回答”走向“可执行、可控制、可验证”的问题。
2. 模型可以参与推理和生成候选动作，但 Runtime 必须负责边界、状态、权限、工具执行和审计。
3. 如果没有结构化设计，Agent 很容易出现假成功、重复行动、上下文污染或不可追踪失败。
4. 后端视角下，可以把它类比成服务编排、状态机、权限网关、审计日志或可观测性体系中的一个环节。
5. 学完今天，至少要能说清楚它的输入、输出、失败模式、验证方式和最小实现方案。

### 3 条要点

- Reasoning（推理）：先理解定义，再追问它在 Runtime 中由哪个组件负责。
- Acting（行动）：不要只停留在 prompt 层，要落实到 Schema、状态、策略、日志或流程里。
- 1. 如果工具执行失败，Observation 应该如何表达给模型？

### Java / 后端类比

- 像后端系统先划清 Controller、Service、Gateway、DB 的职责边界；Agent 也要先划清 LLM、Runtime、Tool、State 的边界。

### 今日小练习

**练习目标**：把 `ReAct（推理与行动）模型` 从概念理解推进到可落地的工程设计。

**任务说明**：写一条 ReAct 轨迹：从测试失败开始，经过搜索、阅读、修改、验证，直到停止。

**操作步骤**：

1. 先用 3 句话写清楚这个练习要解决的核心问题。
2. 列出涉及的关键概念：`Reasoning（推理）`、`Acting（行动）`、`Observation（观察）`。
3. 写出最小数据结构或流程图，优先使用表格、伪代码或 Mermaid。
4. 补充异常情况：失败、超时、权限不足、输入不完整、结果无法验证。
5. 写出最终输出物，并说明它如何被 Runtime 记录、验证或复用。

**建议输出物**：

```text
标题：ReAct（推理与行动）模型 小练习
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

- `ReAct（推理与行动）模型` 的最小可用实现需要哪些类、字段或接口？
- 这个能力上线后，失败时我应该通过哪些日志、Trace 或状态字段定位问题？

### 间隔复习

- D+1：不看资料，用 3 句话复述 `ReAct（推理与行动）模型` 的核心思想。
- D+3：补画一张小图，标出它和 Runtime 其他模块的关系。
- D+7：用一个 Java 后端场景重新解释它，并检查是否能说出风险和验证方式。
