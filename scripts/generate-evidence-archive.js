const fs = require("fs");
const path = require("path");
const {
  protectedHorizontalProjects,
  protectedEvidenceRelativeFiles
} = require("./site-governance");

const root = path.resolve(__dirname, "..");
const evidenceDir = path.join(root, "evidence");
const dryRun = process.argv.includes("--dry-run");

// These hand-authored, evidence-backed records live outside the generated
// placeholder data. The shared governance manifest also drives build validation.
const protectedEvidencePaths = new Set(protectedEvidenceRelativeFiles);
const plannedWrites = [];

const categories = [
  {
    slug: "engineering-projects",
    title: "工程项目证据",
    icon: "fa-code-branch",
    description: "把独立开发、前端实现、工具建设、部署维护和质量验收拆成可追问证据。",
    items: [
      ["symgo-portfolio", "Symgo 个人博客重构", "把旧博客升级为求职、申博和横向合作都能使用的静态作品集。"],
      ["academic-ai-assistant", "学术 AI 助手原型", "在静态站内提供文档解析、问答、Markdown 输出和本地会话管理。"],
      ["resume-builder", "在线简历制作工具", "把学生简历写作拆成结构化输入、模块提示和可导出模板。"],
      ["markdown-workbench", "Markdown 材料工作台", "把学习笔记、项目复盘和申请材料转换成更规整的文档结构。"],
      ["code-runner", "代码高亮与运行展示", "为技术笔记提供可复制、可展示、可讲解的代码片段体验。"],
      ["python-navigation", "Python 学习导航", "将学习路径、工具入口和重点知识整理成可持续维护页面。"],
      ["deep-learning-materials", "深度学习资料导航", "用静态目录承载算法、框架、论文和学习计划。"],
      ["static-build-system", "静态构建白名单", "通过构建脚本只发布可公开目录，避免把历史文件和后端草稿一起部署。"],
      ["portfolio-command-palette", "作品集快速导航", "为访问者提供搜索式跳转入口，降低深层材料的定位成本。"],
      ["responsive-audit-kit", "响应式验收工具链", "用桌面、移动端、链接扫描和构建产物检查页面质量。"],
      ["local-data-persistence", "本地状态持久化", "把主题、留言、AI 会话和 API Key 限定在浏览器本地。"],
      ["netlify-delivery", "Netlify 静态交付", "围绕 headers、redirects、sitemap 和发布目录建立公开部署流程。"]
    ]
  },
  {
    slug: "horizontal-projects",
    title: "横向合作证据",
    icon: "fa-handshake",
    description: "把需求理解、沟通协作、交付边界、验收材料和长期维护写成合作方看得懂的档案。",
    items: [
      ["enterprise-knowledge-base", "企业知识库方案", "面向企业资料沉淀、问答检索和权限边界的轻量知识库方案。"],
      ["lab-outcome-dashboard", "实验室成果看板", "把论文、项目、成员、数据和资源下载集中到一个展示型看板。"],
      ["document-qa-delivery", "文档问答交付方案", "为合作方说明资料上传、检索、引用追溯和评估验收流程。"],
      ["project-reporting-page", "项目汇报页面", "将阶段进度、交付物、问题清单和下一步计划做成静态汇报页。"],
      ["data-visualization-entry", "数据可视化入口", "用低维护图表和指标卡呈现合作项目的关键状态。"],
      ["prototype-acceptance-pack", "原型验收材料包", "定义截图、流程、测试结果、用户反馈和版本记录的交付标准。"],
      ["collaboration-boundary", "合作边界说明", "提前说明能做什么、依赖什么、哪些内容不适合静态公开。"],
      ["meeting-note-system", "协作会议记录体系", "把会议纪要、待办、决策、风险和验收结论形成可追溯链条。"],
      ["risk-register", "横向项目风险清单", "整理数据、权限、口径、时间、维护和沟通风险。"],
      ["cost-estimation-note", "成本估算说明", "把一次性交付、长期维护和功能升级拆成可讨论范围。"],
      ["external-demo-site", "对外演示站", "用静态站快速搭建可公开展示、可替换材料的合作成果入口。"],
      ["handover-playbook", "项目交接手册", "确保合作结束后资料、权限、代码和维护说明能被接手。"]
    ]
  },
  {
    slug: "publication-research",
    title: "论文与研究证据",
    icon: "fa-microscope",
    description: "把论文、手稿、研究计划、阅读笔记、方法栈和实验想法变成可证明的学术材料。",
    items: [
      ["publication-slot-a", "论文展示位 A", "展示论文题目、发表位置、级别、贡献、摘要和 PDF 占位。"],
      ["publication-slot-b", "论文展示位 B", "为在投、预印本或课程论文保留完整学术档案位置。"],
      ["publication-slot-c", "论文展示位 C", "面向未来替换真实 DOI、PDF、代码和数据链接。"],
      ["rag-research-note", "RAG 研究笔记", "围绕轻量知识库、引用追溯和幻觉控制整理研究线索。"],
      ["academic-profile-mining", "个人学术档案挖掘", "从简历、项目、博客和论文中抽取可解释能力画像。"],
      ["hci-portfolio-evaluation", "作品集 HCI 评估", "评估访问者在页面中定位材料、理解项目和形成判断的成本。"],
      ["method-stack-map", "方法栈地图", "把信息抽取、文本检索、前端工程和实验评估放进同一个研究框架。"],
      ["reading-note-index", "阅读笔记索引", "维护论文阅读、技术博客、工具文档和实验想法之间的关系。"],
      ["dataset-placeholder", "数据集占位规范", "为未来公开或脱敏数据集预留说明、权限和引用位置。"],
      ["experiment-log", "实验想法日志", "记录问题、假设、变量、评估方式和失败复盘。"],
      ["advisor-brief", "导师沟通材料", "将研究兴趣、已有证据、计划问题和可合作方向整理成页面。"],
      ["submission-tracker", "投稿状态追踪", "展示投稿阶段、审稿反馈、修改计划和材料更新。"]
    ]
  },
  {
    slug: "application-materials",
    title: "求职申博材料",
    icon: "fa-user-graduate",
    description: "把简历之外的补充材料、导师邮件、一页式档案、面试故事和申请清单集中管理。",
    items: [
      ["cv-chinese", "中文 CV 证据链", "把教育、项目、论文、技能、奖项和链接与站内页面绑定。"],
      ["cv-english", "英文 CV 规划", "为海外项目、英文岗位或国际合作准备英文材料结构。"],
      ["one-page-snapshot", "一页式档案", "给导师或 HR 一个不需要浏览全站也能快速判断的入口。"],
      ["advisor-email-kit", "导师邮件材料包", "把自我介绍、研究兴趣、论文项目和附件链接整理清楚。"],
      ["interview-star-bank", "面试 STAR 故事库", "将项目经历拆成情境、任务、行动、结果和复盘。"],
      ["job-match-matrix", "岗位匹配矩阵", "把目标岗位要求与已有项目、技能、材料对应起来。"],
      ["application-checklist", "申请清单", "维护学校、导师、岗位、截止时间、材料状态和追踪动作。"],
      ["award-certificate-slot", "证书奖项占位", "预留奖项、证书、比赛、课程成绩和证明文件展示位。"],
      ["recommendation-entry", "推荐材料入口", "方便推荐人或合作方快速定位个人亮点和证明材料。"],
      ["self-intro-script", "自我介绍脚本", "准备 30 秒、2 分钟和 5 分钟不同长度的表达版本。"],
      ["faq-followup", "常见追问 FAQ", "提前回答项目真实性、技术细节、研究动机和未来计划。"],
      ["material-update-log", "材料更新日志", "记录每次替换 PDF、截图、描述和链接的原因。"]
    ]
  },
  {
    slug: "content-writing",
    title: "内容与表达证据",
    icon: "fa-pen-nib",
    description: "把博客、教程、复盘、学习路径和长文阅读体验作为长期表达能力的证明。",
    items: [
      ["baoyan-guide", "保研经验整理", "把流程、平台、术语、材料和时间轴整理成可阅读指南。"],
      ["interview-skills", "复试技巧文章", "围绕复试材料、导师联系和面试表达提供结构化经验。"],
      ["git-tutorial", "Git 教程笔记", "把版本管理知识转化为适合学生和新手使用的工具笔记。"],
      ["blog-card-system", "博客卡片系统", "控制标题、摘要、图片和按钮尺寸，避免文章列表过长。"],
      ["content-taxonomy", "内容分类体系", "用教程、工具、笔记、项目复盘和材料更新组织文章。"],
      ["writing-style-guide", "写作风格指南", "保持标题、摘要、标签、时间和入口的统一表达。"],
      ["long-form-reading", "长文阅读体验", "通过阅读进度、目录、视觉层级和段落宽度优化长内容。"],
      ["knowledge-index", "知识索引页", "把文章、项目、材料、研究笔记和 FAQ 串成可搜索入口。"],
      ["update-journal", "更新日志", "让访问者看到站点不是一次性模板，而是持续维护的作品。"],
      ["visual-proof-writing", "图文证据组织", "把截图、PDF、代码链接和结果指标嵌入内容叙事。"],
      ["reader-path", "读者路径设计", "让 HR、导师、合作方和同学都能按自己的目标进入材料。"],
      ["reusable-template", "可复用模板", "维护项目复盘、论文说明、合作 brief 和材料说明模板。"]
    ]
  },
  {
    slug: "product-system",
    title: "产品化系统证据",
    icon: "fa-layer-group",
    description: "把个人站当作一个长期产品维护，强调信息架构、指标、路线图和版本迭代。",
    items: [
      ["portfolio-product-positioning", "作品集产品定位", "明确站点服务于求职、申博、横向合作和长期写作。"],
      ["site-map-governance", "页面地图治理", "管理首页、档案、研究、论文、项目、材料、博客和工具之间的关系。"],
      ["bento-evidence-layout", "Bento 证据布局", "用模块化网格呈现重点内容，兼顾扫描效率和视觉秩序。"],
      ["navigation-minimalism", "极简导航策略", "减少主导航负担，把深层页面放进命令面板和索引库。"],
      ["dark-mode-system", "明暗主题系统", "让站点在不同屏幕和阅读时间里保持舒适对比度。"],
      ["seo-metadata-system", "SEO 元数据系统", "维护 canonical、OG、Twitter Card、sitemap 和 robots。"],
      ["quality-dashboard", "质量仪表盘", "集中呈现页面数量、材料状态、待替换内容和验收结果。"],
      ["version-roadmap", "版本路线图", "规划真实材料替换、英语版本、Serverless 升级和项目截图补充。"],
      ["accessibility-pass", "无障碍检查", "关注语义结构、按钮标签、颜色对比和键盘导航。"],
      ["performance-budget", "性能预算", "控制图片、第三方脚本、页面体量和构建输出。"],
      ["deployment-playbook", "部署操作手册", "记录本地构建、Git 推送、Netlify 发布和失败排查。"],
      ["content-governance", "内容治理节奏", "定义每月维护哪些页面、替换哪些占位、归档哪些过期材料。"]
    ]
  },
  {
    slug: "technical-stack",
    title: "技术栈证据",
    icon: "fa-terminal",
    description: "把使用过的前端、构建、文档处理、AI 接入和部署技术与实际页面绑定。",
    items: [
      ["html-semantics", "HTML 语义结构", "用清晰的 header、main、section、article 和 footer 构建可读页面。"],
      ["css-system", "CSS 设计系统", "维护颜色变量、卡片、网格、按钮、响应式断点和打印样式。"],
      ["javascript-rendering", "JavaScript 数据渲染", "通过数据数组渲染论文、项目、材料和动态交互。"],
      ["static-generators", "Node 静态生成脚本", "用脚本生成知识库、案例库、手册和证据库页面。"],
      ["pdf-placeholders", "PDF 占位与替换", "为论文、CV、研究计划和材料保留可点击文件入口。"],
      ["localstorage-pattern", "LocalStorage 模式", "处理主题、AI 历史、留言和 API Key 的本地状态。"],
      ["fontawesome-icons", "Font Awesome 图标系统", "为按钮、卡片、导航和状态标签提供统一视觉锚点。"],
      ["responsive-grid", "响应式网格", "通过 minmax、断点和稳定尺寸避免移动端错位。"],
      ["link-scanner", "链接扫描脚本", "用 HTMLParser 检查相对链接是否存在，降低部署后 404 风险。"],
      ["browser-qa", "浏览器验收", "通过页面打开、控制台检查和横向溢出检测确认前端可用性。"],
      ["netlify-config", "Netlify 配置", "维护 publish 目录、构建命令、安全 headers 和重定向规则。"],
      ["git-delivery", "Git 交付流程", "用提交记录证明每一轮功能和材料迭代。"]
    ]
  },
  {
    slug: "maintenance-playbooks",
    title: "维护手册证据",
    icon: "fa-screwdriver-wrench",
    description: "把后续如何继续补真实材料、验收页面、处理风险和升级功能写成可执行流程。",
    items: [
      ["weekly-content-review", "每周内容巡检", "检查首页入口、论文、项目、材料、博客和工具是否有过期信息。"],
      ["pdf-replacement-flow", "PDF 替换流程", "替换占位 PDF 时同步更新标题、状态、链接和说明。"],
      ["project-screenshot-flow", "项目截图补充", "为重点项目补首屏、流程、后台、结果图和移动端截图。"],
      ["publication-update-flow", "论文状态更新", "投稿、接收、发表或撤稿时同步更新论文页和材料库。"],
      ["privacy-review", "隐私审查流程", "公开前检查电话、邮箱、PDF、截图和项目材料是否可公开。"],
      ["broken-link-audit", "坏链审计", "每次构建后扫描源站和 dist，确认相对链接都存在。"],
      ["mobile-overflow-audit", "移动端溢出审计", "抽检首页、博客、项目、论文和深层页面的宽度问题。"],
      ["copywriting-tightening", "文案压缩流程", "压缩太长的卡片摘要，保持页面专业、可扫、不过度堆叠。"],
      ["navigation-refresh", "导航刷新流程", "新增页面后同步更新导航、命令面板、sitemap 和首页入口。"],
      ["deploy-rollback-plan", "部署回滚方案", "如果 Netlify 发布失败，保留 Git 提交、构建日志和回退说明。"],
      ["english-version-plan", "英文版规划", "为申博、海外合作或英文岗位准备未来双语站点。"],
      ["serverless-upgrade-plan", "Serverless 升级计划", "当 AI 助手或留言需要共享数据时迁移到 Netlify Functions。"]
    ]
  }
];

