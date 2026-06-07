# Week 1：交易系统全景和 DDD 边界问题答案

> 对应计划：[`week-01-ddd-boundary-daily-plan.md`](week-01-ddd-boundary-daily-plan.md)
> 目标：把第一周每天“要回答的问题”和“自测问题”直接写成可复习答案。

## Day 1：建立项目全景和模块边界

### 问题 1：正式 Maven 模块有哪些，各自职责是什么？

答案：

- `moretickets-start`：启动入口、全局配置、过滤器、异常处理、鉴权入口。
- `moretickets-api-*`：Controller、Param、VO、API 层 Transfer，负责 HTTP/API 入口和出入口模型转换。
- `moretickets-app`：应用服务、查询编排、事务边界、MQ Consumer、Schedule、DTO Transfer。
- `moretickets-domain`：领域模型、领域工厂、领域服务、Gateway 接口，负责核心业务状态和规则。
- `moretickets-infrastructure`：Gateway 实现、Mapper、ES Reader/Writer、缓存、外部供应商 Client。
- `moretickets-client`：跨模块 DTO、VO、Param、Enum、Response。
- `moretickets-common`：通用工具、常量、基础封装。

核心理解：

```text
API 负责入口，不做核心状态决策。
App 负责编排和事务。
Domain 负责业务规则和状态合法性。
Infrastructure 负责数据库、ES、缓存、MQ、外部供应商适配。
Client/Common 放共享模型和通用能力，不放具体业务流程。
```

### 问题 2：写操作标准链路是什么？

答案：

```text
Controller
-> Param validation
-> Param Transfer
-> App Service
-> Domain Factory / Domain Entity / Domain Service
-> Domain Gateway Interface
-> Infrastructure DefaultGateway
-> Mapper / ES Writer / Cache / Supplier
-> DB transaction commit
-> MQ / ES / Notification / Cache side effects
```

关键点：

- `Controller` 不应该决定订单、库存、售后、支付状态。
- `App Service` 负责事务和流程编排。
- `Domain` 负责判断状态能不能变、金额能不能退、库存能不能锁。
- `Infrastructure` 只负责适配持久化和外部系统。
- 事务提交后的副作用通常通过 MQ、ES 同步、缓存失效、通知等方式处理。

### 问题 3：读操作标准链路是什么？

答案：

```text
Controller
-> ParamTransfer
-> QueryService / App Service
-> Mapper / ES Reader / CacheDao
-> DTO assembly
-> VOTransfer
-> Response
```

关键点：

- 读链路可以走 `Mapper`、`ES Reader`、`Cache`，但不能顺手改业务状态。
- DB 是主数据源。
- ES 用于搜索和列表查询，不保证强一致。
- Cache 用于加速读取，可能存在短暂脏读。
- 大列表必须分页，不能无分页扫大表。

### 问题 4：哪些层之间禁止直接调用？

答案：

- API 层不得直接访问 `Mapper`、`ES`、`Redis`、`MQ`、外部 Client。
- App 层写操作不得直接访问 `Mapper`，不得绕过 Domain。
- Domain 层不得依赖 App、API、Mapper、ES、Redis、HTTP Client。
- Infrastructure 层不得承载核心业务状态机和领域决策。
- Client/Common 不得放具体业务流程。

原因：

```text
跨层捷径会让状态规则散落，后续订单、库存、支付、售后链路容易出现不一致。
交易系统的问题通常不是单表字段问题，而是状态、事务、副作用、补偿链路一起变化。
```

### 问题 5：为什么 App 层写操作不能直接访问 Mapper？

答案：

因为写操作通常不是简单落库，而是一次业务状态变化。直接访问 Mapper 会绕过：

- Domain 中的状态合法性检查。
- 订单、库存、支付、售后之间的协作规则。
- Gateway 封装的持久化一致性。
- 事务边界后的 MQ、ES、缓存、通知等副作用检查。
- 幂等、补偿、兼容旧状态等保护点。

