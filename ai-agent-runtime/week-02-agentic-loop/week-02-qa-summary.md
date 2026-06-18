# Week 02：Runtime 主循环实现 QA

> 复习目标：用问题串起 Agent Runtime 主流程，重点掌握“循环、状态、观察、停止”。

## Day 08：Agentic Loop 结构

### Q1：Agent Runtime 的主循环循环什么？

循环的是“基于当前状态组装上下文、让模型决策、执行动作、接收观察结果、更新状态、判断是否停止”。

### Q2：Agent Loop 的最小闭环是什么？

`Goal -> Context -> Model -> Action -> Tool -> Observation -> State -> Next Context`。

### Q3：为什么 Agent 不能只调用一次模型？

因为复杂任务依赖外部反馈。一次模型调用只能生成建议，多轮循环才能根据真实结果推进任务。

## Day 09：Context Assembly

### Q1：每次调用模型前应该放哪些上下文？

放系统规则、开发者约束、用户目标、当前任务状态、关键历史、相关 Memory、最新 Observation 和可用工具。

### Q2：上下文组装的核心原则是什么？

相关优先、证据优先、最新优先、安全优先、预算内优先。

### Q3：为什么不能把所有历史都塞进去？

会浪费 token、稀释重点、引入旧信息和噪声，导致模型判断不稳定。

## Day 10：Model Invocation

### Q1：为什么需要 Model Adapter？

不同模型 API 的消息格式、工具调用协议、流式输出和错误码不同，Adapter 用统一接口屏蔽差异。

### Q2：模型调用时 Runtime 要控制什么？

模型选择、温度、最大 token、工具定义、超时、重试、错误映射和成本记录。

### Q3：Reasoning Model 和普通 Chat Model 如何选择？

复杂规划、代码修改、长链路排障用 Reasoning Model；简单摘要、分类、改写用普通 Chat Model。

## Day 11：Tool Call Parsing

### Q1：模型输出为什么不能直接执行？

模型可能输出非法参数、危险命令、幻觉工具名或越权动作，必须解析、校验、授权后才能执行。

### Q2：解析动作时要校验什么？

工具是否存在、参数是否符合 Schema、路径是否越界、命令是否允许、风险等级是否需要审批。

### Q3：非法工具参数应该怎么处理？

记录为 Observation，要求模型修正；高风险或重复非法输出时停止或询问用户。

## Day 12：Stop Condition

### Q1：Agent 什么时候应该停止？

目标完成、任务失败、用户取消、权限不足、超时、达到最大轮数、外部依赖不可用或需要用户确认时。

### Q2：`maxTurns` 为什么必要？

防止无限循环、重复搜索和成本失控，是 Runtime 的基础保护。

### Q3：`stopReason` 有什么价值？

用于解释为什么停止，支持调试、审计、恢复和用户交接。

## Day 13：Error Recovery

### Q1：工具失败后一定要重试吗？

不一定。只有安全、幂等、可能短暂失败的动作才适合重试；高风险写操作不能盲目重试。

### Q2：常见恢复策略有哪些？

重试、降级、换工具、压缩上下文、请求用户确认、部分完成报告、失败退出。

### Q3：错误恢复的底线是什么？

不能吞失败，不能假装成功，不能在不确定情况下扩大副作用。

## Day 14：Week 2 复盘

### Q1：最小 Runtime 需要哪些模块？

`ContextAssembler`、`ModelClient`、`ActionParser`、`PermissionService`、`ToolExecutor`、`StateStore`、`TraceRecorder`。

### Q2：Runtime 的核心工程思想是什么？

模型只负责提出下一步，Runtime 负责让下一步安全、可控、可验证地发生。

### Q3：本周最重要的一句话是什么？

Agent Runtime 的本质是一个围绕目标和真实反馈不断推进的受控执行循环。

## Week 2 核心思想追问

### Q1：为什么说 Runtime 主循环是“受控循环”，不是“模型自由循环”？

