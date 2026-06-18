# Week 03：Tool System 工程实现 QA

> 复习目标：理解工具不是普通函数，而是 Agent 的受控执行能力。

## Day 15：Tool Interface

### Q1：一个工具最少应该包含哪些元数据？

`name`、`description`、`inputSchema`、`riskLevel`、`timeout`、`permissionRequired`、`idempotent`。

### Q2：工具描述为什么重要？

模型依赖描述判断何时使用工具；描述模糊会导致错用、滥用或不用。

### Q3：工具接口的工程边界是什么？

工具只暴露受控能力，不暴露任意系统权限。

## Day 16：Input Schema

### Q1：Tool Schema 解决什么问题？

限制模型输入，明确参数类型、必填项、枚举范围和安全边界。

### Q2：路径类参数如何设计更安全？

使用 workspace 相对路径，限制根目录，禁止 `..` 越界，必要时只允许白名单目录。

### Q3：命令类参数为什么危险？

命令可能删除文件、泄露数据、访问网络或修改系统状态，必须白名单、审批和审计。

## Day 17：Tool Result

### Q1：Tool Result 应包含什么？

状态、摘要、关键证据、错误信息、原始输出引用、耗时和是否可重试。

### Q2：Tool Result 和 Observation 有什么关系？

Tool Result 是工具原始执行结果；Observation 是整理后给模型决策使用的结果。

### Q3：为什么不直接把原始输出给模型？

原始输出可能太长、含噪声、含敏感信息，容易污染上下文。

## Day 18：Concurrency Safe

### Q1：工具并发会带来什么风险？

写冲突、重复副作用、资源竞争、日志混乱、状态覆盖。

### Q2：如何让工具并发更安全？

按资源加锁，区分读写工具，写操作串行化，保证幂等，记录 step 顺序。

### Q3：哪些工具不适合并发？

写文件、数据库变更、Git 操作、发布、删除、发送消息等有副作用动作。

## Day 19：Tool Scheduler

### Q1：Tool Scheduler 负责什么？

负责任务排队、限流、超时、取消、并发控制、重试调度和结果回收。

### Q2：为什么工具需要超时？

防止 Agent 卡死在外部依赖、慢命令或网络请求上。

### Q3：限流解决什么问题？

控制成本、防止外部系统被打爆、防止模型循环导致工具滥用。

## Day 20：Tool Error Handling

### Q1：工具错误应该如何分类？

参数错误、权限错误、超时、外部服务错误、业务错误、不可恢复错误。

### Q2：什么错误适合重试？

网络抖动、临时超时、限流后等待、只读幂等查询失败。

### Q3：什么错误不应自动重试？

删除、支付、退款、写数据库、发消息、Git push 等非幂等高风险动作。

## Day 21：Week 3 复盘

### Q1：工具调用完整链路是什么？

模型提出工具调用 -> 解析 -> Schema 校验 -> 权限判断 -> 调度执行 -> 结果整理 -> 写入 Transcript -> 生成 Observation。

### Q2：Tool System 的核心思想是什么？

把模型“想做事”的意图转成安全、受控、可验证的系统动作。

### Q3：本周最重要的一句话是什么？

工具越强，Runtime 的 Schema、权限、审计和失败处理越重要。

## Week 3 核心思想追问

### Q1：为什么 Tool 不是普通函数？

因为 Tool 的调用来源是模型输出，而模型可能生成错误参数、危险动作或不存在的工具。Runtime 必须把 Tool 当成受控 API，而不是可信内部函数。

### Q2：一个生产级 ToolDefinition 至少需要哪些字段？

至少需要 `name`、`description`、`inputSchema`、`riskLevel`、`permissionRequired`、`idempotent`、`timeout`、`scopes`、`outputPolicy`。

### Q3：Tool Schema 解决什么，解决不了什么？

Schema 能解决参数结构、类型、必填项和枚举范围；但不能完全解决权限、安全、路径越界、危险命令等问题，这些还需要 Runtime 策略校验。

### Q4：Tool Result 和 Observation 的区别是什么？

Tool Result 是工具执行后的结构化结果；Observation 是 Runtime 从 Tool Result 中提炼出来、给模型下一轮决策使用的事实反馈。

### Q5：为什么 Tool Result 需要 `rawOutputRef`？

长日志、大文件和完整命令输出不应直接进入上下文。`rawOutputRef` 让系统保留可追溯性，同时避免污染模型上下文。

### Q6：哪些工具适合并发，哪些不适合？

只读工具如 `read_file`、`search_code` 适合并发；写文件、删除文件、Git 操作、数据库写操作不适合随意并发。

### Q7：Tool Scheduler 为什么必须有超时和限流？

超时防止工具卡死；限流防止循环调用、成本失控和外部系统压力过大。

### Q8：什么错误可以重试？

只读、幂等、短暂失败的错误可以重试，例如网络抖动、限流、只读查询超时。非幂等写操作不能盲目重试。

### Q9：为什么拒绝或失败的工具调用也要进入 Transcript？

因为拒绝和失败同样是执行事实。它们能解释 Agent 为什么改变计划、为什么停止，以及是否存在安全风险。

### Q10：AI Coding Agent 第一版应该开放哪些工具？

建议只开放 `read_file`、`list_directory`、`search_code`、`run_test`、`write_file_with_diff_preview`。删除、数据库写、发消息、Git push 等高风险工具先不要开放。

## Week 3 最小输出检查表

- 能设计 `ToolDefinition`。
- 能写出 `read_file` / `search_code` / `run_command` 的 Schema。
- 能设计 `ToolResult` 和 `Observation` 映射规则。
- 能区分只读工具和写工具的并发策略。
- 能设计 Tool Scheduler 的超时、限流、重试策略。
- 能解释哪些工具需要人工确认。
- 能画出工具调用完整链路。