正确做法：

```text
App Service 编排流程和事务
-> Domain 判断状态和业务规则
-> Gateway Interface 表达领域持久化意图
-> Infrastructure 用 Mapper 落库
```

## Day 2：画业务域关系图

### 问题 1：哪些业务域拥有状态决策权？

答案：

主业务域拥有状态决策权。

典型归属：

- `order`：用户订单、商家订单、履约单、支付单关联、异常订单、打印任务等状态。
- `inventory`：库存创建、上下架、锁定、释放、自动调价等状态。
- `customerservice`：售后单、退款单、退款/补偿、财务支付事务状态。
- `show`：节目、巡演、场次、票面、票务平台、标签、分类等状态。
- `venue`：场馆模板、场馆实例、选座图、区域、排、座位结构等状态。
- `operator`：用户、商家、管理员、商家入驻、账户、地址、操作日志。
- `notification`：通知模板、消息、发送器、批量通知、发送记录。

原则：

```text
哪个域拥有这个业务概念，哪个域决定它的状态变化。
其他域需要参与时，通过 Gateway、App Service 或 MQ 协作，不能直接改内部状态。
```

### 问题 2：订单域拥有哪些核心对象？

答案：

订单域包含：

- 用户订单。
- 商家订单。
- 履约单。
- 支付单关联。
- 充值订单。
- 异常订单。
- 打印任务。

订单域负责：

- 用户订单状态流转。
- 商家订单状态流转。
- 履约单状态流转。
- 支付成功后订单侧状态变化。
- 取消、超时、履约、出票、退款等订单相关决策。
- 订单状态变更后的 MQ、ES、通知、售后判断等影响面。

### 问题 3：库存域只管库存，还是也能改订单？

答案：

库存域只拥有库存自己的状态，不应该直接修改订单状态。

库存域负责：

- 库存创建、更新、上下架。
- 库存锁定和释放。
- 自动调价。
- 库存属性。
- 参考价和最优价判断。

库存域不能做：

- 直接取消订单。
- 直接改变用户订单、商家订单、履约单状态。
- 在库存代码里维护订单状态机。

正确协作方式：

```text
Order 触发下单/取消/履约失败
-> 调用库存领域能力或 Gateway
-> Inventory 完成锁定/释放
-> 必要时通过 MQ 触发后续补偿
```

### 问题 4：售后域和订单域之间如何协作？

答案：

售后域负责售后单、退款单、退款/补偿和财务支付事务；订单域负责原订单状态和履约状态。二者必须协作，但不能互相绕过主域直接改状态。

典型链路：

```text
CustomerService App Service
-> CustomerServiceOrder Domain
-> RefundOrder Domain
-> Payment refund client
-> Refund callback
-> CustomerService / Refund / Order state update
-> MQ notification
```

要点：

- 不能直接插入退款单绕过售后单。
- 退款回调不能只改支付事务，还要核对售后、退款单、订单展示。
- 金额计算不能散落在 Controller 或 Mapper。
- 原订单是否可退、退多少、退后展示什么，需要订单、售后、支付一起核对。

### 问题 5：演出/场馆/库存之间是什么关系？

答案：

- `show` 管节目、巡演、场次、票面、票务平台、标签、分类。
- `venue` 管场馆模板、场馆实例、选座图、区域、排、座位结构。
- `inventory` 管可售库存、库存属性、锁定、释放、自动调价。

关系可以理解为：

```text
Venue 提供座位和场馆结构
Show 提供节目、巡演、场次和票面信息
Inventory 基于 Show / Venue 形成可售资源
Order 基于 Inventory 完成下单、锁定、支付、履约
```

风险：

- 改场次可售状态后，不检查库存和订单展示，可能导致前台卖错。
- 修改选座结构后，不检查库存、票面、场次引用，可能导致座位/库存错配。
- 库存变更后不检查缓存、ES、前台展示，可能导致查询端展示旧数据。

