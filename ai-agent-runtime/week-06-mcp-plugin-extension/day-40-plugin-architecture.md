# Day 40：Plugin Architecture（插件架构）

> 所属周：Week 06 - MCP / Plugin / Extension
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 39`](../week-06-mcp-plugin-extension/day-39-resource-vs-tool.md) ｜ 下一天：[`Day 41`](../week-06-mcp-plugin-extension/day-41-mcp-error-handling.md)

核心目标：

- 理解 Agent Runtime 如何扩展能力。

关键概念：

- `Plugin（插件）`：向 Runtime 添加能力的一组代码、配置或工具。
- `Extension Point（扩展点）`：系统允许外部扩展的位置。
- `Registration（注册）`：插件把工具或资源声明给 Runtime。
- `Version Compatibility（版本兼容）`：插件与 Runtime 协议版本匹配。

需要理解：

- 插件系统要解决发现、加载、权限、版本、卸载。
- 插件不能绕过 Runtime 的权限管线。
- 插件能力也要有 schema 和审计。

今日输出：

- 设计一个插件 manifest 字段列表。

自测问题：

- 插件为什么不能直接拿到无限权限？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
