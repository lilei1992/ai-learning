# Week 02-08：AI Agent 工程化学习路线

> 面向背景：Java 后端开发，熟悉 Spring Boot、MySQL、Redis、MQ、Elasticsearch。  
> 学习目标：从 Agent 基础概念走到可设计、实现和评估一个 Agent Runtime / AI Coding Agent / 企业内部自动化 Agent。  
> 使用方式：每周按 5 天学习 + 1 天实践 + 1 天复盘推进；工作忙时顺延，不压缩学习质量。

## 总体路线

| 周次 | 主线 | 工程目标 | 对应能力 |
|------|------|----------|----------|
| Week 02 | Agent Loop 与 Runtime 主流程 | 能画出并实现最小 Agent Runtime 主循环 | Agent 执行闭环 |
| Week 03 | Model、Prompt、Tool Calling | 能设计 Tool Schema 和工具调用管线 | 模型与工具集成 |
| Week 04 | Memory 与 Context Engineering | 能设计动态上下文组装与 RAG Memory | 上下文工程 |
| Week 05 | State、Permission、Guardrails | 能设计状态机、权限审批和安全护栏 | 可靠执行 |
| Week 06 | Agent 架构模式与 MCP 扩展 | 能理解 ReAct、Router、Multi-Agent、MCP | 架构模式 |
| Week 07 | AI Coding Agent 与企业场景 | 能设计代码 Review / 日志分析 / 运维排障 Agent | 场景落地 |
| Week 08 | Evaluation、Observability、实战设计 | 能设计评估体系和三个完整项目方案 | 工程闭环 |

## Week 02：Agent Loop 与 Runtime 主流程

### 学习主题

建立 Agent Runtime 的核心执行模型：从用户输入到上下文组装、模型决策、工具调用、观察结果、状态更新、停止条件。

### 必学概念

- `Agent Loop（智能体循环）`
- `Context Assembly（上下文组装）`
- `Model Adapter（模型适配器）`
- `Action Parsing（动作解析）`
- `Observation（观察结果）`
- `Stop Condition（停止条件）`
- `Error Recovery（错误恢复）`
- `Transcript（执行记录）`

### 每天安排

| Day | 主题 | 学习重点 | 输出物 |
|-----|------|----------|--------|
| Day 08 | Agent Loop 主结构 | `Goal -> Context -> Model -> Action -> Observation` | 画最小 Agent Loop 图 |
| Day 09 | Context Assembly | System / Developer / User / Tool Result 如何组装 | 写上下文组装规则 |
| Day 10 | Model Adapter | 屏蔽不同模型 API 差异 | 设计 `ModelClient` 接口 |
| Day 11 | Action Parsing | 模型输出如何转成结构化动作 | 设计 `AgentAction` 类 |
| Day 12 | Stop Condition | 完成、失败、超时、最大轮数 | 写停止条件清单 |
| Day 13 | Error Recovery | 工具失败、模型异常、上下文超限 | 写错误恢复策略 |
| Day 14 | 复盘 | 串起完整 Runtime 主流程 | 伪代码实现最小 Runtime |

### 推荐实践项目

实现一个最小 Java 版 `AgentRuntime` 伪代码，不需要接真实模型：

```java
AgentResult run(AgentTask task) {
    while (!state.shouldStop()) {
        AgentContext context = contextAssembler.assemble(state);
        ModelOutput output = modelClient.invoke(context);
        AgentAction action = actionParser.parse(output);
        ToolResult result = toolExecutor.execute(action);
        state.apply(observationMapper.map(result));
    }
    return state.toResult();
}
```

### 常见坑

- 把 Runtime 写成普通 Controller。
- 没有最大轮数，导致无限循环。
- 工具失败后继续假装成功。
- 把所有工具输出直接塞进上下文。
- 没有区分最终回答和中间 Observation。

### 检查标准

- 能不看资料画出 Agent Loop。
- 能解释 Runtime 和 UI 层的区别。
- 能说清楚一次工具调用如何影响下一轮模型决策。
- 能写出最小 Runtime 伪代码。

## Week 03：Model、Prompt、Tool Calling

### 学习主题