## Day 3：拆一条 HTTP 写操作链路

### 问题 1：Controller 做了哪些事情，哪些事情不该做？

答案：

Controller 应该做：

- 接收 HTTP 请求。
- 做基础参数校验。
- 调用 Param Transfer 转换入参。
- 调用 App Service 或 QueryService。
- 返回 VO / Response。

Controller 不该做：

- 不做订单、库存、支付、售后状态决策。
- 不直接访问 Mapper、ES、Redis、MQ、外部 Client。
- 不写复杂业务流程。
- 不硬编码状态含义、金额规则、供应商协议。
- 不吞异常后返回伪成功。

### 问题 2：Param/DTO/VO/Transfer 在链路里分别解决什么问题？

答案：

- `Param`：API 入参模型，表达前端/外部调用传入的数据。
- `DTO`：应用层或跨层传输模型，表达服务内部组合后的数据。
- `VO`：API 出参模型，表达返回给前端或调用方的数据。
- `Transfer`：负责模型转换，避免 Controller、Service 中散落字段复制逻辑。

分层意义：

```text
Param 面向请求
DTO 面向应用编排
Domain Model 面向业务规则
PO / Entity 面向持久化
VO 面向响应
```

### 问题 3：App Service 负责事务还是状态规则？

答案：

App Service 主要负责事务和流程编排，不应该承载核心状态规则。

App Service 应该负责：

- 开启事务边界。
- 编排多个领域对象和 Gateway。
- 调用 Domain 完成状态决策。
- 组织 MQ、ES、缓存、通知等副作用。
- 处理跨域协作顺序。

核心状态规则应该在 Domain：

```text
能不能取消订单
能不能释放库存
能不能退款
能不能履约完成
状态 A 能不能流转到状态 B
```

### 问题 4：Domain Entity / Factory / Gateway Interface 的边界是什么？

答案：

- `Domain Entity`：承载业务状态和业务行为，判断状态迁移是否合法。
- `Domain Factory`：负责加载、创建或组装领域对象，保证对象进入业务逻辑前是完整的。
- `Gateway Interface`：定义领域需要的持久化或外部能力接口，不暴露 Mapper、ES、HTTP 细节。

边界：

```text
Domain 只知道业务概念和 Gateway 接口。
Domain 不知道 Mapper、PO、Redis、ES、HTTP Client。
Infrastructure 实现 Gateway 接口，负责把领域意图落到具体技术实现。
```

### 问题 5：DefaultGateway、Mapper、PO 是基础设施细节还是业务决策？

答案：

它们应该是基础设施细节，不应该承载核心业务决策。

- `DefaultGateway`：实现 Domain Gateway Interface，把领域模型转换为持久化操作。
- `Mapper`：执行 SQL。
- `PO`：数据库持久化对象。

它们可以做：

- 数据库读写。
- PO 和 Domain/Entity 转换。
- 查询条件封装。
- 基础数据适配。

它们不应该做：

- 决定订单状态能不能变。
- 决定库存能不能释放。
- 决定退款金额规则。
- 实现核心状态机。

### 今日输出答案：订单写链路示例

```text
Controller:
接收订单相关 HTTP 请求，完成参数校验和入口调用。

Param / Transfer:
把前端 Param 转成 App 层可用的 DTO / Command。

App Service:
开启事务，编排订单、库存、支付、售后等领域能力。

Domain Factory / Entity:
加载订单聚合，判断当前状态下能否执行目标动作。

Gateway Interface:
表达订单保存、状态更新、关联对象持久化等领域需求。

DefaultGateway:
把领域模型转换成 PO / Entity，调用 Mapper 落库。

Mapper:
执行具体 SQL。

事务提交后副作用:
发送 MQ，触发 ES 同步、通知、缓存失效、履约或售后补偿。
```

三个风险答案：

