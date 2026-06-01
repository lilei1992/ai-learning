# Codex 记忆机制深度解析

> **文档版本**: v1.0  
> **适用版本**: Codex CLI / Codex App (2026)  
> **更新时间**: 2026-06  

---

## 目录

1. [概述](#1-概述)
2. [双层记忆架构](#2-双层记忆架构)
3. [Layer 1：AGENTS.md 静态指令层](#3-layer-1agentsmd-静态指令层)
4. [Layer 2：Memories 自动生成层](#4-layer-2memories-自动生成层)
5. [记忆加载机制](#5-记忆加载机制)
6. [配置与管理](#6-配置与管理)
7. [最佳实践](#7-最佳实践)
8. [工程化建议](#8-工程化建议)
9. [常见问题](#9-常见问题)

---

## 1. 概述

Codex（OpenAI）采用**双层记忆架构**，将静态知识和动态学习分离处理：

```
┌─────────────────────────────────────────────────────┐
│                  Codex Session 启动                  │
│                                                     │
│  ┌─────────────────┐    ┌──────────────────────┐   │
│  │  Layer 1        │    │  Layer 2             │   │
│  │  AGENTS.md      │    │  ~/.codex/memories/  │   │
│  │  (人工维护)      │    │  (Agent 自动生成)     │   │
│  └────────┬────────┘    └──────────┬───────────┘   │
│           │                        │               │
│           └──────────┬─────────────┘               │
│                      ▼                             │
│              合并注入 Context Window                │
│                      │                             │
│                      ▼                             │
│               [Agent 开始工作]                      │
│                      │                             │
│                      ▼                             │
│           会话结束 → 后台 6小时后异步总结            │
│                      │                             │
│                      ▼                             │
│           写入 ~/.codex/memories/                  │
└─────────────────────────────────────────────────────┘
```

### 核心设计原则

| 特性 | 描述 |
|------|------|
| **双层分离** | 静态指令（人工）与动态记忆（自动）分开管理 |
| **异步总结** | 会话结束后后台运行，不影响前台响应速度 |
| **Override 机制** | `.override.md` 可强制覆盖上层规则 |
| **跨工具兼容** | AGENTS.md 格式被 Cursor、Aider 等多工具采用 |
| **大小限制** | 默认 32 KiB 上限（可配置） |

---

## 2. 双层记忆架构

```
记忆类型      维护方式       存储位置                   适用场景
──────────────────────────────────────────────────────────────
AGENTS.md    人工编写       项目目录 / ~/.codex/       稳定的项目规范
Memories     Agent自动生成  ~/.codex/memories/         会话中涌现的知识
```

两层各司其职，互补而非替代：

- **AGENTS.md** 解决"项目规范"问题 —— 测试命令、代码风格、架构约束
- **Memories** 解决"经验积累"问题 —— 会话中发现的 bug 模式、技术决策

---

## 3. Layer 1：AGENTS.md 静态指令层

### 3.1 文件层级体系

```
优先级（高）
    │
    ▼
① ~/.codex/AGENTS.override.md     ← 全局强制覆盖（临时用）
② ~/.codex/AGENTS.md              ← 全局用户偏好
③ <repo-root>/AGENTS.override.md  ← 项目强制覆盖
④ <repo-root>/AGENTS.md           ← 项目根规范
⑤ <subdir>/AGENTS.override.md     ← 子目录强制覆盖
⑥ <subdir>/AGENTS.md              ← 子目录规范
    │
    ▼
优先级（低）
```

> **关键规则**：同层下 `AGENTS.override.md` 永远优先于 `AGENTS.md`；所有文件**按路径顺序拼接**后注入 Context。

### 3.2 存储结构示意

```
~/.codex/
├── AGENTS.md              # 全局用户偏好
├── AGENTS.override.md     # 全局临时覆盖（慎用）
├── config.toml            # Codex 配置
└── log/
    └── codex-tui.log      # 会话日志

project/
├── AGENTS.md              # 项目全局规范（提交 Git）
└── services/
    └── payments/
        ├── AGENTS.md          # 子模块规范（若有 override 则被忽略）
        └── AGENTS.override.md # 强制覆盖此目录，AGENTS.md 不再读取
```

### 3.3 各层文件示例

#### 全局 `~/.codex/AGENTS.md`

```markdown
# 全局开发偏好

## 语言与风格
- 代码注释使用中文
- 回复我时请使用中文
- 提交信息格式：<type>(<scope>): <message>

## 工具偏好
- 包管理器：优先 pnpm
- 格式化：prettier + eslint
- 测试框架：vitest（前端）/ pytest（后端）
```

#### 项目根 `./AGENTS.md`

```markdown
# MyApp 项目规范

## 测试
- 修改 JavaScript 文件后，始终运行 `npm test`
- 提交 PR 前运行 `npm run lint`

## 依赖管理
- 安装新依赖时优先使用 pnpm
- 添加生产依赖前需确认

## 文档
- 修改公共工具函数时，同步更新 docs/ 下的文档
```

#### 子目录覆盖 `./services/payments/AGENTS.override.md`

```markdown
# Payments 服务专属规则（覆盖上层）

## 测试（覆盖全局 npm test）
- 使用 `make test-payments` 代替 `npm test`

## 安全
- 禁止在未通知安全频道的情况下轮换 API Key
- 所有金额字段必须使用 Decimal 类型，禁止 float
```

### 3.4 跨工具兼容性

AGENTS.md 是开放规范（由 Linux Foundation Agentic AI Foundation 维护），多工具共用：

| 工具 | 默认文件名 |
|------|-----------|
| Codex CLI | `AGENTS.md` |
| Claude Code | `CLAUDE.md` |
| Cursor | `.cursorrules` |
| Aider | `.aider.conf.yml` |

Codex 可通过配置读取其他工具的文件：

```toml
# ~/.codex/config.toml
project_doc_fallback_filenames = ["CLAUDE.md", ".cursorrules"]
```

---

## 4. Layer 2：Memories 自动生成层

### 4.1 机制概述

Memories 是 Codex 独有的**自动化记忆层**，无需人工干预，Agent 自己从历史会话中提炼知识。

```
会话结束（用户关闭终端）
        │
        ▼ （等待 6 小时，默认值）
后台异步触发 Consolidation Pass
        │
        ▼
Model 1：从会话记录中提取候选 memories
        │
        ▼
Model 2：与现有 memory store 合并去重
        │
        ▼
写入 ~/.codex/memories/memory_summary.md
        │
        ▼
下次 Session 启动时自动读取
```

### 4.2 技术细节

| 参数 | 默认值 | 说明 |
|------|--------|------|
| 触发延迟 | 6 小时 | 会话空闲多久后才可被总结 |
| 处理窗口 | 256 rollouts | 单次 consolidation 处理的最大会话数 |
| 记忆老化 | 30 天未使用 | 自动剪枝过期记忆 |
| Rollout 老化 | 30 天未召回 | 原始会话记录清理 |
| 密钥脱敏 | 内置 | 写入前自动过滤 credentials |

### 4.3 独立开关

```toml
# ~/.codex/config.toml
[memories]
write_enabled = true   # 是否将新会话写入 memory store
read_enabled  = true   # 是否在 Session 启动时读取 memories
```

支持非对称配置：

```
read=true  / write=false  → 只读模式，用于 memory 层调试
read=false / write=true   → 只写模式，用于 onboarding 期间积累知识
```

### 4.4 Codex App 的 Memories（云端）

Codex App（ChatGPT 内）也支持 Memories，但文档规格尚未完全公开：

- 官方确认：跨会话持久化
- 未公开：存储形态、保留时长、配置项

设置路径：`Codex App → Settings → Enable Memories`

---

## 5. 记忆加载机制

### 5.1 Session 启动时序

```
codex 命令执行
      │
      ▼
① 读取 ~/.codex/config.toml
      │
      ▼
② 全局范围：检查 ~/.codex/AGENTS.override.md，再检查 AGENTS.md
      │
      ▼
③ 项目范围：从 git repo root 向下 walk 到当前目录，
            每层检查 AGENTS.override.md 优先，再 AGENTS.md
      │
      ▼
④ 读取 ~/.codex/memories/（若 read_enabled=true）
      │
      ▼
⑤ 所有内容拼接 → 注入 System Prompt
      │
      ▼
  Session 开始
```

### 5.2 大小限制与截断

```
⚠️  重要：AGENTS.md 默认 32 KiB 上限（≈ 8000 tokens）

- 超出部分会被静默截断，不报错
- 多层嵌套的大型 Monorepo 容易触发此限制
- 可在 config.toml 中调整：
  project_doc_max_bytes = 65536  # 64 KiB
```

### 5.3 调试命令

```bash
# 查看当前加载了哪些指令
codex --ask-for-approval never "Summarize your current instructions"

# 检查特定子目录的 override 效果
codex --cd services/payments "Show active instruction files"

# 查看工作区根目录
codex status
```

---

## 6. 配置与管理

### 6.1 完整 config.toml 参考

```toml
# ~/.codex/config.toml

# 自定义 Codex 主目录
# CODEX_HOME=/custom/path  # 也可通过环境变量设置

# 备用文件名（跨工具兼容）
project_doc_fallback_filenames = ["CLAUDE.md", ".cursorrules"]

# 文件大小上限（字节，默认 32768 = 32 KiB）
project_doc_max_bytes = 65536

# Memories 配置
[memories]
write_enabled = true
read_enabled  = true
consolidation_idle_hours = 6    # 触发 consolidation 的空闲小时数
max_rollouts = 256               # 单次处理的最大 rollout 数
retention_days = 30              # 记忆保留天数
```

### 6.2 文件路径结构

```
~/.codex/
├── AGENTS.md
├── AGENTS.override.md
├── config.toml
├── memories/
│   └── memory_summary.md      # 自动生成，不建议手动编辑
└── log/
    └── codex-tui.log
```

---

## 7. 最佳实践

### 7.1 AGENTS.md 写作模板

```markdown
# [服务/项目名] 规范

## 🧪 测试
- [具体测试命令]
- [测试覆盖要求]

## 📦 依赖管理
- [包管理器偏好]
- [添加依赖的审批流程]

## 🏗 架构约束
- [禁止的操作或模式]
- [必须遵循的设计原则]

## 📝 文档要求
- [文档同步规范]
```

### 7.2 Override 的使用时机

```
✅ 适合 AGENTS.override.md 的场景：
- 某个子服务使用不同的测试框架
- 特定目录有安全合规要求
- 临时调试期间需要覆盖全局规则

❌ 不适合的场景：
- 长期稳定的规范（放 AGENTS.md 就好）
- 个人偏好（放 ~/.codex/AGENTS.md）
```

### 7.3 Memories 的配合使用

```markdown
## 工作流建议

1. 用 AGENTS.md 建立稳定基线
   └→ 测试命令、架构约束、团队规范

2. 让 Memories 自动积累会话知识
   └→ 发现的 bug 模式、实际决策路径

3. 定期将 Memories 中的重要内容"提升"到 AGENTS.md
   └→ 手动审查 ~/.codex/memories/memory_summary.md
   └→ 将稳定的、有价值的内容迁移到项目 AGENTS.md
```

---

## 8. 工程化建议

### 8.1 Git 配置

```bash
# .gitignore
AGENTS.local.md          # 个人本地备注（自定义，非官方）
# ~/.codex/ 是用户目录，自然不在 git 范围内
```

```bash
# 应提交的文件
git add AGENTS.md
git add services/payments/AGENTS.override.md
git commit -m "docs: 初始化 Codex AGENTS.md 配置"
```

### 8.2 Monorepo 分层策略

```
monorepo/
├── AGENTS.md                    # 全仓规范（lint、commit 格式）
├── packages/
│   ├── ui/
│   │   └── AGENTS.md            # UI 组件规范
│   └── api/
│       └── AGENTS.md            # API 服务规范
└── services/
    └── payments/
        └── AGENTS.override.md   # 支付服务强制规则
```

### 8.3 大小监控

```bash
# 检查各层文件大小
find . -name "AGENTS*.md" -exec wc -c {} \;
wc -c ~/.codex/AGENTS.md

# 汇总大小（不超过 32768 bytes）
find . -name "AGENTS*.md" ~/.codex/AGENTS*.md \
  -exec wc -c {} \; | awk '{sum+=$1} END {print "总计: " sum " bytes (限制: 32768)"}'
```

### 8.4 团队协作规范

```markdown
## AGENTS.md 维护公约

1. **变更审查**：AGENTS.md 修改需 PR + team lead review
2. **同步更新**：架构变更时必须同步更新 AGENTS.md，纳入 DoD
3. **禁止内容**：不写密钥、本地路径、个人偏好
4. **override 审慎**：AGENTS.override.md 使用前需说明理由
5. **Memories 迁移**：每月 review ~/.codex/memories/，
                      有价值的知识手动迁入 AGENTS.md
```

---

## 9. 常见问题

### ❌ 问题 1：AGENTS.md 内容不生效

**排查步骤**：
```bash
# 1. 确认文件有内容且路径正确
cat ./AGENTS.md
cat ~/.codex/AGENTS.md

# 2. 确认文件编码（必须 UTF-8）
file ./AGENTS.md

# 3. 让 Codex 报告当前指令
codex --ask-for-approval never "What instructions do you have?"

# 4. 检查是否有 override 覆盖
find . -name "AGENTS.override.md" | head -20
```

### ❌ 问题 2：指令被截断

```toml
# config.toml 中增大上限
project_doc_max_bytes = 65536  # 64 KiB

# 或拆分文件，减少每层内容
```

### ❌ 问题 3：Memories 没有自动生成

**检查点**：
- `config.toml` 中 `write_enabled = true`
- 会话是否真正结束（不是只是 idle）
- 等待时间是否超过 `consolidation_idle_hours`（默认 6 小时）
- 检查日志：`~/.codex/log/codex-tui.log`

### ❌ 问题 4：团队成员之间 Memories 无法共享

这是 Codex Memories 的已知限制——**Memories 是本地、个人的**，不跨机器同步。

**解决方案**：将 Memories 中积累的团队共识手动提升为 `AGENTS.md` 并提交 Git。

---

## 总结

```
Codex 记忆 = AGENTS.md（静态 + 人工）+ Memories（动态 + 自动）
                              ↓
静态层：项目规范、团队约定 → 提交 Git，团队共享
动态层：会话经验、涌现知识 → 本地存储，个人专属
                              ↓
Override 机制提供精细的层级控制能力
跨工具兼容让 AGENTS.md 投资可复用
```

Codex 的记忆机制亮点在于**双层分离 + 自动 Memories**，以 `AGENTS.md` 为稳定基础，以 Memories 为动态补充，形成比纯人工维护更完善的上下文积累体系。

---

*参考资料：*
- *[Codex AGENTS.md 官方文档](https://developers.openai.com/codex/guides/agents-md)*
- *[Codex Memories 官方文档](https://developers.openai.com/codex/memories)*
- *[AGENTS.md 开放规范](https://agents.md/)*
