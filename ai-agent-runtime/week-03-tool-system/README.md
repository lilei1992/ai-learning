# Week 03：Tool System 工程实现

> 学习目标：设计一套可注册、可校验、可授权、可重试、可审计的工具系统。  
> 核心产出：Tool Schema + Tool Registry + Tool Result 设计。  
> 返回总目录：[`../README.md`](../README.md)  
> 本周 QA：[`week-03-qa-summary.md`](week-03-qa-summary.md)

## 本周主线

Agent 能做事，靠的是工具系统；工具系统不是“随便执行函数”，而是受控 API：

```text
Tool Definition
-> Tool Registry
-> Input Schema Validation
-> Permission Check
-> Execution
-> Tool Result
-> Observation
```

## 每日学习内容

| Day | 主题 | 核心问题 | 学习要点 | 输出物 |
|-----|------|----------|----------|--------|
| Day 15 | Tool Interface（工具接口） | 一个工具最少应该暴露哪些信息？ | name、description、schema、risk、timeout | 设计 `ToolDefinition` |
| Day 16 | Input Schema（输入结构定义） | 如何限制模型传入危险参数？ | required、enum、path 限制、范围限制 | 写 `read_file` Schema |
| Day 17 | Tool Result（工具结果）设计 | 工具结果如何支撑下一轮决策？ | status、summary、evidence、error、rawRef | 设计 `ToolResult` |
| Day 18 | Concurrency Safe（并发安全） | 多工具并发时如何避免冲突？ | 锁、幂等、资源范围、写冲突 | 写并发安全清单 |
| Day 19 | Tool Scheduler（工具调度器） | 工具调用谁来排队、限流、超时？ | scheduler、timeout、rate limit、cancel | 设计调度流程图 |
| Day 20 | Tool Error Handling（工具错误处理） | 工具失败后能不能重试？ | retryable、non-idempotent、fallback | 写工具错误分类表 |
| Day 21 | Week 3 复盘 | 如何完成工具调用端到端闭环？ | 注册、校验、执行、记录、观察 | 画工具调用时序图 |

## 本周实践

设计 4 个基础工具：

- `read_file(path)`：低风险，只读。
- `search_code(keyword, path)`：低风险，只读。
- `run_command(command, cwd)`：中高风险，需要命令白名单。
- `write_file(path, content)`：高风险，需要权限确认和 diff 预览。

## 常见坑

- Tool description 太模糊，模型不会正确选择。
- Schema 太宽，模型能传任意路径或命令。
- 输出没有摘要，直接污染上下文。
- 对写操作自动重试，造成重复副作用。
- 没有记录工具输入和结果，无法审计。

## 检查标准

- 能设计一个完整 Tool Schema。
- 能区分只读工具和写工具的权限级别。
- 能解释 Tool Result 与 Observation 的关系。
- 能说清楚哪些工具失败可以重试，哪些不能。
- 能设计 Tool Registry 的核心字段。
