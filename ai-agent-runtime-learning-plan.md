# AI Agent Runtime 深度学习计划

> 创建日期：2026-05-29
> 目标：系统学习 Claude Code / AI Agent Runtime 的核心工程知识，而不是只停留在工具使用层面。

## 1. 学习目标

本计划聚焦生产级 AI Agent 系统的底层设计。学习完成后，应能清楚解释并初步设计以下模块：

- Agentic Loop：Agent 的主循环、状态推进、停止条件和错误恢复。
- Tool System：工具定义、schema、权限、并发安全、执行隔离和审计。
- Context Management：上下文窗口、token 预算、历史裁剪、摘要和压缩策略。
- Permission System：AI 动作授权、风险分级、sandbox、hook 和人工确认。
- Multi-Agent：任务拆解、子 Agent 隔离、并行执行和结果汇总。
- MCP / Plugin：工具协议、进程隔离、能力发现和外部系统集成。
- Evaluation：Agent 行为测试、回归验证、成功率、成本和安全评估。

## 2. 学习原则

- 先理解概念，再看源码或框架实现。
- 每个知识点都要能映射到熟悉的 Java / 后端工程概念。
- 每周复盘一次，记录“我能讲清楚什么”和“还模糊什么”。
- 不追热点模型名，优先掌握稳定的工程抽象。
- 学习资料统一沉淀在 `/Users/lilei/code/study` 目录。

## 3. 总体路线

### 阶段 1：Agent 基础模型

时间建议：1 周

目标：

- 理解普通 Chat API、Tool Calling、Agent Runtime 的区别。
- 理解 ReAct：Reasoning + Acting。
- 理解 `think -> act -> observe -> update state` 的循环模型。

要掌握的问题：

- 为什么 Agent 不是一次性请求？
- Agentic Loop 每轮做了什么？
- LLM 的输出如何变成工具调用？
- 什么情况下 Agent 应该停止？
- 错误、超时、用户中断如何进入状态机？

输出物：

- 用自己的话画出 Agentic Loop 流程。
- 写一段伪代码描述 Agent 主循环。
- 总结 Chat API、Workflow、Agent 的区别。

### 阶段 2：Tool System

时间建议：1-2 周

目标：

- 理解工具不是函数列表，而是受控能力边界。
- 理解 tool schema、参数校验、执行器、结果格式。
- 理解读写工具的并发差异。

要掌握的问题：

- 一个 Tool 至少包含哪些元数据？
- `input_schema` 为什么重要？
- `FileReadTool`、`FileWriteTool`、`BashTool` 的风险差异是什么？
- 什么叫 `isConcurrencySafe`？
- 工具失败后应该返回错误结果，还是抛异常？
- 工具结果如何避免污染上下文？

Java 类比：

- Tool Interface 类似 SPI。
- Tool Executor 类似应用服务编排器。
- Tool Permission 类似 Spring Security + Method Security。
- Read/Write 调度类似 ReadWriteLock。

输出物：

- 设计一个 `Tool` 接口草图。
- 设计 `ReadFileTool`、`RunTestTool`、`SearchCodeTool` 三个示例。
- 总结“安全工具调用”的最小闭环。

### 阶段 3：Context Management

时间建议：1-2 周

目标：

- 理解 LLM Context Window 是有限工作内存。
- 理解 token 预算、上下文污染、摘要损耗。
- 理解多级压缩策略。

要掌握的问题：

- 上下文里通常放哪些内容？
- 工具输出为什么不能无限塞回上下文？
- 摘要为什么不是无损压缩？
- 什么内容必须保留，什么内容可以裁剪？
- Context Compaction 与 GC 有什么相似和不同？

Java 类比：

- Context Window 类似堆内存。
- Token 预算类似内存预算。
- Context Compaction 类似分代 GC。
- Prompt Cache 类似缓存命中优化。

输出物：

- 总结 5 类上下文内容：system、user、history、tool result、project memory。
- 设计一个 cheapest-first 的上下文压缩策略。
- 记录 3 个上下文污染的例子。

### 阶段 4：Permission System

时间建议：1 周

目标：

- 理解 AI Agent 的安全边界不是“用户请求”，而是“模型即将执行的动作”。
- 理解动作授权、风险分级、hook、sandbox 和审计。

要掌握的问题：

- 为什么 BashTool 风险最高？
- 什么动作必须人工确认？
- allowList / denyList 应该如何设计？
- hook 应该在工具执行前还是执行后？
- sandbox 能解决什么，不能解决什么？
- 审计日志应该记录哪些字段？

Java 类比：

- Permission Pipeline 类似 SecurityFilterChain。
- Rule Evaluator 类似 AccessDecisionVoter。
- Audit Log 类似操作日志 / 安全审计。

输出物：

- 设计一条工具授权管线。
- 给常见工具做风险等级分类。
- 总结“不能让模型直接执行 shell”的原因。

### 阶段 5：MCP / Plugin / Extension

时间建议：1 周

目标：

- 理解 MCP 是 Agent 工具生态的标准化协议。
- 理解进程隔离、工具发现、schema 暴露、JSON-RPC。

要掌握的问题：

- 为什么工具协议需要标准化？
- MCP Server 和普通 HTTP API 有什么区别？
- stdio、HTTP、SSE 各适合什么场景？
- MCP 如何隔离外部工具风险？
- 工具能力发现如何工作？

Java 类比：

