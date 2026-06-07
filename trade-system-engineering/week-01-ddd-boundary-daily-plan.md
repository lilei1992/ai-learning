# Week 1：交易系统全景和 DDD 边界每日计划

> 周目标：建立 MoreTickets 的交易系统全景图，分清主业务域、跨域协作方式、写链路、读链路和异步副作用边界。
> 最终产出：一张业务域关系图、一份模块边界检查清单、一份 AI 协作任务描述模板。

## 本周学习原则

- 不猜业务含义：状态、字段、枚举、MQ topic/tag、ES 字段都要回代码确认。
- 先看边界，再看细节：先分清 `API -> App -> Domain -> Infrastructure`，再深入订单、库存、支付、售后。
- 每天必须有输出物：哪怕只有 15 分钟，也要留下 3 条结论和 1 个待确认问题。
- 不改业务代码：第一周只做阅读、画图、风险标注和任务描述训练。

## Day 1：建立项目全景和模块边界

### 学习目标

弄清 MoreTickets 不是 CRUD 系统，而是订单、库存、支付、售后、履约、通知、ES、MQ 多链路耦合的交易平台。

### 阅读入口

- `~/code/moretickets/AGENTS.md`
- `~/code/moretickets/docs/agent/ddd-boundaries.md`
- `~/code/moretickets/docs/agent/development-workflow.md`

### 要回答的问题

- 正式 Maven 模块有哪些，各自职责是什么？
- 写操作标准链路是什么？
- 读操作标准链路是什么？
- 哪些层之间禁止直接调用？
- 为什么 App 层写操作不能直接访问 Mapper？

### 今日输出

```text
API 层：
App 层：
Domain 层：
Infrastructure 层：
Client/Common 层：

我理解的写操作链路：
我理解的读操作链路：
今天发现的 3 个禁止事项：
```

### Busy Mode

只读 `AGENTS.md` 的“模块边界”和“标准调用链”，写 5 行总结。

## Day 2：画业务域关系图

### 学习目标

分清订单、库存、支付、售后、演出、场馆、商家/用户、通知等业务域的职责归属，避免后续分析时把状态决策放错地方。

### 阅读入口

- `~/code/moretickets/docs/agent/ddd-boundaries.md`
- `~/code/moretickets/moretickets-domain/src/main/java/com/moretickets/order`
- `~/code/moretickets/moretickets-domain/src/main/java/com/moretickets/inventory`
- `~/code/moretickets/moretickets-domain/src/main/java/com/moretickets/customerservice`
- `~/code/moretickets/moretickets-domain/src/main/java/com/moretickets/show`

### 要回答的问题

- 哪些业务域拥有状态决策权？
- 订单域拥有哪些核心对象？
- 库存域只管库存，还是也能改订单？
- 售后域和订单域之间如何协作？
- 演出/场馆/库存之间是什么关系？

### 今日输出

画一张文本版业务域关系图：

```text
Show / Venue
  -> Inventory
  -> Order
Order
  -> Payment
  -> Fulfillment
  -> CustomerService
  -> Notification
  -> ES / Cache
```

并补充说明：

- 主域：
- 协作域：
- 异步副作用：
- 不能直接改的状态：

### Busy Mode

只写出 6 个业务域：`order`、`inventory`、`payment`、`customerservice`、`show`、`notification`，每个域一句职责。

## Day 3：拆一条 HTTP 写操作链路

### 学习目标

理解写操作为什么必须经过 App 编排、Domain 决策和 Gateway 持久化，而不是 Controller 直接改表。

### 阅读入口

- `~/code/moretickets/docs/agent/data-flow.md`
- `~/code/moretickets/moretickets-api-*/src/main/java`
- `~/code/moretickets/moretickets-app/src/main/java/com/moretickets/service`
- `~/code/moretickets/moretickets-domain/src/main/java/com/moretickets/order`
- `~/code/moretickets/moretickets-infrastructure/src/main/java/com/moretickets/infra/gateway/order`

