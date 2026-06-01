# Day 31：Sandbox（沙箱）

> 所属周：Week 05 - Permission System 深入
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 30`](../week-05-permission-system/day-30-permission-pipeline.md) ｜ 下一天：[`Day 32`](../week-05-permission-system/day-32-hooks.md)

核心目标：

- 理解 sandbox 能限制什么，不能限制什么。

关键概念：

- `Sandbox（沙箱）`：隔离执行环境，限制文件、网络、进程等访问。
- `Filesystem Isolation（文件系统隔离）`：限制可访问路径。
- `Network Isolation（网络隔离）`：限制外部网络访问。
- `Process Isolation（进程隔离）`：限制进程之间互相影响。

需要理解：

- Sandbox 是最后一道防线，不是权限系统替代品。
- 有些风险来自业务语义，sandbox 不一定能判断。
- 例如删除临时目录可能安全，也可能误删重要产物，要结合上下文判断。

今日输出：

- 写出 BashTool 需要的 5 个 sandbox 限制。

自测问题：

- 为什么 sandbox 不能完全替代用户确认？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
