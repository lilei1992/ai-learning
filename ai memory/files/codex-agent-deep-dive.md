# Codex as an Agent：设计哲学与核心概念深度解析

> **文档版本**: v1.0  
> **信息来源**: OpenAI 官方博客 "Unrolling the Codex Agent Loop"（2026-01-23）+ 源码 github.com/openai/codex  
> **主要语言**: Rust（94.9% 代码库），Apache-2.0 开源协议  
> **更新时间**: 2026-06  

---

## 目录

1. [什么是 Agent（智能体）](#1-什么是-agent智能体)
2. [设计哲学](#2-设计哲学)
3. [核心概念词典](#3-核心概念词典)
4. [Agent Loop（智能体循环）深度解析](#4-agent-loop智能体循环深度解析)
5. [Prompt 构造体系](#5-prompt-构造体系)
6. [性能工程：Prompt Caching（提示词缓存）](#6-性能工程prompt-caching提示词缓存)
7. [Context Window Management（上下文窗口管理）](#7-context-window-management上下文窗口管理)
8. [安全与权限模型](#8-安全与权限模型)
9. [多产品共享的 Harness 架构](#9-多产品共享的-harness-架构)
10. [Java 开发者视角的类比](#10-java-开发者视角的类比)
11. [文档生成建议](#11-文档生成建议)

---

## 1. 什么是 Agent（智能体）

> **Agent（智能体，也可称智能代理）**：一种能够感知环境、自主决策、循环执行工具调用，直到完成目标的系统。区别于普通 LLM（Large Language Model，大语言模型）应用的关键是：Agent 有"行动能力"，不只生成文字，还能修改文件、运行命令、调用 API（Application Programming Interface，应用程序接口）。

Codex 是 OpenAI 在 2025 年 4 月发布的 **AI（Artificial Intelligence，人工智能）编码智能体（AI Coding Agent）**，定位是"运行在本地机器上的软件工程师"：

```
普通 LLM 应用：用户 → 模型 → 文字输出
                                  ↓
Codex Agent：用户 → 模型 → 工具调用 → 修改文件/运行命令 → 再次推理 → ...→ 最终输出
```

截至 2026 年 3 月，Codex 已有 **200 万周活跃用户**，GitHub 仓库超 75,600 Star。

---

## 2. 设计哲学

### 2.1 Human-in-the-Loop First（人工把关优先）

Codex 的第一原则是**安全高于效率**。所有文件修改默认需要用户确认（approval mode），而非静默执行。这一设计源于 OpenAI 的核心判断：

> 软件代理的输出不只是文字，而是直接作用于真实系统的代码变更，必须让人类保持控制权。

这里的 `Human-in-the-Loop` 不建议机械直译。在 Codex 语境里，它更准确的意思是：Agent 可以循环执行，但关键动作默认要有人确认、监督或接管。

三种审批模式（approval mode）从保守到激进：
- `suggest`：每个操作都询问（默认）
- `auto-edit`：文件修改自动，Shell 命令询问
- `full-auto`：全自动（沙箱环境中使用）

### 2.2 Stateless by Design（无状态设计）

Codex 刻意**不使用** Responses API 的 `previous_response_id` 参数，每次请求都携带完整对话历史，而非依赖服务端状态。

原因是支持 **ZDR（Zero Data Retention / 零数据留存）**：企业客户可选择不在 OpenAI 服务器上存储任何数据，无状态请求是实现这一合规要求的前提。

这是效率（无需重传历史）和合规（不依赖服务端状态）之间有意选择的权衡。

### 2.3 Prompt as the Source of Truth（提示词即事实来源）

Codex 将所有状态（对话历史、工具定义、上下文指令）编码进每次 HTTP 请求的 Prompt 中，而非维护服务端 Session。这使得：

- 每次推理完全可重放
- 可插入任意兼容 Responses API 的模型提供商
- 便于调试（请求 JSON 本身就是完整快照）

### 2.4 Cache-First Performance（缓存优先的性能观）

Codex 的性能优化不依赖减少请求数，而是**让每次请求尽可能命中服务端缓存**。核心手段是保证 Prompt 的"静态前缀不变性"——这是贯穿整个工程实现的设计约束。

### 2.5 Open Source as Product（开源即产品）

Codex CLI（Command-Line Interface，命令行界面/工具）是 Apache-2.0 开源项目。OpenAI 将 GitHub Issues 和 PR（Pull Request，拉取请求/合并请求）作为设计决策的文档载体，源码即文档，历史 commit 即 ADR（Architecture Decision Record，架构决策记录）。

---

## 3. 核心概念词典

按照学习优先级排序，每个概念给出英文原词、中文译名、定义和来源。

### 3.0 缩写速查

| 缩写 | 英文全称 | 中文含义 | 在本文中的意思 |
|------|----------|----------|----------------|
| ADR | Architecture Decision Record | 架构决策记录 | 记录关键设计选择、背景、取舍和后果 |
| AI | Artificial Intelligence | 人工智能 | Codex 所属的技术大类 |
| API | Application Programming Interface | 应用程序接口 | 模型服务、工具和系统之间的调用接口 |
| CLI | Command-Line Interface | 命令行界面/命令行工具 | Codex 在终端中的产品形态 |
| GC | Garbage Collection | 垃圾回收 | Java 类比中用于说明上下文压缩 |
| HTTP | Hypertext Transfer Protocol | 超文本传输协议 | Responses API 的网络调用协议 |
| IDE | Integrated Development Environment | 集成开发环境 | VS Code 这类开发工具 |
| JSON | JavaScript Object Notation | JSON 数据格式 | API 请求、响应和事件载荷格式 |
| JWT | JSON Web Token | JSON Web Token / 自包含令牌 | Java 类比中用于说明无状态请求 |
| KV-Cache | Key-Value Cache | 键值缓存 | Transformer Attention 的中间结果缓存 |
| LLM | Large Language Model | 大语言模型 | Codex 背后的模型能力基础 |
| MCP | Model Context Protocol | 模型上下文协议 | 外部工具接入 Agent 的标准协议 |
| OSS | Open Source Software | 开源软件 | `--oss` 模式指向本地或开源模型后端 |
| PR | Pull Request | 拉取请求/合并请求 | GitHub 上提交、评审和讨论代码变更的单元 |
| SDK | Software Development Kit | 软件开发工具包 | 围绕 API 封装的一组开发库和工具 |
| SPI | Service Provider Interface | 服务提供者接口 | Java 类比中用于说明可插拔扩展 |
| SSE | Server-Sent Events | 服务器发送事件 | 服务端向 CLI 持续推送流式响应 |
| UI | User Interface | 用户界面 | 产品界面层 |
| UX | User Experience | 用户体验 | 用户使用产品时的整体体验 |
| ZDR | Zero Data Retention | 零数据留存 | 企业合规选项，不持久化请求数据 |

### 3.1 基础概念层

---

**Token（词元）**  
推理的原子单位。文本在进入模型前被拆分为 Token（整数 ID，索引模型词汇表）。模型输入和输出都以 Token 计量。1 个汉字 ≈ 1–2 Token，1 个英文单词 ≈ 1–1.5 Token。

---

**Inference（推理）**  
将 Prompt Token 序列送入模型，模型采样生成输出 Token 序列的过程。成本高昂，是整个 Agent 系统中耗时最长的步骤。Codex 的所有性能优化都以减少推理成本为核心目标。

---

**Context Window（上下文窗口）**  
单次推理调用可处理的最大 Token 数，包含输入+输出。超出即报错，Agent 需主动管理不超限。一次 Turn 中可能有数百次工具调用，若不压缩历史，很快耗尽。

---

**Prompt（提示词）**  
发送给模型的完整输入文本，包含系统指令、对话历史、工具调用结果等所有上下文。Codex 每次推理都重新构造完整 Prompt（无状态设计的体现）。

---

**Completion（补全文本 / 生成结果）**  
模型根据 Prompt 生成的输出文本。早期 LLM 时代的核心概念，Codex 使用更新的 Responses API，但底层仍是 completion 机制。

---

### 3.2 Agent 核心层

---

**Agent Loop（智能体循环）**  
Agent 的核心控制流：接收输入 → 推理 → 工具调用 → 追加结果 → 再次推理，循环至模型发出 Assistant Message 终止。这里的 `Loop` 指执行闭环，译作"智能体循环"更贴近语境。Codex 将此逻辑称为 **Harness（运行框架）**，是所有 Codex 产品的共享核心。

```
Agent Loop 伪代码（Rust 实现）：

loop {
    response = model.infer(prompt)
    if response.is_assistant_message() {
        return response  // Turn 结束
    }
    tool_result = execute(response.tool_call)
    prompt.append(tool_call + tool_result)
}
```

---

**Turn（轮次）**  
从用户发送消息到 Agent 返回 Assistant Message 的完整过程。一个 Turn 内可以有多次 model inference + tool call 迭代。Codex 内部称之为 **Thread（对话线程）**，不是操作系统线程。

---

**Tool Call（工具调用）**  
模型在推理过程中请求 Agent 执行的外部操作（如 `run ls`、`write file`、`search web`）。结果被追加到 Prompt 中供下次推理参考。工具调用是 Agent 区别于普通 Chatbot 的本质能力。

---

**Assistant Message（助手消息）**  
一次 Turn 的终止信号。当模型停止请求工具调用、直接向用户输出文字时，即为 Assistant Message，标志 Agent 将控制权交还用户。

---

**Harness（运行框架 / 驱动框架）**  
Codex 对 Agent Loop 实现的内部命名。`harness` 原意可以是"线束"或"安全带"，但在这里更接近"把模型推理、工具调用、状态管理连接起来的运行框架"。Codex CLI、Codex Cloud、VS Code 扩展共享同一 Harness。

---

**Rollout（执行轨迹 / 会话记录）**  
一次完整的 Agent 会话记录，包含所有 Turn 的历史。这里的重点不是批量任务，而是一次 Agent 运行过程的完整轨迹。Memories 系统以 Rollout 为粒度进行存储和 Consolidation（归并整理）。默认每个 Rollout 保留 30 天。

---

### 3.3 性能与工程层

---

**Prompt Caching（提示词缓存）**  
服务端将前缀相同的 Prompt 的 KV-Cache（键值缓存）复用，命中缓存的 Token 几乎不需要重新计算。Codex 的核心性能优化策略。缓存命中要求 Prompt 是上次请求的精确前缀。

---

**Cache Miss（缓存未命中）**  
Prompt 前缀发生变化，服务端无法复用已有计算，需要全量重新推理。典型触发场景：切换模型、中途修改工具列表、改变工作目录。

---

**KV-Cache（键值缓存）**  
Transformer 架构中 Attention 机制的中间计算结果缓存。每层每个 Token 产生 Key 和 Value 向量，缓存后对相同前缀可直接复用，避免 O(n²) 的重复计算。

---

**SSE（Server-Sent Events / 服务器发送事件）**  
Responses API 的响应方式。服务端以流式方式逐步返回 JSON 事件，使 CLI 可以实时显示模型输出（流式输出），无需等待完整响应。

---

**ZDR（Zero Data Retention / 零数据留存）**  
企业合规选项：OpenAI 不在服务器持久化任何请求数据。Codex 的无状态设计直接服务于此合规需求。

---

**Context Compaction（上下文压缩）**  
当对话历史接近 Context Window 上限时，Agent 自动将早期历史摘要压缩为更短的表示，为新轮次腾出空间，同时尽量保留关键信息。

---

### 3.4 配置与记忆层

---

**AGENTS.md**  
项目级静态指令文件，在 Agent 启动时注入 Prompt 的 developer 角色。人工维护，可提交 Git 团队共享。详见《Codex 记忆机制》文档。

---

**Memories（记忆）**  
Codex 的自动化动态记忆层。会话结束后后台从 Rollout 中提炼知识，写入 `~/.codex/memories/`，下次会话自动加载。区别于 AGENTS.md 的人工静态性。

---

**Consolidation（归并整理）**  
Memories 系统的后台任务：两个模型协作，从多个 Rollout 中提取、去重、合并记忆条目。默认在会话空闲 6 小时后触发。

---

**Sandbox（沙箱）**  
Codex 的安全执行环境，限制 Shell 工具的文件系统访问范围。沙箱只约束 Codex 原生提供的 Shell 工具，MCP 服务器提供的工具需自行管理权限。

---

**MCP（Model Context Protocol / 模型上下文协议）**  
标准化的工具扩展协议，允许外部服务向 Agent 暴露工具。Codex 启动时枚举所有 MCP 工具并注入 Prompt。MCP 工具列表的中途变更会导致 Cache Miss，是已知工程难题。

---

**Responses API**  
OpenAI 提供的新一代推理 API（替代旧 Completions API），原生支持工具调用、流式输出、多轮对话状态管理。Codex 完全基于此 API 构建，且支持任何实现了 Responses API 规范（openresponses.org）的第三方端点。

---

**Role（角色）**  
Prompt 中每条消息的权重标识，决定指令优先级。从高到低：`system`（服务端控制）> `developer`（客户端配置）> `user`（用户输入）> `assistant`（模型输出）。

---

## 4. Agent Loop（智能体循环）深度解析

### 4.1 单轮流程

```
用户输入
    │
    ▼
构造 Prompt（指令 + 工具定义 + 对话历史 + 用户消息）
    │
    ▼
POST /v1/responses  ←──────────────────────────────┐
    │                                               │
    ▼ SSE 流式响应                                  │
解析响应类型                                        │
    │                                               │
    ├─── Tool Call 请求 ──► 执行工具 ──► 追加结果 ───┘
    │                                  （Prompt 增长）
    │
    └─── Assistant Message ──► 展示给用户，Turn 结束
```

### 4.2 多轮对话的 Prompt 增长问题

```
Turn 1: [System][Tools][Instructions][User: "create auth module"]
Turn 2: [System][Tools][Instructions][User: "create auth module"]
              [Assistant: ...][ToolCall: ls][ToolResult: ...]
              [Assistant: ...][ToolCall: write][ToolResult: ...]
              [Assistant: "Done"][User: "add tests"]
Turn 3: [完整 Turn 1 + Turn 2 历史] + [User: "add tests"]
```

每个新 Turn 都包含全量历史，Prompt 线性增长。这正是 Prompt Caching 的价值所在：增长的尾部是新内容，不变的头部可命中缓存。

### 4.3 API 端点路由

```rust
// 源码：codex-rs/core/src/model_provider_info.rs

match auth_method {
    ChatGPTLogin =>  "https://chatgpt.com/backend-api/codex/responses"
    APIKey       =>  "https://api.openai.com/v1/responses"
    OSS (--oss)  =>  "http://localhost:11434/v1/responses"  // ollama / LM Studio
    AzureAPIKey  =>  "<azure-endpoint>/openai/v1/responses"
}
```

同一套 Harness 代码，通过配置切换推理后端。

---

## 5. Prompt 构造体系

### 5.1 构造顺序（服务端决定最终顺序）

服务端按以下顺序组装最终 Prompt：

```
① system（服务端控制，客户端不可修改）
② tools（工具定义列表）
③ instructions（客户端 developer 角色指令）
④ input（对话历史 + 当前用户消息）
```

### 5.2 Instructions 的多源聚合

`instructions` 字段聚合自多个来源，按优先级从低到高：

```
config.toml developer_instructions（全局用户偏好）
    +
~/.codex/AGENTS.override.md / AGENTS.md（全局项目指令）
    +
<git-root> → <cwd> 路径上每层的 AGENTS.override.md / AGENTS.md
    +
配置的 skills 内容
    ↓
合并（上限 32 KiB）→ 作为 developer 角色消息注入
```

### 5.3 Cache-Friendly Prompt 设计原则

```
✅ 静态内容（工具定义、系统指令）放 Prompt 头部
✅ 动态内容（用户消息、工具结果）追加在尾部
✅ 工具列表顺序保持一致（MCP 工具乱序是早期 Cache Miss bug 的根因）
✅ 中途配置变更用追加新消息代替修改旧消息

❌ 不要在对话中途修改工具列表
❌ 不要修改早期历史消息（破坏前缀）
❌ 不要在 instructions 中插入动态时间戳（常见错误）
```

---

## 6. 性能工程：Prompt Caching（提示词缓存）

### 6.1 为什么缓存如此关键

没有缓存时，对话的计算成本是 **O(n²)**（每次推理重新计算所有历史 Token）。有缓存时，只需计算新增部分，降至 **O(n)**。

```
Turn  1：计算 100 Token
Turn  2：命中缓存 100 Token，计算新增 50 Token
Turn  3：命中缓存 150 Token，计算新增 60 Token
Turn 10：命中缓存 800 Token，计算新增 40 Token  ← 线性而非二次
```

### 6.2 导致 Cache Miss 的操作（源码已确认）

| 操作 | 原因 |
|------|------|
| 切换目标模型 | 模型相关的 instructions 变化 |
| 改变 sandbox 配置 | permissions 消息变化 |
| 改变 approval mode | permissions 消息变化 |
| 改变工作目录（cwd） | environment 消息变化 |
| MCP 工具动态变更 | 工具列表变化 |
| 图片/文件内容变化 | 内容 hash 不同 |

### 6.3 Codex 的应对策略

当以上配置发生变化时，Codex **不修改早期消息**，而是**追加新消息**，保留前缀的最大长度：

```
变化前：[Instructions-v1][Turn1][Turn2]
变化后：[Instructions-v1][Turn1][Turn2][NEW: updated-sandbox-config-v2]
               ↑ 这段被缓存，不变
```

---

## 7. Context Window Management（上下文窗口管理）

### 7.1 问题规模

单次 Turn 可能包含数百次工具调用，每次追加一个 tool call + tool result。如果每个工具结果是 1000 Token，100 次调用就是 100,000 Token，超过大多数模型的 Context Window。

### 7.2 Context Compaction（上下文压缩）策略

```
检测：当前 Prompt 超过 Context Window 的阈值（如 80%）
    │
    ▼
触发 Compaction：
  用另一次推理（消耗 token）对早期历史进行摘要压缩
    │
    ▼
替换：将早期详细历史替换为摘要
保留：最近的对话和关键上下文
    │
    ▼
继续 Agent Loop
```

这是一个以计算换空间的策略：用一次额外的推理，换取更长的对话生命周期。

### 7.3 encrypted_content 与 ZDR 的兼容

ZDR 客户选择不存储数据，但 Agent 的推理消息（reasoning tokens）在多轮中需要延续。Codex 的解法：

- 推理消息以 `encrypted_content` 字段传输
- 用客户自持的解密密钥在服务端解密，而非明文存储
- OpenAI 只持久化解密密钥（与客户数据分离），不持久化推理内容本身

---

## 8. 安全与权限模型

### 8.1 工具的两类权限边界

```
Codex 原生 Shell 工具
    └─ 受 Codex Sandbox 保护
    └─ 文件系统访问受限
    └─ approval mode 控制执行

MCP 服务器工具
    └─ Codex 不对其进行沙箱化
    └─ 必须自行实现 guardrails
    └─ 这是已知安全边界，源码注释明确说明
```

这一设计是有意为之：Codex 对自己的工具负责，第三方工具自己管好权限。

### 8.2 Approval Mode（审批模式）详解

```toml
# config.toml
approval_mode = "suggest"   # suggest | auto-edit | full-auto
```

| 模式 | 文件修改 | Shell 命令 |
|------|---------|-----------|
| `suggest` | 询问 | 询问 |
| `auto-edit` | 自动 | 询问 |
| `full-auto` | 自动 | 自动 |

切换 approval mode 会触发新的 developer 消息追加（而非修改旧配置），以保持 Prompt 前缀稳定。

---

## 9. 多产品共享的 Harness 架构

Codex 同一套 Harness 驱动三个产品：

```
┌─────────────────────────────────────────────────┐
│              Codex Harness（核心）               │
│  Agent Loop + Prompt 构造 + 工具管理 + 缓存优化  │
└─────────┬──────────────┬──────────────┬──────────┘
          │              │              │
    ┌─────▼────┐   ┌─────▼────┐   ┌────▼─────┐
    │ Codex CLI│   │ Codex    │   │ Codex    │
    │ 终端界面 │   │ Cloud    │   │ VS Code  │
    │ (本地)   │   │ (云端)   │   │ (IDE)    │
    └──────────┘   └──────────┘   └──────────┘
```

这是"一份业务逻辑，多个界面接入"的经典架构，类似后端的 Service Layer 被多个 Controller 复用。

---

## 10. Java 开发者视角的类比

| Codex 概念 | Java/Spring 类比 | 说明 |
|-----------|-----------------|------|
| Agent Loop | `while(!done) { ... }` 的状态机 | 带条件终止的事件循环 |
| Tool Call | `@FeignClient` 的远程调用 | 声明式外部接口调用 |
| Prompt | `HttpServletRequest` + 全量请求体 | 每次请求携带所有上下文 |
| Responses API SSE | Spring WebFlux `Flux<T>` 流 | 响应式流式数据返回 |
| Harness | Spring `DispatcherServlet` | 核心请求分发和生命周期管理 |
| Context Window | JVM Heap 上限 | 有限资源，需主动管理 |
| Prompt Caching | Spring Cache `@Cacheable` | 相同输入复用计算结果 |
| Context Compaction | JVM GC（老年代压缩） | 空间不足时的主动整理 |
| ZDR Stateless | Stateless JWT（不依赖 Session） | 每次请求自包含，不依赖服务端状态 |
| MCP Tools | SPI（Service Provider Interface） | 可插拔的第三方工具扩展机制 |
| Approval Mode | `@PreAuthorize` 安全注解 | 操作执行前的权限检查和用户确认 |
| AGENTS.md | `application.yml` 配置文件 | 注入到运行时的外部配置 |
| Rollout | Request Log / Audit Trail | 完整的会话操作记录 |

---

## 11. 文档生成建议

以下是对这份文档的几点改进建议，也适用于团队知识文档的一般性原则：

### 11.1 结构优化建议

**当前文档适合"精读"，可以补充"快速查阅"入口：**

```markdown
<!-- 在文档顶部加一个 TL;DR（太长不看版）-->

## TL;DR（30 秒速览）
- Codex = Agent Loop（推理→工具→循环）+ Harness（共享核心）
- 性能关键：Prompt Caching，保持静态前缀不变
- 合规关键：Stateless Design，支持 ZDR
- 记忆机制：AGENTS.md（静态人工）+ Memories（动态自动）
- 安全边界：Codex 沙箱只管原生工具，MCP 工具自管
```

### 11.2 深度扩展方向

这份文档覆盖了概念层和设计层。可以继续拆分出以下专题文档：

```
codex-agent-loop-source-walkthrough.md   ← 源码逐层走读（Rust）
codex-performance-tuning.md              ← Prompt Caching 实战优化手册
codex-mcp-integration.md                 ← MCP 工具开发接入指南
codex-vs-claude-code-comparison.md       ← 已有（memory-comparison.md）
codex-team-workflow.md                   ← 团队工作流设计
```

### 11.3 维护建议

```markdown
<!-- 在文档头部 frontmatter 加入版本跟踪 -->
---
source_commit: openai/codex @ main (2026-06)
review_needed: true  ← Codex 更新频率极高（日均多个 release）
next_review: 2026-09
---
```

**高频变化点**（需要重点跟踪更新）：
- MCP 工具动态变更的 Cache Miss 处理方案（仍在演进）
- Context Compaction 策略（官方尚未完整公开）
- Memories Consolidation 的触发条件（配置参数可能变化）

### 11.4 可视化补充建议

以下内容做成交互式图表效果会显著提升：

- Agent Loop 流程图（已可用 `codex-agent-deep-dive` 配套 SVG）
- Prompt 增长与 Cache 命中率关系图（折线图）
- 不同 approval mode 的工具执行决策树

### 11.5 面向不同角色的阅读路径

**推荐在 README 中加入角色导读：**

```markdown
## 阅读路径推荐

- **想快速上手 Codex**  → §2 设计哲学 → §8 安全与权限
- **排查 Cache Miss 问题**  → §6 性能工程 → §5.3
- **开发 MCP 工具**  → §3.3（MCP）→ §8.1 安全边界
- **理解 Agent 通用原理**  → §1 → §4 Agent Loop → §10 Java 类比
- **团队知识体系建设**  → §3 概念词典 → §11 文档建议
```

---

## 参考资料

| 资料 | 类型 | 说明 |
|------|------|------|
| [Unrolling the Codex Agent Loop](https://openai.com/index/unrolling-the-codex-agent-loop/) | 官方博客 | Agent Loop 权威解析，2026-01-23 |
| [github.com/openai/codex](https://github.com/openai/codex) | 源码 | Apache-2.0，Rust 实现，Issues/PR 含大量设计决策 |
| [Codex 官方文档](https://developers.openai.com/codex) | 文档 | CLI、配置、AGENTS.md 规范 |
| [openresponses.org](https://www.openresponses.org) | 规范 | Responses API 开放规范 |
| [agents.md](https://agents.md) | 规范 | AGENTS.md 跨工具开放规范 |