### 要回答的问题

- Controller 做了哪些事情，哪些事情不该做？
- Param/DTO/VO/Transfer 在链路里分别解决什么问题？
- App Service 负责事务还是状态规则？
- Domain Entity / Factory / Gateway Interface 的边界是什么？
- DefaultGateway、Mapper、PO 是基础设施细节还是业务决策？

### 今日输出

选一个你能找到的订单相关写入口，写出链路：

```text
Controller:
Param / Transfer:
App Service:
Domain Factory / Entity:
Gateway Interface:
DefaultGateway:
Mapper:
事务提交后副作用:
```

再写 3 个风险：

- 如果 Controller 直接改状态，会绕过什么？
- 如果 App 写操作直接调用 Mapper，会丢失什么？
- 如果事务内发送 MQ，会有什么一致性风险？

### Busy Mode

只写标准链路：`Controller -> App Service -> Domain -> Gateway -> Mapper`，并解释每层一句话。

## Day 4：拆一条 HTTP 查询链路

### 学习目标

分清读链路和写链路的不同：读链路可以走 Mapper/ES/Cache 组合查询，但不能顺手承载状态变更。

### 阅读入口

- `~/code/moretickets/docs/agent/data-flow.md`
- `~/code/moretickets/moretickets-infrastructure/src/main/java/com/moretickets/infra/gateway/order/repository/es`
- `~/code/moretickets/moretickets-infrastructure/src/main/java/com/moretickets/infra/gateway/customerservice/repository/es`
- 搜索：`rg "EsReader|EsWriter|QueryService|Cache" ~/code/moretickets`

### 要回答的问题

- 查询为什么可以走 ES，但不能把 ES 当强一致数据源？
- QueryService 和 App Service 的职责差别是什么？
- 查询链路里 DTO assembly 和 VOTransfer 的作用是什么？
- 哪些查询必须分页？
- 如果 DB 已更新但 ES 未同步，前端会看到什么？

### 今日输出

选一个查询链路，写出：

```text
Controller:
ParamTransfer:
QueryService / App Service:
Mapper / ES Reader / Cache:
DTO:
VOTransfer:
Response:

一致性判断：
- DB 是否为主数据：
- ES 是否可能延迟：
- Cache 是否可能脏读：
- 用户是否可接受短暂旧数据：
```

### Busy Mode

只总结一句：DB、ES、Cache 在查询链路里的角色分别是什么。

## Day 5：理解异步副作用和最终一致性

### 学习目标

理解 DB 事务、MQ、Consumer、ES、通知、缓存之间不是一个强一致事务，重点识别补偿和幂等要求。

### 阅读入口

- `~/code/moretickets/docs/agent/data-flow.md`
- `~/code/moretickets/docs/agent/mq-guidelines.md`
- `~/code/moretickets/moretickets-app/src/main/java/com/moretickets/consumer/order`
- `~/code/moretickets/moretickets-app/src/main/java/com/moretickets/consumer/inventory`

### 要回答的问题

- MQ 为什么必须在 DB 事务提交后发送？
- Consumer 为什么必须幂等？
- 消费失败时应该吞异常还是触发重试？
- ES 同步失败后，系统靠什么补偿？
- 通知失败是否应该影响主流程成功？

### 今日输出

画一条最终一致性链路：

```text
DB transaction commit
-> MQ publish
-> Consumer receives
-> idempotency check
-> ES / Cache / Notification / Supplier
-> retry / compensation
```

异常场景表：

| 场景 | 可能后果 | 当前应检查的保护 | 补偿方式 |
|------|----------|------------------|----------|
| MQ 发送失败 | | | |
| MQ 重复消费 | | | |
| Consumer 处理一半失败 | | | |
| ES 写入失败 | | | |
| 通知发送失败 | | | |

### Busy Mode

只写清楚 3 句话：MQ 的作用、Consumer 幂等的原因、ES 延迟的影响。

## Day 6：做模块边界检查清单