理解 LLM 在 Agent 中的位置，掌握 Prompt 分层、Function Calling、Tool Schema 和工具执行管线。

### 必学概念

- `LLM（Large Language Model，大语言模型）`
- `Reasoning Model（推理模型）`
- `Chat Model（聊天模型）`
- `System Prompt（系统提示词）`
- `Developer Message（开发者消息）`
- `User Message（用户消息）`
- `Function Calling（函数调用）`
- `Tool Schema（工具结构定义）`
- `Tool Registry（工具注册表）`
- `Tool Retry（工具重试）`

### 每天安排

| Day | 主题 | 学习重点 | 输出物 |
|-----|------|----------|--------|
| Day 15 | Model / LLM | LLM 负责推理和生成，不负责真实执行 | 模型职责边界表 |
| Day 16 | Prompt 分层 | System、Developer、User、Tool 消息边界 | Prompt 模板草图 |
| Day 17 | Function Calling | 模型如何请求工具调用 | 一个 Tool Call JSON 示例 |
| Day 18 | Tool Schema | 输入参数、必填字段、枚举、风险等级 | 设计 `read_file` / `run_test` Schema |
| Day 19 | Tool Registry | 工具注册、发现、版本、权限元数据 | 设计 `ToolDefinition` 类 |
| Day 20 | Tool Failure | 超时、重试、幂等、错误映射 | 工具失败处理表 |
| Day 21 | 复盘 | 完成工具调用端到端设计 | 画工具调用时序图 |

### 推荐实践项目

设计一个本地工具系统：

- `read_file(path)`
- `search_code(keyword, path)`
- `run_command(command, cwd)`
- `write_file(path, content)`

要求每个工具都有：

- `name`
- `description`
- `inputSchema`
- `riskLevel`
- `timeout`
- `permissionRequired`
- `idempotent`

### Tool Schema 示例

```json
{
  "name": "search_code",
  "description": "Search source files by keyword in a limited workspace.",
  "input_schema": {
    "type": "object",
    "properties": {
      "keyword": {
        "type": "string",
        "description": "Search keyword."
      },
      "path": {
        "type": "string",
        "description": "Relative path under workspace."
      }
    },
    "required": ["keyword", "path"]
  },
  "risk_level": "low",
  "permission_required": false,
  "idempotent": true
}
```

### 常见坑

- Tool Schema 太宽泛，导致模型传入危险参数。
- 工具描述含糊，模型不知道何时使用。
- 没有超时和最大输出限制。
- 重试非幂等工具。
- 工具错误没有结构化返回。

### 检查标准

- 能解释 Function Calling 的基本机制。
- 能设计 3 个可用 Tool Schema。
- 能说明哪些工具需要权限确认。
- 能区分模型决策和工具执行责任。

## Week 04：Memory 与 Context Engineering

### 学习主题

掌握 Agent 最关键的工程能力：如何选择上下文、管理记忆、控制 token、避免污染。

### 必学概念

- `Context Engineering（上下文工程）`
- `Prompt Engineering（提示词工程）`
- `Dynamic Context Assembly（动态上下文组装）`
- `Context Window（上下文窗口）`
- `Context Pollution（上下文污染）`
- `Working Memory（工作记忆）`
- `Episodic Memory（情景记忆）`
- `Semantic Memory（语义记忆）`
- `Vector Database（向量数据库）`
- `RAG（Retrieval-Augmented Generation，检索增强生成）`

### 每天安排

| Day | 主题 | 学习重点 | 输出物 |
|-----|------|----------|--------|
| Day 22 | Context Window | token、窗口、上下文预算 | Token 预算表 |
| Day 23 | Context Pollution | 工具输出、网页、日志、旧信息污染 | 污染来源清单 |
| Day 24 | Dynamic Context Assembly | 按任务动态选择上下文 | 上下文组装算法草图 |
| Day 25 | Memory 类型 | Working / Episodic / Semantic | 三类 Memory 对比表 |
| Day 26 | Vector DB / RAG | embedding、chunk、召回、引用来源 | RAG 流程图 |
| Day 27 | Memory Write Policy | 什么能写、何时写、如何删除 | Memory 写入规则 |
| Day 28 | 复盘 | 设计知识库 Agent 的上下文系统 | 个人知识库 Agent 设计稿 |