- MCP Server 类似独立 RPC 服务。
- Plugin 类似 Maven Plugin / SPI 扩展。
- Capability Discovery 类似服务发现 + 接口元数据。

输出物：

- 画出 Agent Runtime、MCP Client、MCP Server、外部系统的调用关系。
- 总结 MCP 适合封装哪些能力，不适合封装哪些能力。

### 阶段 6：Multi-Agent

时间建议：1-2 周

目标：

- 理解 Multi-Agent 的核心不是“多个模型聊天”，而是任务拆解、隔离执行和结果合并。

要掌握的问题：

- 主 Agent 如何拆任务？
- 子 Agent 应该继承哪些上下文？
- 子 Agent 的工具权限如何限制？
- 子 Agent 失败、超时、结果冲突如何处理？
- Multi-Agent 成本为什么容易失控？

Java 类比：

- SubAgent 类似 ForkJoinTask / CompletableFuture worker。
- Sidechain transcript 类似子任务日志。
- Orchestrator Agent 类似任务编排服务。

输出物：

- 设计一个“代码审查 Multi-Agent 流程”。
- 总结 Multi-Agent 的 5 个风险：成本、上下文、权限、冲突、不可复现。

### 阶段 7：Evaluation 与工程落地

时间建议：持续

目标：

- 能判断一个 Agent 系统是否可靠，而不是只看 demo 是否炫。

要掌握的问题：

- Agent 成功率如何评估？
- 工具调用错误如何归因？
- 如何做回归测试？
- 如何记录成本、延迟和 token 使用量？
- 如何防止 Agent 在异常路径里“假成功”？

Java 类比：

- Evaluation 类似自动化测试 + 监控指标 + 审计。
- Golden Task 类似回归测试用例。
- Trace 类似分布式链路追踪。

输出物：

- 设计一个 Agent 评估表。
- 总结 10 个可复用的 Agent 回归测试任务。

## 4. 每周复习模板

每周复习一次，建议固定在周五或周末。

```markdown
## 复习记录 - YYYY-MM-DD

### 本周学习内容

- 

### 我已经能讲清楚的点

- 

### 仍然模糊的点

- 

### 和 Java / 后端工程的类比

- 

### 下周要继续的问题

- 
```

## 5. 学习笔记模板

后续新增资料时，可以按下面格式追加。

```markdown
## 笔记 - 标题

来源：

日期：

### 核心观点

- 

### 关键概念

- 

### 工程类比

- 

### 可迁移到项目里的启发

- 

### 待验证问题

- 
```

## 6. 资料索引

后续资料统一追加到这里。

| 日期 | 主题 | 资料/文件 | 结论 |
|------|------|-----------|------|
| 2026-05-29 | Claude Code 架构分享 HTML | `/Users/lilei/Downloads/claude_code_revealjs (1).html` | 作为 AI Agent Runtime 学习主线 |
| 2026-06-01 | AI Agent Runtime 每日学习目标 | `/Users/lilei/code/study/ai-agent-runtime-daily-goals.md` | 56 天可顺延学习计划，包含 Busy / Standard / Deep 三种学习节奏 |
| 2026-06-01 | AI Agent Runtime 周目录版 | `/Users/lilei/code/study/ai-agent-runtime/README.md` | 按 Week 拆目录、按 Day 拆文件，适合每天学习和复习记录 |

## 7. 关键词表

| 关键词 | 简要解释 | Java / 后端类比 |
|--------|----------|-----------------|
| Agentic Loop | Agent 反复推理、执行工具、观察结果并推进状态的主循环 | 应用服务编排 / 状态机 |
| Tool Calling | 模型请求 Runtime 执行某个受控工具 | SPI / Service Method |
| Tool Schema | 工具参数结构定义 | DTO + Validation |
| Context Window | 模型一次请求能看到的上下文容量 | 堆内存 / 工作内存 |
| Context Compaction | 对历史和工具结果进行裁剪、折叠、摘要 | GC / 缓存淘汰 |
| Permission Pipeline | 对模型动作进行安全授权 | SecurityFilterChain |
| MCP | Agent 工具扩展协议 | RPC / SPI / Plugin |
| SubAgent | 独立上下文中的子任务 Agent | ForkJoinTask / Worker |
| Transcript | Agent 执行过程日志 | Event Sourcing / Audit Log |
| Evaluation | 对 Agent 行为进行测试与评估 | 自动化测试 / 监控 |

## 8. 待深入问题池

- Agentic Loop 如何设计停止条件，避免无限循环？
- 工具结果应该用自然语言、JSON，还是结构化事件返回？
- 权限系统如何避免误拒绝和误通过？
- Context 摘要如何降低信息损失？
- Multi-Agent 如何做结果冲突处理？
- MCP Server 如何做超时、重试和错误映射？
- Agent 回归测试如何设计稳定断言？

## 9. 当前进度

- [x] 建立学习计划文件。
- [x] 建立每日学习目标文件。
- [x] 建立按周目录和每日主题文件。
- [ ] 完成阶段 1：Agent 基础模型。
- [ ] 完成阶段 2：Tool System。
- [ ] 完成阶段 3：Context Management。
- [ ] 完成阶段 4：Permission System。
- [ ] 完成阶段 5：MCP / Plugin / Extension。
- [ ] 完成阶段 6：Multi-Agent。
- [ ] 建立长期 Evaluation 题库。
