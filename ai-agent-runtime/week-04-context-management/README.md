# Week 04：Context Engineering 与 Memory

> 学习目标：掌握 Agent 最核心的工程能力：如何动态选择上下文、管理记忆、控制 token、避免污染。  
> 核心产出：上下文组装策略 + Memory 写入规则 + RAG 设计草图。  
> 返回总目录：[`../README.md`](../README.md)  
> 本周 QA：[`week-04-qa-summary.md`](week-04-qa-summary.md)

## 本周主线

Prompt 写得好不够，Agent 真正稳定依赖 Context Engineering：

```text
Task Goal
-> Select Relevant Instructions
-> Select State
-> Select Memory
-> Retrieve Documents
-> Summarize Observations
-> Fit Token Budget
-> Invoke Model
```

## 每日学习内容

| Day | 主题 | 核心问题 | 学习要点 | 输出物 |
|-----|------|----------|----------|--------|
| Day 22 | Context Window（上下文窗口） | 模型一次能看多少信息？ | token、窗口、预算、截断风险 | 写 token 预算表 |
| Day 23 | Context Pollution（上下文污染） | 哪些内容会误导模型？ | 旧信息、无关日志、恶意网页、错误 Memory | 写污染来源清单 |
| Day 24 | Tool Result Budget（工具结果预算） | 工具长输出如何放回上下文？ | 摘要、证据、引用、rawRef | 设计工具结果压缩规则 |
| Day 25 | Context Compaction（上下文压缩） | 长任务如何压缩历史？ | summary、milestone、decision record | 写压缩模板 |
| Day 26 | Prompt Cache（提示词缓存） | 哪些上下文适合缓存？ | 稳定规则、项目说明、工具定义 | 设计缓存分层 |
| Day 27 | Memory Write Policy（记忆写入策略） | 什么信息能写入长期记忆？ | Working / Episodic / Semantic Memory | 写 Memory 写入规则 |
| Day 28 | Week 4 复盘 | 如何设计知识库 Agent 的上下文？ | RAG、引用来源、记忆边界 | 画 RAG 流程图 |

## 本周实践

设计个人知识库 Agent 的上下文系统：

- 文档切分为 chunk。
- 向量化后存入 Vector DB。
- 提问时召回相关 chunk。
- 回答必须带引用来源。
- 不把一次性日志写入长期 Memory。

## 常见坑

- 把 Prompt Engineering 当成全部。
- 检索到不相关内容也塞进上下文。
- Memory 写入太激进，长期污染。
- 不保留引用来源，答案无法验证。
- 大文件、大日志直接进入模型。

## 检查标准

- 能解释 Context Engineering 和 Prompt Engineering 的区别。
- 能区分 Working / Episodic / Semantic Memory。
- 能设计 RAG 基础流程。
- 能写出上下文选择优先级。
- 能说明如何避免上下文太长、太乱、太旧。
