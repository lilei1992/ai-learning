# Week 02：Runtime 主循环实现

> 学习目标：把 Week 01 的概念落到一个可实现的 `AgentRuntime.run()` 主流程。  
> 核心产出：最小 Agent Runtime 伪代码 + 主循环状态图 + 本周 QA。  
> 返回总目录：[`../README.md`](../README.md)  
> 本周 QA：[`week-02-qa-summary.md`](week-02-qa-summary.md)

## 本周主线

本周不再重复解释“Agent 是什么”，而是学习一个 Agent Runtime 如何真正跑起来：

```text
User Goal
-> Context Assembly
-> Model Invocation
-> Action Parsing
-> Permission Check
-> Tool Execution
-> Observation
-> State Update
-> Stop / Continue
```

## 本周学习重心调整

第二周不要当成 7 个孤立知识点学习，而要当成一条完整执行链路：

> Runtime 负责控制执行过程，Model 只负责提出下一步建议。

本周真正要抓住 5 个核心思想：

1. **模型没有执行权**  
   LLM 可以生成计划、解释原因、提出工具调用，但真正执行动作的是 Runtime。  
   工程含义：模型输出必须经过解析、校验、权限判断和审计。

2. **Agent Loop 的核心是状态推进**  
   每一轮不是重复聊天，而是基于 `State（状态）` 和 `Observation（观察结果）` 推进任务。  
   工程含义：没有状态存储，就无法恢复、无法调试、无法判断是否完成。

3. **Observation 是现实反馈**  
   工具结果、测试输出、文件 diff、权限拒绝都应该变成 Observation。  
   工程含义：下一轮模型决策必须基于事实反馈，而不是基于模型自我感觉。

4. **Stop Condition 是工程判断，不是模型声明**  
   “完成了”必须由证据支持，例如测试通过、文件已修改、审批通过、状态已变更。  
   工程含义：要区分 `DONE_VERIFIED` 和 `DONE_UNVERIFIED`。

5. **每一步都要可追踪**  
   Agent 做了什么、为什么做、工具返回了什么、状态如何变化，都要进入 Trace / Transcript。  
   工程含义：没有执行记录，就无法排查失败，也无法建立信任。

学习时优先追问：

- 当前步骤由模型负责，还是 Runtime 负责？
- 这一步改变了什么状态？
- 这一步有没有真实证据？
- 失败后能不能恢复？
- 最终用户能不能验证结果？

## 每日学习内容

| Day | 主题 | 核心问题 | 学习要点 | 输出物 |
|-----|------|----------|----------|--------|
| Day 08 | Agentic Loop（智能体主循环）结构 | Agent Runtime 的主循环到底循环什么？ | Goal、State、Action、Observation、Stop 的关系 | 画一张 Runtime 主循环图 |
| Day 09 | Context Assembly（上下文组装） | 每次调用模型前应该放入哪些上下文？ | System / Developer / User / Memory / Tool Result 的优先级 | 写一份上下文组装规则 |
| Day 10 | Model Invocation（模型调用） | Runtime 如何屏蔽不同模型 API 差异？ | Model Adapter、请求参数、流式输出、错误映射 | 设计 `ModelClient` 接口 |
| Day 11 | Tool Call Parsing（工具调用解析） | 模型输出如何变成可执行动作？ | JSON 解析、参数校验、非法动作处理 | 设计 `AgentAction` 数据结构 |
| Day 12 | Stop Condition（停止条件） | Agent 什么时候应该停止？ | Done、Failed、Cancelled、Timeout、MaxTurns | 写停止条件检查表 |
| Day 13 | Error Recovery（错误恢复） | 工具失败或模型异常后如何继续？ | retry、fallback、ask user、fail fast | 写错误恢复策略表 |
| Day 14 | Week 2 复盘 | 如何串起一个最小 Runtime？ | 主循环、状态更新、执行记录 | 写最小 Runtime 伪代码 |

## 本周实践

用 Java 伪代码实现一个最小 Runtime：

```java
public AgentResult run(AgentTask task) {
    AgentState state = stateStore.create(task);
    while (!state.shouldStop()) {
        AgentContext context = contextAssembler.assemble(state);
        ModelOutput output = modelClient.invoke(context);
        AgentAction action = actionParser.parse(output);
        PermissionDecision decision = permissionService.check(action);
        Observation observation = executor.executeIfAllowed(action, decision);
        state.apply(observation);
        traceRecorder.record(state, action, observation);
    }
    return state.toResult();
}
```

## 常见坑

- 把 Runtime 写成一次 HTTP 请求，没有循环和状态。
- 没有 `maxTurns`，导致无限调用模型。
- 工具失败被吞掉，最终制造假成功。
- 每轮都塞完整历史，导致上下文越来越脏。
- 没有保存 `stopReason`，无法排查为什么停止。

## 检查标准

- 能画出 Agent Runtime 主循环。
- 能解释每轮模型调用前上下文如何组装。
- 能说明模型输出为什么必须先解析和校验。
- 能列出至少 5 种停止原因。
- 能写出一个可读的 `AgentRuntime.run()` 伪代码。

## 复习建议

如果时间有限，第二周优先复习这条链：

```text
Goal
-> State
-> Context
-> Model Decision
-> Action Validation
-> Tool Execution
-> Observation
-> State Update
-> Stop Condition
```

不要把重点放在“记住所有术语”，而要能解释：

- 为什么 Agent Runtime 不是普通 Controller。
- 为什么模型输出不能直接执行。
- 为什么工具失败也要反馈给模型。
- 为什么完成必须有证据。
- 为什么 Trace 是 Runtime 的基础设施，而不是附加日志。
