# Codex 架构设计分享素材整理

## 对齐假设

- 本稿主题按用户最新目标理解为：**Codex 架构设计 / 源码设计 / 架构哲学 / 使用最佳实践**。
- 用户粘贴模板中仍出现“Claude Code 架构设计”，这里不沿用该主题字样，只复用演示风格与页面能力要求。
- 重点解释 OpenAI Codex 的公开产品形态，以及 `openai/codex` 仓库中本地 Codex CLI / `codex-rs` 的源码结构。

## 公开资料来源

- OpenAI Codex 介绍：<https://openai.com/index/introducing-codex/>
- Codex with GPT-5：<https://openai.com/index/codex-now-with-gpt-5/>
- OpenAI Codex GitHub 仓库：<https://github.com/openai/codex>
- Codex App Server README：<https://github.com/openai/codex/blob/main/codex-rs/app-server/README.md>
- 关键源码：
  - `codex-rs/core/src/session/turn.rs`
  - `codex-rs/core/src/codex_thread.rs`
  - `codex-rs/core/src/thread_manager.rs`
  - `codex-rs/core/src/tools/router.rs`
  - `codex-rs/core/src/tools/orchestrator.rs`
  - `codex-rs/core/src/exec.rs`
  - `codex-rs/core/src/agents_md.rs`
  - `codex-rs/app-server/src/message_processor.rs`

## 一句话定位

Codex 不是“更聪明的代码补全”，而是一个可运行在真实工程环境里的 coding agent runtime：它把自然语言需求转成可审计的工程动作，在 thread / turn / tool / sandbox / approval / transcript 这些边界内完成代码理解、修改、执行和验证。

## 产品形态

- Cloud agent：适合长任务、并行任务、异步交付、自动生成 PR。
- Local CLI：适合在本机仓库内即时协作，能读取项目规则、执行命令、修改文件、跑测试。
- App Server：把本地 agent 能力暴露成 JSON-RPC 协议，供 IDE、TUI 或其他客户端管理 thread 和 turn。
- Review / PR 场景：把 agent 的执行过程、测试输出、终端日志变成可以复核的工程证据。

## 源码模块地图

- `tui`：终端交互界面，承载用户输入、事件展示、审批交互。
- `app-server`：后台服务进程，通过 JSON-RPC 管理 thread / turn / event。
- `core`：核心 agent runtime，负责 session、turn loop、context、tool、approval、sandbox。
- `protocol` / `core-api`：客户端与核心之间的协议、事件、操作定义。
- `tools`：模型可见工具、工具注册表、工具路由和调用结果处理。
- `exec` / `sandboxing` / `execpolicy`：命令执行、沙箱、文件/网络权限策略。
- `thread-store` / `state` / `rollout`：会话历史、线程持久化、回滚与恢复。
- `codex-mcp` / `mcp-server`：MCP server 接入与工具调用。
- `config` / `skills` / `core-plugins`：配置、技能、插件与扩展机制。

## 源码关键观察

### Thread / Turn

- `CodexThread` 是 thread 的双向消息通道，thread 是可持久化的任务会话。
- 每次用户输入会形成一个 turn；turn 是一次从“用户需求”到“模型采样、工具调用、结果回传、必要时继续采样”的执行周期。
- `ThreadManager` 负责 thread 的启动、恢复、fork、关闭、模型管理和配置绑定。

### Agent Loop

- `run_turn` 的核心结构是循环：构建上下文 -> 调用模型 -> 解析输出 -> 执行工具 -> 将工具结果写回历史 -> 再次采样，直到没有需要继续执行的工具调用。
- turn 开始前可能会做 compact，避免上下文超限。
- turn 内会处理 pending input、hooks、token usage、模型错误重试、自动 compact、stop hook 和最终事件。

### Context Engineering

- `agents_md.rs` 负责发现和组装 `AGENTS.md` / `AGENTS.override.md` 等项目指令。
- Codex 会从 project root 到 cwd 逐级收集项目规则，并与配置指令合并。
- 上下文不仅是聊天历史，还包括：仓库规则、当前目录、工具说明、技能/插件、系统配置、历史摘要、任务状态、用户权限。

### Tool Calling

