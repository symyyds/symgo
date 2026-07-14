(() => {
  "use strict";

  const storageKey = "symgo-local-notes-v2";
  const form = document.getElementById("local-note-form");
  const list = document.querySelector("[data-note-list]");
  const status = document.querySelector("[data-note-status]");
  const clearButton = document.querySelector("[data-clear-notes]");
  const copyButton = document.querySelector("[data-copy-contact]");
  if (!form || !list || !status) return;

  function readNotes() {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(parsed) ? parsed.filter((item) => item && typeof item.content === "string") : [];
    } catch {
      return [];
    }
  }

  function writeNotes(notes) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(notes.slice(0, 30)));
      return true;
    } catch {
      status.textContent = "浏览器拒绝了本地存储，请检查隐私设置。";
      return false;
    }
  }

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (typeof text === "string") element.textContent = text;
    return element;
  }

  function render() {
    const notes = readNotes();
    list.replaceChildren();
    if (!notes.length) {
      list.appendChild(makeElement("p", "empty-state", "当前浏览器还没有备忘记录。"));
      return;
    }

    notes.forEach((note) => {
      const article = makeElement("article", "local-note-item");
      const head = makeElement("div", "local-note-item__head");
      const title = makeElement("strong", "", note.name || "未命名备忘");
      const time = makeElement("time", "", new Date(note.createdAt).toLocaleString("zh-CN", { hour12: false }));
      time.dateTime = note.createdAt;
      head.append(title, time);
      const content = makeElement("p", "", note.content);
      const remove = makeElement("button", "text-link", "删除此条");
      remove.type = "button";
      remove.setAttribute("aria-label", `删除备忘：${note.name || "未命名备忘"}`);
      remove.addEventListener("click", () => {
        const next = readNotes().filter((item) => item.id !== note.id);
        if (writeNotes(next)) {
          status.textContent = "已从当前浏览器删除。";
          render();
        }
      });
      article.append(head, content, remove);
      list.appendChild(article);
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = form.elements.name.value.trim().slice(0, 40);
    const content = form.elements.content.value.trim().slice(0, 800);
    if (!content) {
      status.textContent = "请输入备忘内容。";
      form.elements.content.focus();
      return;
    }
    const notes = readNotes();
    notes.unshift({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, name, content, createdAt: new Date().toISOString() });
    if (!writeNotes(notes)) return;
    form.reset();
    status.textContent = "已保存到当前浏览器，没有上传到服务器。";
    render();
  });

  clearButton?.addEventListener("click", () => {
    if (!readNotes().length) {
      status.textContent = "当前没有可清除的记录。";
      return;
    }
    if (!window.confirm("确定清空当前浏览器中的全部备忘吗？")) return;
    if (writeNotes([])) {
      status.textContent = "本机备忘已清空。";
      render();
    }
  });

  copyButton?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("19861208800@163.com");
      status.textContent = "联系邮箱已复制。";
    } catch {
      status.textContent = "复制失败，请手动复制：19861208800@163.com";
    }
  });

  render();
})();