- Controller 直接改状态会绕过 Domain 状态合法性、权限、幂等和跨域副作用检查。
- App 写操作直接调用 Mapper 会让业务规则散落，后续 MQ、ES、缓存、售后、支付影响面容易漏。
- 事务内发送 MQ 时，如果 DB 回滚但 MQ 已发出，Consumer 可能基于不存在或未提交的数据执行副作用。

## Day 4：拆一条 HTTP 查询链路

### 问题 1：查询为什么可以走 ES，但不能把 ES 当强一致数据源？

答案：

因为 ES 是搜索和列表查询读模型，不是主数据源。DB 写入后，ES 通常通过 Writer、SyncService、Consumer 或 Schedule 异步同步。

这意味着：

- DB 已更新时，ES 可能还没更新。
- ES 查询结果可能短暂旧。
- ES 同步失败后需要补偿或重建。
- 关键状态判断不能只依赖 ES。

正确理解：

```text
DB = source of truth
ES = search/read model
Cache = read acceleration
```

### 问题 2：QueryService 和 App Service 的职责差别是什么？

答案：

- `QueryService`：偏查询编排，组合 Mapper、ES Reader、Cache，组装 DTO/VO，不改变业务状态。
- `App Service`：偏业务用例编排，尤其是写操作，管理事务，调用 Domain 完成状态变化。

判断标准：

```text
只读数据、组装返回：QueryService
涉及状态变化、事务、副作用：App Service + Domain
```

### 问题 3：查询链路里 DTO assembly 和 VOTransfer 的作用是什么？

答案：

- `DTO assembly`：把 DB、ES、Cache、外部查询结果组合成应用层数据结构。
- `VOTransfer`：把 DTO 转成前端/API 需要的响应模型。

好处：

- 避免 Controller 直接拼字段。
- 避免把持久化对象直接暴露给前端。
- 隔离内部模型和外部响应契约。
- 多端 API 可以有不同 VO，不影响领域模型和 DB 模型。

### 问题 4：哪些查询必须分页？

答案：

所有可能返回大列表的查询都必须分页，尤其是：

- 订单列表。
- 商家订单列表。
- 售后单列表。
- 库存列表。
- 演出/场次列表。
- 通知记录列表。
- 操作日志列表。
- ES 搜索列表。

特别注意：

- 禁止无分页扫大表。
- ES `from + size > 10000` 时不能继续深分页，要考虑 `search_after`。
- 分页条件必须带必要的组织、商家、用户、软删除过滤。

### 问题 5：如果 DB 已更新但 ES 未同步，前端会看到什么？

答案：

前端可能看到旧数据，例如：

- 订单状态已经支付成功，但列表仍显示待支付。
- 售后状态已退款完成，但搜索结果仍显示处理中。
- 库存已下架，但列表仍显示可售。
- 演出信息已修改，但搜索页仍显示旧标题、旧时间或旧票面。

处理方式：

- 明确 DB 是最终判断依据。
- 关键详情页可回源 DB。
- 列表页接受短暂延迟时，要有同步补偿。
- 写 DB 后必须检查对应 ES Writer / SyncService / Consumer / Schedule。

### 今日输出答案：查询链路示例

```text
Controller:
接收查询请求，校验分页和筛选参数。

ParamTransfer:
把 Param 转成 QO / DTO。

QueryService / App Service:
编排 DB、ES、Cache 查询，组装业务需要的数据。

Mapper / ES Reader / Cache:
Mapper 查强一致 DB，ES Reader 查搜索读模型，Cache 提升读取性能。

DTO:
承载服务内部组合后的查询结果。

VOTransfer:
转成前端/API 响应模型。

Response:
返回分页结果或详情数据。
```

一致性判断：

- DB 是主数据。
- ES 可能延迟。
- Cache 可能脏读。
- 用户是否可接受短暂旧数据，取决于业务场景：列表通常可短暂延迟，支付/退款/履约关键判断不能依赖旧读模型。

