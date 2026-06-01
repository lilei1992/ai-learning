# Claude Code 记忆机制深度解析

> **文档版本**: v1.0  
> **适用版本**: Claude Code (current)  
> **更新时间**: 2026-06  

---

## 目录

1. [概述](#1-概述)
2. [记忆文件体系](#2-记忆文件体系)
3. [四类记忆文件详解](#3-四类记忆文件详解)
4. [记忆加载机制](#4-记忆加载机制)
5. [记忆写入与管理](#5-记忆写入与管理)
6. [最佳实践](#6-最佳实践)
7. [工程化建议](#7-工程化建议)
8. [常见误区](#8-常见误区)

---

## 1. 概述

Claude Code **没有跨会话的原生记忆**，但通过一套精心设计的「记忆文件（Memory Files）」体系，将上下文持久化到文件系统中，实现了**工程级别的上下文延续**。

```
┌─────────────────────────────────────────────┐
│              Claude Code Session             │
│                                             │
│  ┌──────────┐    读取    ┌───────────────┐  │
│  │  Claude  │◄──────────│  Memory Files │  │
│  │  Agent   │           │  (CLAUDE.md)  │  │
│  └──────────┘    写入   └───────────────┘  │
│        │         ──────►        │           │
│        ▼                        ▼           │
│   [执行任务]              [持久化存储]        │
└─────────────────────────────────────────────┘
```

### 核心设计思路

| 特性 | 描述 |
|------|------|
| **无状态 Agent** | 每次会话重新加载上下文 |
| **文件即记忆** | 用 Markdown 文件替代内存状态 |
| **层级覆盖** | 全局 → 项目根 → 子目录，逐层精化 |
| **人工可读** | 记忆文件是普通文本，人可审阅和修改 |

---

## 2. 记忆文件体系

Claude Code 支持四类记忆文件，按**加载优先级**从低到高：

```
优先级（高）
    │
    ▼
① ~/.claude/CLAUDE.md          ← 用户全局配置
② <project-root>/CLAUDE.md     ← 项目根配置
③ <subdir>/CLAUDE.md           ← 子目录配置（递归向上查找）
④ CLAUDE.local.md              ← 本地个人配置（不提交 Git）
    │
    ▼
优先级（低）
```

> **关键规则**：同名指令，**更具体的路径优先**；多文件内容会**合并**后注入上下文。

---

## 3. 四类记忆文件详解

### 3.1 全局记忆 `~/.claude/CLAUDE.md`

**作用域**：所有项目、所有会话

```markdown
# 全局开发偏好

## 个人风格
- 代码注释使用中文
- 函数命名遵循 camelCase
- 提交信息格式：<type>(<scope>): <message>

## 常用工具偏好
- 包管理器：优先使用 pnpm
- 测试框架：Vitest（前端）/ pytest（后端）
- 格式化：prettier + eslint

## 沟通风格
- 回答请使用中文
- 技术术语保留英文原文
```

**适合写入内容**：
- 个人编码习惯
- 偏好的技术栈
- 沟通语言与风格

---

### 3.2 项目记忆 `<project-root>/CLAUDE.md`

**作用域**：当前项目所有会话，**应提交到 Git**

```markdown
# MyApp 项目上下文

## 项目概述
- 类型：B2B SaaS 平台
- 技术栈：Next.js 14 + tRPC + Prisma + PostgreSQL
- 部署：Vercel（前端）+ Railway（后端）

## 架构说明
src/
├── app/          # Next.js App Router 页面
├── server/       # tRPC 路由和业务逻辑
│   ├── routers/  # 各模块路由
│   └── services/ # 业务服务层
├── lib/          # 共享工具函数
└── components/   # UI 组件库

## 开发规范
- API 层：所有数据库操作必须经过 Service 层
- 错误处理：使用 TRPCError，不要 throw 原生 Error
- 类型：所有 API 响应必须有 Zod Schema 校验

## 关键约束
- 数据库：禁止直接写原生 SQL，使用 Prisma ORM
- 认证：所有 mutation 必须校验 session
- 测试：新功能需附带集成测试

## 常用命令
\`\`\`bash
pnpm dev          # 启动开发服务器
pnpm db:push      # 同步数据库 schema
pnpm test         # 运行测试套件
\`\`\`
```

**适合写入内容**：
- 项目架构与目录结构
- 技术选型与版本
- 团队编码规范
- 常用命令速查

---

### 3.3 子目录记忆 `<subdir>/CLAUDE.md`

**作用域**：该目录及其子目录，按需精化上下文

```
project/
├── CLAUDE.md              ← 项目整体规范
├── src/
│   ├── api/
│   │   └── CLAUDE.md      ← API 模块专属规范
│   └── components/
│       └── CLAUDE.md      ← 组件库专属规范
└── scripts/
    └── CLAUDE.md          ← 脚本专属说明
```

示例 `src/api/CLAUDE.md`：

```markdown
# API 模块说明

## 路由命名规范
- 资源路由：`<resource>Router`（如 `userRouter`）
- 方法命名：getXxx / createXxx / updateXxx / deleteXxx

## 中间件顺序
1. `authMiddleware` - 认证校验
2. `rateLimitMiddleware` - 限流
3. `validationMiddleware` - 入参校验

## 错误码规范
| 错误码 | 含义 |
|--------|------|
| `UNAUTHORIZED` | 未登录 |
| `FORBIDDEN` | 无权限 |
| `NOT_FOUND` | 资源不存在 |
| `BAD_REQUEST` | 参数错误 |
```

---

### 3.4 本地记忆 `CLAUDE.local.md`

**作用域**：个人本地，**加入 `.gitignore`，不提交**

```markdown
# 本地开发环境备注

## 本机环境
- Node.js: v22.3.0
- 数据库地址：localhost:5432/myapp_dev
- Redis：localhost:6379

## 调试技巧（个人笔记）
- 遇到 tRPC 类型报错先 `pnpm type-check`
- 数据库连接问题检查 Docker 是否启动

## 当前进行中的任务
- [ ] 重构用户权限模块（预计本周完成）
- [x] 接入 Stripe 支付 ✓
```

**适合写入内容**：
- 本机环境变量和路径
- 个人调试笔记
- 进行中的私人任务

---

## 4. 记忆加载机制

### 4.1 加载时序

```
Claude Code 启动
      │
      ▼
① 加载 ~/.claude/CLAUDE.md（全局）
      │
      ▼
② 从当前工作目录向上遍历，收集所有 CLAUDE.md
      │
      ▼
③ 加载 CLAUDE.local.md（如存在）
      │
      ▼
④ 合并所有内容 → 注入 System Prompt
      │
      ▼
  开始会话
```

### 4.2 向上递归查找示例

当你在 `project/src/api/users/` 目录下工作时，Claude Code 会查找：

```
project/src/api/users/CLAUDE.md   ← 最优先
project/src/api/CLAUDE.md
project/src/CLAUDE.md
project/CLAUDE.md                 ← 项目根
~/.claude/CLAUDE.md               ← 全局
```

所有存在的文件都会被**合并加载**。

### 4.3 上下文窗口消耗

```
⚠️  注意：CLAUDE.md 内容会占用 Context Window

建议单个文件控制在 500 行以内
避免堆砌无关信息
定期清理过时内容
```

---

## 5. 记忆写入与管理

### 5.1 手动写入

直接编辑 Markdown 文件：

```bash
# 编辑全局记忆
vim ~/.claude/CLAUDE.md

# 编辑项目记忆
vim ./CLAUDE.md
```

### 5.2 通过 Claude Code 写入

在会话中指令 Claude 更新记忆文件：

```
用户：把这个架构决策记录到 CLAUDE.md 中：
      我们决定使用 Redis 做 Session 存储，而不是 JWT，
      原因是需要支持强制登出功能。
```

Claude 会自动找到合适的记忆文件并追加内容。

### 5.3 使用 `/memory` 命令

```
/memory          # 查看当前加载的所有记忆内容
```

---

## 6. 最佳实践

### 6.1 记忆文件结构模板

```markdown
# [项目名] 上下文

## 🏗 架构概览
<!-- 简明描述系统架构，附目录树 -->

## 📋 开发规范
<!-- 团队约定的编码规范 -->

## 🚀 快速命令
<!-- 高频使用的命令 -->

## ⚠️ 重要约束
<!-- 必须遵守的硬性约束 -->

## 🔧 当前状态
<!-- 进行中的工作、已知问题 -->
```

### 6.2 记忆分层策略

```
全局 CLAUDE.md    →  个人偏好，跨项目通用
项目 CLAUDE.md    →  架构、规范，团队共享
子目录 CLAUDE.md  →  模块专属细节
local CLAUDE.md   →  私人笔记，不共享
```

### 6.3 保持记忆文件精简

| ✅ 应该写入 | ❌ 不应该写入 |
|------------|--------------|
| 架构决策与原因 | 代码逻辑本身 |
| 非显而易见的约束 | 可以从代码推断的信息 |
| 常用命令 | 过期的历史记录 |
| 项目关键路径 | 临时性的调试信息 |

---

## 7. 工程化建议

### 7.1 Git 配置

```bash
# .gitignore 中添加
CLAUDE.local.md
.claude/
```

```bash
# 提交项目记忆文件
git add CLAUDE.md
git commit -m "docs: 初始化 Claude Code 项目记忆配置"
```

### 7.2 团队协作规范

```markdown
## CLAUDE.md 维护规约（写入项目 README）

1. **谁来更新**：做出架构决策的人负责更新 CLAUDE.md
2. **何时更新**：架构变更时同步更新，不允许延迟
3. **代码审查**：CLAUDE.md 的变更需要 team lead review
4. **禁止内容**：不写密钥、不写本地路径、不写个人偏好
```

### 7.3 多项目管理

```bash
~/.claude/
├── CLAUDE.md              # 全局通用配置
└── templates/
    ├── nextjs-CLAUDE.md   # Next.js 项目模板
    ├── python-CLAUDE.md   # Python 项目模板
    └── monorepo-CLAUDE.md # Monorepo 项目模板
```

初始化新项目时：

```bash
# 使用模板快速初始化
cp ~/.claude/templates/nextjs-CLAUDE.md ./CLAUDE.md
```

### 7.4 记忆文件 Lint

```bash
# 检查记忆文件大小（建议 < 500 行）
wc -l CLAUDE.md ~/.claude/CLAUDE.md

# 检查是否有敏感信息（密钥、密码等）
grep -rn "password\|secret\|token\|key=" CLAUDE.md
```

---

## 8. 常见误区

### ❌ 误区 1：把 CLAUDE.md 当代码文档

```markdown
# 错误示例
## calculateTax 函数说明
这个函数接受 income 参数，计算税额...
（这些信息从代码本身就能读取）
```

**✅ 正确做法**：CLAUDE.md 记录**决策**和**约束**，不记录实现细节。

---

### ❌ 误区 2：不区分全局和项目记忆

把所有内容都堆在 `~/.claude/CLAUDE.md` 里，导致：
- 全局文件越来越大
- 不同项目的规范相互干扰

**✅ 正确做法**：严格按层级分类。

---

### ❌ 误区 3：忘记更新记忆文件

重构了项目架构，但 CLAUDE.md 还是旧的，导致 Claude 给出错误的建议。

**✅ 正确做法**：将记忆文件更新纳入架构变更的 Definition of Done。

---

### ❌ 误区 4：把 CLAUDE.local.md 提交到 Git

```bash
# 危险！可能泄漏本地路径、个人信息
git add CLAUDE.local.md  # ← 不要这样做
```

**✅ 正确做法**：始终在 `.gitignore` 中忽略 `CLAUDE.local.md`。

---

## 总结

```
记忆机制本质 = 结构化的 System Prompt 注入
                        ↓
通过文件系统实现跨会话上下文持久化
                        ↓
  全局配置 → 项目规范 → 模块细节 → 个人笔记
```

Claude Code 的记忆机制简单而强大：**用文件代替内存，用 Markdown 代替数据库**。掌握其层级结构和加载机制，能显著提升 AI 辅助开发的效率和一致性。

---

*参考资料：[Claude Code 官方文档](https://docs.claude.com/en/docs/claude-code/memory)*
