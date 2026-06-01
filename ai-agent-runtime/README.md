# AI Agent Runtime 学习目录

> 创建日期：2026-06-01
> 组织方式：每周一个目录，每天一个主题文件。
> 原始汇总版：[`../ai-agent-runtime-daily-goals.md`](../ai-agent-runtime-daily-goals.md)

## 使用方式

- 按 `Day N` 顺序学习，工作忙时可以顺延，不需要按自然日期追赶。
- 每天至少留下 3 条要点、1 个 Java / 后端类比、1 个没想清楚的问题。
- 每周最后一天是 Review Day（复盘日），用于补齐 Busy Mode（忙碌模式）下跳过的输出物。

## 时间节奏

| 模式 | 时间 | 适用情况 |
|------|------|----------|
| Busy Mode（忙碌模式） | 15-20 分钟 | 加班、会议多、状态差，只看核心概念和自测问题 |
| Standard Mode（标准模式） | 45 分钟 | 普通工作日，完成概念学习、笔记和自测 |
| Deep Mode（深度模式） | 90 分钟 | 周末或空闲晚上，补图、伪代码和复盘 |

## 周目录

| 周次 | 主题 | 目录 | 学习目标 |
|------|------|------|----------|
| Week 1 | Agent 基础模型 | [`week-01-agent-basics/README.md`](week-01-agent-basics/README.md) | 分清 Chat API、Workflow、Agent、Runtime，建立 AI Agent Runtime 的基础 mental model（心智模型）。 |
| Week 2 | Agentic Loop 深入 | [`week-02-agentic-loop/README.md`](week-02-agentic-loop/README.md) | 理解 Agentic Loop（智能体主循环）的输入、执行、观察、停止和恢复机制。 |
| Week 3 | Tool System 深入 | [`week-03-tool-system/README.md`](week-03-tool-system/README.md) | 掌握 Tool Interface（工具接口）、Input Schema（输入结构定义）、Tool Result（工具结果）和 Tool Scheduler（工具调度器）。 |
| Week 4 | Context Management 深入 | [`week-04-context-management/README.md`](week-04-context-management/README.md) | 理解 Context Window（上下文窗口）、Context Pollution（上下文污染）、Context Compaction（上下文压缩）和 Memory Write Policy（记忆写入策略）。 |
| Week 5 | Permission System 深入 | [`week-05-permission-system/README.md`](week-05-permission-system/README.md) | 理解 AI Action Authorization（AI 动作授权）、Permission Pipeline（权限管线）、Sandbox（沙箱）、Hooks（钩子）和 Audit Log（审计日志）。 |
| Week 6 | MCP / Plugin / Extension | [`week-06-mcp-plugin-extension/README.md`](week-06-mcp-plugin-extension/README.md) | 理解 MCP（Model Context Protocol，模型上下文协议）、Plugin Architecture（插件架构）、Process Isolation（进程隔离）和 JSON-RPC（JSON 远程过程调用）。 |
| Week 7 | Multi-Agent 深入 | [`week-07-multi-agent/README.md`](week-07-multi-agent/README.md) | 掌握 Multi-Agent（多智能体）的任务拆解、上下文隔离、结果汇总、成本控制和失败处理。 |
| Week 8 | Evaluation 与工程落地 | [`week-08-evaluation-engineering/README.md`](week-08-evaluation-engineering/README.md) | 建立 Evaluation（评估）、Trace（链路记录）、Observability（可观测性）、Regression Test（回归测试）和落地设计能力。 |

## 每日主题索引

