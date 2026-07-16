const fs = require("fs");
const path = require("path");
const { protectedSitemapPages } = require("./site-governance");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "dist");
const DEFAULT_SITE_URL = "https://symweb.netlify.app";
const STALE_SITE_HOST = ["symgo", "netlify", "app"].join(".");

const navigationGroups = [
  { label: "首页", href: "index.html" },
  {
    label: "关于",
    href: "profile.html",
    children: [
      ["个人档案", "profile.html", "定位、能力与经历概览"],
      ["阶段成果", "resume.html", "本科材料与研究生阶段预留"],
      ["研究方向", "research.html", "问题意识、方法与未来课题"],
      ["一页式档案", "snapshot.html", "快速发给导师或招聘方"]
    ]
  },
  {
    label: "成果",
    href: "publications.html",
    children: [
      ["论文发表", "publications.html", "论文首页、DOI 与 PDF"],
      ["项目总览", "projects.html", "工程项目与横向项目入口"],
      ["材料中心", "materials.html", "简历、论文和可验证材料"],
      ["成果证明", "achievements.html", "奖项、项目与公开证据"]
    ]
  },
  {
    label: "项目",
    href: "engineering-projects.html",
    children: [
      ["工程项目", "engineering-projects.html", "开发、工具、API 与部署"],
      ["横向项目", "horizontal-projects.html", "技术路线、材料与验收证据"],
      ["证据档案", "evidence/index.html", "公开边界内的证据链"],
      ["合作方向", "services.html", "原型、材料与科研协作"]
    ]
  },
  {
    label: "知识",
    href: "blog.html",
    children: [
      ["技术博客", "blog.html", "教程、阅读与项目复盘"],
      ["知识库", "library/index.html", "研究笔记与维护记录"],
      ["案例库", "cases/index.html", "模块级实践与复盘"],
      ["扩展手册", "handbook/index.html", "工程、研究和申请专题"]
    ]
  },
  {
    label: "工具",
    href: "tools/api_lab.html",
    children: [
      ["API 实验室", "tools/api_lab.html", "Functions 状态与调用结果"],
      ["AI 助手", "ai.html", "安全代理与文档问答"],
      ["代码展示", "tools/code_runner.html", "隔离运行与代码高亮"],
      ["Python 导航", "tools/python_nav.html", "入门、数据类型与编程笔记"],
      ["深度学习", "tools/deep_learning.html", "框架、课程与教程资源"],
      ["Markdown 工具", "tools/markdown_to_word.html", "预览、排版与导出"],
      ["简历制作", "tools/resume_builder.html", "结构化简历编辑工具"]
    ]
  },
  { label: "联系", href: "leave_message.html" }
];

const pageDescriptions = new Map([
  ["blog/25_skills.html", "孙远鸣整理的复试与面试技巧，涵盖材料准备、表达方法、常见问题和视频讲解。"],
  ["blog/git.html", "面向初学者的 Git 学习笔记，介绍版本控制、常用命令与协作流程。"],
  ["tools/code_runner.html", "在线代码展示与运行工具，支持多语言编辑、代码高亮、隔离执行和结果导出。"],
  ["tools/deep_learning.html", "深度学习学习资源导航，汇总 TensorFlow、PyTorch、Keras、课程、书籍和示例项目。"],
  ["tools/markdown_to_word.html", "Markdown 编辑、实时预览与文档导出工具，支持代码、公式和常用排版语法。"],
  ["tools/python_nav.html", "Python 学习资料导航，集中访问入门、数据类型、程序结构、面向对象与 PyTorch 笔记。"],
  ["tools/pytorch.html", "PyTorch 学习归档，整理 Dataset、Dataloader、网络结构、训练流程与 GPU 使用示例。"],
  ["tools/python/python三大程序结构.html", "Python 顺序、分支与循环三大程序结构的完整 Jupyter 学习笔记。"],
  ["tools/python/python入门.html", "Python 零基础入门 Jupyter 笔记，涵盖变量、输入输出、数据类型、程序结构与函数。"],
  ["tools/python/六大数据类型.html", "Python 六大数据类型及常用增删改查操作的 Jupyter 学习笔记。"],
  ["tools/python/面向对象编程.html", "Python 面向对象编程学习笔记，涵盖类、对象、继承、封装与常用示例。"]
]);

const legacyPageTitles = new Map([
  ["tools/pytorch.html", "PyTorch 学习归档"],
  ["tools/python/python三大程序结构.html", "Python 三大程序结构"],
  ["tools/python/python入门.html", "Python 零基础入门"],
  ["tools/python/六大数据类型.html", "Python 六大数据类型"],
  ["tools/python/面向对象编程.html", "Python 面向对象编程"]
]);

const rootFiles = [
  "_headers",
  "_redirects",
  "404.html",
  "index.html",
  "dashboard.html",
  "profile.html",
  "resume.html",
  "research.html",
  "snapshot.html",
  "achievements.html",
  "services.html",
  "roadmap.html",
  "interview.html",
  "publications.html",
  "projects.html",
  "engineering-projects.html",
  "horizontal-projects.html",
  "materials.html",
  "blog.html",
  "ai.html",
  "api.html",
  "leave_message.html",
  "manifest.webmanifest",
  "robots.txt",
  "sitemap.xml"
];

// These are intentional public content/resource roots. Historical pages, build
// tooling and Netlify function source are not copied into the static publish dir.
const publicDirectories = [
  "css",
  "js",
  "vendor",
  "images",
  "files",
  "blog",
  "tools",
  "library",
  "cases",
  "handbook",
  "evidence"
];