const sectionNames = [
  "背景与目标",
  "我承担的工作",
  "技术与方法",
  "可验证证据",
  "可展示材料",
  "可追问问题",
  "后续替换计划",
  "求职申博讲法",
  "维护检查清单"
];

function ensureDir(dir) {
  if (!dryRun) fs.mkdirSync(dir, { recursive: true });
}

function relativeEvidencePath(target) {
  return path.relative(evidenceDir, target).split(path.sep).join("/");
}

function writeGeneratedFile(target, content) {
  const relativePath = relativeEvidencePath(target);
  if (protectedEvidencePaths.has(relativePath)) {
    throw new Error(`Refusing to overwrite protected evidence page: ${relativePath}`);
  }

  plannedWrites.push(relativePath);
  if (!dryRun) fs.writeFileSync(target, content, "utf8");
}

function validateProtectedProjects() {
  const missing = [];
  for (const project of protectedHorizontalProjects) {
    const relativePath = `horizontal-projects/${project.slug}.html`;
    if (!fs.existsSync(path.join(evidenceDir, relativePath))) missing.push(relativePath);
    const imagePath = path.join(root, "images", "horizontal-projects", project.image);
    if (!fs.existsSync(imagePath)) missing.push(`images/horizontal-projects/${project.image}`);
  }

  if (missing.length) {
    throw new Error(`Protected evidence asset(s) missing: ${missing.join(", ")}`);
  }
}