### 学习目标

把第一周看到的边界规则整理成可复用检查清单。以后任何需求、Bug、代码评审都先过这张表。

### 阅读入口

- `~/code/moretickets/docs/agent/ddd-boundaries.md`
- `~/code/moretickets/docs/agent/development-workflow.md`
- `~/code/moretickets/docs/agent/pitfalls.md`

### 要回答的问题

- API 层是否直接访问 Mapper、ES、Redis、MQ？
- App 写操作是否绕过 Domain？
- Domain 是否依赖 App/API/Mapper/ES/Redis/HTTP Client？
- Infrastructure 是否承载了核心状态机？
- 新增或修改状态后，是否检查 Consumer、ES Writer、通知、售后判断？

### 今日输出

整理一份检查清单：

```markdown
## 模块边界检查清单

- [ ] 已确认主业务域。
- [ ] Controller 未做核心状态决策。
- [ ] App 写操作未直接访问 Mapper。
- [ ] Domain 未依赖基础设施细节。
- [ ] Infrastructure 未承载核心状态机。
- [ ] 写 DB 后已检查 MQ。
- [ ] 影响列表查询时已检查 ES 同步。
- [ ] 影响读模型时已检查 Cache 失效。
- [ ] 涉及外部供应商时已检查超时、重试、幂等、签名。
- [ ] 已定义验证方式和回滚方案。
```

### Busy Mode

只完成前 5 个检查项，并各写一句为什么。

## Day 7：周复盘和 AI 协作训练

### 学习目标

把“交易系统全景和 DDD 边界”转化成 AI 能安全执行的任务描述能力。

### 阅读入口

- 本周 Day 1-6 笔记
- `~/code/moretickets/docs/agent/development-workflow.md`
- `~/code/moretickets/AGENTS.md`

### 要回答的问题

- 我现在能否解释写链路和读链路的区别？
- 哪些业务状态只能由主域决策？
- 哪些副作用必须走 MQ 或补偿？
- 如果让 AI 改一个订单需求，我必须提前写清哪些边界？
- 如果 AI 给出跨层捷径，我如何识别并拒绝？

### 今日输出

写一份 AI 任务描述模板，主题建议用“分析订单状态变更影响面”：

```text
请分析 [订单状态变更场景] 的影响面，不要直接改代码。

背景：
- 业务域：order
- 入口：
- 当前状态：
- 目标状态：

范围内：
- Controller / Param / VO
- App Service / QueryService
- Domain Model / Gateway
- Infrastructure Mapper / ES / Cache
- MQ Producer / Consumer

范围外：
- 不新增数据库字段
- 不改变支付/售后状态语义
- 不做无关重构

必须检查：
- 状态迁移是否合法
- DB 事务边界
- MQ topic/tag/message/handler
- Consumer 幂等
- ES Reader/Writer
- Cache 失效
- 老数据和老消息兼容

验收：
- 成功路径：
- 失败路径：
- 重复请求：
- 并发场景：
- 回滚方案：
```

### Busy Mode

只完成这 4 行：

```text
背景：
目标：
范围外：
验收标准：
```

## 本周最终验收

完成 Week 1 后，你应该至少留下 3 个文件或笔记块：

- `week-01-domain-map.md`：业务域关系图。
- `week-01-boundary-checklist.md`：模块边界检查清单。
- `week-01-ai-task-template.md`：AI 协作任务描述模板。

如果只想保留一个文件，也可以把三块内容都放进 `week-01-review.md`。

## 自测问题

- 写操作为什么不能从 Controller 直接到 Mapper？
- 为什么 Domain 不能依赖 HTTP Client 或 Redis？
- DB、ES、Cache 在交易系统里分别是什么角色？
- MQ 重复消费时，Consumer 应该靠什么保证幂等？
- 新增订单状态时，为什么必须检查售后、通知、ES 和 Consumer？
- AI 协作任务里，“范围外”和“回滚方案”为什么必须写清楚？
