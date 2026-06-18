Reveal.initialize({
  width: 1280,
  height: 720,
  margin: 0.04,
  hash: true,
  slideNumber: "c/t",
  controls: true,
  progress: true,
  center: false,
  transition: "fade",
  backgroundTransition: "fade",
  plugins: [RevealNotes],
});

const loopSteps = [
  {
    title: "Observe（观察需求）",
    text: "系统先理解用户目标、当前目录、已有约束和历史对话。",
    log: "turn 1: user asks for a code change",
  },
  {
    title: "Assemble Context（组装上下文）",
    text: "把用户消息、系统规则、项目文件、工具结果组合成模型可读的上下文。",
    log: "context += AGENTS.md + files + previous turns",
  },
  {
    title: "Call Model（调用模型）",
    text: "模型不是直接改代码，而是生成下一步意图：解释、调用工具、继续追问或结束。",
    log: "llm.stream(context) -> assistant events",
  },
  {
    title: "Select Tool（选择工具）",
    text: "如果模型需要读文件、改文件、跑测试，会发起工具调用请求。",
    log: "tool_use: Read(file) / Edit(file) / Bash(command)",
  },
  {
    title: "Run Tool（执行工具）",
    text: "执行工具后把结果写回会话，模型再根据结果判断下一步。",
    log: "tool_result -> append to transcript",
  },
  {
    title: "Stop Check（停止判断）",
    text: "如果目标完成、用户中断、权限拒绝或达到最大回合数，循环停止。",
    log: "stop? done : next_turn",
  },
];

let loopIndex = 0;

function renderLoop() {
  document.querySelectorAll("#loopVisual [data-step]").forEach((item) => {
    item.classList.toggle("active", Number(item.dataset.step) === loopIndex);
  });
  const step = loopSteps[loopIndex];
  document.getElementById("loopTitle").textContent = step.title;
  document.getElementById("loopText").textContent = step.text;
  document.getElementById("loopLog").textContent = step.log;
}

document.getElementById("loopNext")?.addEventListener("click", () => {
  loopIndex = (loopIndex + 1) % loopSteps.length;
  renderLoop();
});

renderLoop();

const toolRuns = [];
const toolMeta = {
  read: { label: "Read（读取）", safe: true, color: "#37d7a5" },
  grep: { label: "Grep（搜索）", safe: true, color: "#5b9dff" },
  edit: { label: "Edit（编辑）", safe: false, color: "#ff9364" },
  bash: { label: "Bash（命令）", safe: false, color: "#ff6b78" },
};

function scheduleTool(tool) {
  const meta = toolMeta[tool];
  const lastEnd = toolRuns.reduce((max, item) => Math.max(max, item.end), 0);
  const runningReadOnlyEnd = toolRuns
    .filter((item) => item.safe && meta.safe)
    .reduce((min, item) => Math.min(min, item.end), 0);
  let start = 0;
  if (meta.safe) {
    const hasExclusive = toolRuns.some((item) => !item.safe);
    start = hasExclusive ? lastEnd : runningReadOnlyEnd;
  } else {
    start = lastEnd;
  }
  const duration = meta.safe ? 28 : 34;
  toolRuns.push({
    label: meta.label,
    safe: meta.safe,
    color: meta.color,
    start,
    end: start + duration,
  });
  renderTimeline();
}

function renderTimeline() {
  const timeline = document.getElementById("toolTimeline");
  if (!timeline) return;
  if (!toolRuns.length) {
    timeline.innerHTML = '<p class="muted">点击左侧工具，观察调度顺序。</p>';
    return;
  }
  timeline.innerHTML = toolRuns.map((run) => {
    const left = Math.min(run.start, 86);
    const width = Math.max(16, run.end - run.start);
    return `
      <div class="bar-row">
        <div class="bar-label">${run.label}${run.safe ? " / Read-only（只读）" : " / Exclusive（独占）"}</div>
        <div class="bar-track">
          <div class="bar-fill" style="left:${left}%;width:${width}%;background:${run.color}"></div>
        </div>
      </div>
    `;
  }).join("");
}

document.querySelectorAll("#toolQueue [data-tool]").forEach((button) => {
  button.addEventListener("click", () => scheduleTool(button.dataset.tool));
});

document.getElementById("toolReset")?.addEventListener("click", () => {
  toolRuns.length = 0;
  renderTimeline();
});

renderTimeline();

let budget = 96;
const compressMap = {
  tool: { delta: 9, text: "截断大段工具结果：保留关键片段，丢弃重复日志。成本低，信息损失小。" },
  snip: { delta: 14, text: "丢弃最旧消息：下降很快，但可能丢掉早期约束。适合历史明显无关时。" },
  micro: { delta: 12, text: "微压缩：选择性清理单个工具结果，尽量不破坏缓存边界。" },
  collapse: { delta: 22, text: "上下文折叠：把多段消息折成压缩视图，保留原始数据用于审计。" },
  summary: { delta: 32, text: "LLM 摘要：效果最强但要额外调用模型，成本最高，通常最后使用。" },
};

function renderBudget(message) {
  const fill = document.getElementById("budgetFill");
  const text = document.getElementById("budgetText");
  const log = document.getElementById("compressLog");
  if (!fill || !text || !log) return;
  fill.style.width = `${budget}%`;
  text.textContent = `${budget}% 使用中`;
  log.textContent = message;
}

document.querySelectorAll("[data-compress]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = compressMap[button.dataset.compress];
    budget = Math.max(28, budget - action.delta);
    renderBudget(action.text);
  });
});

renderBudget("当前上下文接近上限，优先尝试低成本压缩。");

function checkPermission() {
  const active = document.querySelector(".permission-scenario.active");
  const tool = active?.dataset.tool;
  const target = active?.dataset.target;
  const result = document.getElementById("permResult");
  if (!tool || !target || !result) return;

  let level = "allow";
  let title = "允许执行";
  let detail = "低风险动作，可以直接进入工具执行阶段。";

  if (target === "secret" || target === "system") {
    level = tool === "read" && target === "secret" ? "ask" : "deny";
  } else if (tool === "edit" || tool === "bash") {
    level = "ask";
  }

  if (level === "ask") {
    title = "需要人工确认";
    detail = "动作可能影响项目状态，需要展示参数、路径和风险说明后由用户确认。";
  }
  if (level === "deny") {
    title = "拒绝执行";
    detail = "目标越过安全边界，或者动作风险过高，不进入工具执行。";
  }

  const toolLabel = active.querySelector("span")?.textContent || tool;
  const targetLabel = active.querySelector("b")?.textContent || target;
  result.className = `permission-result ${level}`;
  result.innerHTML = `<small>${toolLabel} -> ${targetLabel}</small><b>${title}</b><span>${detail}</span>`;
}

document.querySelectorAll(".permission-scenario").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".permission-scenario").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    checkPermission();
  });
});

Reveal.on("slidechanged", () => {
  if (Reveal.getIndices().h === 15) checkPermission();
});
