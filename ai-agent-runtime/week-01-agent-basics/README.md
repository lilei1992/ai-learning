# Week 01：Agent 基础模型

> 学习目标：分清 Chat API、Workflow、Agent、Runtime，建立 AI Agent Runtime 的基础 mental model（心智模型）。
> 返回总目录：[`../README.md`](../README.md)

## 本周学习重心

第一周不要急着写代码，也不要急着套框架。重点是建立 `Boundary Sense（边界感）`：

> Agent 的难点不是“会不会调用 LLM”，而是能不能分清模型、Runtime、工具、状态、记忆和业务系统各自应该负责什么。

本周真正要抓住 6 个核心思想：

1. **LLM 不是 Agent**  
   `LLM（Large Language Model，大语言模型）` 负责理解、推理和生成；`Agent（智能体）` 是围绕目标持续行动的系统。  
   工程含义：不要把一次模型调用误认为 Agent 系统。

2. **Runtime 是执行内核**  
   `Runtime（运行时）` 负责上下文、工具、权限、状态、日志、错误恢复和验证。  
   工程含义：Runtime 更像后端应用服务和基础设施编排层，不是 UI，也不是模型。

3. **Workflow 和 Agent 不是谁替代谁**  
   `Workflow（工作流）` 适合确定性、高风险、强状态业务；`Agent` 适合开放性、探索性、多步骤任务。  
   工程含义：企业落地通常是 `Workflow + Agent`，而不是让模型接管核心流程。

4. **ReAct 的关键是 Observation**  
   `ReAct（Reasoning and Acting，推理与行动）` 的价值不在于模型会想，而在于行动后有真实反馈。  
   工程含义：工具结果必须转成 `Observation（观察结果）`，否则 Agent 只是连续生成文本。

5. **State Machine 限制不确定性**  
   `State Machine（状态机）` 用显式状态、合法转移、终止条件约束 Agent 行为。  
   工程含义：状态机把模型的不确定输出关进 Runtime 可控边界内。

6. **Memory 和 Transcript 不能混用**  
   `Memory（记忆）` 是长期影响源；`Transcript（执行记录）` 是事实账本。  
   工程含义：Memory 要保守，Transcript 要完整，Context 要精简。

学习时优先追问：

- 这是模型职责，还是 Runtime 职责？
- 这是文本输出，还是外部状态变化？
- 这是确定流程，还是开放探索？
- 这是短期上下文，长期记忆，还是执行记录？
- 这个结论有没有工具结果或状态变化支撑？

## 本周节奏

- 工作日优先完成当天主题，不追求一次学透。
- Review Day（复盘日）统一补图、补类比、补自测问题。
- 如果工作 delay，直接从未完成的 Day 继续，不压缩多个主题到同一天。

## 每日主题

| Day | 主题 | 文件 |
|-----|------|------|
| Day 01 | 认识 AI Agent Runtime（智能体运行时） | [`day-01-ai-agent-runtime.md`](day-01-ai-agent-runtime.md) |
| Day 02 | Chat API、Workflow、Agent 的区别 | [`day-02-chat-api-workflow-agent.md`](day-02-chat-api-workflow-agent.md) |
| Day 03 | ReAct（推理与行动）模型 | [`day-03-react-reasoning-and-acting.md`](day-03-react-reasoning-and-acting.md) |
| Day 04 | State Machine（状态机）视角理解 Agent | [`day-04-state-machine-agent.md`](day-04-state-machine-agent.md) |
| Day 05 | Messages、Memory、Transcript 的区别 | [`day-05-messages-memory-transcript.md`](day-05-messages-memory-transcript.md) |
| Day 06 | Agent 的可靠性边界 | [`day-06-agent-reliability-boundary.md`](day-06-agent-reliability-boundary.md) |
| Day 07 | Week 1 复盘 | [`day-07-week-01-review.md`](day-07-week-01-review.md) |

## 本周最小心智模型

```text
User Goal
-> Agent Runtime
-> Context Assembly
-> LLM Decision
-> Tool Request
-> Permission / State Check
-> Tool Execution
-> Observation
-> Transcript / State Update
-> Continue or Stop
```

一句话理解：

> LLM 负责生成可能的下一步，Runtime 负责判断这一步能不能安全、可控、可验证地发生。

## 复习建议

如果时间有限，第一周优先复习这 5 个问题：

1. `LLM`、`Agent`、`Runtime` 的区别是什么？
2. `Chat API`、`Workflow`、`Agent` 分别适合什么场景？
3. 为什么 `Observation` 是 Agent Loop 的关键？
4. 为什么 Agent 需要 `State Machine（状态机）`？
5. 为什么 `Memory` 要保守，而 `Transcript` 要完整？