- `ToolRouter` 负责把模型输出转换为工具调用，并维护对模型可见的 tool specs。
- `ToolOrchestrator` 是工具执行的安全中枢，统一处理审批、沙箱选择、执行、失败重试、权限升级策略。
- 工具调用不是“模型想执行就执行”，而是经过路由、策略、审批、运行时封装之后再落到本机系统。

### Sandbox / Approval

- `exec.rs` 将抽象的命令执行请求转换成具体 `argv`、`cwd`、环境变量、超时、输出捕获和沙箱策略。
- 文件系统权限、网络权限、平台沙箱、审批策略共同决定命令是否可执行。
- 高风险动作会进入用户审批或策略拒绝，而不是直接交给模型。

### App Server

- App Server 作为独立后台进程运行。
- 客户端通过 JSON-RPC 与其通信。
- README 中明确使用 thread / turn 术语：thread 是 `.codex` 中持久化的会话对象，turn 是一次用户 prompt 对应的执行单元。
- 设计目标是让 IDE、TUI、其他客户端共享同一套 agent runtime，而不是每个界面各自实现 agent。

### Memory / State

- thread 历史、rollout、transcript、token usage、memory mode、checkpoint 共同构成长期任务的可恢复状态。
- compact 不是简单丢历史，而是把长上下文压缩成摘要，并在下一轮继续注入必要上下文。
- 源码中也提供 rollback、flush、shutdown、thread memory mode 更新等机制。

## 架构哲学

1. Local-first：真实工程上下文在本地，agent 必须贴近仓库、命令、文件和测试。
2. Protocol-first：用 JSON-RPC / protocol / event 把 UI 和 runtime 解耦。
3. Auditable by default：终端命令、工具调用、文件变更、测试结果都应能回放和复核。
4. Safety as runtime：权限不是提示词里的建议，而是 approval、sandbox、exec policy、network policy 的组合。
5. Context is product：AGENTS.md、skills、plugins、history、compact、cwd 共同决定 agent 的质量上限。
6. Small loops win：短反馈闭环、明确验证命令、可回滚的变更，比一次性大任务更可靠。

## 演讲主线

1. Codex 是什么：从代码助手到工程 agent runtime。
2. 代码结构怎么看：从 UI 到 app-server，再到 core runtime。
3. Agent Loop 为什么是核心：模型只是大脑，loop 才是工作流。
4. Context Engineering 决定质量：项目规则、任务状态、历史摘要、工具说明。
5. Tool Calling 如何变成真实动作：router、orchestrator、exec、sandbox。
6. MCP 扩展边界：把外部系统变成可治理的工具。
7. Memory System：让长任务可继续、可恢复、可追踪。
8. 实时 Demo：模拟一次从需求到工具执行再到验证的完整路径。
9. 最佳实践：企业/团队怎么安全接入。
10. 未来趋势：agent 不是插件，而会成为工程操作系统的一层。

## 使用最佳实践

- 为每个仓库维护清晰的 `AGENTS.md`：构建命令、测试命令、架构边界、禁改区域、代码风格、审批要求。
- 任务要小而明确：一次只让 agent 处理一个可验证目标。
- 每个任务指定验收标准：跑哪些测试、看哪些页面、检查哪些日志。
- 高风险操作显式分级：只读、写文件、执行命令、生产访问、外部 API、批量变更。
- 把工具做成最小权限：读写分离、资源范围限制、参数校验、敏感字段脱敏。
- 使用 checkpoint / transcript：长任务要能中断、恢复、复盘。
- 让 agent 先解释计划，再执行变更；关键业务变更必须有人审批。
- 团队层面沉淀 prompt 模板、demo 脚本、问题清单、失败复盘。
- 不把 Codex 当“自动程序员”，而是当“带权限边界的工程执行系统”。

## Keynote 页面设计方向

- 黑色舞台背景，低亮网格、细线、玻璃质感面板。
- 首屏强调 Codex 作为工程 runtime，不使用传统 PPT 大段文字。
- 架构页用分层系统图，展示 Surface -> Protocol -> Runtime -> Tool/Sandbox -> Store。
- Agent Loop 用环形步骤和流动光线表达。
- Context Engineering 用“上下文栈”视觉表达。
- Tool Calling 用数据流动画表达从 model output 到 sandboxed execution。
- Demo 页提供按钮式实时演示，模拟 turn 的事件流。
- Speaker notes 放更完整讲稿，页面只放关键词。