## Day 5：理解异步副作用和最终一致性

### 问题 1：MQ 为什么必须在 DB 事务提交后发送？

答案：

因为 MQ 消息会触发异步副作用。如果事务还没提交就发送 MQ，会出现：

- DB 回滚，但 MQ 已消费，导致 ES、通知、库存、履约等基于不存在的数据执行。
- Consumer 查询不到主数据。
- Consumer 看到旧状态，执行错误补偿。
- 重试后产生重复副作用。

正确原则：

```text
先完成 DB 事务
再发送 MQ
Consumer 再根据 DB 当前状态做幂等处理
```

### 问题 2：Consumer 为什么必须幂等？

答案：

因为 MQ 消息可能重复投递，Consumer 也可能因为超时、异常、重平衡等原因重复执行。

不幂等会导致：

- 重复释放库存。
- 重复发送通知。
- 重复同步 ES。
- 重复创建退款单。
- 重复触发财务支付事务。
- 重复改变订单状态。

常见幂等方式：

- 按业务唯一键去重。
- 状态前置条件判断。
- 数据库唯一索引。
- 处理记录表。
- 根据当前 DB 状态决定是否继续执行。

### 问题 3：消费失败时应该吞异常还是触发重试？

答案：

应该触发重试或进入补偿，不能吞异常后伪成功。

原因：

- 吞异常会让 MQ 认为消息已成功处理。
- ES、通知、缓存、财务、库存等副作用可能永久丢失。
- 后续排查时只能看到主流程成功，看不到异步链路失败。

正确做法：

```text
能恢复的失败：抛异常或返回重试
不可恢复的业务失败：记录明确失败原因，进入补偿或人工处理
重复消息：幂等判断后安全返回成功
```

### 问题 4：ES 同步失败后，系统靠什么补偿？

答案：

常见补偿方式：

- MQ 重试。
- ES SyncService 重建。
- Schedule 定时补偿。
- 人工触发重建。
- 基于 DB 主数据重新构建 Document。

关键点：

- 不能把 ES 当最终状态。
- 不能因为 ES 写失败就随意回滚已成功的核心交易状态。
- 需要确保 DB 到 Document 的字段映射和 Reader 查询字段一致。

### 问题 5：通知失败是否应该影响主流程成功？

答案：

通常不应该影响主流程成功，通知属于异步副作用。

例如：

- 订单支付成功后，短信/邮件失败，不应该把订单改回未支付。
- 售后退款成功后，通知失败，不应该把退款改失败。
- 履约状态已变更后，IM/邮件失败，应记录失败并重试或人工补发。

但通知失败必须可诊断：

- 有发送记录。
- 有失败原因。
- 有重试或补偿机制。
- 不记录敏感信息。

### 今日输出答案：异常场景表

| 场景 | 可能后果 | 当前应检查的保护 | 补偿方式 |
|------|----------|------------------|----------|
| MQ 发送失败 | ES、通知、缓存、履约等副作用未执行 | 是否事务后发送，是否有发送失败日志 | 重发 MQ、定时扫描 DB 补偿 |
| MQ 重复消费 | 重复通知、重复释放库存、重复创建记录 | Consumer 是否有业务幂等键和状态判断 | 幂等返回成功，必要时清理重复副作用 |
| Consumer 处理一半失败 | DB 部分更新，ES/通知/缓存部分失败 | 是否有事务边界，失败是否抛出 | MQ 重试、补偿任务、人工处理 |
| ES 写入失败 | 列表或搜索展示旧数据 | 是否有 Writer/SyncService/Schedule | 基于 DB 重建 ES Document |
| 通知发送失败 | 用户或商家未收到消息 | 是否有发送记录和失败原因 | 重试、补发、人工通知 |

## Day 6：做模块边界检查清单

### 问题 1：API 层是否直接访问 Mapper、ES、Redis、MQ？

