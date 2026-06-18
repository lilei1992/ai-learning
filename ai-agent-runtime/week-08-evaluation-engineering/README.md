# Week 08：Evaluation、Observability 与实战项目设计

> 学习目标：建立 Agent 工程闭环：评估、可观测性、成本控制、技术选型和项目设计。  
> 核心产出：评估指标表 + Trace 字段设计 + 三个实战项目方案。  
> 返回总目录：[`../README.md`](../README.md)  
> 本周 QA：[`week-08-qa-summary.md`](week-08-qa-summary.md)

## 本周学习重心

第八周的核心是理解 `Evaluation as Engineering（评估即工程）`：

> Agent 能跑不代表能上线；能上线的 Agent 必须可评估、可观测、可回归、可控成本，并且能解释失败。

本周真正要抓住 6 个核心思想：

1. **评估不是最后一步**  
   Evaluation（评估）应该伴随设计、开发、测试和上线。  
   工程含义：每个能力都要定义成功标准和失败样本。

2. **Trace 是评估数据源**  
   没有 Trace，就无法判断失败来自上下文、模型、工具、权限还是用户目标。  
   工程含义：Trace 不是日志装饰，而是 Agent 质量系统的基础数据。

3. **回归测试防止能力退化**  
   Prompt、模型、工具、上下文策略一变，Agent 行为都可能变化。  
   工程含义：需要固定任务集、期望结果、评分规则和对比报告。

4. **成本和延迟是产品能力**  
   Agent 太慢或太贵，即使准确也难落地。  
   工程含义：要监控 token、工具次数、并发、缓存命中率和失败重试成本。

5. **用户体验依赖透明度**  
   用户需要知道 Agent 正在做什么、卡在哪里、哪些结果已验证。  
   工程含义：进度、证据、未验证项和下一步建议都要清楚表达。

6. **最终目标是设计自己的 Runtime**  
   前 7 周的概念最终要收敛成可实现架构。  
   工程含义：你应该能画模块图、定义核心类、表结构、工具协议和评估方案。

学习时优先追问：

- 这个 Agent 的成功标准是什么？
- 失败能不能定位到具体环节？
- 行为变化能不能回归测试？
- 成本和延迟是否可接受？
- 用户能否验证最终结论？

## 本周主线

Agent 不能只看 Demo 效果，必须能评估、能复盘、能控制成本、能持续改进。

```text
Define Success Criteria
-> Collect Trace
-> Build Golden Dataset
-> Run Evaluation
-> Analyze Failure
-> Improve Prompt / Tool / Context
```

## 每日学习内容

| Day | 主题 | 核心问题 | 学习要点 | 输出物 |
|-----|------|----------|----------|--------|
| Day 50 | Agent Evaluation（智能体评估） | 如何判断 Agent 真的有效？ | 成功率、完成率、工具成功率、人工评分 | 设计评估指标表 |
| Day 51 | Trace 与 Observability（可观测性） | 每一步应该记录什么？ | task、step、tool、input、output、cost、latency | 设计 Trace 字段 |
| Day 52 | Regression Test（回归测试） | Prompt / 模型 / 工具升级如何防退化？ | golden dataset、trajectory replay | 写回归测试方案 |
| Day 53 | Cost and Latency（成本与延迟） | 如何控制 token、模型成本和耗时？ | 模型路由、缓存、摘要、并发 | 写成本估算表 |
| Day 54 | Human Experience（人机协作体验） | 用户如何信任和接管 Agent？ | 可解释、可确认、可取消、可恢复 | 设计交互检查清单 |
| Day 55 | Design Your Own Agent Runtime | 如何设计自己的 Runtime？ | 模块、类、表、Redis/MQ/ES/Vector DB | 输出 Runtime 设计文档 |
| Day 56 | 最终复盘与下一阶段计划 | 后续该做哪 3 个项目？ | 知识库、Review、排障 Agent | 写下一阶段项目计划 |

## 三个实战项目

### 项目一：个人知识库 Agent

- 目标：上传文档、RAG 检索、问答、引用来源。
- MVP：先支持 Markdown / TXT，只读问答，回答必须带来源。
- 核心工具：parse document、chunk、embedding、vector search、citation。

### 项目二：代码仓库 Review Agent

- 目标：读取 Git diff、结合项目规范、输出风险点和建议。
- MVP：只读，不直接改代码；每条发现必须带文件路径和理由。
- 核心工具：git diff、read file、search code、read rules。

### 项目三：后端运维排障 Agent

- 目标：读取日志、查询 MySQL / Redis / ES、分析异常链路。
- MVP：所有工具只读；高风险操作只给建议，不执行。
- 核心工具：search log、query mysql readonly、query redis readonly、query es readonly。

## 技术栈优先级

| 技术 | 作用 | Java 后端优先级 |
|------|------|----------------|
| OpenAI API / Claude API | 模型调用、工具调用 | 高 |
| Spring AI | Java 生态模型和 RAG 接入 | 高 |
| MCP | 工具扩展协议 | 高 |
| MySQL | 任务、状态、审计 | 高 |
| Redis | 会话缓存、锁、限流 | 高 |
| MQ | 长任务异步执行 | 高 |
| Elasticsearch | 日志、文档、代码搜索 | 中高 |
| Vector DB | RAG / Memory | 高 |
| LangGraph | 状态图式 Agent | 中 |
| LlamaIndex | RAG 数据连接 | 中 |

## 常见坑

- 没有评估集就上线。
- 只看最终回答，不看执行轨迹。
- 成本和延迟没有预算。
- 不能区分已验证事实和模型推测。
- 生产写权限开放过早。

## 检查标准

- 能设计 Agent Trace 字段。
- 能设计最小评估集。
- 能说明 Agent 成功率如何度量。
- 能完成三个实战项目的 MVP 方案。
- 能总结后端开发者学习 Agent 的 20% 重点。
