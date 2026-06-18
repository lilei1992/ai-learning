# AI Agent 学习含金量提升建议

> 目的：避免学习停留在“知道概念”，把每周内容转成可落地的工程能力。

## 1. 每周必须有一个工程输出

| 周次 | 必做输出 |
|------|----------|
| Week 02 | `AgentRuntime.run()` 伪代码 + 状态图 |
| Week 03 | Tool Schema + Tool Registry 设计 |
| Week 04 | Context Assembly 策略 + RAG 流程图 |
| Week 05 | Permission Pipeline + Audit Log 表设计 |
| Week 06 | Agent 架构模式选型表 + MCP 组件图 |
| Week 07 | Code Review Agent MVP 方案 |
| Week 08 | 三个实战项目完整设计文档 |

## 2. 每天都要回答 4 个工程问题

1. 这个概念解决什么真实工程问题？
2. 如果没有它，Agent 会出现什么失败模式？
3. Java 后端系统里有没有类似组件？
4. 如果让我实现，核心类、表或接口是什么？

## 3. 不要过早追框架

先理解 Runtime、Tool、Context、State、Permission、Trace，再学 LangGraph、Spring AI、MCP。否则容易会用框架，但不懂为什么这么设计。

## 4. 把企业风险场景引入学习

每学一个概念，都用这些场景验证：

- 订单状态能不能让 Agent 自动改？
- 生产 SQL 能不能让 Agent 自动执行？
- 删除文件要不要审批？
- 日志里有 token 怎么脱敏？
- Agent 没跑测试能不能说完成？

## 5. 三个实战项目要逐步增加风险

建议顺序：

1. 个人知识库 Agent：只读，低风险，练 RAG 和引用。
2. Code Review Agent：只读中风险，练代码上下文和规则对齐。
3. 运维排障 Agent：只读高风险，练权限、审计、事实与推测分离。

## 6. 每周末做一次 QA 复盘

复盘标准：

- 能否不看资料回答本周 QA？
- 能否画出本周核心流程图？
- 能否说出 3 个失败模式？
- 能否给出 Java 后端类比？
- 能否写出一个最小接口或表结构？

## 7. 学习时优先抓 20% 核心

最值得反复练的是：Agent Loop、Tool Schema、Context Assembly、Memory Policy、State Machine、Permission Pipeline、Trace / Transcript、Evaluation。
