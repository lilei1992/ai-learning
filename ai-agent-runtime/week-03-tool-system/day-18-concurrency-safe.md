# Day 18：Concurrency Safe（并发安全）

> 所属周：Week 03 - Tool System 深入
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 17`](../week-03-tool-system/day-17-tool-result-design.md) ｜ 下一天：[`Day 19`](../week-03-tool-system/day-19-tool-scheduler.md)

核心目标：

- 掌握工具并发调度规则。

关键概念：

- `Concurrency Safe（并发安全）`：多个工具同时执行不会互相破坏状态。
- `Read-only Tool（只读工具）`：不修改外部状态，通常可并发。
- `Mutating Tool（变更工具）`：修改文件、数据库、远程服务，通常要独占。
- `Exclusive Execution（独占执行）`：某个工具执行期间不允许其他冲突工具执行。

需要理解：

- 读文件、搜索代码通常可并发。
- 写文件、运行修改性命令通常不可并发。
- 并发安全不是工具自己说了算，还要看参数是否冲突。

Java / 后端类比：

- Read-only Tool 类似读锁。
- Mutating Tool 类似写锁。
- Scheduler 类似 ReadWriteLock + 任务队列。

今日输出：

- 给 10 个常见工具标注是否并发安全，并写理由。

自测问题：

- 两个 `FileWriteTool` 写不同文件，是否可以并发？为什么仍要谨慎？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