### 推荐实践项目

设计个人知识库 Agent：

- 上传 Markdown / PDF / 文档。
- 切分 chunk。
- 生成 embedding。
- 存入 Vector DB。
- 用户提问时召回相关片段。
- 回答必须带引用来源。

### Context Assembly 示例

```text
System Rules
+ Developer Policy
+ User Goal
+ Current Task State
+ Relevant Memory
+ Retrieved Documents
+ Latest Observations
+ Tool Definitions
```

### 常见坑

- 以为 Prompt 写好就够了，忽略上下文选择。
- 召回内容不相关还强行塞给模型。
- Memory 写入太积极，长期污染。
- 不保留引用来源，回答无法验证。
- 大日志、大文件直接进入上下文。

### 检查标准

- 能解释 Context Engineering 为什么比单纯 Prompt Engineering 更重要。
- 能设计 RAG 基础流程。
- 能说清楚三类 Memory 区别。
- 能写出 Memory 写入和删除规则。

## Week 05：State、Permission、Guardrails

### 学习主题

让 Agent 从“能跑”变成“可控、可恢复、可审计”。重点学习状态机、权限系统、审批流、护栏和高风险操作控制。

### 必学概念

- `State Store（状态存储）`
- `Session State（会话状态）`
- `Task State（任务状态）`
- `Tool State（工具状态）`
- `Permission Control（权限控制）`
- `Guardrail（护栏）`
- `Human Approval（人工审批）`
- `Sandbox（沙箱）`
- `Idempotency（幂等性）`
- `Audit Log（审计日志）`

### 每天安排

| Day | 主题 | 学习重点 | 输出物 |
|-----|------|----------|--------|
| Day 29 | State Management | 会话、任务、工具状态区分 | Agent 状态机图 |
| Day 30 | Permission Pipeline | 动作风险识别与权限判断 | 权限决策表 |
| Day 31 | Human Approval | 哪些操作必须人工确认 | 审批流图 |
| Day 32 | Sandbox | 文件、命令、网络隔离 | 沙箱策略清单 |
| Day 33 | Guardrails | 防越权、防误删、防误发 | 高风险动作清单 |
| Day 34 | Recovery | 中断恢复、重试、回滚 | 恢复策略表 |
| Day 35 | 复盘 | 设计安全版 Runtime | 权限 + 状态设计稿 |

### 需要人工确认的操作

- 删除文件、批量移动文件。
- 执行 Shell 写操作。
- 修改数据库。
- 调用生产 API。
- 发送邮件、消息、工单。
- Git push / merge / release。
- 订单、支付、退款、库存等业务状态变更。

### Java 核心类草图

```java
class PermissionRequest {
    String taskId;
    String actionType;
    String toolName;
    Map<String, Object> input;
    RiskLevel riskLevel;
    String reason;
}

class PermissionDecision {
    boolean allowed;
    boolean requiresHumanApproval;
    String denyReason;
}
```

### 常见坑

- 相信模型自己判断安全。
- 权限只做前端弹窗，没有后端强校验。
- 高风险动作没有审计。
- 自动重试非幂等写操作。
- 取消任务后没有处理半完成状态。

### 检查标准

- 能列出高风险工具动作。
- 能设计权限审批流。
- 能解释幂等性和重试关系。
- 能设计 Agent 中断后的恢复策略。

## Week 06：Agent 架构模式与 MCP 扩展

### 学习主题

系统掌握常见 Agent 架构模式，并理解 MCP / Plugin 如何让 Agent 扩展外部能力。

### 必学概念

- `ReAct Agent`
- `Plan-and-Execute Agent`
- `Router Agent`
- `Tool-Using Agent`
- `Supervisor Agent`
- `Multi-Agent System（多智能体系统）`
- `Coding Agent`
- `Research Agent`
- `Workflow + Agent`
- `MCP（Model Context Protocol，模型上下文协议）`
- `JSON-RPC（JSON 远程过程调用）`
- `Resource（资源）`
- `Tool（工具）`

