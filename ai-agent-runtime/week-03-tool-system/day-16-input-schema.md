# Day 16：Input Schema（输入结构定义）

> 所属周：Week 03 - Tool System 深入
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 15`](../week-03-tool-system/day-15-tool-interface.md) ｜ 下一天：[`Day 17`](../week-03-tool-system/day-17-tool-result-design.md)

核心目标：

- 理解工具参数为什么必须 schema 化。

关键概念：

- `Input Schema（输入结构定义）`：描述工具参数结构。
- `Required Field（必填字段）`：没有就不能执行。
- `Enum（枚举）`：限制参数只能是某几个值。
- `Default Value（默认值）`：参数缺省时的默认行为。
- `Validation Error（校验错误）`：参数不合法时的错误。

需要理解：

- Schema 是模型与 Runtime 之间的契约。
- Schema 越清晰，模型越不容易乱传参数。
- 复杂工具应避免参数过多，否则模型更容易出错。

今日输出：

- 为 `ReadFileTool`、`SearchCodeTool`、`RunShellCommandTool` 各写一个参数列表。

自测问题：

- 哪些工具参数必须禁止自由文本？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