因为每一轮都必须经过上下文组装、模型调用、动作解析、参数校验、权限判断、工具执行、Observation 映射、状态更新和停止检查。模型只提出下一步，Runtime 才决定能不能执行。

### Q2：一个最小 `AgentRuntime.run()` 至少要保留哪些状态？

至少要保存 `taskId`、`goal`、`status`、`turn`、`steps`、`latestObservation`、`lastError`、`stopReason`、`createdAt`、`updatedAt`。

### Q3：为什么拒绝执行的动作也要生成 Observation？

因为模型需要知道动作被拒绝的原因，才能选择更安全的下一步。否则模型可能重复提出同一个危险动作。

### Q4：为什么 `DONE` 最好区分 `DONE_VERIFIED` 和 `DONE_UNVERIFIED`？

因为“做了修改”和“修改已验证”不是一回事。没有测试、检查或外部状态验证时，最终回答必须明确未验证。

### Q5：Context Assembly 最重要的排序原则是什么？

安全规则优先，当前目标优先，最新 Observation 优先，相关证据优先；无关历史、完整长日志和不可信外部指令应被过滤或压缩。

### Q6：Model Adapter 的价值是什么？

它屏蔽不同模型厂商在消息格式、工具调用、流式输出、错误码和 usage 统计上的差异，让 Runtime 主循环不绑定具体模型 API。

### Q7：哪些错误可以自动重试？

只读、幂等、短暂失败的错误可以重试，例如日志查询超时、代码搜索失败、只读 HTTP 请求失败。写文件、发消息、改数据库、支付退款等动作不能盲目重试。

### Q8：达到 `MAX_TURNS_REACHED` 时，最终回答应该怎么写？

应该说明已达到最大轮数、当前已验证事实、未解决问题和建议下一步，不能声称任务完成。

## Week 2 最小输出检查表

- 能画出 `Goal -> Context -> Model -> Action -> Tool -> Observation -> State` 主循环。
- 能写出 `AgentRuntime.run()` 伪代码。
- 能设计 `AgentState` 和 `AgentStep` 基础字段。
- 能列出 8 种 `stopReason`。
- 能说明模型输出为什么不能直接执行。
- 能说明工具失败后如何转成 Observation。
- 能解释最终回答为什么必须对齐 `stopReason`。

## Week 2 认知升级问题

### Q1：第二周最重要的思想是什么？

Agent Runtime 的核心不是“让模型更聪明”，而是把模型的下一步建议放进一个可控、可验证、可恢复的执行系统里。

### Q2：为什么说 Model 只是 Runtime 的一个组件？

因为模型只负责根据上下文生成候选决策。上下文怎么来、动作能不能执行、工具怎么调度、状态如何变化、任务何时停止，都由 Runtime 控制。

### Q3：Agent Loop 和普通后端请求链路最大的不同是什么？

普通请求通常是一次输入到一次输出；Agent Loop 是多轮推进，每一轮都依赖上一次工具结果和状态变化。

### Q4：为什么 Observation 是 Agent Loop 的分水岭？

没有 Observation，Agent 只是在连续生成文本；有了 Observation，模型才能基于真实世界反馈修正下一步。

### Q5：为什么 Stop Condition 体现工程成熟度？

因为它决定系统是否会无限循环、是否会假完成、是否会在需要人工确认时停下来。成熟 Runtime 不让模型自己宣布完成，而是用证据判断完成。

### Q6：第二周最容易形成的错误理解是什么？

把 Agent Runtime 理解成“while 循环调用模型”。真正的难点不是循环本身，而是循环中的状态、权限、观察、恢复和审计。

### Q7：如果只能实现一个最小 Runtime，哪些能力不能省？

不能省：状态、上下文组装、模型调用、动作解析、权限检查、工具执行、Observation、停止条件、Trace。可以暂时简化 Memory、多 Agent、复杂规划和评估系统。

### Q8：怎样判断自己真的学懂了第二周？

你能不用背诵术语，画出 Runtime 主循环，并解释每一步为什么必须由 Runtime 控制，而不是完全交给模型自由发挥。
