# Day 32：Hooks（钩子机制）

> 所属周：Week 05 - Permission System 深入
> 建议节奏：Busy Mode（15-20 分钟）/ Standard Mode（45 分钟）/ Deep Mode（90 分钟）
> 导航：[`本周目录`](README.md) / [`总目录`](../README.md)
> 上一天：[`Day 31`](../week-05-permission-system/day-31-sandbox.md) ｜ 下一天：[`Day 33`](../week-05-permission-system/day-33-audit-log.md)

核心目标：

- 理解工具执行前后的扩展点。

关键概念：

- `Hook（钩子）`：在某个生命周期点插入自定义逻辑。
- `PreToolUse Hook（工具执行前钩子）`：执行前检查、记录、拒绝。
- `PostToolUse Hook（工具执行后钩子）`：执行后审计、同步、清理。
- `Lifecycle（生命周期）`：工具调用从创建到完成的各阶段。

需要理解：

- Hook 适合做审计、安全扫描、参数检查。
- Hook 不应承载核心业务状态机，否则会变得难以追踪。
- Hook 失败时要明确是否阻断工具执行。

今日输出：

- 设计 3 个 Hook：安全扫描、日志审计、敏感路径拦截。

自测问题：

- PreToolUse Hook 超时了，应该允许工具继续执行吗？

## 今日笔记

### 3 条要点

- 
- 
- 

### Java / 后端类比

- 

### 还没想清楚的问题

- 
