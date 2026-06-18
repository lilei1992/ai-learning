# Week 06：Agent 架构模式与 MCP 扩展

> 学习目标：掌握常见 Agent 架构模式，并理解 MCP / Plugin 如何扩展外部能力。  
> 核心产出：架构模式对比表 + MCP 组件图 + 场景选型表。  
> 返回总目录：[`../README.md`](../README.md)  
> 本周 QA：[`week-06-qa-summary.md`](week-06-qa-summary.md)

## 本周学习重心

第六周的核心是理解 `Extension Boundary（扩展边界）`：

> Agent Runtime 不可能内置所有能力，必须通过 MCP、插件和外部进程扩展工具，但扩展能力越强，边界、协议和隔离就越重要。

本周真正要抓住 6 个核心思想：

1. **MCP 是能力接入协议**  
   `MCP（Model Context Protocol，模型上下文协议）` 让 Runtime 用统一方式发现和调用外部工具、资源和提示模板。  
   工程含义：工具能力从内置代码变成可插拔服务。

2. **协议比函数调用更重要**  
   MCP 不只是调用函数，还涉及能力发现、Schema、错误、进程生命周期和安全边界。  
   工程含义：Runtime 要把外部能力当不可信服务接入。

3. **Tool 和 Resource 语义不同**  
   `Tool（工具）` 表示可执行动作；`Resource（资源）` 表示可读取上下文。  
   工程含义：读资源和执行动作应该走不同权限和缓存策略。

4. **进程隔离是安全边界**  
   插件通常运行在独立进程或沙箱里，避免第三方代码污染 Runtime 主进程。  
   工程含义：要处理启动、超时、崩溃、重启、stdout/stderr 和协议异常。

5. **插件能力需要治理**  
   插件越多，工具冲突、权限扩大、Schema 漂移和供应链风险越高。  
   工程含义：需要版本、签名、白名单、权限声明和禁用机制。

6. **扩展失败不能拖垮 Runtime**  
   MCP server 崩溃、超时、返回脏数据时，Runtime 应降级、隔离并记录。  
   工程含义：插件系统必须有错误边界和熔断策略。

学习时优先追问：

- 这个能力是 Tool、Resource 还是 Prompt？
- 插件需要哪些权限？
- 插件进程失败时 Runtime 如何恢复？
- 返回内容是否可信？
- 是否可以禁用、升级、审计和回滚？

## 本周主线

不同任务需要不同 Agent 模式。不要一上来就 Multi-Agent，也不要所有任务都用 ReAct。

```text
Task Type
-> Select Pattern
-> Select Tools
-> Define Boundaries
-> Execute
-> Evaluate
```

## 每日学习内容

| Day | 主题 | 核心问题 | 学习要点 | 输出物 |
|-----|------|----------|----------|--------|
| Day 36 | MCP 基础 | MCP 解决什么扩展问题？ | Host、Client、Server、Tool、Resource | 画 MCP 组件图 |
| Day 37 | JSON-RPC（JSON 远程过程调用） | MCP 如何通信？ | request、response、method、params、error | 写 JSON-RPC 示例 |
| Day 38 | Process Isolation（进程隔离） | 为什么工具要隔离运行？ | 安全、崩溃隔离、权限边界 | 写隔离策略 |
| Day 39 | Resource 与 Tool 的区别 | 读资源和执行动作有何不同？ | Resource 供读取，Tool 产生动作 | 设计资源/工具表 |
| Day 40 | Plugin Architecture（插件架构） | 如何让 Agent 可扩展？ | manifest、version、capability、permission | 设计插件清单 |
| Day 41 | MCP Error Handling（MCP 错误处理） | 插件失败不能拖垮主任务 | timeout、retry、fallback、disable | 写错误处理策略 |
| Day 42 | Week 6 复盘 | 如何选择 Agent 架构模式？ | ReAct、Plan、Router、Multi-Agent、Workflow+Agent | 输出模式选型表 |

## 架构模式速查

| 模式 | 适用场景 | 优点 | 缺点 |
|------|----------|------|------|
| ReAct Agent | 排查、代码修复、探索任务 | 灵活 | 容易循环 |
| Plan-and-Execute | 长任务、复杂目标 | 结构清晰 | 计划可能过期 |
| Router Agent | 多领域分发 | 简化入口 | 路由可能错误 |
| Supervisor Agent | 多子任务协调 | 可并行 | 成本高、复杂 |
| Coding Agent | 代码阅读、修改、测试 | 工程价值高 | 误改风险高 |
| Research Agent | 资料调研 | 覆盖面广 | 来源可靠性难控 |
| Workflow + Agent | 企业关键流程 | 可控可靠 | 边界设计复杂 |

## 常见坑

- 过早使用 Multi-Agent。
- 子 Agent 上下文互相污染。
- Router 没有兜底策略。
- MCP 工具权限暴露太宽。
- 插件错误没有隔离和降级。

## 检查标准

- 能说清楚 7 种 Agent 模式的适用场景。
- 能解释 MCP 的 Host / Client / Server。
- 能区分 Resource 和 Tool。
- 能为企业场景选择合适架构。
- 能说明插件失败如何处理。