答案：

不允许。

API 层应该只处理入口：

- 参数接收。
- 参数校验。
- Param/VO 转换。
- 调用 App Service / QueryService。
- 返回 Response。

如果 API 层直接访问 Mapper、ES、Redis、MQ，会导致入口层承载业务和基础设施细节，后续权限、事务、领域规则、副作用都容易失控。

### 问题 2：App 写操作是否绕过 Domain？

答案：

不应该绕过。

App 写操作应该：

```text
App Service 编排事务
-> 调用 Domain 完成状态判断和业务行为
-> 通过 Gateway 持久化
-> 事务后处理 MQ / ES / Cache / Notification
```

如果 App 直接改字段，状态机就会散落在 Service 和 SQL 中，订单、库存、售后、支付之间的规则会越来越难维护。

### 问题 3：Domain 是否依赖 App/API/Mapper/ES/Redis/HTTP Client？

答案：

不应该依赖。

Domain 只应该依赖：

- 领域模型。
- 领域服务。
- Gateway Interface。
- 业务值对象和枚举。

Domain 不应该依赖：

- Controller。
- App Service。
- Mapper / PO。
- ES Reader / Writer。
- Redis。
- HTTP Client。
- 供应商 SDK DTO。

原因：

```text
Domain 是业务规则核心，应该独立于技术实现。
技术细节变化时，不应该迫使核心业务状态机跟着改。
```

### 问题 4：Infrastructure 是否承载了核心状态机？

答案：

不应该承载。

Infrastructure 可以做：

- Gateway 实现。
- Mapper SQL。
- ES Reader/Writer。
- Cache。
- 外部供应商 Client。
- PO/Entity/Document 转换。

Infrastructure 不应该做：

- 决定订单状态迁移是否合法。
- 决定售后是否可退款。
- 决定库存释放业务规则。
- 决定支付成功后订单状态怎么流转。

如果发现核心状态判断写在 `DefaultGateway`、`Mapper SQL`、`Client` 里，应该警惕 DDD 边界被破坏。

### 问题 5：新增或修改状态后，是否检查 Consumer、ES Writer、通知、售后判断？

答案：

必须检查。

新增或修改订单、库存、支付、售后状态时，至少检查：

- 枚举定义和状态语义。
- Domain 状态迁移规则。
- App Service 编排。
- DB 字段和历史数据。
- MQ message、topic/tag、Producer、Consumer。
- Consumer 幂等和旧消息兼容。
- ES Writer / Reader / Document 字段。
- Cache 失效。
- 通知模板和发送条件。
- 售后、支付、履约、财务判断。
- 前端/API 展示。
- 回滚方案。

## Day 7：周复盘和 AI 协作训练

### 问题 1：我现在能否解释写链路和读链路的区别？

答案：

可以。

写链路：

```text
Controller
-> App Service
-> Domain
-> Gateway
-> Mapper
-> DB commit
-> MQ / ES / Cache / Notification side effects
```

写链路重点是状态变化、事务、幂等、补偿和副作用一致性。

读链路：

```text
Controller
-> QueryService
-> Mapper / ES Reader / Cache
-> DTO
-> VO
-> Response
```

读链路重点是查询效率、分页、读模型一致性、ES/Cache 延迟和响应模型转换。

### 问题 2：哪些业务状态只能由主域决策？

答案：

只能由主域决策的状态包括：

- 用户订单状态：由订单域决策。
- 商家订单状态：由订单域决策。
- 履约单状态：由订单/履约相关领域决策。
- 库存锁定/释放/上下架状态：由库存域决策。
- 售后单状态：由售后域决策。
- 退款单状态：由售后/退款领域决策，并与支付协作。
- 支付事务状态：由支付领域和支付供应商回调协作决策。
- 场次、票面、演出可售状态：由演出域决策。

其他域只能通过 Gateway、App Service 或 MQ 协作，不能直接改内部状态。