// Third-party browser libraries are committed under vendor/ so production pages
// keep working when public CDNs are slow, blocked or unavailable. Source pages
// may still contain historical CDN URLs; the build normalises every published
// HTML file to the correct relative, same-origin asset path.
const externalAssetRules = [
  {
    pattern: /https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/[^/]+\/css\/all\.min\.css/gi,
    target: "vendor/fontawesome/css/all.min.css"
  },
  {
    pattern: /https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/codemirror\/[^/]+\/codemirror\.min\.css/gi,
    target: "vendor/codemirror/codemirror.min.css"
  },
  {
    pattern: /https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/codemirror\/[^/]+\/codemirror\.min\.js/gi,
    target: "vendor/codemirror/codemirror.min.js"
  },
  {
    pattern: /https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/codemirror\/[^/]+\/theme\/(monokai|dracula|material|solarized)\.min\.css/gi,
    target: (theme) => `vendor/codemirror/theme/${theme}.min.css`
  },
  {
    pattern: /https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/codemirror\/[^/]+\/mode\/(markdown|python|javascript|clike)\/\1\.min\.js/gi,
    target: (mode) => `vendor/codemirror/mode/${mode}.min.js`
  },
  {
    pattern: /https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/highlight\.js\/[^/]+\/highlight\.min\.js/gi,
    target: "vendor/highlight/highlight.min.js"
  },
  {
    pattern: /https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/highlight\.js\/[^/]+\/styles\/((?:base16\/)?[a-z0-9-]+)\.min\.css/gi,
    target: (theme) => `vendor/highlight/styles/${theme}.min.css`
  },
  {
    pattern: /https:\/\/(?:cdn\.jsdelivr\.net\/npm\/marked(?:@[^/]+)?\/marked\.min\.js|cdn\.jsdelivr\.net\/npm\/marked(?:@[^/]+)?\/lib\/marked\.umd\.js)/gi,
    target: "vendor/libs/marked.min.js"
  },
  {
    pattern: /https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/dompurify\/[^/]+\/purify\.min\.js/gi,
    target: "vendor/libs/purify.min.js"
  },
  {
    pattern: /https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/jspdf\/[^/]+\/jspdf\.umd\.min\.js/gi,
    target: "vendor/libs/jspdf.umd.min.js"
  },
  {
    pattern: /https:\/\/(?:cdnjs\.cloudflare\.com\/ajax\/libs\/html2canvas\/[^/]+|html2canvas\.hertzen\.com)\/dist\/html2canvas\.min\.js/gi,
    target: "vendor/libs/html2canvas.min.js"
  },
  {
    pattern: /https:\/\/(?:cdn\.jsdelivr\.net\/npm|unpkg\.com)\/docx(?:@[^/]+)?\/build\/(?:index(?:\.min)?\.js)/gi,
    target: "vendor/libs/docx.min.js"
  },
  {
    pattern: /https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/FileSaver\.js\/[^/]+\/FileSaver\.min\.js/gi,
    target: "vendor/libs/FileSaver.min.js"
  },
  {
    pattern: /https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/showdown\/[^/]+\/showdown\.min\.js/gi,
    target: "vendor/libs/showdown.min.js"
  },
  {
    pattern: /https:\/\/cdn\.jsdelivr\.net\/npm\/html-to-image(?:@[^/]+)?\/dist\/html-to-image\.min\.js/gi,
    target: "vendor/libs/html-to-image.min.js"
  },
  {
    pattern: /https:\/\/cdn\.jsdelivr\.net\/npm\/mathjax(?:@[^/]+)?\/es5\/tex-mml-chtml\.js/gi,
    target: "vendor/libs/tex-svg.js"
  },
  {
    pattern: /https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/pdf\.js\/[^/]+\/pdf\.min\.js/gi,
    target: "vendor/libs/pdf.min.js"
  },
  {
    pattern: /https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/mammoth\/[^/]+\/mammoth\.browser\.min\.js/gi,
    target: "vendor/libs/mammoth.browser.min.js"
  }
];

const primarySitePages = [
  "",
  "dashboard.html",
  "profile.html",
  "resume.html",
  "research.html",
  "snapshot.html",
  "achievements.html",
  "services.html",
  "roadmap.html",
  "interview.html",
  "publications.html",
  "projects.html",
  "engineering-projects.html",
  "horizontal-projects.html",
  "materials.html",
  "blog.html",
  "ai.html",
  "api.html",
  "leave_message.html"
];

const indexableGeneratedPages = new Set(protectedSitemapPages);
const generatedPlaceholderPrefixes = ["library/", "cases/", "handbook/", "evidence/"];
const explicitlyThinPages = new Set(["blog/paper-review-1.html"]);
const notebookHeadingPages = new Set([
  "tools/python/python三大程序结构.html",
  "tools/python/六大数据类型.html",
  "tools/python/面向对象编程.html"
]);
const supersededSourceAssets = new Set([
  "images/blog/baoyan/baoyan.png",
  "images/blog/25_skills/fig1.png",
  "images/movies/25_skills_movie.mp4"
]);
const skippedPublishPaths = new Set();

