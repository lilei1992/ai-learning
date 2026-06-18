# Week 05：State、Permission 与 Guardrails

> 学习目标：让 Agent 从“能跑”变成“可控、可恢复、可审计”。  
> 核心产出：状态机图 + 权限决策表 + 高风险动作审批流。  
> 返回总目录：[`../README.md`](../README.md)  
> 本周 QA：[`week-05-qa-summary.md`](week-05-qa-summary.md)

## 本周学习重心

第五周的核心不是“多加几个确认弹窗”，而是建立 `Action Safety Boundary（动作安全边界）`：

> 模型可以提出动作，但不能拥有执行权；所有真实副作用都必须经过 Runtime 的权限、风险、沙箱和审计管线。

本周真正要抓住 6 个核心思想：

1. **模型输出不是授权**  
   模型说“我要执行”只是一种候选动作，不代表系统允许执行。  
   工程含义：权限判断必须在 Runtime 服务端完成，不能交给 prompt 或前端按钮。

2. **风险来自副作用**  
   只读查询、写文件、执行命令、改数据库、发消息、发布代码的风险完全不同。  
   工程含义：先按副作用分类，再决定自动执行、审批、拒绝或沙箱执行。

3. **权限管线要前置**  
   解析动作、校验参数、风险分类、权限判断、审批确认都要发生在工具执行前。  
   工程含义：不能先执行再补审计，安全系统必须拦在副作用之前。

4. **Sandbox 限制影响范围**  
   沙箱不是绝对安全，而是把可读、可写、可联网、可执行范围收窄。  
   工程含义：路径白名单、命令白名单、网络限制、环境变量脱敏都属于 Runtime 责任。

5. **拒绝也是 Observation**  
   被拒绝的动作也要反馈给模型，说明原因和替代方案。  
   工程含义：拒绝不等于静默失败，必须进入 Transcript 和下一轮上下文。

6. **Audit Log 是信任基础**  
   高风险动作必须能回答谁提出、谁批准、执行了什么、结果如何。  
   工程含义：审计日志要记录决策过程，但不能记录密钥、token、cookie 等敏感信息。

学习时优先追问：

- 这个动作是只读还是有副作用？
- 影响范围是什么？文件、数据库、消息、支付还是发布？
- 是否需要人工确认？
- 执行前能不能预览 diff 或参数？
- 执行后有没有审计和回滚线索？

## 本周主线

模型不能直接拥有执行权。Runtime 必须用状态、权限和护栏包住每一次动作：

```text
Action Proposal
-> Risk Classification
-> Permission Decision
-> Human Approval?
-> Sandbox Execution
-> Audit Log
-> State Update
```

## 每日学习内容

| Day | 主题 | 核心问题 | 学习要点 | 输出物 |
|-----|------|----------|----------|--------|
| Day 29 | AI Action Authorization（AI 动作授权） | 模型提出动作后，谁决定能不能执行？ | action、risk、policy、decision | 设计权限决策表 |
| Day 30 | Permission Pipeline（权限管线） | 权限判断应该经过哪些步骤？ | parse、classify、authorize、approve、execute | 画权限管线图 |
| Day 31 | Sandbox（沙箱） | 如何限制工具影响范围？ | cwd、路径白名单、网络限制、命令白名单 | 写沙箱策略 |
| Day 32 | Hooks（钩子机制） | 动作前后如何插入校验？ | before/after hook、policy hook、audit hook | 设计 Hook 列表 |
| Day 33 | Audit Log（审计日志） | 每个高风险动作要记录什么？ | actor、action、input、decision、result | 设计审计字段 |
| Day 34 | Security Failure Modes（安全失败模式） | Agent 会怎样越权或误操作？ | prompt injection、误删、误发、误执行 | 写失败模式清单 |
| Day 35 | Week 5 复盘 | 如何设计安全版 Runtime？ | 状态、权限、审计、恢复 | 输出安全架构图 |

## 高风险动作清单

- 删除、覆盖、批量移动文件。
- 执行 Shell 写操作。
- 修改数据库或生产配置。
- 调用支付、退款、库存、订单状态接口。
- 发送邮件、短信、IM、工单。
- Git push、merge、release。
- 访问敏感日志、密钥、用户隐私数据。

## 常见坑

- 让模型自己判断动作是否安全。
- 前端确认代替后端权限控制。
- 只记录成功动作，不记录拒绝和失败。
- 高风险动作没有 diff 或预览。
- 审计日志记录了 token、cookie、密码等敏感信息。

## 检查标准

- 能给动作分低、中、高风险。
- 能设计人工审批流程。
- 能解释 Sandbox 的边界。
- 能列出至少 5 种 Agent 安全失败模式。
- 能设计审计日志字段。