### 问题 3：哪些副作用必须走 MQ 或补偿？

答案：

典型异步副作用：

- ES 同步。
- 通知发送。
- 缓存失效或刷新。
- 库存释放补偿。
- 履约单创建、取消、自动发货。
- 支付状态主动查询。
- 退款通知处理。
- 商家订单结算。
- IM 消息。
- 财务或运营类异步处理。

判断标准：

```text
主交易状态已落 DB，但后续动作可以异步完成，就应考虑 MQ、重试和补偿。
如果副作用失败不应回滚主交易状态，就更需要异步可靠处理。
```

### 问题 4：如果让 AI 改一个订单需求，我必须提前写清哪些边界？

答案：

必须写清：

- 主业务域：例如 `order`。
- 具体入口：Controller、API path、App Service。
- 目标状态变化：从什么状态到什么状态。
- 范围内文件：Controller、Param、VO、Transfer、App、Domain、Gateway、Mapper、Consumer、ES、Cache。
- 范围外：不改数据库结构、不改支付语义、不改售后语义、不做无关重构等。
- 一致性要求：DB、MQ、ES、Cache、外部供应商分别如何处理。
- 幂等要求：重复请求、重复 MQ、重复回调。
- 兼容性要求：旧数据、旧消息、旧客户端。
- 验收标准：成功、失败、重复、并发、回滚。
- 验证命令：相关模块测试、编译或人工核对路径。

### 问题 5：如果 AI 给出跨层捷径，我如何识别并拒绝？

答案：

看到下面情况就要拒绝：

- Controller 直接调用 Mapper。
- Controller 直接发 MQ。
- App 写操作直接 update 表，不经过 Domain。
- Domain 依赖 Mapper、Redis、ES、HTTP Client。
- Mapper SQL 里承载订单状态机。
- 支付回调直接改订单表，不走订单领域能力。
- Consumer 没有幂等判断。
- 事务内发送 MQ。
- 改 DB 后不检查 ES、Cache、通知。
- 新增状态不检查旧数据、旧消息和前端展示。

拒绝方式：

```text
这个方案破坏了模块边界。请改为：
Controller 只做入口，
App Service 编排事务，
Domain 判断状态，
Gateway 落库，
事务提交后处理 MQ / ES / Cache / Notification。
```

## 本周最终输出答案

### 1. 业务域关系图

```text
Venue
  -> 提供场馆、选座图、区域、排、座位结构

Show
  -> 提供节目、巡演、场次、票面、票务平台、标签、分类
  -> 依赖 Venue 的场馆和座位结构

Inventory
  -> 基于 Show / Venue 形成可售库存
  -> 负责库存锁定、释放、上下架、自动调价

Order
  -> 基于 Inventory 创建用户订单、商家订单、履约单
  -> 协调支付、履约、售后、通知、ES、缓存

Payment
  -> 处理支付单、支付事务、支付回调、主动查询
  -> 支付结果影响 Order / Refund / Recharge 状态

CustomerService
  -> 处理售后单、退款单、退款/补偿、财务支付事务
  -> 与 Order / Payment 协作

Notification
  -> 处理短信、邮件、IM、批量通知、发送记录
  -> 通常作为异步副作用

ES / Cache
  -> 服务查询和展示
  -> 不作为强一致主数据
```

### 2. 模块边界检查清单

```markdown
- [ ] 已确认主业务域。
- [ ] Controller 未做核心状态决策。
- [ ] Controller 未直接访问 Mapper、ES、Redis、MQ、外部 Client。
- [ ] App 写操作未直接访问 Mapper。
- [ ] App 写操作未绕过 Domain。
- [ ] Domain 未依赖 App/API/Mapper/ES/Redis/HTTP Client。
- [ ] Infrastructure 未承载核心状态机。
- [ ] 写 DB 后已检查 MQ。
- [ ] 事务内未发送 MQ。
- [ ] Consumer 已检查幂等。
- [ ] 影响列表查询时已检查 ES Reader/Writer。
- [ ] 影响读模型时已检查 Cache 失效。
- [ ] 涉及外部供应商时已检查超时、重试、幂等、签名。
- [ ] 已检查旧数据、旧消息、旧客户端兼容。
- [ ] 已定义验证方式和回滚方案。
```

