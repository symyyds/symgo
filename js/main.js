(() => {
  "use strict";

  const mainScript = [...document.scripts].find((script) => /(?:^|\/)js\/main\.js(?:[?#]|$)/.test(script.src));
  const siteRoot = mainScript
    ? new URL(mainScript.src.replace(/js\/main\.js(?:[?#].*)?$/, ""))
    : new URL("./", document.baseURI);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktopNav = window.matchMedia("(min-width: 1181px)");

  const navigationGroups = [
    { label: "首页", href: "index.html" },
    {
      label: "关于",
      href: "profile.html",
      children: [
        { label: "个人档案", href: "profile.html", desc: "定位、能力与经历概览" },
        { label: "阶段成果", href: "resume.html", desc: "本科材料与研究生阶段预留" },
        { label: "研究方向", href: "research.html", desc: "问题意识、方法与未来课题" },
        { label: "一页式档案", href: "snapshot.html", desc: "快速发给导师或招聘方" },
      ],
    },
    {
      label: "成果",
      href: "publications.html",
      children: [
        { label: "论文发表", href: "publications.html", desc: "论文首页、DOI 与 PDF" },
        { label: "项目总览", href: "projects.html", desc: "工程项目与横向项目入口" },
        { label: "材料中心", href: "materials.html", desc: "简历、论文和可验证材料" },
        { label: "成果证明", href: "achievements.html", desc: "奖项、项目与公开证据" },
      ],
    },
    {
      label: "项目",
      href: "engineering-projects.html",
      children: [
        { label: "工程项目", href: "engineering-projects.html", desc: "开发、工具、API 与部署" },
        { label: "横向项目", href: "horizontal-projects.html", desc: "技术路线、材料与验收证据" },
        { label: "证据档案", href: "evidence/index.html", desc: "公开边界内的证据链" },
        { label: "合作方向", href: "services.html", desc: "原型、材料与科研协作" },
      ],
    },
    {
      label: "知识",
      href: "blog.html",
      children: [
        { label: "技术博客", href: "blog.html", desc: "教程、阅读与项目复盘" },
        { label: "知识库", href: "library/index.html", desc: "研究笔记与维护记录" },
        { label: "案例库", href: "cases/index.html", desc: "模块级实践与复盘" },
        { label: "扩展手册", href: "handbook/index.html", desc: "工程、研究和申请专题" },
      ],
    },
    {
      label: "工具",
      href: "tools/api_lab.html",
      children: [
        { label: "API 实验室", href: "tools/api_lab.html", desc: "Functions 状态与调用结果" },
        { label: "AI 助手", href: "ai.html", desc: "安全代理与文档问答" },
        { label: "代码展示", href: "tools/code_runner.html", desc: "隔离运行与代码高亮" },
        { label: "Python 导航", href: "tools/python_nav.html", desc: "入门、数据类型与编程笔记" },
        { label: "深度学习", href: "tools/deep_learning.html", desc: "框架、课程与教程资源" },
        { label: "Markdown 工具", href: "tools/markdown_to_word.html", desc: "预览、排版与导出" },
        { label: "简历制作", href: "tools/resume_builder.html", desc: "结构化简历编辑工具" },
      ],
    },
    { label: "联系", href: "leave_message.html" },
  ];

  const paletteItems = [
    ["首页", "真实成果与核心入口", "index.html"],
    ["个人档案", "定位、能力与经历概览", "profile.html"],
    ["阶段成果", "本科材料与研究生阶段预留", "resume.html"],
    ["研究方向", "问题意识、方法与未来课题", "research.html"],
    ["一页式档案", "导师、招聘与合作快速入口", "snapshot.html"],
    ["论文发表", "论文首页、DOI 与 PDF", "publications.html"],
    ["项目总览", "工程项目与横向项目", "projects.html"],
    ["工程项目", "开发、工具、API 与部署", "engineering-projects.html"],
    ["横向项目", "技术路线、材料与验收证据", "horizontal-projects.html"],
    ["材料中心", "CV、论文与公开材料", "materials.html"],
    ["成果证明", "奖项、项目与公开证据", "achievements.html"],
    ["技术博客", "教程、论文阅读与项目复盘", "blog.html"],
    ["知识库", "研究笔记与更新日志", "library/index.html"],
    ["案例库", "模块级实践与复盘", "cases/index.html"],
    ["扩展手册", "工程、研究与申请专题", "handbook/index.html"],
    ["证据档案", "公开边界内的证据链", "evidence/index.html"],
    ["API 实验室", "Functions 状态与调用结果", "tools/api_lab.html"],
    ["AI 助手", "安全代理与文档问答", "ai.html"],
    ["代码展示", "隔离运行与代码高亮", "tools/code_runner.html"],
    ["Python 导航", "入门、数据类型与编程笔记", "tools/python_nav.html"],
    ["深度学习", "框架、课程与教程资源", "tools/deep_learning.html"],
    ["Markdown 工具", "预览、排版与导出", "tools/markdown_to_word.html"],
    ["简历制作", "结构化简历编辑", "tools/resume_builder.html"],
    ["联系", "邮箱、GitHub 与合作方向", "leave_message.html"],
  ].map(([label, desc, href]) => ({ label, desc, href }));

  const categoryNames = {
    blog: "技术博客",
    tools: "工具",
    library: "知识库",
    cases: "案例库",
    handbook: "扩展手册",
    evidence: "证据档案",
  };

  function siteUrl(path = "") {
    return new URL(path.replace(/^\//, ""), siteRoot).href;
  }

  function currentRelativePath() {
    const current = new URL(window.location.href);
    const rootPath = decodeURI(siteRoot.pathname).replace(/\/$/, "");
    const currentPath = decodeURI(current.pathname);
    let relative = currentPath.startsWith(`${rootPath}/`) ? currentPath.slice(rootPath.length + 1) : currentPath.replace(/^\//, "");
    if (!relative || relative.endsWith("/")) relative += "index.html";
    return relative.replace(/\\/g, "/");
  }

  function normalizeTarget(href) {
    try {
      const target = new URL(href, window.location.href);
      const rootPath = decodeURI(siteRoot.pathname).replace(/\/$/, "");
      let relative = decodeURI(target.pathname);
      if (relative.startsWith(`${rootPath}/`)) relative = relative.slice(rootPath.length + 1);
      else relative = relative.replace(/^\//, "");
      if (!relative || relative.endsWith("/")) relative += "index.html";
      return relative;
    } catch {
      return href;
    }
  }

  function showToast(message) {
    let toast = document.querySelector(".site-toast-v2");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "site-toast-v2";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2000);
  }

  function ensureSkipLink() {
    if (document.querySelector(".skip-link-v2, .skip-link")) return;
    const main = document.querySelector("main");
    if (!main) return;
    if (!main.id) main.id = "main-content";
    const link = document.createElement("a");
    link.className = "skip-link-v2";
    link.href = `#${main.id}`;
    link.textContent = "跳到主要内容";
    document.body.prepend(link);
  }

  function renderHeader() {
    const header = document.querySelector("body > header");
    if (!header) return;

    header.className = "site-header-v2";
    header.setAttribute("data-site-header", "");
    header.innerHTML = `
      <div class="container site-header-v2__inner">
        <a class="site-brand-v2" href="${siteUrl("index.html")}" aria-label="孙远鸣个人成果网站首页">
          <span class="site-brand-v2__mark" aria-hidden="true">SYM<span>.</span></span>
          <span class="site-brand-v2__copy"><strong>孙远鸣</strong><small>Research × Engineering</small></span>
        </a>
        <nav class="site-nav-v2" id="site-navigation" aria-label="主导航" data-site-nav>
          <ul>${navigationGroups.map((item, index) => {
            if (!item.children) {
              return `<li><a class="site-nav-v2__primary" href="${siteUrl(item.href)}" data-nav-path="${item.href}">${item.label}</a></li>`;
            }
            const id = `site-nav-panel-${index}`;
            return `
              <li class="site-nav-v2__cluster">
                <div class="site-nav-v2__cluster-head">
                  <a class="site-nav-v2__primary" href="${siteUrl(item.href)}" data-nav-path="${item.href}">${item.label}</a>
                  <button type="button" aria-expanded="false" aria-controls="${id}" aria-haspopup="true" aria-label="展开${item.label}分类">
                    <svg viewBox="0 0 12 12" aria-hidden="true"><path d="m2.5 4.5 3.5 3 3.5-3" /></svg>
                  </button>
                </div>
                <div class="site-nav-v2__panel" id="${id}" role="menu" aria-hidden="true" inert>
                  ${item.children.map((child) => `
                    <a href="${siteUrl(child.href)}" role="menuitem" data-nav-path="${child.href}"><span>${child.label}</span><small>${child.desc}</small></a>
                  `).join("")}
                </div>
              </li>
            `;
          }).join("")}</ul>
        </nav>
        <div class="site-header-v2__actions">
          <button class="site-search-button" type="button" data-command-open aria-label="搜索页面，快捷键 Ctrl+K">
            <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" /><path d="m13 13 4 4" /></svg>
          </button>
          <a class="site-cv-button" href="${siteUrl("files/CV.pdf")}" target="_blank" rel="noopener noreferrer">CV <span>↗</span></a>
          <button class="site-menu-button" type="button" aria-expanded="false" aria-controls="site-navigation" aria-label="打开导航菜单"><span></span><span></span></button>
        </div>
      </div>
    `;
  }

  function initNavigation() {
    const header = document.querySelector("[data-site-header]");
    const nav = document.querySelector("[data-site-nav]");
    const menuButton = document.querySelector(".site-menu-button");
    const main = document.querySelector("main");
    const footer = document.querySelector("body > footer");
    if (!header || !nav || !menuButton || !main) return;

    const clusters = [...nav.querySelectorAll(".site-nav-v2__cluster")];
    let lastFocused = null;
    let suppressClusterFocusOpen = false;

    function setCluster(cluster, open) {
      const button = cluster.querySelector(".site-nav-v2__cluster-head button");
      const panel = cluster.querySelector(".site-nav-v2__panel");
      cluster.classList.toggle("is-open", open);
      button?.setAttribute("aria-expanded", String(open));
      if (panel) {
        panel.setAttribute("aria-hidden", String(!open));
        panel.inert = !open;
      }
    }

    function closeClusters(except = null) {
      clusters.forEach((cluster) => {
        if (cluster !== except) setCluster(cluster, false);
      });
    }

    clusters.forEach((cluster) => {
      const button = cluster.querySelector(".site-nav-v2__cluster-head button");
      const panel = cluster.querySelector(".site-nav-v2__panel");
      let closeTimer;
      if (!button || !panel) return;

      const openCluster = () => {
        window.clearTimeout(closeTimer);
        closeClusters(cluster);
        setCluster(cluster, true);
      };
      const queueClose = () => {
        window.clearTimeout(closeTimer);
        closeTimer = window.setTimeout(() => setCluster(cluster, false), 240);
      };

      cluster.addEventListener("pointerenter", () => desktopNav.matches && openCluster());
      cluster.addEventListener("pointerleave", () => desktopNav.matches && queueClose());
      cluster.addEventListener("focusin", () => desktopNav.matches && !suppressClusterFocusOpen && openCluster());
      cluster.addEventListener("focusout", (event) => {
        if (desktopNav.matches && !cluster.contains(event.relatedTarget)) queueClose();
      });
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const willOpen = !cluster.classList.contains("is-open");
        closeClusters(cluster);
        setCluster(cluster, willOpen);
        if (willOpen && !desktopNav.matches) requestAnimationFrame(() => panel.querySelector("a")?.focus());
      });
    });

    function setMobileMenu(open, restoreFocus = true) {
      if (open) lastFocused = document.activeElement;
      nav.classList.toggle("is-open", open);
      if (!desktopNav.matches) nav.setAttribute("aria-hidden", String(!open));
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
      header.classList.toggle("menu-active", open);
      document.body.classList.toggle("menu-open", open);
      main.inert = open;
      if (footer) footer.inert = open;

      if (open) requestAnimationFrame(() => nav.querySelector("a")?.focus());
      else {
        closeClusters();
        if (restoreFocus && lastFocused instanceof HTMLElement) lastFocused.focus();
      }
    }

    menuButton.addEventListener("click", () => setMobileMenu(menuButton.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a") && !desktopNav.matches) setMobileMenu(false, false);
    });
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".site-nav-v2__cluster")) closeClusters();
    });
    document.addEventListener("keydown", (event) => {
      const menuOpen = menuButton.getAttribute("aria-expanded") === "true";
      if (event.key === "Escape") {
        if (menuOpen) setMobileMenu(false);
        else {
          const activeCluster = event.target instanceof Element
            ? event.target.closest(".site-nav-v2__cluster.is-open")
            : null;
          closeClusters();
          const clusterButton = activeCluster?.querySelector(".site-nav-v2__cluster-head button");
          if (clusterButton instanceof HTMLElement) {
            event.preventDefault();
            suppressClusterFocusOpen = true;
            clusterButton.focus();
            suppressClusterFocusOpen = false;
          }
        }
        return;
      }
      if (event.key !== "Tab" || !menuOpen) return;
      const focusable = [
        ...nav.querySelectorAll("a, .site-nav-v2__cluster-head button"),
        menuButton,
      ].filter((element) => element.offsetParent !== null && !element.closest("[inert]"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    });
    desktopNav.addEventListener("change", (event) => {
      if (event.matches) {
        setMobileMenu(false, false);
        nav.removeAttribute("aria-hidden");
        document.querySelector(".site-brand-v2")?.focus();
      } else {
        nav.setAttribute("aria-hidden", "true");
      }
    });
    if (!desktopNav.matches) nav.setAttribute("aria-hidden", "true");
  }

  function markActiveNavigation() {
    const current = currentRelativePath();
    const currentSection = current.includes("/") ? current.split("/")[0] : "";
    const nav = document.querySelector("[data-site-nav]");
    if (!nav) return;

    const setLinkState = (link, visuallyCurrent, currentPage = false) => {
      link.classList.toggle("is-current", visuallyCurrent);
      if (currentPage) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    };

    const representsCurrentSection = (target) => {
      const targetSection = target.includes("/") ? target.split("/")[0] : "";
      return Boolean(currentSection) && (
        target === `${currentSection}/index.html`
        || (currentSection === "blog" && target === "blog.html")
        || (["library", "cases", "handbook", "evidence"].includes(currentSection) && targetSection === currentSection)
      );
    };

    nav.querySelectorAll(":scope > ul > li").forEach((item) => {
      const cluster = item.querySelector(":scope > .site-nav-v2__cluster-head")?.parentElement;
      const primary = cluster
        ? cluster.querySelector(":scope > .site-nav-v2__cluster-head > .site-nav-v2__primary")
        : item.querySelector(":scope > .site-nav-v2__primary");
      if (!primary) return;

      const primaryTarget = normalizeTarget(primary.href);
      if (!cluster) {
        const exactPrimary = primaryTarget === current;
        setLinkState(primary, exactPrimary, exactPrimary);
        return;
      }

      const children = [...cluster.querySelectorAll(":scope > .site-nav-v2__panel > a[data-nav-path]")];
      const exactChild = children.find((link) => normalizeTarget(link.href) === current) || null;
      const sectionChild = exactChild || children.find((link) => representsCurrentSection(normalizeTarget(link.href))) || null;

      children.forEach((link) => {
        setLinkState(link, link === sectionChild, link === exactChild);
      });

      const primarySection = primaryTarget.includes("/") ? primaryTarget.split("/")[0] : "";
      const sectionCurrent = primaryTarget === current
        || Boolean(sectionChild)
        || (Boolean(currentSection) && primarySection === currentSection);

      /* A clustered primary identifies the active section visually. The exact
         child owns aria-current="page", avoiding two page announcements for
         duplicated landing targets such as Publications and API Lab. */
      setLinkState(primary, sectionCurrent, sectionCurrent && !exactChild && primaryTarget === current);
      cluster.classList.toggle("has-current", sectionCurrent);
    });
  }

  function initHeaderState() {
    const header = document.querySelector("[data-site-header]");
    if (!header) return;
    let scheduled = false;
    function update() {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
      scheduled = false;
    }
    window.addEventListener("scroll", () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  function renderFooter() {
    const footer = document.querySelector("body > footer");
    if (!footer) return;
    footer.className = "site-footer-v2";
    footer.innerHTML = `
      <div class="container site-footer-v2__grid">
        <div class="site-footer-v2__identity">
          <span class="site-brand-v2__mark" aria-hidden="true">SYM<span>.</span></span>
          <p>Research × Engineering × Evidence</p>
        </div>
        <div><span>成果</span><a href="${siteUrl("publications.html")}">论文</a><a href="${siteUrl("engineering-projects.html")}">工程项目</a><a href="${siteUrl("horizontal-projects.html")}">横向项目</a></div>
        <div><span>材料</span><a href="${siteUrl("resume.html")}">阶段档案</a><a href="${siteUrl("materials.html")}">材料中心</a><a href="${siteUrl("blog.html")}">技术博客</a></div>
        <div><span>联系</span><a href="mailto:19861208800@163.com">Email ↗</a><a href="https://github.com/symyyds/symgo" target="_blank" rel="noopener noreferrer">GitHub ↗</a><button type="button" data-copy-email>复制邮箱</button></div>
        <p class="site-footer-v2__copyright">© 2026 孙远鸣。所有事实内容以公开材料为准。</p>
      </div>
    `;
    footer.querySelector("[data-copy-email]")?.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText("19861208800@163.com");
        showToast("邮箱已复制");
      } catch {
        showToast("复制失败，请手动复制邮箱");
      }
    });
  }

  function initReadingProgress() {
    const progress = document.createElement("div");
    progress.className = "reading-progress-v2";
    progress.innerHTML = "<span></span>";
    document.body.appendChild(progress);
    const bar = progress.querySelector("span");
    let scheduled = false;
    function update() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      bar.style.transform = `scaleX(${ratio})`;
      scheduled = false;
    }
    window.addEventListener("scroll", () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  function initCommandPalette() {
    if (typeof HTMLDialogElement === "undefined") return;
    const dialog = document.createElement("dialog");
    dialog.className = "command-palette-v2";
    dialog.setAttribute("aria-labelledby", "command-title");
    dialog.innerHTML = `
      <div class="command-palette-v2__dialog">
        <div class="command-palette-v2__head">
          <div><span>QUICK NAVIGATION</span><h2 id="command-title">搜索页面与材料</h2></div>
          <button type="button" data-command-close aria-label="关闭搜索">×</button>
        </div>
        <label class="command-palette-v2__search"><span class="sr-only">搜索关键词</span><input type="search" placeholder="输入论文、项目、材料或工具名称" autocomplete="off" /></label>
        <div class="command-palette-v2__results" role="list"></div>
      </div>
    `;
    document.body.appendChild(dialog);
    const input = dialog.querySelector("input");
    const results = dialog.querySelector(".command-palette-v2__results");
    let previousFocus = null;

    function render(keyword = "") {
      const term = keyword.trim().toLowerCase();
      const matches = paletteItems.filter((item) => `${item.label} ${item.desc}`.toLowerCase().includes(term));
      results.innerHTML = matches.length
        ? matches.map((item, index) => `<a href="${siteUrl(item.href)}" role="listitem"><span>${String(index + 1).padStart(2, "0")}</span><strong>${item.label}</strong><small>${item.desc}</small><b>↗</b></a>`).join("")
        : '<p class="empty-state">没有匹配结果，请换一个关键词。</p>';
    }
    function open() {
      previousFocus = document.activeElement;
      render(input.value);
      dialog.showModal();
      document.body.classList.add("dialog-open");
      requestAnimationFrame(() => input.focus());
    }
    function close() {
      if (!dialog.open) return;
      dialog.close();
      document.body.classList.remove("dialog-open");
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    }
    document.querySelectorAll("[data-command-open]").forEach((button) => button.addEventListener("click", open));
    dialog.querySelector("[data-command-close]").addEventListener("click", close);
    input.addEventListener("input", () => render(input.value));
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) close();
    });
    dialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));
    document.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialog.open) close();
        else open();
      }
    });
    render();
  }

  function initBackToTop() {
    const button = document.createElement("button");
    button.className = "back-top-v2";
    button.type = "button";
    button.setAttribute("aria-label", "返回页面顶部");
    button.textContent = "↑";
    document.body.appendChild(button);
    function update() {
      button.classList.toggle("is-visible", window.scrollY > 700);
    }
    window.addEventListener("scroll", update, { passive: true });
    button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? "auto" : "smooth" }));
    update();
  }

  function initBreadcrumbs() {
    const current = currentRelativePath();
    if (current === "index.html" || document.querySelector(".breadcrumbs-v2")) return;
    const target = document.querySelector(".page-hero .container, .article-header, main > .container:first-child");
    if (!target) return;
    const section = current.includes("/") ? current.split("/")[0] : "";
    const title = document.title.split("|")[0].trim() || document.querySelector("main h1")?.textContent.trim();
    const crumbs = [{ label: "首页", href: siteUrl("index.html") }];
    if (section && categoryNames[section]) crumbs.push({ label: categoryNames[section], href: siteUrl(`${section}/index.html`) });
    crumbs.push({ label: title, href: "" });
    const nav = document.createElement("nav");
    nav.className = "breadcrumbs-v2";
    nav.setAttribute("aria-label", "面包屑导航");
    nav.innerHTML = crumbs.map((crumb, index) => index === crumbs.length - 1
      ? `<span aria-current="page">${crumb.label}</span>`
      : `<a href="${crumb.href}">${crumb.label}</a><i aria-hidden="true">/</i>`).join("");
    target.prepend(nav);
  }

  let revealObserver = null;
  function initReveal() {
    const selectors = ".section-band, .surface-card, .project-showcase, .publication-card, .handbook-section, .evidence-section, .blog-card, .timeline-card, .metric-card, .material-card, .capability-card, .artifact-card, .library-card, .case-block, .visual-proof-card";
    const items = [...document.querySelectorAll(selectors)].filter((item) => item.dataset.revealReady !== "true");
    if (!items.length) return;
    items.forEach((item) => {
      item.dataset.revealReady = "true";
      item.classList.add("reveal-ready-v2");
    });
    if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("reveal-in-v2"));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("reveal-in-v2");
          revealObserver.unobserve(entry.target);
        });
      // Large, content-driven sections can be several viewports tall on mobile.
      // A percentage threshold would otherwise keep the entire section invisible
      // even though its first screen is already in view.
      }, { threshold: 0.01, rootMargin: "0px 0px -2% 0px" });
    }
    items.forEach((item) => revealObserver.observe(item));
  }

  function refreshPageRail() {
    document.querySelector(".page-side-rail-v2")?.remove();
    const main = document.querySelector("main");
    if (!main || document.body.classList.contains("home-v2")) return;
    const headings = [...main.querySelectorAll("h2")]
      .filter((heading) => heading.textContent.trim())
      .filter((heading) => !heading.closest(".publication-card, .project-showcase, .blog-card, .capability-card, .material-card, .api-log-card, [data-api-widget]"))
      .slice(0, 7);
    if (headings.length < 3) return;
    const rail = document.createElement("aside");
    rail.className = "page-side-rail-v2";
    rail.setAttribute("aria-label", "页面快速定位");
    rail.innerHTML = `<span>ON THIS PAGE</span>${headings.map((heading, index) => {
      if (!heading.id) heading.id = `section-${index + 1}`;
      return `<a href="#${heading.id}">${heading.textContent.trim()}</a>`;
    }).join("")}`;
    main.appendChild(rail);
  }

  function sanitizeLinksAndImages() {
    document.querySelectorAll('a[target="_blank"]').forEach((link) => {
      const rel = new Set((link.getAttribute("rel") || "").split(/\s+/).filter(Boolean));
      rel.add("noopener");
      rel.add("noreferrer");
      link.setAttribute("rel", [...rel].join(" "));
    });
    document.querySelectorAll('a[href="#"], a[href=""]').forEach((link) => {
      if (link.dataset.placeholderReady === "true") return;
      link.dataset.placeholderReady = "true";
      link.setAttribute("aria-disabled", "true");
      link.classList.add("is-placeholder-link");
      link.addEventListener("click", (event) => {
        event.preventDefault();
        showToast("此入口为明确占位，尚未提供真实材料。");
      });
    });
    document.querySelectorAll("main img").forEach((image, index) => {
      if (index > 0 && !image.hasAttribute("loading")) image.loading = "lazy";
      image.decoding = "async";
      if (image.dataset.errorReady === "true") return;
      image.dataset.errorReady = "true";
      image.addEventListener("error", () => {
        image.classList.add("is-broken-image");
        const visualFrame = image.closest("figure, .publication-preview, .project-cover-link, .horizontal-card-preview, .blog-img, .resume-preview-link");
        visualFrame?.classList.add("has-broken-image");
      });
    });
  }

  function initImagePreview() {
    if (document.documentElement.dataset.imagePreviewReady === "true") return;
    document.documentElement.dataset.imagePreviewReady = "true";

    const dialog = document.createElement("dialog");
    dialog.className = "image-preview-dialog";
    dialog.setAttribute("aria-labelledby", "image-preview-title");
    dialog.innerHTML = `
      <div class="image-preview-dialog__shell">
        <div class="image-preview-dialog__head">
          <div>
            <span class="section-kicker">VISUAL EVIDENCE</span>
            <h2 id="image-preview-title">项目截图预览</h2>
          </div>
          <button class="image-preview-dialog__close" type="button" data-image-preview-close aria-label="关闭截图预览">×</button>
        </div>
        <div class="image-preview-dialog__media">
          <span data-image-preview-status role="status" aria-live="polite">正在加载截图…</span>
          <img alt="" decoding="async" hidden>
        </div>
        <p data-image-preview-caption></p>
      </div>
    `;
    document.body.appendChild(dialog);

    const previewImage = dialog.querySelector("img");
    const caption = dialog.querySelector("[data-image-preview-caption]");
    const status = dialog.querySelector("[data-image-preview-status]");
    let opener = null;

    const closePreview = () => {
      if (dialog.open) dialog.close();
    };

    document.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-image-preview-src]");
      if (!trigger) return;
      event.preventDefault();
      const source = trigger.dataset.imagePreviewSrc;
      if (!source) return;
      opener = trigger;
      const label = trigger.dataset.imagePreviewAlt || "项目截图";
      previewImage.alt = label;
      previewImage.hidden = true;
      status.hidden = false;
      status.textContent = "正在加载截图…";
      caption.textContent = label;
      dialog.showModal();
      document.body.classList.add("dialog-open");
      previewImage.src = new URL(source, document.baseURI).href;
    });

    previewImage.addEventListener("load", () => {
      previewImage.hidden = false;
      status.hidden = true;
    });
    previewImage.addEventListener("error", () => {
      previewImage.hidden = true;
      status.hidden = false;
      status.textContent = "截图加载失败；可关闭预览后打开对应项目页面。";
    });

    dialog.querySelector("[data-image-preview-close]").addEventListener("click", closePreview);
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closePreview();
    });
    dialog.addEventListener("close", () => {
      document.body.classList.remove("dialog-open");
      previewImage.removeAttribute("src");
      previewImage.hidden = true;
      status.hidden = true;
      if (opener?.isConnected) opener.focus();
    });
  }

  function initContactValidation() {
    const form = document.getElementById("contact-form");
    if (!form) return;
    form.addEventListener("submit", (event) => {
      const email = form.querySelector('input[type="email"]');
      if (!email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) return;
      event.preventDefault();
      email.setAttribute("aria-invalid", "true");
      email.focus();
      showToast("请输入有效的电子邮件地址");
    });
  }

  function refreshEnhancements() {
    sanitizeLinksAndImages();
    initReveal();
    window.clearTimeout(refreshEnhancements.railTimer);
    refreshEnhancements.railTimer = window.setTimeout(refreshPageRail, 80);
  }

  function init() {
    // Remove the key used by the retired browser-direct AI implementation.
    // Model credentials now belong exclusively in Netlify environment variables.
    try { localStorage.removeItem("deepseek_api_key"); } catch { /* storage may be unavailable */ }
    ensureSkipLink();
    renderHeader();
    renderFooter();
    initNavigation();
    markActiveNavigation();
    initHeaderState();
    initReadingProgress();
    initCommandPalette();
    initBackToTop();
    initBreadcrumbs();
    initContactValidation();
    initImagePreview();
    refreshEnhancements();
    window.symgoRefreshEnhancements = refreshEnhancements;
    document.addEventListener("symgo:content-updated", refreshEnhancements);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
