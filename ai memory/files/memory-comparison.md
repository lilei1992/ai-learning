# Claude Code vs Codex 记忆机制对比

> **文档版本**: v1.0  
> **对比版本**: Claude Code (current) vs Codex CLI/App (2026)  
> **更新时间**: 2026-06  

---

## 目录

1. [一句话总结](#1-一句话总结)
2. [架构对比](#2-架构对比)
3. [文件体系对比](#3-文件体系对比)
4. [加载机制对比](#4-加载机制对比)
5. [自动记忆能力对比](#5-自动记忆能力对比)
6. [团队协作对比](#6-团队协作对比)
7. [工程化能力对比](#7-工程化能力对比)
8. [选型建议](#8-选型建议)
9. [全景速查表](#9-全景速查表)

---

## 1. 一句话总结

| 工具 | 记忆哲学 |
|------|---------|
| **Claude Code** | 「人工 + 分层」—— 靠开发者精心维护 CLAUDE.md，无自动学习 |
| **Codex** | 「人工 + 自动」—— AGENTS.md 提供基线，Memories 自动从会话中提炼知识 |

---

## 2. 架构对比

### Claude Code：单层文件记忆

```
开发者 ──写──► CLAUDE.md（各层级）
                    │
                    ▼ 启动时读取
              Claude Code Agent
                    │
                    ▼
              执行任务（会话结束后不产生新记忆）
```

### Codex：双层混合记忆

```
开发者 ──写──► AGENTS.md（各层级）
                    │                        ┌─────────────────────┐
                    ▼ 启动时读取              │  ~/.codex/memories/ │
              Codex Agent ◄──────────────────┤  (自动生成层)        │
                    │                        └─────────────────────┘
                    ▼                                    ▲
              执行任务                                    │
                    │               会话结束后 6h 后台总结 │
                    └────────────────────────────────────┘
```

**核心差异**：Codex 有从会话中自动学习并持久化的闭环，Claude Code 没有。

---

## 3. 文件体系对比

### 3.1 文件命名

| 维度 | Claude Code | Codex |
|------|------------|-------|
| 核心文件名 | `CLAUDE.md` | `AGENTS.md` |
| 本地私有文件 | `CLAUDE.local.md` | 无官方支持（可自定义） |
| Override 文件 | ❌ 无 | `AGENTS.override.md` ✅ |
| 跨工具规范 | 非开放标准 | Linux Foundation 开放规范 |

### 3.2 层级结构

**Claude Code** 层级（4层）：

```
~/.claude/CLAUDE.md                   # 全局
<project-root>/CLAUDE.md              # 项目
<subdir>/CLAUDE.md                    # 子目录（向上递归）
CLAUDE.local.md                       # 本地私有（不提交 Git）
```

**Codex** 层级（含 Override，实际 6+ 层）：

```
~/.codex/AGENTS.override.md           # 全局强制覆盖
~/.codex/AGENTS.md                    # 全局
<repo-root>/AGENTS.override.md        # 项目强制覆盖
<repo-root>/AGENTS.md                 # 项目
<subdir>/AGENTS.override.md           # 子目录强制覆盖
<subdir>/AGENTS.md                    # 子目录
```

### 3.3 层级机制差异

| 特性 | Claude Code | Codex |
|------|------------|-------|
| 向上递归查找 | ✅ 从当前目录向上 | ✅ 从 repo root 向下 walk |
| 多文件合并 | ✅ 全部合并 | ✅ 按路径顺序拼接 |
| Override 覆盖 | ❌ 无 | ✅ `.override.md` 优先 |
| 本地私有文件 | ✅ `CLAUDE.local.md` | ❌ 无官方机制 |
| 大小限制 | Context Window 上限 | 32 KiB（可配置）硬限制 |

---

## 4. 加载机制对比

### Claude Code 加载时序

```
① 加载 ~/.claude/CLAUDE.md
② 从当前目录向上，收集所有 CLAUDE.md
③ 加载 CLAUDE.local.md
④ 所有内容合并 → 注入 System Prompt
```

### Codex 加载时序

```
① 读取 config.toml
② 全局：AGENTS.override.md 优先，再 AGENTS.md
③ 从 repo root 向下 walk 到当前目录，每层 override 优先
④ 读取 ~/.codex/memories/（若 read_enabled=true）
⑤ 所有内容拼接 → 注入 System Prompt
```

### 差异点

| 特性 | Claude Code | Codex |
|------|------------|-------|
| 遍历方向 | 当前目录 **向上** | repo root **向下** |
| Memories 注入 | ❌ 无 | ✅ 自动注入 |
| 配置文件 | 无 config | `config.toml` 可调参 |
| 调试手段 | `/memory` 命令 | `codex status` + `--ask-for-approval` |

---

## 5. 自动记忆能力对比

这是两者**最大的架构差异**：

| 特性 | Claude Code | Codex |
|------|------------|-------|
| 是否有自动记忆 | ❌ 完全没有 | ✅ Memories 层 |
| 记忆来源 | 人工写入 CLAUDE.md | 会话自动总结 |
| 触发时机 | N/A | 会话结束 6 小时后 |
| 存储位置 | N/A | `~/.codex/memories/` |
| 记忆去重 | N/A | 两模型协作合并 |
| 记忆老化 | N/A | 30 天未使用自动剪枝 |
| 密钥脱敏 | N/A | ✅ 内置自动过滤 |
| 团队共享 | ✅ Git 提交 CLAUDE.md | ❌ 仅本地个人 |

**结论**：

- Claude Code 的上下文**完全依赖人工维护**，质量高但需要纪律
- Codex Memories **降低了维护门槛**，但积累的知识是个人本地的，不能团队共享

---

## 6. 团队协作对比

### Claude Code

```
优势：
✅ CLAUDE.md 可提交 Git，团队自然共享
✅ 所有上下文人工管理，审查方便
✅ CLAUDE.local.md 分离个人偏好，不污染团队文件

劣势：
❌ 需要团队纪律，变更容易被遗忘
❌ 无法自动积累会话中涌现的知识
```

### Codex

```
优势：
✅ AGENTS.md 同样可提交 Git 团队共享
✅ Override 机制更精细，可针对子服务强制规则
✅ Memories 让个人知识自动积累，降低维护负担

劣势：
❌ Memories 仅本地个人，新成员无法继承
❌ 团队共识仍需手动从 Memories 提升到 AGENTS.md
❌ Override 层级复杂，团队协作时可能产生困惑
```

---

## 7. 工程化能力对比

| 特性 | Claude Code | Codex |
|------|------------|-------|
| 提交 Git | ✅ CLAUDE.md | ✅ AGENTS.md |
| 本地私有文件 | ✅ CLAUDE.local.md | ❌ 无官方机制 |
| 大小监控 | 需手动 `wc -l` | 需手动 `wc -c`（有硬限制警告） |
| 配置文件 | 无 | `config.toml`（丰富） |
| 自定义文件名 | ❌ 固定为 CLAUDE.md | ✅ fallback_filenames 可配 |
| 跨工具复用 | ❌ 只有 Claude Code 读 | ✅ Cursor/Aider 等都读 AGENTS.md |
| 环境变量 | 无 | `CODEX_HOME` 可定制主目录 |
| IDE 集成 | 暂无 | ✅ IDE Extension |

---

## 8. 选型建议

### 选 Claude Code 记忆机制，如果你：

```
✅ 团队重视知识共享和一致性
✅ 希望所有上下文透明可审查
✅ 有纪律的 code review 文化（能维护好 CLAUDE.md）
✅ 不需要 IDE 集成
✅ 已深度使用 Claude 生态
```

### 选 Codex 记忆机制，如果你：

```
✅ 希望降低手动维护上下文的负担
✅ 需要个人知识自动积累（Memories 层）
✅ 使用 Cursor/Aider 等多工具，需要 AGENTS.md 跨工具复用
✅ Monorepo 有复杂的子服务规则需要 Override
✅ 需要 IDE 扩展支持
```

### 混合使用场景

两者不互斥。实际上，如果项目同时使用两个工具，可以：

```bash
# 让 Codex 读取 CLAUDE.md（通过 fallback 配置）
# ~/.codex/config.toml
project_doc_fallback_filenames = ["CLAUDE.md"]

# 同时维护两份文件（针对各自工具特有功能）
project/
├── CLAUDE.md    # Claude Code 专用（含 CLAUDE.local.md 引用）
└── AGENTS.md    # Codex 专用（含 Override 结构）
```

---

## 9. 全景速查表

| 对比维度 | Claude Code | Codex |
|---------|------------|-------|
| **文件名** | CLAUDE.md | AGENTS.md |
| **全局配置** | `~/.claude/CLAUDE.md` | `~/.codex/AGENTS.md` |
| **本地私有** | `CLAUDE.local.md` ✅ | 无官方支持 ❌ |
| **Override 机制** | ❌ | `AGENTS.override.md` ✅ |
| **遍历方向** | 向上（current→root） | 向下（root→current） |
| **自动记忆** | ❌ | ✅ Memories 层 |
| **记忆触发** | N/A | 会话结束 6h 后 |
| **记忆存储** | N/A | `~/.codex/memories/` |
| **团队共享** | ✅ Git 即共享 | ✅ AGENTS.md 可 Git |
| **个人积累** | ❌ 需手动 | ✅ 自动 Memories |
| **大小限制** | Context Window | 32 KiB 硬限制（可调） |
| **配置文件** | 无 | `config.toml` ✅ |
| **自定义文件名** | ❌ | ✅ fallback_filenames |
| **跨工具兼容** | ❌ | ✅（开放规范） |
| **IDE 集成** | ❌ | ✅ |
| **调试命令** | `/memory` | `codex status` + `--ask-for-approval` |
| **密钥脱敏** | 无内置 | ✅ Memories 写入前自动过滤 |
| **开放标准** | 非开放 | Linux Foundation 维护 ✅ |

---

## 附：思维导图式总结

```
AI Coding Agent 记忆机制
├── Claude Code
│   ├── 设计哲学：人工精确控制
│   ├── 文件：CLAUDE.md（多层）+ CLAUDE.local.md
│   ├── 亮点：local 文件分离 + 向上递归查找
│   ├── 短板：无自动学习，依赖人工纪律
│   └── 适合：重视一致性、有 Code Review 文化的团队
│
└── Codex
    ├── 设计哲学：静态基线 + 自动积累
    ├── 文件：AGENTS.md（多层 + Override）+ Memories（自动）
    ├── 亮点：Override 机制 + 自动 Memories + 跨工具兼容
    ├── 短板：Memories 不能团队共享，Override 层级较复杂
    └── 适合：希望降低维护负担、多工具混用的开发者
```

---

*参考文档：*
- *[Claude Code Memory 官方文档](https://docs.claude.com/en/docs/claude-code/memory)*
- *[Codex AGENTS.md 官方文档](https://developers.openai.com/codex/guides/agents-md)*
- *[Codex Memories 官方文档](https://developers.openai.com/codex/memories)*
- *[AGENTS.md 开放规范](https://agents.md/)*
