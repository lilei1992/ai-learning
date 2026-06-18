# Claude Code Reveal.js 实时演示版

## 打开方式

推荐启动本地服务：

```bash
cd /Users/lilei/code/share/claude-code-reveal-live
python3 -m http.server 8765
```

然后访问：

```text
http://127.0.0.1:8765/
```

Q&A 讨论稿访问：

```text
http://127.0.0.1:8765/qa.index.html
```

也可以直接打开 `index.html`。Reveal.js 运行文件已放在 `vendor/reveal`，不依赖现场网络。

## 演示内容

- 重新组织原 HTML 内容，不照搬原版长卡片。
- 定位为纯知识类学习材料，增加小白友好的概念解释、学习模型和 Java 类比。
- 非技术栈类英文概念以 `English（中文注释）` 方式保留和解释。
- 排版已增强为工程蓝图风格背景，并增加封面架构图、层级编号、扩展机制强调条等可视化。
- 包含 4 个实时演示：
  - Agent Loop（Agent 循环）步骤
  - Tool Scheduling（工具并发调度）
  - Context Compaction（上下文压缩）策略
  - Permission Check（权限判断）流程
- `qa.index.html` 基于现场讨论页的问题，整理了公司内部接入 Claude Code / AI Agent 架构的 Q&A 讨论稿。

## 备注

技术名词如 `Agent`、`MCP`、`TypeScript`、`Bun`、`React` 会保留英文，避免翻译后失真；解释性概念会用中文补充。
