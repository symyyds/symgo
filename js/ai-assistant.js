(() => {
  "use strict";

  const storageKey = "symgo-ai-sessions-v2";
  const form = document.querySelector("[data-ai-form]");
  const messagesRoot = document.querySelector("[data-ai-messages]");
  const sessionsRoot = document.querySelector("[data-ai-sessions]");
  const titleRoot = document.querySelector("[data-ai-title]");
  const statusRoot = document.querySelector("[data-ai-status]");
  const serviceRoot = document.querySelector("[data-ai-service-state]");
  const fileInput = document.getElementById("ai-file");
  const fileStatus = document.querySelector("[data-ai-file-status]");
  const fileContextRoot = document.querySelector("[data-ai-file-context]");
  const sendButton = document.querySelector("[data-ai-send]");
  if (!form || !messagesRoot || !sessionsRoot || !titleRoot || !statusRoot || !serviceRoot) return;

  let sessions = readSessions();
  let activeId = sessions[0]?.id || "";
  if (!activeId) createSession();
  let fileContext = null;

  function readSessions() {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (!Array.isArray(parsed)) return [];
      return parsed.slice(0, 20).map((session) => ({
        id: String(session.id || ""),
        title: String(session.title || "新对话").slice(0, 48),
        updatedAt: String(session.updatedAt || new Date().toISOString()),
        messages: Array.isArray(session.messages)
          ? session.messages.filter((message) => ["user", "assistant"].includes(message.role) && typeof message.content === "string").slice(-30)
          : [],
      })).filter((session) => session.id);
    } catch {
      return [];
    }
  }

  function saveSessions() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(sessions.slice(0, 20)));
    } catch {
      statusRoot.textContent = "会话无法写入本地存储，请检查浏览器隐私设置。";
    }
  }

  function createSession() {
    const session = { id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, title: "新对话", updatedAt: new Date().toISOString(), messages: [] };
    sessions.unshift(session);
    activeId = session.id;
    saveSessions();
    return session;
  }

  function activeSession() {
    return sessions.find((session) => session.id === activeId) || createSession();
  }

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (typeof text === "string") element.textContent = text;
    return element;
  }

  function renderSessions() {
    sessionsRoot.replaceChildren();
    sessions.forEach((session) => {
      const row = makeElement("div", `ai-session-row${session.id === activeId ? " is-active" : ""}`);
      const open = makeElement("button", "ai-session-open");
      open.type = "button";
      open.append(makeElement("strong", "", session.title), makeElement("small", "", new Date(session.updatedAt).toLocaleString("zh-CN", { hour12: false })));
      open.addEventListener("click", () => {
        activeId = session.id;
        render();
      });
      const remove = makeElement("button", "ai-session-remove", "×");
      remove.type = "button";
      remove.setAttribute("aria-label", `删除会话：${session.title}`);
      remove.addEventListener("click", () => {
        sessions = sessions.filter((item) => item.id !== session.id);
        if (!sessions.length) createSession();
        if (activeId === session.id) activeId = sessions[0].id;
        saveSessions();
        render();
      });
      row.append(open, remove);
      sessionsRoot.appendChild(row);
    });
  }

  function renderMessages() {
    const session = activeSession();
    titleRoot.textContent = session.title;
    messagesRoot.replaceChildren();
    if (!session.messages.length) {
      const empty = makeElement("div", "ai-empty-message");
      empty.append(
        makeElement("span", "", "START A CONVERSATION"),
        makeElement("h3", "", "用真实材料提出一个可验证的问题。"),
        makeElement("p", "", "可以直接输入问题，或先添加 TXT、Markdown、PDF、DOCX 文件。文件只在浏览器提取文本，随后作为当前会话上下文发送。"),
      );
      messagesRoot.appendChild(empty);
      return;
    }

    session.messages.forEach((message) => {
      const article = makeElement("article", `ai-message ai-message--${message.role}`);
      article.append(
        makeElement("span", "ai-message__role", message.role === "user" ? "YOU" : "ASSISTANT"),
        makeElement("p", "ai-message__content", message.content),
      );
      messagesRoot.appendChild(article);
    });
    requestAnimationFrame(() => messagesRoot.scrollTo({ top: messagesRoot.scrollHeight, behavior: "smooth" }));
  }

  function render() {
    renderSessions();
    renderMessages();
  }

  async function extractFile(file) {
    const extension = file.name.split(".").pop().toLowerCase();
    if (file.size > 12 * 1024 * 1024) throw new Error("文件超过 12MB 限制。");
    if (["txt", "md"].includes(extension)) return (await file.text()).slice(0, 40000);

    if (extension === "pdf") {
      if (!window.pdfjsLib) throw new Error("PDF 解析组件加载失败。");
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("vendor/libs/pdf.worker.min.js", document.baseURI).href;
      const pdf = await window.pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
      const pages = [];
      const limit = Math.min(pdf.numPages, 20);
      for (let pageNumber = 1; pageNumber <= limit; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        pages.push(`[第 ${pageNumber} 页]\n${content.items.map((item) => item.str).join(" ")}`);
      }
      return pages.join("\n\n").slice(0, 40000);
    }

    if (extension === "docx") {
      if (!window.mammoth) throw new Error("Word 解析组件加载失败。");
      const result = await window.mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
      return result.value.slice(0, 40000);
    }

    throw new Error("仅支持 TXT、Markdown、PDF 和 DOCX。" );
  }

  fileInput?.addEventListener("change", async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    fileStatus.textContent = "正在提取文本……";
    try {
      const text = await extractFile(file);
      if (!text.trim()) throw new Error("文件中没有提取到可读文本。" );
      fileContext = { name: file.name, text };
      fileStatus.textContent = `${file.name} · 已提取 ${text.length.toLocaleString("zh-CN")} 字符`;
      fileContextRoot.hidden = false;
      fileContextRoot.textContent = `已添加材料：${file.name}。发送下一条消息后，本材料将作为上下文使用一次。`;
    } catch (error) {
      fileContext = null;
      fileInput.value = "";
      fileStatus.textContent = error.message || "文件解析失败。";
      fileContextRoot.hidden = true;
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const prompt = form.elements.prompt.value.trim();
    if (!prompt || sendButton.disabled) return;
    const session = activeSession();
    const visiblePrompt = prompt.slice(0, 8000);
    const requestContent = fileContext
      ? `${visiblePrompt}\n\n[用户附加材料：${fileContext.name}]\n${fileContext.text}`
      : visiblePrompt;

    session.messages.push({ role: "user", content: visiblePrompt });
    if (session.title === "新对话") session.title = visiblePrompt.slice(0, 28) || "新对话";
    session.updatedAt = new Date().toISOString();
    form.reset();
    fileContext = null;
    if (fileStatus) fileStatus.textContent = "未添加文件";
    fileContextRoot.hidden = true;
    saveSessions();
    render();

    serviceRoot.classList.add("is-loading");
    serviceRoot.innerHTML = "<span></span>正在请求安全代理";
    statusRoot.textContent = "正在通过本站 Netlify Function 请求模型……";
    sendButton.disabled = true;

    const payloadMessages = session.messages.slice(-12).map((message, index, array) => ({
      role: message.role,
      content: index === array.length - 1 && message.role === "user" ? requestContent : message.content,
    }));

    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 50000);
      const response = await fetch("/.netlify/functions/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ messages: payloadMessages }),
        signal: controller.signal,
      });
      window.clearTimeout(timeout);
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || result.error || `HTTP ${response.status}`);
      const reply = String(result.reply || "").trim();
      if (!reply) throw new Error("模型没有返回文本内容。" );
      session.messages.push({ role: "assistant", content: reply.slice(0, 16000) });
      session.updatedAt = new Date().toISOString();
      saveSessions();
      serviceRoot.classList.remove("is-loading", "is-error");
      serviceRoot.innerHTML = `<span></span>成功 · ${Number(result.latencyMs || 0).toLocaleString("zh-CN")}ms`;
      statusRoot.textContent = `模型：${result.model || "DeepSeek"}；本轮上下文包含 ${payloadMessages.length} 条消息。`;
    } catch (error) {
      serviceRoot.classList.remove("is-loading");
      serviceRoot.classList.add("is-error");
      serviceRoot.innerHTML = "<span></span>请求失败";
      statusRoot.textContent = error.name === "AbortError" ? "请求超时，请稍后重试。" : (error.message || "请求失败。");
      session.messages.push({ role: "assistant", content: `请求未完成：${statusRoot.textContent}` });
    } finally {
      sendButton.disabled = false;
      saveSessions();
      render();
    }
  });

  document.querySelector("[data-ai-new]")?.addEventListener("click", () => {
    const session = createSession();
    activeId = session.id;
    render();
    form.elements.prompt.focus();
  });

  document.querySelector("[data-ai-clear]")?.addEventListener("click", () => {
    if (!window.confirm("确定清空当前浏览器中的全部 AI 会话吗？")) return;
    sessions = [];
    createSession();
    render();
  });

  render();
})();