function normalizePath(value) {
  return value.split(path.sep).join("/").replace(/^\.\//, "");
}

function resetDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function isDevelopmentArtifact(relativePath, isDirectory) {
  const normalized = normalizePath(relativePath);
  const segments = normalized.toLowerCase().split("/");
  const basename = segments.at(-1) || "";
  const blockedSegments = new Set([
    ".git",
    ".netlify",
    ".ipynb_checkpoints",
    "node_modules",
    "old",
    "server",
    "scripts",
    "test",
    "tests",
    "tmp",
    "temp",
    "scratch",
    "__pycache__"
  ]);

  if (segments.some((segment) => blockedSegments.has(segment))) return true;
  if (isDirectory) return false;
  if (basename === "test.html" || basename === "test1.html") return true;
  if (/\.(?:ipynb|pyc|pyo|bak|orig|tmp|temp)$/i.test(basename)) return true;
  if (/^(?:\.ds_store|thumbs\.db|desktop\.ini)$/i.test(basename)) return true;
  if (/^~\$/.test(basename)) return true;
  if (/(?:^|[._-])(?:test|spec|tmp|temp|scratch)(?:[._-]|$)/i.test(basename)) return true;
  return false;
}

function shouldExcludeFromPublish(relativePath, isDirectory) {
  const normalized = normalizePath(relativePath);
  return isDevelopmentArtifact(normalized, isDirectory) || (!isDirectory && supersededSourceAssets.has(normalized));
}

function copyFile(relativePath) {
  const from = path.join(root, relativePath);
  const to = path.join(outDir, relativePath);
  if (!fs.existsSync(from)) throw new Error(`Required public file is missing: ${relativePath}`);
  if (shouldExcludeFromPublish(relativePath, false)) {
    skippedPublishPaths.add(normalizePath(relativePath));
    return;
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

function copyDir(relativePath) {
  const from = path.join(root, relativePath);
  const to = path.join(outDir, relativePath);
  if (!fs.existsSync(from)) throw new Error(`Required public directory is missing: ${relativePath}`);

  fs.cpSync(from, to, {
    recursive: true,
    filter(source) {
      const relativeSource = normalizePath(path.relative(root, source));
      const isDirectory = fs.statSync(source).isDirectory();
      const blocked = shouldExcludeFromPublish(relativeSource, isDirectory);
      if (blocked) skippedPublishPaths.add(relativeSource);
      return !blocked;
    }
  });
}

function collectFiles(dir, predicate = () => true) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { recursive: true })
    .map((entry) => path.join(dir, entry))
    .filter((target) => fs.existsSync(target) && fs.statSync(target).isFile() && predicate(target));
}

function outputPageForFile(relativeFile) {
  const normalized = normalizePath(relativeFile);
  if (normalized === "index.html") return "";
  if (normalized.endsWith("/index.html")) return normalized.replace(/index\.html$/, "");
  return normalized;
}

function outputFileForPage(page) {
  return page === ""
    ? "index.html"
    : page.endsWith("/")
      ? `${page}index.html`
      : page;
}

function isIndexablePage(relativeFile) {
  const page = outputPageForFile(relativeFile);
  if (relativeFile === "404.html" || explicitlyThinPages.has(page)) return false;
  if (generatedPlaceholderPrefixes.some((prefix) => page.startsWith(prefix))) {
    return indexableGeneratedPages.has(page);
  }
  return true;
}

function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function relativeHref(relativeFile, target) {
  const fromDir = path.posix.dirname(normalizePath(relativeFile));
  const href = path.posix.relative(fromDir === "." ? "" : fromDir, target);
  return href || path.posix.basename(target);
}

function rewriteExternalAssets(html, relativeFile) {
  let output = html;
  for (const rule of externalAssetRules) {
    output = output.replace(rule.pattern, (match, ...args) => {
      const captures = args.slice(0, -2);
      const target = typeof rule.target === "function"
        ? rule.target(...captures)
        : rule.target;
      return relativeHref(relativeFile, target);
    });
  }

  if (/<body\b[^>]*class=["'][^"']*legacy-page/i.test(output)) {
    output = output
      .replace(/<script\b[^>]*\bsrc=["']https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/require\.js\/[^"']+["'][^>]*>\s*<\/script>/gi, "")
      .replace(/<script\b[^>]*\bsrc=["']https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/mathjax\/2\.[^"']+["'][^>]*>\s*<\/script>/gi, "")
      .replace(/<script\b[^>]*\btype=["']text\/x-mathjax-config["'][^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<script\b[^>]*\btype=["']module["'][^>]*>[\s\S]*?import\(["']https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/mermaid\/[\s\S]*?<\/script>/gi, "");
  }

  return output;
}

function pageMatchesTarget(relativeFile, target, allowSectionLanding = false) {
  const current = outputPageForFile(relativeFile) || "index.html";
  const section = current.includes("/") ? current.split("/")[0] : "";
  const targetSection = target.includes("/") ? target.split("/")[0] : "";
  return target === current
    || (section && target === `${section}/index.html`)
    || (allowSectionLanding && section === "blog" && target === "blog.html")
    || (["library", "cases", "handbook", "evidence"].includes(section) && targetSection === section)
    || (allowSectionLanding && section === "tools" && target === "tools/api_lab.html");
}

function renderStaticHeader(relativeFile) {
  const link = (target) => escapeAttribute(relativeHref(relativeFile, target));
  const navigation = navigationGroups.map((item, index) => {
    const primaryCurrent = normalizePath(relativeFile) === item.href;
    const childVisualActive = item.children?.some(([, href]) => pageMatchesTarget(relativeFile, href, false)) || false;
    const active = pageMatchesTarget(relativeFile, item.href, true) || childVisualActive;
    const primaryClass = `site-nav-v2__primary${active ? " is-current" : ""}`;
    const current = primaryCurrent ? ' aria-current="page"' : "";
    if (!item.children) {
      return `<li><a class="${primaryClass}" href="${link(item.href)}" data-nav-path="${item.href}"${current}>${item.label}</a></li>`;
    }
    const id = `site-nav-panel-${index}`;
    const childLinks = item.children.map(([label, href, description]) => {
      const childActive = pageMatchesTarget(relativeFile, href, false);
      const childCurrent = normalizePath(relativeFile) === href && !(primaryCurrent && href === item.href);
      const childClass = childActive ? ' class="is-current"' : "";
      const childAriaCurrent = childCurrent ? ' aria-current="page"' : "";
      return `<a href="${link(href)}" data-nav-path="${href}"${childClass}${childAriaCurrent}><span>${label}</span><small>${description}</small></a>`;
    }).join("");
    return `<li class="site-nav-v2__cluster${active ? " has-current" : ""}">
      <div class="site-nav-v2__cluster-head">
        <a class="${primaryClass}" href="${link(item.href)}" data-nav-path="${item.href}"${current}>${item.label}</a>
        <button type="button" aria-controls="${id}" aria-label="显示${item.label}分类"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="m2.5 4.5 3.5 3 3.5-3" /></svg></button>
      </div>
      <div class="site-nav-v2__panel" id="${id}">${childLinks}</div>
    </li>`;
  }).join("");

  return `<header class="site-header-v2 is-static-shell" data-site-header>
    <div class="container site-header-v2__inner">
      <a class="site-brand-v2" href="${link("index.html")}" aria-label="孙远鸣个人成果网站首页">
        <span class="site-brand-v2__mark" aria-hidden="true">SYM<span>.</span></span>
        <span class="site-brand-v2__copy"><strong>孙远鸣</strong><small>Research × Engineering</small></span>
      </a>
      <nav class="site-nav-v2 site-nav-v2--static" id="site-navigation" aria-label="主导航" data-site-nav><ul>${navigation}</ul></nav>
      <div class="site-header-v2__actions">
        <a class="site-search-button" href="${link("sitemap.xml")}" aria-label="查看站点地图"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" /><path d="m13 13 4 4" /></svg></a>
        <a class="site-cv-button" href="${link("files/CV.pdf")}" target="_blank" rel="noopener noreferrer">CV <span>↗</span></a>
        <button class="site-menu-button" type="button" aria-expanded="false" aria-controls="site-navigation" aria-label="打开导航菜单"><span></span><span></span></button>
      </div>
    </div>
  </header>`;
}

function injectStaticSiteShell(html, relativeFile) {
  if (/<body\b[^>]*class=["'][^"']*legacy-page/i.test(html)) return html;
  if (!/<body\b/i.test(html) || !/(?:site-shell|home-v2)/i.test(html)) return html;

  let output = html;
  const skipLink = '<a class="skip-link-v2" href="#main-content">跳到主要内容</a>';
  const header = renderStaticHeader(relativeFile);
  const bodyHeader = /(<body\b[^>]*>\s*)(?:<a\b[^>]*class=["'][^"']*skip-link[^"']*["'][^>]*>[\s\S]*?<\/a>\s*)?<header\b[\s\S]*?<\/header>/i;
  if (bodyHeader.test(output)) {
    output = output.replace(bodyHeader, `$1${skipLink}\n${header}`);
  } else {
    output = output.replace(/(<body\b[^>]*>)/i, `$1\n${skipLink}\n${header}`);
  }
  output = output.replace(/<main(?![^>]*\bid=)([^>]*)>/i, '<main id="main-content"$1>');
  // Contextual side panels live inside the main landmark and should not announce
  // as additional top-level complementary landmarks.
  output = output
    .replace(/<aside\b/gi, "<div")
    .replace(/<\/aside>/gi, "</div>");
  return output;
}

function stripTags(value) {
  return String(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#\d+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function injectStaticLegacyShell(html, relativeFile) {
  if (!/<body\b[^>]*class=["'][^"']*legacy-page/i.test(html)) return html;
  const match = html.match(/<body\b([^>]*)>([\s\S]*?)<\/body>/i);
  if (!match) return html;

  const title = legacyPageTitles.get(relativeFile) || stripTags((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]) || "学习资料";
  let attributes = match[1];
  if (/\bclass=["']/i.test(attributes)) {
    attributes = attributes.replace(/\bclass=(["'])([^"']*)\1/i, (full, quote, classes) => `class=${quote}${classes} legacy-ready${quote}`);
  } else {
    attributes += ' class="legacy-page legacy-ready"';
  }
  if (!/\bid=["']/i.test(attributes)) attributes += ' id="top"';

  let bodyContent = match[2].replace(/<script\b[^>]*\bsrc=["'][^"']*js\/legacy\.js[^"']*["'][^>]*>\s*<\/script>/gi, "");
  const existingMain = bodyContent.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  if (existingMain) bodyContent = existingMain[1];
  bodyContent = bodyContent
    .replace(/<h1\b([^>]*)>([\s\S]*?)<\/h1>/gi, '<h2$1>$2</h2>')
    .replace(/(<code\b[^>]*?)\s+lang=(["'])(?:python|java|javascript|cpp|c\+\+|bash|shell)\2/gi, "$1")
    .replace(/<pre(?![^>]*\btabindex)([^>]*)>/gi, '<pre role="group" tabindex="0" aria-label="可横向滚动的代码示例"$1>');

  let previousHeadingLevel = 1;
  bodyContent = bodyContent.replace(/<h([2-6])\b([^>]*)>([\s\S]*?)<\/h\1>/gi, (full, rawLevel, attrs, content) => {
    const level = Math.min(Number(rawLevel), previousHeadingLevel + 1);
    previousHeadingLevel = level;
    return `<h${level}${attrs}>${content}</h${level}>`;
  });

  const tocItems = [];
  let headingIndex = 0;
  bodyContent = bodyContent.replace(/<(h[23])\b([^>]*)>([\s\S]*?)<\/\1>/gi, (full, tag, attrs, content) => {
    headingIndex += 1;
    let nextAttrs = attrs;
    const idMatch = attrs.match(/\bid=(["'])([^"']+)\1/i);
    const id = idMatch ? idMatch[2] : `legacy-section-${headingIndex}`;
    if (!idMatch) nextAttrs += ` id="${id}"`;
    if (tocItems.length < 14) tocItems.push([id, stripTags(content).replace(/¶/g, "").trim() || `Section ${headingIndex}`]);
    return `<${tag}${nextAttrs}>${content}</${tag}>`;
  });

  const href = (target) => escapeAttribute(relativeHref(relativeFile, target));
  const toc = tocItems.length
    ? tocItems.map(([id, label]) => `<a href="#${escapeAttribute(id)}">${escapeAttribute(label)}</a>`).join("")
    : '<span class="legacy-toc-empty">暂无目录</span>';
  const staticBody = `<header class="legacy-topbar"><div class="legacy-shell">
      <a class="legacy-brand" href="${href("index.html")}"><img src="${href("images/sym_photo.jpg")}" alt="孙远鸣" width="46" height="46"><span>孙远鸣作品集</span></a>
      <nav class="legacy-nav" aria-label="归档页面导航"><a href="${href("index.html")}">首页</a><a href="${href("projects.html")}">项目</a><a href="${href("blog.html")}">博客</a><a href="${href("tools/python_nav.html")}">Python导航</a><a href="${href("materials.html")}">材料</a></nav>
    </div></header>
    <main id="main-content"><section class="legacy-hero" aria-labelledby="legacy-page-title"><div class="legacy-shell"><div class="legacy-kicker">Archive / Learning Material</div><h1 id="legacy-page-title">${escapeAttribute(title)}</h1><p>这是从旧博客或学习资料中保留下来的页面，已接入统一的作品集阅读外壳，方便继续浏览、复盘和引用。</p></div></section>
    <div class="legacy-shell legacy-layout"><article class="legacy-content">${bodyContent}</article><nav class="legacy-toc" aria-label="页面目录"><div class="legacy-toc-title">Contents</div>${toc}</nav></div>
    <a class="legacy-back-top" href="#top" aria-label="返回顶部">↑</a></main>`;

  let output = html.replace(match[0], `<body${attributes}>${staticBody}</body>`);
  if (/<html\b[^>]*\blang=/i.test(output)) {
    output = output.replace(/(<html\b[^>]*\blang=)(["'])[^"']*\2/i, '$1"zh-CN"');
  } else {
    output = output.replace(/<html\b([^>]*)>/i, '<html lang="zh-CN"$1>');
  }
  return output;
}

const imageDimensionCache = new Map();

function readImageDimensions(target) {
  if (imageDimensionCache.has(target)) return imageDimensionCache.get(target);
  let dimensions = null;
  try {
    const extension = path.extname(target).toLowerCase();
    const data = fs.readFileSync(target);
    if (extension === ".png" && data.length >= 24 && data.toString("ascii", 1, 4) === "PNG") {
      dimensions = { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
    } else if ((extension === ".jpg" || extension === ".jpeg") && data.length >= 4) {
      let offset = 2;
      while (offset + 9 < data.length) {
        if (data[offset] !== 0xff) {
          offset += 1;
          continue;
        }
        const marker = data[offset + 1];
        if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
          dimensions = { width: data.readUInt16BE(offset + 7), height: data.readUInt16BE(offset + 5) };
          break;
        }
        if (marker === 0xd8 || marker === 0xd9 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
          offset += 2;
          continue;
        }
        const segmentLength = data.readUInt16BE(offset + 2);
        if (segmentLength < 2) break;
        offset += segmentLength + 2;
      }
    } else if (extension === ".gif" && data.length >= 10) {
      dimensions = { width: data.readUInt16LE(6), height: data.readUInt16LE(8) };
    } else if (extension === ".webp" && data.length >= 30 && data.toString("ascii", 0, 4) === "RIFF") {
      const chunk = data.toString("ascii", 12, 16);
      if (chunk === "VP8X") {
        dimensions = {
          width: 1 + data.readUIntLE(24, 3),
          height: 1 + data.readUIntLE(27, 3)
        };
      } else if (chunk === "VP8 " && data.length >= 30) {
        dimensions = {
          width: data.readUInt16LE(26) & 0x3fff,
          height: data.readUInt16LE(28) & 0x3fff
        };
      } else if (chunk === "VP8L" && data.length >= 25) {
        const bits = data.readUInt32LE(21);
        dimensions = {
          width: 1 + (bits & 0x3fff),
          height: 1 + ((bits >>> 14) & 0x3fff)
        };
      }
    } else if (extension === ".svg") {
      const source = data.toString("utf8", 0, Math.min(data.length, 32768));
      const svg = source.match(/<svg\b[^>]*>/i)?.[0] || "";
      const width = Number.parseFloat(svg.match(/\bwidth=["']([\d.]+)/i)?.[1] || "");
      const height = Number.parseFloat(svg.match(/\bheight=["']([\d.]+)/i)?.[1] || "");
      const viewBox = svg.match(/\bviewBox=["']\s*[-\d.]+[ ,]+[-\d.]+[ ,]+([\d.]+)[ ,]+([\d.]+)["']/i);
      dimensions = width > 0 && height > 0
        ? { width: Math.round(width), height: Math.round(height) }
        : viewBox
          ? { width: Math.round(Number(viewBox[1])), height: Math.round(Number(viewBox[2])) }
          : null;
    }
  } catch {
    dimensions = null;
  }
  if (!dimensions || dimensions.width <= 0 || dimensions.height <= 0) dimensions = null;
  imageDimensionCache.set(target, dimensions);
  return dimensions;
}

function resolveLocalImage(relativeFile, source) {
  if (!source || /^(?:data:|blob:|https?:|\/\/)/i.test(source)) return null;
  let decoded;
  try {
    decoded = decodeURIComponent(source.split(/[?#]/, 1)[0]);
  } catch {
    decoded = source.split(/[?#]/, 1)[0];
  }
  const target = decoded.startsWith("/")
    ? path.resolve(outDir, decoded.replace(/^\/+/, ""))
    : path.resolve(outDir, path.dirname(relativeFile), decoded);
  const relativeTarget = path.relative(outDir, target);
  if (relativeTarget.startsWith("..") || path.isAbsolute(relativeTarget) || !fs.existsSync(target)) return null;
  return target;
}

function ensureImageMetadata(html, relativeFile) {
  let index = 0;
  return html.replace(/<img\b([^>]*)>/gi, (full, attributes) => {
    index += 1;
    const selfClosing = /\/\s*$/.test(attributes);
    let next = selfClosing ? attributes.replace(/\s*\/\s*$/, "") : attributes.trimEnd();
    if (!/\bdecoding=/i.test(next)) next += ' decoding="async"';
    if (index > 1 && !/\bloading=/i.test(next)) next += ' loading="lazy"';
    if (!/\bwidth=/i.test(next) || !/\bheight=/i.test(next)) {
      const source = next.match(/\bsrc=(["'])(.*?)\1/i)?.[2] || "";
      const target = resolveLocalImage(relativeFile, source);
      const dimensions = target ? readImageDimensions(target) : null;
      if (dimensions) {
        if (!/\bwidth=/i.test(next)) next += ` width="${dimensions.width}"`;
        if (!/\bheight=/i.test(next)) next += ` height="${dimensions.height}"`;
      }
    }
    return `<img${next}${selfClosing ? " /" : ""}>`;
  });
}

function upsertHeadTag(html, matcher, tag) {
  if (matcher.test(html)) return html.replace(matcher, tag);
  return html.replace(/<\/head>/i, `    ${tag}\n</head>`);
}

function findMetaContent(html, attribute, value) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  const wanted = tags.find((tag) => new RegExp(`\\b${attribute}=["']${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`, "i").test(tag));
  if (!wanted) return "";
  const match = wanted.match(/\bcontent=(["'])([\s\S]*?)\1/i);
  return match ? match[2].trim() : "";
}

function injectSeoMetadata(html, relativeFile, siteUrl) {
  const page = outputPageForFile(relativeFile);
  const canonicalUrl = encodeURI(`${siteUrl}/${page}`);
  const escapedUrl = escapeAttribute(canonicalUrl);
  const robots = isIndexablePage(relativeFile) ? "index,follow" : "noindex,follow";
  const pageTitle = stripTags((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]) || "孙远鸣个人成果网站";
  const description = findMetaContent(html, "name", "description")
    || pageDescriptions.get(relativeFile)
    || `${pageTitle}：孙远鸣的研究、工程、写作与可验证成果档案。`;
  const socialImage = findMetaContent(html, "property", "og:image")
    || `${siteUrl}/images/profile/sun-yuanming-portrait.jpg`;

  let output = rewriteExternalAssets(html, relativeFile).replaceAll(DEFAULT_SITE_URL, siteUrl);
  output = injectStaticLegacyShell(output, relativeFile);
  output = injectStaticSiteShell(output, relativeFile);
  output = ensureImageMetadata(output, relativeFile);
  if (notebookHeadingPages.has(relativeFile)) {
    let headingIndex = 0;
    output = output.replace(/<h1\b([^>]*)>([\s\S]*?)<\/h1>/gi, (match, attributes, content) => {
      headingIndex += 1;
      return headingIndex === 1 ? match : `<h2${attributes}>${content}</h2>`;
    });
  }
  output = upsertHeadTag(
    output,
    /<link(?=[^>]*\brel=["']canonical["'])[^>]*>/i,
    `<link rel="canonical" href="${escapedUrl}">`
  );
  output = upsertHeadTag(
    output,
    /<meta(?=[^>]*\bproperty=["']og:url["'])[^>]*>/i,
    `<meta property="og:url" content="${escapedUrl}">`
  );
  output = upsertHeadTag(
    output,
    /<meta(?=[^>]*\bname=["']robots["'])[^>]*>/i,
    `<meta name="robots" content="${robots}">`
  );
  output = upsertHeadTag(
    output,
    /<meta(?=[^>]*\bname=["']description["'])[^>]*>/i,
    `<meta name="description" content="${escapeAttribute(description)}">`
  );
  output = upsertHeadTag(
    output,
    /<meta(?=[^>]*\bproperty=["']og:description["'])[^>]*>/i,
    `<meta property="og:description" content="${escapeAttribute(description)}">`
  );
  output = upsertHeadTag(
    output,
    /<meta(?=[^>]*\bproperty=["']og:image["'])[^>]*>/i,
    `<meta property="og:image" content="${escapeAttribute(socialImage.replaceAll(DEFAULT_SITE_URL, siteUrl))}">`
  );
  output = upsertHeadTag(
    output,
    /<meta(?=[^>]*\bname=["']twitter:card["'])[^>]*>/i,
    '<meta name="twitter:card" content="summary_large_image">'
  );
  return output;
}

function rewriteHtmlMetadata(siteUrl) {
  const htmlFiles = collectFiles(outDir, (target) => target.toLowerCase().endsWith(".html"));
  for (const target of htmlFiles) {
    const relativeFile = normalizePath(path.relative(outDir, target));
    const html = fs.readFileSync(target, "utf8");
    fs.writeFileSync(target, injectSeoMetadata(html, relativeFile, siteUrl), "utf8");
  }
  return htmlFiles.length;
}

function collectSitemapPages() {
  const pages = [...primarySitePages, ...protectedSitemapPages];
  for (const directory of ["blog", "tools"]) {
    const directoryPath = path.join(outDir, directory);
    for (const target of collectFiles(directoryPath, (file) => file.toLowerCase().endsWith(".html"))) {
      const relativeFile = normalizePath(path.relative(outDir, target));
      if (isIndexablePage(relativeFile)) pages.push(outputPageForFile(relativeFile));
    }
  }

  return Array.from(new Set(pages)).filter((page) => {
    const file = path.join(outDir, outputFileForPage(page));
    return fs.existsSync(file) && isIndexablePage(normalizePath(path.relative(outDir, file)));
  });
}

function pagePriority(page) {
  if (page === "") return "1.0";
  if (["publications.html", "engineering-projects.html", "horizontal-projects.html", "resume.html"].includes(page)) return "0.9";
  if (page.startsWith("evidence/horizontal-projects/")) return "0.8";
  if (page.startsWith("blog/")) return "0.7";
  if (page.startsWith("tools/")) return "0.6";
  return "0.8";
}

function writeSitemapAndRobots(siteUrl) {
  const pages = collectSitemapPages();
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((page) => `  <url><loc>${encodeURI(`${siteUrl}/${page}`)}</loc><priority>${pagePriority(page)}</priority></url>`).join("\n")}
</urlset>
`;
  fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemap, "utf8");
  fs.writeFileSync(path.join(outDir, "robots.txt"), `User-agent: *
Allow: /
Disallow: /old/
Disallow: /test.html
Disallow: /test1.html
Disallow: /*.ipynb$

Sitemap: ${siteUrl}/sitemap.xml
`, "utf8");
  return pages.length;
}

function validateBuildOutput() {
  const outputFiles = collectFiles(outDir).map((target) => normalizePath(path.relative(outDir, target)));
  const forbidden = outputFiles.filter((file) => shouldExcludeFromPublish(file, false));
  if (forbidden.length) {
    throw new Error(`Non-public source artifacts leaked into dist: ${forbidden.join(", ")}`);
  }

  const staleDomainFiles = outputFiles.filter((file) => {
    if (!/\.(?:html?|css|js|json|xml|txt|webmanifest)$/i.test(file)) return false;
    return fs.readFileSync(path.join(outDir, file), "utf8").includes(STALE_SITE_HOST);
  });
  if (staleDomainFiles.length) {
    throw new Error(`Stale production host leaked into dist: ${staleDomainFiles.join(", ")}`);
  }

  const externalRuntimeFiles = outputFiles.filter((file) => {
    if (!file.startsWith("js/") || !file.endsWith(".js")) return false;
    return /https:\/\/(?:cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com|html2canvas\.hertzen\.com)\//i
      .test(fs.readFileSync(path.join(outDir, file), "utf8"));
  });
  if (externalRuntimeFiles.length) {
    throw new Error(`Published JavaScript still depends on a public CDN: ${externalRuntimeFiles.join(", ")}`);
  }

  for (const page of protectedSitemapPages.slice(1)) {
    if (!fs.existsSync(path.join(outDir, page))) {
      throw new Error(`Protected project page missing from dist: ${page}`);
    }
  }

  const horizontalIndexPath = path.join(outDir, "evidence", "horizontal-projects", "index.html");
  const horizontalIndex = fs.readFileSync(horizontalIndexPath, "utf8");
  for (const page of protectedSitemapPages.slice(1)) {
    const filename = path.posix.basename(page);
    if (!horizontalIndex.includes(`href="${filename}`)) {
      throw new Error(`Protected project entry missing from generated index: ${filename}`);
    }
  }

  const sitemap = fs.readFileSync(path.join(outDir, "sitemap.xml"), "utf8");
  if (/\/old\/|\/test1?\.html|\.ipynb|\/library\/|\/cases\/|\/handbook\//i.test(sitemap)) {
    throw new Error("Sitemap contains a historical, test, notebook or generated placeholder URL.");
  }

  for (const relativeFile of outputFiles.filter((file) => file.endsWith(".html"))) {
    const html = fs.readFileSync(path.join(outDir, relativeFile), "utf8");
    const visibleHtml = html.replace(/<!--[\s\S]*?-->/g, "");
    const canonicalCount = (html.match(/<link(?=[^>]*\brel=["']canonical["'])[^>]*>/gi) || []).length;
    const robotsCount = (html.match(/<meta(?=[^>]*\bname=["']robots["'])[^>]*>/gi) || []).length;
    const openGraphUrlCount = (html.match(/<meta(?=[^>]*\bproperty=["']og:url["'])[^>]*>/gi) || []).length;
    if (canonicalCount !== 1 || robotsCount !== 1 || openGraphUrlCount !== 1) {
      throw new Error(`SEO metadata must appear exactly once in ${relativeFile}.`);
    }

    if (/<(?:link|script)\b[^>]*(?:href|src)=["']https:\/\/(?:cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com|html2canvas\.hertzen\.com)\//i.test(html)) {
      throw new Error(`A known CDN stylesheet or script remains in ${relativeFile}.`);
    }

    if (/<img\b[^>]*\/\s+(?:decoding|loading|width|height)=/i.test(visibleHtml)) {
      throw new Error(`Image metadata was appended after a self-closing slash in ${relativeFile}.`);
    }

    const staticHeader = visibleHtml.match(/<header\b[^>]*\bdata-site-header\b[^>]*>[\s\S]*?<\/header>/i)?.[0] || "";
    if (staticHeader) {
      const pageCurrentCount = (staticHeader.match(/\baria-current=["']page["']/gi) || []).length;
      if (pageCurrentCount > 1) {
        throw new Error(`Static navigation has multiple aria-current=page items in ${relativeFile}.`);
      }
      if (/<div\b[^>]*\bclass=["'][^"']*site-nav-v2__panel[^"']*["'][^>]*(?:\binert\b|\baria-hidden=["']true["'])/i.test(staticHeader)) {
        throw new Error(`Static navigation panels are unavailable without JavaScript in ${relativeFile}.`);
      }
    }

    for (const imageTag of visibleHtml.match(/<img\b[^>]*>/gi) || []) {
      const source = imageTag.match(/\bsrc=(["'])(.*?)\1/i)?.[2] || "";
      if (/^(?:https?:|\/\/)/i.test(source)) {
        throw new Error(`External image hotlink remains in ${relativeFile}: ${source}`);
      }
      const target = resolveLocalImage(relativeFile, source);
      if (target && (!/\bwidth=["']?\d+/i.test(imageTag) || !/\bheight=["']?\d+/i.test(imageTag))) {
        throw new Error(`Local image lacks intrinsic dimensions in ${relativeFile}: ${source}`);
      }
    }
  }

  for (const page of collectSitemapPages()) {
    const relativeFile = outputFileForPage(page);
    const html = fs.readFileSync(path.join(outDir, relativeFile), "utf8");
    const h1Count = (html.match(/<h1\b[^>]*>/gi) || []).length;
    const descriptionCount = (html.match(/<meta(?=[^>]*\bname=["']description["'])[^>]*\bcontent=["'][^"']+["'][^>]*>/gi) || []).length;
    const openGraphImageCount = (html.match(/<meta(?=[^>]*\bproperty=["']og:image["'])[^>]*\bcontent=["'][^"']+["'][^>]*>/gi) || []).length;
    if (h1Count !== 1) {
      throw new Error(`Indexable page must contain exactly one H1: ${relativeFile}.`);
    }
    if (descriptionCount !== 1 || openGraphImageCount !== 1) {
      throw new Error(`Indexable page is missing a unique description or og:image: ${relativeFile}.`);
    }
  }

  const staticFallbackChecks = new Map([
    ["publications.html", /<div\b[^>]*\bdata-publications\b[^>]*>([\s\S]*?)<\/div>/i],
    ["engineering-projects.html", /<div\b[^>]*\bdata-projects\b[^>]*>([\s\S]*?)<\/div>/i],
    ["horizontal-projects.html", /<div\b[^>]*\bdata-projects\b[^>]*>([\s\S]*?)<\/div>/i],
    ["tools/api_lab.html", /<div\b[^>]*\bdata-api-grid\b[^>]*>([\s\S]*?)<\/div>/i],
    ["tools/resume_builder.html", /<div\b[^>]*\bid=["']sectionItems["'][^>]*>([\s\S]*?)<\/div>/i],
    ["ai.html", /<div\b[^>]*\bdata-ai-sessions\b[^>]*>([\s\S]*?)<\/div>/i]
  ]);
  for (const [relativeFile, matcher] of staticFallbackChecks) {
    const html = fs.readFileSync(path.join(outDir, relativeFile), "utf8");
    const content = html.match(matcher);
    if (!content || !stripTags(content[1])) {
      throw new Error(`Required no-JavaScript fallback is empty in ${relativeFile}.`);
    }
  }

  for (const relativeFile of legacyPageTitles.keys()) {
    const legacyHtml = fs.readFileSync(path.join(outDir, relativeFile), "utf8");
    if (!/<html\b[^>]*\blang=["']zh-CN["']/i.test(legacyHtml)) {
      throw new Error(`Legacy archive must declare html lang=zh-CN: ${relativeFile}.`);
    }
  }
}

function reportLargeAssets() {
  const warningBytes = 10 * 1024 * 1024;
  const largeAssets = collectFiles(outDir)
    .map((target) => ({
      path: normalizePath(path.relative(outDir, target)),
      bytes: fs.statSync(target).size
    }))
    .filter((asset) => asset.bytes > warningBytes)
    .sort((a, b) => b.bytes - a.bytes);

  for (const asset of largeAssets) {
    console.warn(`Performance warning: ${asset.path} is ${(asset.bytes / 1024 / 1024).toFixed(1)} MB.`);
  }
}

resetDir(outDir);
rootFiles.forEach(copyFile);
publicDirectories.forEach(copyDir);

const siteUrl = (
  process.env.SITE_URL ||
  process.env.URL ||
  process.env.DEPLOY_PRIME_URL ||
  DEFAULT_SITE_URL
).replace(/\/$/, "");

const htmlCount = rewriteHtmlMetadata(siteUrl);
const sitemapCount = writeSitemapAndRobots(siteUrl);
validateBuildOutput();
reportLargeAssets();

console.log(`Static site built to ${path.relative(root, outDir)}: ${htmlCount} HTML files, ${sitemapCount} indexed URLs, ${skippedPublishPaths.size} non-public source artifacts excluded.`);