function curatedProjectCards(category) {
  if (category.slug !== "horizontal-projects") return "";

  return protectedHorizontalProjects.map((project) => `
                    <article class="surface-card">
                        <a class="horizontal-card-preview" href="${project.slug}.html#visual-proof">
                            <img src="../../images/horizontal-projects/${project.image}" alt="${escapeHtml(project.imageAlt)}" loading="lazy">
                        </a>
                        <div class="card-icon"><i class="fas ${project.icon}"></i></div>
                        <span class="section-kicker">REAL PROJECT</span>
                        <h3>${escapeHtml(project.title)}</h3>
                        <p>${escapeHtml(project.summary)}</p>
                        <div class="evidence-tag-row">${project.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
                        <div class="project-actions">
                            <a class="text-link" href="${project.slug}.html#evidence-dashboard">证据看板 <i class="fas fa-arrow-right"></i></a>
                            <a class="text-link" href="${project.slug}.html">完整档案 <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </article>`).join("\n");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function paragraph(category, item, section, index) {
  const [slug, title, summary] = item;
  const angle = [
    "它不是孤立的页面装饰，而是简历之外的证据层。",
    "它需要让访问者在几秒内理解背景，也能在追问时看到可落地细节。",
    "它适合继续补充真实截图、PDF、仓库、实验数据、部署记录或导师反馈。",
    "它的描述要同时服务 HR、导师、合作方和未来的自己维护材料。",
    "它需要保持边界清楚，公开材料只展示可以公开的事实和占位内容。"
  ][index % 5];

  return `${escapeHtml(title)} 属于「${escapeHtml(category.title)}」中的关键证据项。${escapeHtml(summary)} 在「${escapeHtml(section)}」这一层面，需要说明问题来源、个人职责、技术取舍、交付结果和后续可替换材料。${angle} 页面后续维护时，应把真实链接、文件路径、图文说明、质量验收和版本记录补充到同一条证据链中，避免经历只停留在简历的一行文字。`;
}

function bullets(item, index) {
  const [slug, title] = item;
  const suffix = [
    "补充真实截图、PDF 或代码仓库链接。",
    "补充时间、角色、协作者、约束和结果指标。",
    "补充可复盘的问题、失败尝试和改进动作。",
    "补充面试或导师沟通时最可能被追问的细节。"
  ];

  return suffix.map((text, i) => `<li>${escapeHtml(title)}：${text} 当前条目编号 ${String(index + 1).padStart(2, "0")}，可在后续材料更新中逐步替换占位说明。</li>`).join("\n");
}

function pageTemplate(category, item, itemIndex) {
  const [slug, title, summary] = item;
  const sections = sectionNames.map((section, index) => `
                <article class="evidence-section">
                    <div class="evidence-marker">${String(index + 1).padStart(2, "0")}</div>
                    <div>
                        <h2>${escapeHtml(section)}</h2>
                        <p>${paragraph(category, item, section, index)}</p>
                        <ul>
${bullets(item, index)}
                        </ul>
                    </div>
                </article>`).join("\n");

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${escapeHtml(title)} - ${escapeHtml(category.title)} - 孙远鸣个人作品集证据档案。">
    <title>${escapeHtml(title)} | ${escapeHtml(category.title)}</title>
    <link rel="stylesheet" href="../../css/style.css">
    <link rel="stylesheet" href="../../css/dropdown.css">
    <link rel="stylesheet" href="../../css/site.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="manifest" href="../../manifest.webmanifest">
</head>
<body class="site-shell">
    <header>
        <div class="container">
            <a class="site-brand" href="../../index.html">
                <img src="../../images/sym_photo.jpg" alt="孙远鸣个人照片" class="profile-img">
                <div class="profile-info">
                    <h1>孙远鸣</h1>
                    <p class="title">Computer Science / Software Engineering</p>
                    <p class="keywords">研究 · 工程 · 写作</p>
                </div>
            </a>
            <nav>
                <ul>
                    <li><a href="../../index.html">首页</a></li>
                    <li><a href="../../dashboard.html">仪表盘</a></li>
                    <li><a href="../index.html" class="active">证据库</a></li>
                    <li><a href="../../projects.html">项目</a></li>
                    <li><a href="../../materials.html">材料</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main>
        <section class="page-hero">
            <div class="container">
                <div class="eyebrow"><i class="fas ${category.icon}"></i> Evidence ${String(itemIndex + 1).padStart(2, "0")}</div>
                <h1>${escapeHtml(title)}</h1>
                <p>${escapeHtml(summary)}</p>
            </div>
        </section>

        <section class="section-band white">
            <div class="container">
                <div class="evidence-meta-grid">
                    <div class="evidence-meta"><span>Category</span><strong>${escapeHtml(category.title)}</strong></div>
                    <div class="evidence-meta"><span>Status</span><strong>可替换占位</strong></div>
                    <div class="evidence-meta"><span>Audience</span><strong>HR / 导师 / 合作方</strong></div>
                    <div class="evidence-meta"><span>Material</span><strong>截图 · PDF · 仓库 · 复盘</strong></div>
                </div>
            </div>
        </section>

        <section class="section-band">
            <div class="container">
                <div class="handbook-layout">
${sections}
                </div>
            </div>
        </section>
    </main>

    <footer class="site-footer">
        <div class="container">
            <div class="footer-bottom"><p>&copy; 2026 孙远鸣. Evidence archive.</p></div>
        </div>
    </footer>
    <script src="../../js/main.js"></script>
</body>
</html>`;
}

function categoryIndex(category) {
  const curatedCards = curatedProjectCards(category);
  const cards = category.items.map((item, index) => {
    const [slug, title, summary] = item;
    return `
                    <article class="surface-card">
                        <div class="card-icon"><i class="fas ${category.icon}"></i></div>
                        <span class="section-kicker">EVIDENCE ${String(index + 1).padStart(2, "0")}</span>
                        <h3>${escapeHtml(title)}</h3>
                        <p>${escapeHtml(summary)}</p>
                        <div class="evidence-tag-row"><span>可追问</span><span>可替换</span><span>可展示</span></div>
                        <a class="text-link" href="${slug}.html">打开档案 <i class="fas fa-arrow-right"></i></a>
                    </article>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${escapeHtml(category.title)}索引 - 孙远鸣个人作品集证据档案。">
    <title>${escapeHtml(category.title)} | 证据档案库</title>
    <link rel="stylesheet" href="../../css/style.css">
    <link rel="stylesheet" href="../../css/dropdown.css">
    <link rel="stylesheet" href="../../css/site.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="manifest" href="../../manifest.webmanifest">
</head>
<body class="site-shell">
    <header><div class="container"><a class="site-brand" href="../../index.html"><img src="../../images/sym_photo.jpg" alt="孙远鸣个人照片" class="profile-img"><div class="profile-info"><h1>孙远鸣</h1><p class="title">Computer Science / Software Engineering</p><p class="keywords">研究 · 工程 · 写作</p></div></a><nav><ul><li><a href="../../index.html">首页</a></li><li><a href="../../dashboard.html">仪表盘</a></li><li><a href="../index.html" class="active">证据库</a></li><li><a href="../../projects.html">项目</a></li><li><a href="../../materials.html">材料</a></li></ul></nav></div></header>
    <main>
        <section class="page-hero"><div class="container"><div class="eyebrow"><i class="fas ${category.icon}"></i> Evidence Archive</div><h1>${escapeHtml(category.title)}</h1><p>${escapeHtml(category.description)}</p></div></section>
        <section class="section-band">
            <div class="container">
                <div class="evidence-card-grid">
${curatedCards}
${cards}
                </div>
            </div>
        </section>
    </main>
    <footer class="site-footer"><div class="container"><div class="footer-bottom"><p>&copy; 2026 孙远鸣. Evidence archive.</p></div></div></footer>
    <script src="../../js/main.js"></script>
</body>
</html>`;
}

function rootIndex() {
  const cards = categories.map((category) => {
    const curatedCount = category.slug === "horizontal-projects" ? protectedHorizontalProjects.length : 0;
    const totalCount = category.items.length + curatedCount;
    return `
                    <article class="surface-card">
                        <div class="card-icon"><i class="fas ${category.icon}"></i></div>
                        <h3>${escapeHtml(category.title)}</h3>
                        <p>${escapeHtml(category.description)} 本分类包含 ${totalCount} 个档案，其中已核验项目与待补充材料明确分开。</p>
                        <div class="evidence-tag-row"><span>${totalCount} 个档案</span><span>证据链</span><span>长期维护</span></div>
                        <a class="text-link" href="${category.slug}/index.html">进入分类 <i class="fas fa-arrow-right"></i></a>
                    </article>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="孙远鸣个人作品集证据档案库，用于展示项目、论文、横向合作、求职申博材料和长期维护记录。">
    <title>证据档案库 | 孙远鸣</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/dropdown.css">
    <link rel="stylesheet" href="../css/site.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="manifest" href="../manifest.webmanifest">
</head>
<body class="site-shell">
    <header><div class="container"><a class="site-brand" href="../index.html"><img src="../images/sym_photo.jpg" alt="孙远鸣个人照片" class="profile-img"><div class="profile-info"><h1>孙远鸣</h1><p class="title">Computer Science / Software Engineering</p><p class="keywords">研究 · 工程 · 写作</p></div></a><nav><ul><li><a href="../index.html">首页</a></li><li><a href="../dashboard.html">仪表盘</a></li><li><a href="index.html" class="active">证据库</a></li><li><a href="../projects.html">项目</a></li><li><a href="../materials.html">材料</a></li></ul></nav></div></header>
    <main>
        <section class="page-hero"><div class="container"><div class="eyebrow"><i class="fas fa-boxes-stacked"></i> Evidence Archive</div><h1>证据档案库</h1><p>把项目、论文、横向合作、求职申博、内容表达、产品系统、技术栈和维护流程拆成可追问档案。这里的占位内容后续可以逐步替换为真实 PDF、截图、仓库、实验记录和验收材料。</p></div></section>
        <section class="section-band white">
            <div class="container">
                <div class="handbook-overview">
                    <div class="evidence-card-grid">
${cards}
                    </div>
                    <aside class="evidence-callout">
                        <h2>使用方式</h2>
                        <p>这不是普通文章列表，而是简历之外的材料索引。以后每完成一个项目、论文投稿、合作交付或材料替换，都可以补到对应档案里，形成可验证的个人成长证据链。</p>
                        <a class="text-link" href="../materials.html">查看材料库 <i class="fas fa-arrow-right"></i></a>
                    </aside>
                </div>
            </div>
        </section>
    </main>
    <footer class="site-footer"><div class="container"><div class="footer-bottom"><p>&copy; 2026 孙远鸣. Evidence archive.</p></div></div></footer>
    <script src="../js/main.js"></script>
</body>
</html>`;
}

validateProtectedProjects();
ensureDir(evidenceDir);
writeGeneratedFile(path.join(evidenceDir, "index.html"), rootIndex());

for (const category of categories) {
  const categoryDir = path.join(evidenceDir, category.slug);
  ensureDir(categoryDir);
  const indexHtml = categoryIndex(category);
  if (category.slug === "horizontal-projects") {
    for (const project of protectedHorizontalProjects) {
      if (!indexHtml.includes(`href="${project.slug}.html`)) {
        throw new Error(`Generated horizontal-projects index lost protected entry: ${project.slug}`);
      }
    }
  }
  writeGeneratedFile(path.join(categoryDir, "index.html"), indexHtml);
  category.items.forEach((item, index) => {
    writeGeneratedFile(path.join(categoryDir, `${item[0]}.html`), pageTemplate(category, item, index));
  });
}

const totalPages = 1 + categories.length + categories.reduce((sum, category) => sum + category.items.length, 0);
if (dryRun) {
  console.log(`Dry run validated ${plannedWrites.length} generated writes and ${protectedHorizontalProjects.length} protected project pages.`);
} else {
  console.log(`Generated ${totalPages} template/index pages while preserving ${protectedHorizontalProjects.length} protected project pages.`);
}