| Day | Week | 主题 | 文件 |
|-----|------|------|------|
| Day 01 | Week 1 | 认识 AI Agent Runtime（智能体运行时） | [`day-01-ai-agent-runtime.md`](week-01-agent-basics/day-01-ai-agent-runtime.md) |
| Day 02 | Week 1 | Chat API、Workflow、Agent 的区别 | [`day-02-chat-api-workflow-agent.md`](week-01-agent-basics/day-02-chat-api-workflow-agent.md) |
| Day 03 | Week 1 | ReAct（推理与行动）模型 | [`day-03-react-reasoning-and-acting.md`](week-01-agent-basics/day-03-react-reasoning-and-acting.md) |
| Day 04 | Week 1 | State Machine（状态机）视角理解 Agent | [`day-04-state-machine-agent.md`](week-01-agent-basics/day-04-state-machine-agent.md) |
| Day 05 | Week 1 | Messages、Memory、Transcript 的区别 | [`day-05-messages-memory-transcript.md`](week-01-agent-basics/day-05-messages-memory-transcript.md) |
| Day 06 | Week 1 | Agent 的可靠性边界 | [`day-06-agent-reliability-boundary.md`](week-01-agent-basics/day-06-agent-reliability-boundary.md) |
| Day 07 | Week 1 | Week 1 复盘 | [`day-07-week-01-review.md`](week-01-agent-basics/day-07-week-01-review.md) |
| Day 08 | Week 2 | Agentic Loop（智能体主循环）结构 | [`day-08-agentic-loop-structure.md`](week-02-agentic-loop/day-08-agentic-loop-structure.md) |
| Day 09 | Week 2 | Context Assembly（上下文组装） | [`day-09-context-assembly.md`](week-02-agentic-loop/day-09-context-assembly.md) |
| Day 10 | Week 2 | Model Invocation（模型调用） | [`day-10-model-invocation.md`](week-02-agentic-loop/day-10-model-invocation.md) |
| Day 11 | Week 2 | Tool Call Parsing（工具调用解析） | [`day-11-tool-call-parsing.md`](week-02-agentic-loop/day-11-tool-call-parsing.md) |
| Day 12 | Week 2 | Stop Condition（停止条件） | [`day-12-stop-condition.md`](week-02-agentic-loop/day-12-stop-condition.md) |
| Day 13 | Week 2 | Error Recovery（错误恢复） | [`day-13-error-recovery.md`](week-02-agentic-loop/day-13-error-recovery.md) |
| Day 14 | Week 2 | Week 2 复盘 | [`day-14-week-02-review.md`](week-02-agentic-loop/day-14-week-02-review.md) |
| Day 15 | Week 3 | Tool Interface（工具接口） | [`day-15-tool-interface.md`](week-03-tool-system/day-15-tool-interface.md) |
| Day 16 | Week 3 | Input Schema（输入结构定义） | [`day-16-input-schema.md`](week-03-tool-system/day-16-input-schema.md) |
| Day 17 | Week 3 | Tool Result（工具结果）设计 | [`day-17-tool-result-design.md`](week-03-tool-system/day-17-tool-result-design.md) |
| Day 18 | Week 3 | Concurrency Safe（并发安全） | [`day-18-concurrency-safe.md`](week-03-tool-system/day-18-concurrency-safe.md) |
| Day 19 | Week 3 | Tool Scheduler（工具调度器） | [`day-19-tool-scheduler.md`](week-03-tool-system/day-19-tool-scheduler.md) |
| Day 20 | Week 3 | Tool Error Handling（工具错误处理） | [`day-20-tool-error-handling.md`](week-03-tool-system/day-20-tool-error-handling.md) |
| Day 21 | Week 3 | Week 3 复盘 | [`day-21-week-03-review.md`](week-03-tool-system/day-21-week-03-review.md) |
| Day 22 | Week 4 | Context Window（上下文窗口） | [`day-22-context-window.md`](week-04-context-management/day-22-context-window.md) |
| Day 23 | Week 4 | Context Pollution（上下文污染） | [`day-23-context-pollution.md`](week-04-context-management/day-23-context-pollution.md) |
| Day 24 | Week 4 | Tool Result Budget（工具结果预算） | [`day-24-tool-result-budget.md`](week-04-context-management/day-24-tool-result-budget.md) |
| Day 25 | Week 4 | Context Compaction（上下文压缩） | [`day-25-context-compaction.md`](week-04-context-management/day-25-context-compaction.md) |
| Day 26 | Week 4 | Prompt Cache（提示词缓存） | [`day-26-prompt-cache.md`](week-04-context-management/day-26-prompt-cache.md) |
| Day 27 | Week 4 | Memory Write Policy（记忆写入策略） | [`day-27-memory-write-policy.md`](week-04-context-management/day-27-memory-write-policy.md) |
| Day 28 | Week 4 | Week 4 复盘 | [`day-28-week-04-review.md`](week-04-context-management/day-28-week-04-review.md) |
| Day 29 | Week 5 | AI Action Authorization（AI 动作授权） | [`day-29-ai-action-authorization.md`](week-05-permission-system/day-29-ai-action-authorization.md) |
| Day 30 | Week 5 | Permission Pipeline（权限管线） | [`day-30-permission-pipeline.md`](week-05-permission-system/day-30-permission-pipeline.md) |
| Day 31 | Week 5 | Sandbox（沙箱） | [`day-31-sandbox.md`](week-05-permission-system/day-31-sandbox.md) |
| Day 32 | Week 5 | Hooks（钩子机制） | [`day-32-hooks.md`](week-05-permission-system/day-32-hooks.md) |
| Day 33 | Week 5 | Audit Log（审计日志） | [`day-33-audit-log.md`](week-05-permission-system/day-33-audit-log.md) |
| Day 34 | Week 5 | Security Failure Modes（安全失败模式） | [`day-34-security-failure-modes.md`](week-05-permission-system/day-34-security-failure-modes.md) |
| Day 35 | Week 5 | Week 5 复盘 | [`day-35-week-05-review.md`](week-05-permission-system/day-35-week-05-review.md) |
| Day 36 | Week 6 | MCP 基础 | [`day-36-mcp-basics.md`](week-06-mcp-plugin-extension/day-36-mcp-basics.md) |
| Day 37 | Week 6 | JSON-RPC（JSON 远程过程调用） | [`day-37-json-rpc.md`](week-06-mcp-plugin-extension/day-37-json-rpc.md) |
| Day 38 | Week 6 | Process Isolation（进程隔离） | [`day-38-process-isolation.md`](week-06-mcp-plugin-extension/day-38-process-isolation.md) |
| Day 39 | Week 6 | Resource 与 Tool 的区别 | [`day-39-resource-vs-tool.md`](week-06-mcp-plugin-extension/day-39-resource-vs-tool.md) |
| Day 40 | Week 6 | Plugin Architecture（插件架构） | [`day-40-plugin-architecture.md`](week-06-mcp-plugin-extension/day-40-plugin-architecture.md) |
| Day 41 | Week 6 | MCP Error Handling（MCP 错误处理） | [`day-41-mcp-error-handling.md`](week-06-mcp-plugin-extension/day-41-mcp-error-handling.md) |
| Day 42 | Week 6 | Week 6 复盘 | [`day-42-week-06-review.md`](week-06-mcp-plugin-extension/day-42-week-06-review.md) |
| Day 43 | Week 7 | Multi-Agent 基础 | [`day-43-multi-agent-basics.md`](week-07-multi-agent/day-43-multi-agent-basics.md) |
| Day 44 | Week 7 | Task Decomposition（任务拆解） | [`day-44-task-decomposition.md`](week-07-multi-agent/day-44-task-decomposition.md) |
| Day 45 | Week 7 | Context Isolation（上下文隔离） | [`day-45-context-isolation.md`](week-07-multi-agent/day-45-context-isolation.md) |
| Day 46 | Week 7 | Result Aggregation（结果汇总） | [`day-46-result-aggregation.md`](week-07-multi-agent/day-46-result-aggregation.md) |
| Day 47 | Week 7 | Cost Control（成本控制） | [`day-47-cost-control.md`](week-07-multi-agent/day-47-cost-control.md) |
| Day 48 | Week 7 | Failure Handling（失败处理） | [`day-48-failure-handling.md`](week-07-multi-agent/day-48-failure-handling.md) |
| Day 49 | Week 7 | Week 7 复盘 | [`day-49-week-07-review.md`](week-07-multi-agent/day-49-week-07-review.md) |
| Day 50 | Week 8 | Agent Evaluation（智能体评估） | [`day-50-agent-evaluation.md`](week-08-evaluation-engineering/day-50-agent-evaluation.md) |
| Day 51 | Week 8 | Trace 与 Observability（可观测性） | [`day-51-trace-observability.md`](week-08-evaluation-engineering/day-51-trace-observability.md) |
| Day 52 | Week 8 | Regression Test（回归测试） | [`day-52-regression-test.md`](week-08-evaluation-engineering/day-52-regression-test.md) |
| Day 53 | Week 8 | Cost and Latency（成本与延迟） | [`day-53-cost-and-latency.md`](week-08-evaluation-engineering/day-53-cost-and-latency.md) |
| Day 54 | Week 8 | Human Experience（人机协作体验） | [`day-54-human-experience.md`](week-08-evaluation-engineering/day-54-human-experience.md) |
| Day 55 | Week 8 | Design Your Own Agent Runtime（设计自己的 Agent Runtime） | [`day-55-design-your-own-agent-runtime.md`](week-08-evaluation-engineering/day-55-design-your-own-agent-runtime.md) |
| Day 56 | Week 8 | 最终复盘与下一阶段计划 | [`day-56-final-review-next-stage.md`](week-08-evaluation-engineering/day-56-final-review-next-stage.md) |