### 3. AI 协作任务描述模板

```text
请分析 [订单状态变更场景] 的影响面，不要直接改代码。

背景：
- 业务域：order
- 当前入口：
- 当前状态：
- 目标状态：
- 触发来源：HTTP / MQ / Schedule / 外部回调 / 人工操作

范围内：
- Controller / Param / VO / Transfer
- App Service / QueryService
- Domain Model / Factory / Gateway
- Infrastructure DefaultGateway / Mapper / ES / Cache
- MQ Producer / Message / Consumer
- 相关测试和验证命令

范围外：
- 不新增数据库字段
- 不改变支付状态语义
- 不改变售后状态语义
- 不做无关重构
- 不格式化无关文件

必须检查：
- 主业务域是否正确
- 状态迁移是否合法
- DB 事务边界
- 是否事务内发送 MQ
- MQ topic/tag/message/handler
- Consumer 幂等
- ES Reader/Writer/Document 字段
- Cache 失效
- 通知、售后、支付、履约影响
- 老数据和老消息兼容

验收：
- 成功路径：
- 失败路径：
- 重复请求：
- 并发场景：
- MQ 重复消费：
- ES 延迟：
- Cache 脏读：
- 回滚方案：
```

## 自测问题答案

### 1. 写操作为什么不能从 Controller 直接到 Mapper？

因为 Controller 到 Mapper 会绕过 App 的事务编排、Domain 的状态合法性、Gateway 的领域边界，以及 MQ/ES/Cache/通知等副作用检查。交易系统的写操作通常是一组状态和副作用变化，不是单表 update。

### 2. 为什么 Domain 不能依赖 HTTP Client 或 Redis？

因为 HTTP Client 和 Redis 是基础设施细节。Domain 应该表达稳定的业务规则，如果依赖这些技术实现，就会让核心业务状态机被外部协议、缓存实现、网络错误污染。正确做法是 Domain 依赖 Gateway Interface，由 Infrastructure 实现具体 HTTP、Redis、ES、Mapper 调用。

### 3. DB、ES、Cache 在交易系统里分别是什么角色？

- DB：强一致主数据源，是最终判断依据。
- ES：搜索和列表查询读模型，异步同步，可能延迟。
- Cache：读取加速层，可能短暂脏读，需要失效、TTL 或刷新策略。

### 4. MQ 重复消费时，Consumer 应该靠什么保证幂等？

Consumer 应该靠业务唯一键、状态前置条件、数据库唯一索引、处理记录表或当前 DB 状态判断保证幂等。重复消息如果已经处理过，应安全返回成功，不应重复释放库存、重复退款、重复通知或重复改状态。

### 5. 新增订单状态时，为什么必须检查售后、通知、ES 和 Consumer？

因为订单状态通常影响多个链路：

- 售后判断订单是否可退、可补偿、可取消。
- 通知判断是否要发短信、邮件、IM。
- ES 决定列表和搜索如何展示新状态。
- Consumer 可能监听订单状态变化并触发履约、结算、同步、通知。

只改订单枚举或主表字段，会导致异步链路和查询展示不一致。

### 6. AI 协作任务里，“范围外”和“回滚方案”为什么必须写清楚？

因为 AI 容易为了完成目标扩大改动范围。写清“范围外”可以防止无关重构、跨层捷径、随意改状态语义和公共契约。写清“回滚方案”可以保证改动出现问题时能快速恢复旧行为，尤其是订单、库存、支付、售后这种高风险链路。
