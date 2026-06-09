const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const libraryDir = path.join(root, "library");

const sections = [
  {
    slug: "project-deep-dives",
    title: "项目深挖档案",
    eyebrow: "Project Deep Dives",
    icon: "fa-diagram-project",
    intro: "把代表项目拆成问题、约束、方案、技术、风险、复盘和可追问材料，方便面试或申博时展开。",
    items: [
      ["Symgo 展示站重构", "旧博客无法支撑求职/申博材料展示，需要重新组织信息架构。", "重构首页、项目、论文、材料库、研究方向、仪表盘、面试故事库和 Netlify 发布工程。"],
      ["学术 AI 助手", "阅读资料、整理问题、生成初稿时缺少统一工作流。", "实现本地会话、文档解析、Markdown 渲染、API Key 本地保存和可迁移后端建议。"],
      ["保研复试资料工具包", "升学资料容易散落在文档、表格、视频和口头经验中。", "把流程、术语、模板、技巧和下载入口组织成可访问资源。"],
      ["在线简历制作工具", "学生写简历时常常缺少结构化输入和示例参考。", "拆分教育、项目、技能、奖项模块，提供模板和后续 PDF 导出方向。"],
      ["企业知识库原型", "横向项目常见问题是资料散、口径乱、复用难。", "规划上传、分类、检索、问答、权限和追溯模块。"],
      ["实验室成果看板", "论文、项目、成员和数据统计缺少统一展示界面。", "设计成果概览、项目进度、资源下载和指标模块。"]
    ]
  },
  {
    slug: "research-notes",
    title: "研究笔记索引",
    eyebrow: "Research Notes",
    icon: "fa-microscope",
    intro: "围绕 AI 工具、知识管理、个人学术档案和展示型软件工程沉淀研究问题、阅读线索和实验想法。",
    items: [
      ["个人学术档案挖掘", "如何从简历、论文、项目和博客中抽取可解释能力画像。", "可结合信息抽取、表示学习、标签体系和人机协同编辑。"],
      ["RAG 知识库轻量化", "如何为小团队构建低维护成本的文档问答系统。", "重点关注引用追溯、权限边界、更新策略和幻觉控制。"],
      ["作品集信息架构", "如何让个人站不只是展示，而是成为可追问证据层。", "可评估首屏判断效率、材料定位时间和项目理解成本。"],
      ["AI 助手隐私策略", "静态站如何接入 API 又尽量不暴露密钥和敏感材料。", "可比较本地保存、Serverless 代理和用户自带 key 的取舍。"],
      ["面试叙事结构化", "如何把项目经历转化为 STAR 结构并减少表达遗漏。", "可建立项目证据、技术细节和结果指标之间的映射。"],
      ["横向项目展示", "如何把需求理解、协作交付和验收材料展示给外部读者。", "重点补充场景、角色、约束、交付物和维护成本。"]
    ]
  },
  {
    slug: "tech-stack",
    title: "技术栈说明书",
    eyebrow: "Technology Stack",
    icon: "fa-code",
    intro: "把站点里实际使用和后续可扩展的技术栈拆成学习、实践、证据和下一步升级。",
    items: [
      ["HTML/CSS/JavaScript", "用于纯静态站和工具页面的核心实现。", "重点展示语义化结构、响应式布局、数据驱动渲染和轻量交互。"],
      ["Netlify", "用于静态发布、headers、redirects、sitemap 和白名单构建。", "后续可接入 Forms、Functions、环境变量和 Git 自动部署。"],
      ["DeepSeek API", "用于学术助手问答与文档分析原型。", "当前采用用户本地输入 key，后续可迁移到 serverless proxy。"],
      ["PDF.js / Mammoth.js", "用于 PDF 和 Word 文档文本读取。", "适合展示对真实学习资料处理流程的理解。"],
      ["LocalStorage", "用于本地留言、AI 会话、主题偏好和 API Key 保存。", "适合静态站原型，但共享数据需要后端服务。"],
      ["GitHub", "用于版本管理、公开代码仓库和 Netlify Git 集成。", "后续可把项目 issue、release 和 changelog 接到展示站。"]
    ]
  },
  {
    slug: "application-materials",
    title: "求职申博材料清单",
    eyebrow: "Application Materials",
    icon: "fa-folder-open",
    intro: "把求职、申博、导师沟通和横向合作可能需要的材料拆成可维护清单。",
    items: [
      ["中文 CV", "用于国内求职、导师沟通和项目合作。", "需要持续更新教育经历、项目、论文、奖项和技能。"],
      ["英文 CV", "用于英文项目、海外申请或国际合作。", "后续建议补英文版页面和英文 PDF。"],
      ["研究计划", "用于申博和导师沟通。", "可基于 research.html 延展成 1-2 页 PDF。"],
      ["项目证明", "用于面试追问和合作展示。", "每个重点项目应至少包含背景、职责、技术、产出和链接。"],
      ["论文材料", "用于学术能力证明。", "补充 DOI、PDF、代码、数据集、作者贡献和投稿状态。"],
      ["推荐入口", "用于让对方快速判断你是否匹配。", "snapshot.html 可作为邮件或简历二维码入口。"]
    ]
  },
  {
    slug: "faq",
    title: "常见追问 FAQ",
    eyebrow: "Interview FAQ",
    icon: "fa-circle-question",
    intro: "提前整理面试官、导师或合作方可能问到的问题，让页面不仅展示材料，也辅助表达。",
    items: [
      ["你为什么做这个站？", "因为简历只能放摘要，无法展开论文、项目、材料和工具证据。", "这个站承担简历之外的证据层。"],
      ["为什么使用纯静态？", "个人展示站核心内容不依赖后端，纯静态更稳定、便宜、可迁移。", "需要共享留言或 API 代理时再接 Netlify Functions。"],
      ["AI 助手安全吗？", "目前真实 key 不写入源码，由访问者在本地浏览器保存。", "如果要长期公开使用，应改成后端代理和环境变量。"],
      ["项目是否都是真实完成？", "页面先保留可替换占位和真实已有模块，后续应逐步替换为真实截图、仓库和 PDF。", "材料库就是为了让证据持续补齐。"],
      ["横向项目为什么单独分类？", "横向项目重点不是单纯编码，而是需求理解、协作、交付和验收。", "分类后更容易展示合作能力。"],
      ["后续如何继续升级？", "路线图已经拆成真实材料替换、项目证据增强、动态能力升级和专项版本。", "每轮更新都应能被 Git 和页面证明。"]
    ]
  },
  {
    slug: "changelog",
    title: "站点更新日志",
    eyebrow: "Changelog",
    icon: "fa-clock-rotate-left",
    intro: "记录站点从旧博客到作品集系统的演进过程，体现长期维护和产品迭代意识。",
    items: [
      ["2026-06-09 第一轮", "重构首页，新增论文页、项目页、材料库和 Netlify 配置。", "从普通博客升级为学术展示站。"],
      ["2026-06-09 第二轮", "新增个人档案、研究方向、一页式档案、命令面板和主题切换。", "增强求职/申博场景入口。"],
      ["2026-06-09 第三轮", "新增仪表盘、成就、服务、路线图和面试故事库。", "让站点更像完整作品集产品。"],
      ["下一步", "替换真实论文 PDF、真实项目截图和英文版材料。", "提高可信度和国际化能力。"],
      ["下一步", "接入 Netlify Forms 或 Functions。", "让留言、AI 代理和材料检索具备动态能力。"],
      ["长期", "建立定期复盘和更新日志。", "保证网站不变成一次性模板。"]
    ]
  }
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function pageTemplate(section) {
  const cards = section.items.map(([title, problem, action], index) => `
                <article class="library-card">
                    <div class="library-index">${String(index + 1).padStart(2, "0")}</div>
                    <div>
                        <span class="section-kicker">${section.eyebrow}</span>
                        <h2>${title}</h2>
                        <p><strong>问题：</strong>${problem}</p>
                        <p><strong>处理：</strong>${action}</p>
                    </div>
                </article>`).join("\n");

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${section.title} - 孙远鸣个人作品集知识库。">
    <title>${section.title} | 孙远鸣</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/dropdown.css">
    <link rel="stylesheet" href="../css/site.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="manifest" href="../manifest.webmanifest">
</head>
<body class="site-shell">
    <header>
        <div class="container">
            <a class="site-brand" href="../index.html">
                <img src="../images/sym_photo.jpg" alt="孙远鸣个人照片" class="profile-img">
                <div class="profile-info">
                    <h1>孙远鸣</h1>
                    <p class="title">Computer Science / Software Engineering</p>
                    <p class="keywords">研究 · 工程 · 写作</p>
                </div>
            </a>
            <nav>
                <ul>
                    <li><a href="../index.html">首页</a></li>
                    <li><a href="../dashboard.html">仪表盘</a></li>
                    <li><a href="../projects.html">项目</a></li>
                    <li><a href="../materials.html">材料</a></li>
                    <li><a href="index.html" class="active">知识库</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main>
        <section class="page-hero">
            <div class="container">
                <div class="eyebrow"><i class="fas ${section.icon}"></i> ${section.eyebrow}</div>
                <h1>${section.title}</h1>
                <p>${section.intro}</p>
            </div>
        </section>

        <section class="section-band">
            <div class="container">
                <div class="library-list">
${cards}
                </div>
            </div>
        </section>
    </main>

    <footer class="site-footer"><div class="container"><div class="footer-bottom"><p>&copy; 2026 孙远鸣. Portfolio Library.</p></div></div></footer>
    <script src="../js/main.js"></script>
</body>
</html>
`;
}

function indexTemplate() {
  const links = sections.map((section) => `
                    <article class="surface-card">
                        <div class="card-icon"><i class="fas ${section.icon}"></i></div>
                        <h3>${section.title}</h3>
                        <p>${section.intro}</p>
                        <a class="text-link" href="${section.slug}.html">打开 <i class="fas fa-arrow-right"></i></a>
                    </article>`).join("\n");

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="孙远鸣个人作品集知识库，集中展示项目深挖、研究笔记、技术栈、申请材料、FAQ 和更新日志。">
    <title>作品集知识库 | 孙远鸣</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/dropdown.css">
    <link rel="stylesheet" href="../css/site.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="manifest" href="../manifest.webmanifest">
</head>
<body class="site-shell">
    <header><div class="container"><a class="site-brand" href="../index.html"><img src="../images/sym_photo.jpg" alt="孙远鸣个人照片" class="profile-img"><div class="profile-info"><h1>孙远鸣</h1><p class="title">Computer Science / Software Engineering</p><p class="keywords">研究 · 工程 · 写作</p></div></a><nav><ul><li><a href="../index.html">首页</a></li><li><a href="../dashboard.html">仪表盘</a></li><li><a href="../projects.html">项目</a></li><li><a href="../materials.html">材料</a></li><li><a href="index.html" class="active">知识库</a></li></ul></nav></div></header>
    <main>
        <section class="page-hero"><div class="container"><div class="eyebrow"><i class="fas fa-book-open"></i> Portfolio Library</div><h1>作品集知识库</h1><p>这里集中放项目深挖、研究笔记、技术栈说明、申请材料、FAQ 和更新日志，让站点从页面集合变成可维护知识系统。</p></div></section>
        <section class="section-band"><div class="container"><div class="focus-grid">${links}</div></div></section>
    </main>
    <footer class="site-footer"><div class="container"><div class="footer-bottom"><p>&copy; 2026 孙远鸣. Portfolio Library.</p></div></div></footer>
    <script src="../js/main.js"></script>
</body>
</html>
`;
}

ensureDir(libraryDir);
fs.writeFileSync(path.join(libraryDir, "index.html"), indexTemplate(), "utf8");
for (const section of sections) {
  fs.writeFileSync(path.join(libraryDir, `${section.slug}.html`), pageTemplate(section), "utf8");
}

console.log(`Generated ${sections.length + 1} library pages in ${path.relative(root, libraryDir)}`);