### 每天安排

| Day | 主题 | 学习重点 | 输出物 |
|-----|------|----------|--------|
| Day 36 | ReAct / Tool-Using | 边观察边行动，工具增强 | 模式对比表 |
| Day 37 | Plan-and-Execute | 先规划，再逐步执行 | 计划执行流程图 |
| Day 38 | Router / Supervisor | 任务路由与子 Agent 管理 | Router 规则设计 |
| Day 39 | Multi-Agent | 任务拆解、上下文隔离、结果汇总 | 多 Agent 架构图 |
| Day 40 | MCP 基础 | Host / Client / Server / Tool / Resource | MCP 组件图 |
| Day 41 | Plugin Extension | 插件隔离、版本、错误处理 | 插件接口设计 |
| Day 42 | 复盘 | 选择适合企业场景的架构模式 | 场景选型表 |

### 模式速查

| 模式 | 适用场景 | 优点 | 缺点 | 工程难点 |
|------|----------|------|------|----------|
| ReAct Agent | 排查、代码修复、探索任务 | 灵活 | 容易循环 | 停止条件、轨迹质量 |
| Plan-and-Execute | 长任务、复杂目标 | 结构清晰 | 计划可能过期 | 计划修正 |
| Router Agent | 多工具、多领域分发 | 降低复杂度 | 路由错误 | 分类和兜底 |
| Supervisor Agent | 多子任务协调 | 可并行 | 成本高 | 上下文隔离 |
| Coding Agent | 代码阅读、修改、测试 | 工程价值高 | 误改风险高 | diff 控制、测试验证 |
| Research Agent | 资料调研、总结 | 信息覆盖广 | 来源可靠性 | 引用与去重 |
| Workflow + Agent | 企业关键流程 | 可控可靠 | 架构复杂 | 边界划分 |

### MCP 学习重点

MCP 的工程意义：

- 把外部工具能力标准化。
- 让 Agent 可以发现和调用工具。
- 通过进程隔离降低工具风险。
- 用 JSON-RPC 统一通信。

### 常见坑

- 过早上 Multi-Agent，复杂度暴涨。
- 子 Agent 上下文互相污染。
- Router 没有兜底策略。
- MCP 工具暴露太宽。
- 插件失败没有隔离主任务。

### 检查标准

- 能说清楚 5 种 Agent 架构模式适用场景。
- 能解释 MCP 的 Host / Client / Server。
- 能区分 Resource 和 Tool。
- 能为一个企业场景选择合适模式。

## Week 07：AI Coding Agent 与企业内部 Agent

### 学习主题

聚焦 Claude Code、Codex、Cursor、Cline 这类 AI Coding Agent 的工作原理，并把能力迁移到企业内部效率工具。

### 必学概念

- `Repository Context（仓库上下文）`
- `Code Search（代码搜索）`
- `AST（Abstract Syntax Tree，抽象语法树）`
- `Git Diff`
- `Patch Generation（补丁生成）`
- `Test Runner（测试运行器）`
- `AGENTS.md / CLAUDE.md / Rules`
- `Code Review Agent`
- `Log Analysis Agent`
- `SQL Analysis Agent`
- `Ops Troubleshooting Agent`

### 每天安排

| Day | 主题 | 学习重点 | 输出物 |
|-----|------|----------|--------|
| Day 43 | Coding Agent 原理 | 读仓库、找文件、改代码、跑测试 | Coding Agent 流程图 |
| Day 44 | 代码上下文选择 | README、AGENTS、调用链、diff | Java 项目上下文规则 |
| Day 45 | Patch / Diff 控制 | 小步修改、避免大范围误改 | Patch 检查清单 |
| Day 46 | Code Review Agent | 读取 Git diff + 项目规范 | Review Agent MVP 设计 |
| Day 47 | 日志 / SQL / ES Agent | 接日志、DB、Redis、ES 只读工具 | 排障工具列表 |
| Day 48 | 企业流程自动化 | 需求拆解、文档、测试用例、客服知识库 | 场景 MVP 表 |
| Day 49 | 复盘 | 设计一个企业内部 Agent | 完整方案说明 |

