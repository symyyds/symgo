const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const caseDir = path.join(root, "cases");

const cases = [
  ["portfolio-information-architecture", "作品集信息架构", "如何把旧博客重组为证据型作品集。"],
  ["publication-evidence-page", "论文证据页", "如何展示论文级别、贡献、摘要、PDF 和相关项目。"],
  ["engineering-case-study", "工程项目 Case Study", "如何把项目从简历条目扩展成可追问档案。"],
  ["horizontal-project-brief", "横向项目说明", "如何表达需求理解、合作交付和验收意识。"],
  ["material-library", "材料库", "如何把 CV、论文、项目和升学资料集中检索。"],
  ["academic-ai-assistant", "学术 AI 助手", "如何设计静态站里的文档问答原型。"],
  ["api-key-safety", "API Key 安全", "如何避免在静态仓库中暴露真实密钥。"],
  ["netlify-whitelist-build", "Netlify 白名单构建", "如何只发布需要公开的静态文件。"],
  ["seo-basics", "SEO 基础", "如何补 canonical、OG、manifest、robots 和 sitemap。"],
  ["responsive-audit", "响应式验收", "如何用桌面和移动端检查横向溢出。"],
  ["command-palette", "命令面板", "如何让访问者快速跳到关键页面。"],
  ["dark-mode", "明暗主题", "如何给个人站增加不打扰的主题切换。"],
  ["reading-progress", "阅读进度", "如何增强长文章和项目页的阅读反馈。"],
  ["interview-star", "STAR 面试故事", "如何把项目经历整理为可表达结构。"],
  ["research-agenda", "研究方向页", "如何把兴趣、问题和方法栈讲清楚。"],
  ["one-page-snapshot", "一页式档案", "如何快速给导师或 HR 一个判断入口。"],
  ["achievement-proof", "成就证明", "如何把成果绑定到可访问证据。"],
  ["service-boundary", "合作边界", "如何说明自己能提供什么和不做什么。"],
  ["roadmap", "路线图", "如何公开下一步迭代计划。"],
  ["changelog", "更新日志", "如何体现长期维护而不是一次性模板。"]
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function memoTemplate(slug, title, summary, index) {
  const questions = [
    "这个模块解决了什么具体问题？",
    "它在求职、申博或横向合作里证明什么能力？",
    "如果面试官追问，应该展开哪些技术细节？",
    "当前版本还有什么占位内容需要后续替换？",
    "下一步如何把它从展示升级为更真实的证据？"
  ];
  const blocks = questions.map((question, i) => `
                <article class="case-block">
                    <span class="case-step">${String(i + 1).padStart(2, "0")}</span>
                    <div>
                        <h2>${question}</h2>
                        <p>${summary} 这一模块的价值不在于单独增加一个页面，而在于把经历、材料、工程和表达连接起来。后续维护时，应继续补充截图、真实链接、指标、PDF 或代码仓库，让它从“说明”变成“证据”。</p>
                    </div>
                </article>`).join("\n");

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${title}案例备忘录 - 孙远鸣个人作品集。">
    <title>${title} | 案例备忘录</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/dropdown.css">
    <link rel="stylesheet" href="../css/site.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="manifest" href="../manifest.webmanifest">
</head>
<body class="site-shell">
    <header><div class="container"><a class="site-brand" href="../index.html"><img src="../images/sym_photo.jpg" alt="孙远鸣个人照片" class="profile-img"><div class="profile-info"><h1>孙远鸣</h1><p class="title">Computer Science / Software Engineering</p><p class="keywords">研究 · 工程 · 写作</p></div></a><nav><ul><li><a href="../index.html">首页</a></li><li><a href="../dashboard.html">仪表盘</a></li><li><a href="index.html" class="active">案例库</a></li><li><a href="../projects.html">项目</a></li><li><a href="../materials.html">材料</a></li></ul></nav></div></header>
    <main>
        <section class="page-hero"><div class="container"><div class="eyebrow"><i class="fas fa-file-lines"></i> Case Memo ${String(index + 1).padStart(2, "0")}</div><h1>${title}</h1><p>${summary}</p></div></section>
        <section class="section-band"><div class="container"><div class="case-block-list">${blocks}</div></div></section>
    </main>
    <footer class="site-footer"><div class="container"><div class="footer-bottom"><p>&copy; 2026 孙远鸣. Case memo.</p></div></div></footer>
    <script src="../js/main.js"></script>
</body>
</html>`;
}

function indexTemplate() {
  const cards = cases.map(([slug, title, summary], index) => `
                    <article class="surface-card">
                        <div class="card-icon"><i class="fas fa-file-lines"></i></div>
                        <span class="section-kicker">CASE ${String(index + 1).padStart(2, "0")}</span>
                        <h3>${title}</h3>
                        <p>${summary}</p>
                        <a class="text-link" href="${slug}.html">阅读备忘录 <i class="fas fa-arrow-right"></i></a>
                    </article>`).join("\n");
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="孙远鸣作品集案例备忘录索引。">
    <title>案例备忘录 | 孙远鸣</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/dropdown.css">
    <link rel="stylesheet" href="../css/site.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="manifest" href="../manifest.webmanifest">
</head>
<body class="site-shell">
    <header><div class="container"><a class="site-brand" href="../index.html"><img src="../images/sym_photo.jpg" alt="孙远鸣个人照片" class="profile-img"><div class="profile-info"><h1>孙远鸣</h1><p class="title">Computer Science / Software Engineering</p><p class="keywords">研究 · 工程 · 写作</p></div></a><nav><ul><li><a href="../index.html">首页</a></li><li><a href="../dashboard.html">仪表盘</a></li><li><a href="index.html" class="active">案例库</a></li><li><a href="../projects.html">项目</a></li><li><a href="../materials.html">材料</a></li></ul></nav></div></header>
    <main>
        <section class="page-hero"><div class="container"><div class="eyebrow"><i class="fas fa-layer-group"></i> Case Memos</div><h1>案例备忘录</h1><p>这些页面用于把每个产品模块都变成可追问、可复盘的说明材料。</p></div></section>
        <section class="section-band"><div class="container"><div class="focus-grid">${cards}</div></div></section>
    </main>
    <footer class="site-footer"><div class="container"><div class="footer-bottom"><p>&copy; 2026 孙远鸣. Case memos.</p></div></div></footer>
    <script src="../js/main.js"></script>
</body>
</html>`;
}

ensureDir(caseDir);
fs.writeFileSync(path.join(caseDir, "index.html"), indexTemplate(), "utf8");
cases.forEach(([slug, title, summary], index) => {
  fs.writeFileSync(path.join(caseDir, `${slug}.html`), memoTemplate(slug, title, summary, index), "utf8");
});

console.log(`Generated ${cases.length + 1} case memo pages in ${path.relative(root, caseDir)}`);
