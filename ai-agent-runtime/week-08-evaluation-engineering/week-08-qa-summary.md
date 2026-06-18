# Week 08：Evaluation、Observability 与实战项目设计 QA

> 复习目标：让 Agent 从 Demo 走向可评估、可观测、可持续改进的工程系统。

## Day 50：Agent Evaluation

### Q1：如何判断 Agent 真的有效？

看任务完成率、答案正确率、工具成功率、验证通过率、人工评分和失败类型分布。

### Q2：为什么不能只看最终回答？

最终回答可能幻觉或假成功，必须结合执行轨迹和外部状态验证。

### Q3：什么是 Golden Dataset？

一组标准任务、输入、期望结果和评分规则，用于回归评估 Agent 行为。

## Day 51：Trace / Observability

### Q1：Agent Trace 应记录什么？

task、step、model、prompt 摘要、tool、input summary、output summary、status、cost、latency、error。

### Q2：Trace 对排查有什么价值？

能定位失败发生在模型判断、工具执行、权限拒绝、上下文组装还是外部系统。

### Q3：Trace 和审计日志区别是什么？

Trace 偏工程调试和性能分析；审计日志偏安全、合规和责任追踪。

## Day 52：Regression Test

### Q1：Agent 为什么需要回归测试？

模型、Prompt、工具、上下文策略变化都可能导致行为退化。

### Q2：回归测试测什么？

最终结果、工具调用顺序、关键证据、是否越权、是否跳过验证。

### Q3：轨迹回放有什么价值？

能比较不同版本 Agent 在同一任务上的行为差异。

## Day 53：Cost and Latency

### Q1：Agent 成本来自哪里？

输入 token、输出 token、模型价格、工具调用、检索、重试和多轮循环。

### Q2：如何降低成本？

上下文裁剪、缓存、摘要、小模型路由、减少重复工具调用、限制最大轮数。

### Q3：延迟如何优化？

并发只读工具、缓存稳定上下文、流式输出、异步长任务、提前停止无效循环。

## Day 54：Human Experience

### Q1：用户为什么需要可解释过程？

Agent 会执行动作，用户需要知道它做了什么、为什么做、结果是否验证。

### Q2：哪些交互能力很重要？

确认、取消、暂停、恢复、查看 diff、查看证据、接管执行。

### Q3：好的最终回答应包含什么？

已完成事项、证据、验证结果、未验证项、风险和后续建议。

## Day 55：Design Your Own Agent Runtime

### Q1：通用 Runtime 的核心模块有哪些？

User Input、Context Assembly、Model Adapter、Tool Registry、Permission Control、Planner、Executor、State Store、Memory Store、Trace、Evaluation。

### Q2：MySQL / Redis / MQ / ES / Vector DB 如何配合？

MySQL 存任务和审计；Redis 做缓存、锁、限流；MQ 跑异步长任务；ES 搜索日志和文档；Vector DB 做语义检索。

### Q3：Java 后端实现优先设计哪些类？

`AgentTask`、`AgentState`、`AgentContext`、`ModelClient`、`ToolDefinition`、`ToolExecutor`、`PermissionDecision`、`Observation`、`TraceEvent`。

## Day 56：最终复盘

### Q1：三个实战项目的学习顺序是什么？

先做个人知识库 Agent，再做代码仓库 Review Agent，最后做后端运维排障 Agent。

### Q2：如果只学 20%，先学什么？

Agent Loop、Tool Calling、Context Engineering、State、Permission、Trace、Evaluation。

### Q3：本周最重要的一句话是什么？

没有评估和可观测性的 Agent 只是 Demo，不是可持续运行的工程系统。

## Week 8 认知升级问题

### Q1：第八周最重要的思想是什么？

Agent 工程最终要用评估闭环收口。没有评估、Trace 和回归测试，Agent 只能演示，不能稳定演进。

### Q2：Agent Evaluation 和普通接口测试有什么区别？

普通接口测试多是确定输入输出；Agent 评估要看过程、工具使用、证据、状态变化、成本、失败恢复和最终质量。

### Q3：为什么 Trace 是评估基础？

Trace 记录每一步上下文、模型输出、动作、工具结果、权限和状态变化。没有它，失败只能猜。

### Q4：回归测试应该覆盖什么？

覆盖典型成功任务、常见失败任务、高风险拒绝、上下文污染、工具超时、权限不足和成本边界。

### Q5：成本和延迟为什么是工程指标？

用户不会只关心 Agent 是否聪明，还会关心是否足够快、是否可控、是否值得花钱。

### Q6：用户体验如何影响 Agent 信任？

清楚展示进度、证据、失败原因和未验证项，会比一句“完成了”更可信。

### Q7：设计自己的 Agent Runtime 时最小模块有哪些？

ContextAssembler、ModelAdapter、ToolRegistry、PermissionService、Executor、StateStore、MemoryStore、TraceRecorder、Evaluator。

### Q8：第八周学懂的标志是什么？

你能为一个 Agent 项目定义任务集、评估指标、Trace 字段、回归测试流程和上线监控方案。

## Week 8 输出检查

- 能设计 Agent 评估指标。
- 能画出 Trace / Observability 流程。
- 能设计回归测试任务集。
- 能说明成本和延迟优化策略。
- 能设计用户体验状态展示。
- 能输出自己的 Agent Runtime 架构草图。