### AI Coding Agent 核心流程

```text
读取项目规则
-> 扫描目录结构
-> 定位相关文件
-> 阅读调用链
-> 制定修改计划
-> 小范围 patch
-> 运行测试 / 静态检查
-> 汇总证据和风险
```

### Java 后端项目例子

修改订单状态逻辑时，Coding Agent 应优先读取：

- `AGENTS.md`
- Controller / Param / VO
- App Service
- Domain Entity / Domain Service
- Gateway Interface
- Infrastructure Gateway / Mapper
- Enum / StatusCode
- MQ Consumer
- ES Writer / SyncService
- 相关测试

不能直接只看一个 Service 就改状态字段。

### 企业 Agent MVP 场景

| 场景 | MVP 做法 | 工具 | 风险 |
|------|----------|------|------|
| Code Review Agent | 只读 Git diff，输出风险点 | Git、规则文件、代码搜索 | 误报、漏报 |
| 日志分析 Agent | 上传日志，提取错误链路 | 日志搜索、知识库 | 泄露敏感日志 |
| SQL 分析 Agent | 只读 SQL + explain 建议 | MySQL readonly | 错误优化建议 |
| ES 查询 Agent | 生成查询 DSL，不直接执行写操作 | ES readonly | 深分页、索引误用 |
| 测试用例生成 | 根据 diff 生成测试建议 | Git、代码搜索 | 测试不可运行 |
| 运维排障 Agent | 只读日志 / DB / Redis / ES | Readonly tools | 误判根因 |

### 常见坑

- 不读项目规则文件就修改代码。
- 一次改太多文件。
- 没有复现失败就修。
- 没有运行相关测试就说完成。
- 企业工具一开始就接生产写权限。

### 检查标准

- 能解释 Coding Agent 如何理解仓库。
- 能设计 Review Agent 的输入、输出和风险控制。
- 能列出企业内部 5 个适合 Agent 的场景。
- 能说明哪些工具必须只读。

## Week 08：Evaluation、Observability、实战项目设计

### 学习主题

把前 7 周能力收束到工程落地：评估、可观测性、成本、延迟、项目设计和技术选型。

### 必学概念

- `Agent Evaluation（智能体评估）`
- `Trace（链路记录）`
- `Observability（可观测性）`
- `Regression Test（回归测试）`
- `Golden Dataset（黄金数据集）`
- `Success Criteria（成功标准）`
- `Cost Control（成本控制）`
- `Latency（延迟）`
- `Human-in-the-loop（人在回路）`

### 每天安排

| Day | 主题 | 学习重点 | 输出物 |
|-----|------|----------|--------|
| Day 50 | Evaluation | 准确率、完成率、工具成功率 | 评估指标表 |
| Day 51 | Observability | Trace、日志、审计、成本 | Trace 字段设计 |
| Day 52 | Regression Test | 轨迹回归、Prompt 回归、工具回归 | Golden Dataset 草图 |
| Day 53 | Cost / Latency | token、模型选择、缓存、并发 | 成本估算表 |
| Day 54 | 技术栈选型 | Java、Python、Spring AI、LangGraph、MCP | 技术选型表 |
| Day 55 | 三个项目设计 | 知识库、Review、排障 Agent | 项目设计文档 |
| Day 56 | 总复盘 | 20% 重点、10 个坑、下一阶段 | 下一阶段计划 |

### 三个实战项目

#### 项目一：个人知识库 Agent

目标：

- 支持上传文档。
- 支持 RAG 检索。
- 支持问答。
- 支持引用来源。

核心工具：

- 文档解析工具。
- Chunk 切分工具。
- Embedding 工具。
- Vector Search 工具。
- Source Citation 工具。

MVP：

- 只支持 Markdown / TXT。
- 问答必须返回引用文件名和片段。
- 不做长期 Memory 写入，只做文档检索。

#### 项目二：代码仓库 Review Agent

目标：

- 读取 Git diff。
- 结合项目规范。
- 输出风险点。
- 给出修改建议。
- 不直接修改代码。

核心工具：

- `git_diff`
- `read_file`
- `search_code`
- `read_rules`
- `risk_classifier`

