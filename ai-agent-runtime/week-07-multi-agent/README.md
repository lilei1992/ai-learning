# Week 07：AI Coding Agent 与企业内部 Agent

> 学习目标：理解 Claude Code、Codex、Cursor、Cline 这类 Coding Agent 的原理，并设计企业内部 Agent MVP。  
> 核心产出：Coding Agent 流程图 + Code Review Agent MVP + 运维排障 Agent MVP。  
> 返回总目录：[`../README.md`](../README.md)  
> 本周 QA：[`week-07-qa-summary.md`](week-07-qa-summary.md)

## 本周学习重心

第七周的核心是理解 `Coordination Cost（协作成本）`：

> Multi-Agent 不是把多个模型放在一起就更强，而是用明确分工、上下文隔离、结果合并和失败治理来换取并行探索能力。

本周真正要抓住 6 个核心思想：

1. **多 Agent 解决复杂任务分解**  
   它适合研究、代码审查、排障、方案对比等可以拆分的任务。  
   工程含义：先判断任务是否可并行，再决定是否需要多 Agent。

2. **Supervisor 负责控制，不是聊天主持人**  
   `Supervisor Agent（监督者智能体）` 负责拆解任务、分派子任务、检查结果、合并结论。  
   工程含义：Supervisor 需要状态、预算、权限和质量标准。

3. **Context Isolation 防止互相污染**  
   每个子 Agent 只拿自己需要的上下文，不共享所有历史。  
   工程含义：隔离能降低噪声、泄漏和错误传播。

4. **Aggregation 是关键难点**  
   多个 Agent 的结论可能冲突、重复或证据不足。  
   工程含义：结果合并需要证据、置信度、冲突处理和最终责任人。

5. **成本控制必须前置**  
   多 Agent 会放大 token、工具调用、延迟和错误面。  
   工程含义：需要并发上限、预算、取消、早停和优先级。

6. **失败隔离比成功并行更重要**  
   子 Agent 失败不应该拖垮整个任务。  
   工程含义：每个子任务都要有超时、重试、降级和部分结果交付。

学习时优先追问：

- 这个任务真的需要多 Agent 吗？
- 每个 Agent 的职责边界是什么？
- 上下文是否隔离？
- 结果冲突如何裁决？
- 成本和失败如何控制？

## 本周主线

Coding Agent 的关键不是“会写代码”，而是能正确选择代码上下文、小范围修改、运行验证并交付证据。

```text
Read Rules
-> Inspect Repo
-> Locate Files
-> Understand Call Chain
-> Plan Patch
-> Edit Small Scope
-> Run Checks
-> Report Evidence
```

## 每日学习内容

| Day | 主题 | 核心问题 | 学习要点 | 输出物 |
|-----|------|----------|----------|--------|
| Day 43 | Multi-Agent / Coding Agent 基础 | Coding Agent 如何理解仓库？ | README、AGENTS、目录、调用链、diff | 画 Coding Agent 流程图 |
| Day 44 | Task Decomposition（任务拆解） | 大任务如何拆成安全小任务？ | search、read、plan、edit、verify | 写任务拆解模板 |
| Day 45 | Context Isolation（上下文隔离） | 多文件、多子任务如何避免互相污染？ | 子任务上下文、结果摘要、边界 | 写隔离规则 |
| Day 46 | Result Aggregation（结果汇总） | 多个发现如何汇总成结论？ | evidence、severity、risk、suggestion | 设计 Review 输出格式 |
| Day 47 | Cost Control（成本控制） | Coding Agent 如何控制成本？ | 文件选择、摘要、缓存、小模型路由 | 写成本控制清单 |
| Day 48 | Failure Handling（失败处理） | 测试失败、权限不足、语义不明怎么办？ | stop、ask、rollback、partial report | 写失败处理策略 |
| Day 49 | Week 7 复盘 | 如何设计企业内部 Agent MVP？ | Review、日志、SQL、ES、运维 | 输出场景 MVP 表 |

## 企业内部 Agent 场景

| 场景 | MVP | 工具 | 风险 |
|------|-----|------|------|
| Code Review Agent | 只读 Git diff，输出风险点 | Git、代码搜索、规则文件 | 误报、漏报 |
| 日志分析 Agent | 上传日志，提取异常链路 | 日志搜索、知识库 | 敏感信息泄露 |
| SQL 分析 Agent | 分析 SQL 和 explain | MySQL readonly | 错误优化建议 |
| ES 查询 Agent | 生成 DSL 并检查风险 | ES readonly | 深分页、索引误用 |
| 测试用例生成 Agent | 根据 diff 生成测试建议 | Git、代码搜索 | 测试不可运行 |
| 运维排障 Agent | 只读日志 / DB / Redis / ES | 只读工具 | 误判根因 |

## Java 后端项目上下文优先级

1. `AGENTS.md` / 项目规则。
2. README / 模块说明。
3. Controller / Param / VO。
4. App Service / Query Service。
5. Domain Entity / Domain Service。
6. Gateway / Mapper / Client。
7. Enum / StatusCode / message properties。
8. MQ Consumer / ES Sync / Cache。
9. 相关测试和历史 diff。

## 常见坑

- 不读项目规则文件就修改代码。
- 没有复现失败就开始修。
- 一次修改太多文件。
- 不运行验证就说完成。
- 企业 Agent 一开始就接生产写权限。

## 检查标准

- 能解释 Coding Agent 如何读取项目上下文。
- 能设计 Code Review Agent 的只读 MVP。
- 能列出 5 个企业内部 Agent 场景。
- 能说明 AI Coding 为什么依赖 Context Engineering。
- 能区分已验证事实和模型推测。