MVP：

- 只做只读 Review。
- 输出按严重级别排序。
- 每条建议必须带文件路径和理由。

#### 项目三：后端运维排障 Agent

目标：

- 读取日志。
- 查询 MySQL / Redis / ES。
- 分析异常链路。
- 给出排查步骤。
- 高风险操作必须人工确认。

核心工具：

- `search_log`
- `query_mysql_readonly`
- `query_redis_readonly`
- `query_es_readonly`
- `trace_error_chain`

MVP：

- 所有工具只读。
- 禁止生产写操作。
- 输出“已验证事实”和“推测原因”分开。

### 数据表设计建议

```sql
agent_task(
  id,
  user_id,
  task_type,
  goal,
  status,
  stop_reason,
  created_at,
  updated_at
)

agent_step(
  id,
  task_id,
  step_no,
  action_type,
  tool_name,
  input_summary,
  output_summary,
  status,
  error_message,
  created_at
)

agent_memory(
  id,
  user_id,
  scope,
  memory_type,
  content,
  source,
  confidence,
  created_at,
  updated_at
)

agent_permission_request(
  id,
  task_id,
  action_type,
  risk_level,
  status,
  requested_by,
  approved_by,
  created_at,
  approved_at
)
```

### 技术栈优先级

| 技术 | 解决什么 | Java 后端优先级 |
|------|----------|----------------|
| OpenAI API / Claude API | 模型调用、Function Calling | 高 |
| Spring AI | Java 生态模型接入、RAG | 高 |
| LangGraph | Agent 状态图、复杂流程 | 中 |
| LangChain | 快速了解生态概念 | 中 |
| LlamaIndex | RAG、数据连接器 | 中 |
| MCP | 工具扩展协议 | 高 |
| PostgreSQL / MySQL | 任务、状态、审计 | 高 |
| Redis | 会话缓存、锁、限流 | 高 |
| MQ | 长任务异步执行 | 高 |
| Elasticsearch | 日志、文档、代码搜索 | 中高 |
| Vector DB | RAG Memory | 高 |
| LangSmith / OpenTelemetry | Trace 与评估 | 中 |

### 常见坑

- 没有评估集就上线 Agent。
- 只看最终回答，不看执行轨迹。
- 成本和延迟没有预算。
- 所有任务都用最贵模型。
- 不能区分已验证事实和模型推测。

### 检查标准

- 能设计一个 Agent 的 Trace 字段。
- 能设计最小评估集。
- 能解释 Agent 成功率如何度量。
- 能完整说明三个实战项目的架构、工具、风险和 MVP。

## 最后总结：优先掌握的 20%

如果时间有限，先学这 8 件事：

1. `Agent Loop`：目标、决策、行动、观察、停止。
2. `Tool Calling`：Schema、权限、执行、错误。
3. `Context Engineering`：动态选择上下文，而不是堆材料。
4. `Memory Policy`：什么能记，什么不能记。
5. `State Machine`：Agent 当前处于什么状态。
6. `Permission / Guardrails`：模型不能直接拥有执行权。
7. `Trace / Transcript`：每一步都要可追溯。
8. `Evaluation`：用证据证明 Agent 真的有效。

## 后端开发者最应该掌握的 10 个能力

1. 把 Agent 拆成 Runtime、Model、Tool、State、Memory、Permission。
2. 设计结构化 Tool Schema。
3. 设计只读和写操作权限边界。
4. 用状态机约束 Agent 执行。
5. 设计 Trace / Audit Log。
6. 控制上下文长度和质量。
7. 设计 RAG 检索和引用来源。
8. 做工具超时、重试、幂等和错误恢复。
9. 为企业场景设计 MVP，而不是直接做全自动。
10. 用测试和评估集验证 Agent 行为。

## 后续细化建议

后续每周学习时，建议按这个顺序扩展每日文件：

```text
先扩展 Week 02 Day 08：Agentic Loop 主结构
-> 再扩展 Week 02 Day 09：Context Assembly
-> 每天学完后生成对应问题答案
-> 每周末生成 week-xx-qa-summary.md
```
