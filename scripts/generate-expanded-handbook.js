const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const handbookDir = path.join(root, "handbook");

const categories = [
  {
    slug: "engineering",
    title: "工程能力手册",
    icon: "fa-code-branch",
    topics: [
      "静态站信息架构", "响应式布局验收", "组件化 CSS 组织", "导航状态管理", "命令面板交互",
      "本地状态持久化", "API Key 安全边界", "Netlify 白名单构建", "SEO 元数据策略", "404 与重定向",
      "资源路径治理", "构建脚本维护", "Git 提交流程", "部署故障排查", "浏览器验收方法",
      "无障碍语义结构", "打印样式设计", "移动端卡片布局", "主题切换机制", "长页面阅读反馈"
    ]
  },
  {
    slug: "research",
    title: "研究表达手册",
    icon: "fa-microscope",
    topics: [
      "研究问题拆解", "个人学术档案挖掘", "RAG 知识库原型", "文档问答评估", "材料标签体系",
      "可解释能力画像", "论文贡献表达", "研究计划结构", "导师沟通材料", "实验想法记录",
      "阅读笔记索引", "方法栈说明", "数据集占位规范", "代码仓库证据", "投稿状态展示",
      "学术网页 SEO", "研究路线图", "跨学科合作表达", "HCI 展示评估", "知识管理场景"
    ]
  },
  {
    slug: "career",
    title: "求职申博手册",
    icon: "fa-user-graduate",
    topics: [
      "简历证据层", "一页式档案", "HR 快速判断入口", "导师邮件入口", "项目 STAR 讲法",
      "技术栈可信表达", "论文页补充说明", "材料库分类", "证书奖项占位", "英文 CV 规划",
      "岗位匹配页面", "面试前复盘", "经历时间线", "能力矩阵呈现", "联系方式布局",
      "下载材料治理", "申请清单维护", "常见追问 FAQ", "自我介绍脚本", "长期更新策略"
    ]
  },
  {
    slug: "collaboration",
    title: "横向合作手册",
    icon: "fa-handshake",
    topics: [
      "需求访谈提纲", "合作边界说明", "交付物定义", "验收材料设计", "项目汇报页面",
      "企业知识库原型", "实验室成果看板", "权限与隐私边界", "资料归档流程", "RAG 方案表达",
      "静态演示原型", "成本估算说明", "风险清单", "维护计划", "协作沟通记录",
      "阶段性里程碑", "用户反馈收集", "数据可视化入口", "文档引用追溯", "成果对外展示"
    ]
  },
  {
    slug: "content",
    title: "内容运营手册",
    icon: "fa-pen-nib",
    topics: [
      "博客短卡片策略", "文章分类筛选", "标签云维护", "资料下载入口", "升学经验沉淀",
      "Git 教程整理", "Python 学习导航", "深度学习材料", "Markdown 工具说明", "代码高亮展示",
      "内容更新日志", "文章封面治理", "长文阅读体验", "FAQ 写作方法", "知识库索引",
      "材料替换流程", "图文证据组织", "读者路径设计", "搜索关键词优化", "可复用模板"
    ]
  },
  {
    slug: "product",
    title: "产品化迭代手册",
    icon: "fa-layer-group",
    topics: [
      "作品集产品定位", "页面地图规划", "核心指标定义", "访问路径设计", "证据模块优先级",
      "MVP 到产品化", "版本更新节奏", "质量验收清单", "用户视角审查", "视觉系统一致性",
      "信息密度控制", "功能边界取舍", "长期维护成本", "公开部署策略", "自动化生成内容",
      "静态与动态取舍", "Serverless 升级路线", "国际化版本", "性能预算", "下一轮迭代计划"
    ]
  }
];

const chapterNames = [
  "适用场景",
  "核心问题",
  "页面证据",
  "实现要点",
  "可追问细节",
  "后续增强",
  "风险与边界",
  "维护清单"
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function paragraph(category, topic, chapter, index) {
  return `${topic}属于${category.title}中的关键模块。${chapter}需要回答的不只是“有没有做”，还要说明它在求职、申博、科研交流或横向合作中证明了什么能力。当前站点已经提供了首页、仪表盘、档案、研究、论文、项目、材料库、知识库、案例库和面试故事等入口，后续维护时可以把真实截图、PDF、代码仓库、实验数据、导师反馈或项目验收材料继续补进来。第 ${index + 1} 条检查应当能被页面链接、文件路径、构建产物或浏览器验收结果证明。`;
}

function pageTemplate(category, topic, topicIndex) {
  const chapters = chapterNames.map((chapter, index) => `
                <article class="handbook-section">
                    <div class="handbook-marker">${String(index + 1).padStart(2, "0")}</div>
                    <div>
                        <h2>${chapter}</h2>
                        <p>${paragraph(category, topic, chapter, index)}</p>
                        <ul>
                            <li>把抽象能力绑定到具体页面，例如项目页、材料库、研究方向或案例备忘录。</li>
                            <li>避免只写口号，优先补链接、截图、PDF、仓库、时间线和可复盘描述。</li>
                            <li>如果当前仍是占位内容，要保留明确替换路径和下一步维护动作。</li>
                        </ul>
                    </div>
                </article>`).join("\n");

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${topic} - ${category.title} - 孙远鸣个人作品集扩展手册。">
    <title>${topic} | ${category.title}</title>
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
                    <li><a href="../index.html" class="active">扩展手册</a></li>
                    <li><a href="../../projects.html">项目</a></li>
                    <li><a href="../../materials.html">材料</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main>
        <section class="page-hero">
            <div class="container">
                <div class="eyebrow"><i class="fas ${category.icon}"></i> ${category.title} / ${String(topicIndex + 1).padStart(2, "0")}</div>
                <h1>${topic}</h1>
                <p>这一页是扩展手册中的专题说明，用来把单个能力点拆成可展示、可追问、可维护的证据结构。</p>
            </div>
        </section>

        <section class="section-band">
            <div class="container">
                <div class="handbook-layout">
${chapters}
                </div>
            </div>
        </section>
    </main>

    <footer class="site-footer"><div class="container"><div class="footer-bottom"><p>&copy; 2026 孙远鸣. Expanded handbook.</p></div></div></footer>
    <script src="../../js/main.js"></script>
</body>
</html>`;
}

function categoryIndex(category) {
  const cards = category.topics.map((topic, index) => {
    const file = `${String(index + 1).padStart(2, "0")}-${slugify(topic)}.html`;
    return `
                    <article class="surface-card">
                        <div class="card-icon"><i class="fas ${category.icon}"></i></div>
                        <span class="section-kicker">${String(index + 1).padStart(2, "0")}</span>
                        <h3>${topic}</h3>
                        <p>围绕${topic}整理场景、证据、实现、追问和维护清单。</p>
                        <a class="text-link" href="${file}">打开专题 <i class="fas fa-arrow-right"></i></a>
                    </article>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${category.title}索引 - 孙远鸣个人作品集扩展手册。">
    <title>${category.title} | 扩展手册</title>
    <link rel="stylesheet" href="../../css/style.css">
    <link rel="stylesheet" href="../../css/dropdown.css">
    <link rel="stylesheet" href="../../css/site.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="manifest" href="../../manifest.webmanifest">
</head>
<body class="site-shell">
    <header><div class="container"><a class="site-brand" href="../../index.html"><img src="../../images/sym_photo.jpg" alt="孙远鸣个人照片" class="profile-img"><div class="profile-info"><h1>孙远鸣</h1><p class="title">Computer Science / Software Engineering</p><p class="keywords">研究 · 工程 · 写作</p></div></a><nav><ul><li><a href="../../index.html">首页</a></li><li><a href="../../dashboard.html">仪表盘</a></li><li><a href="../index.html" class="active">扩展手册</a></li><li><a href="../../projects.html">项目</a></li><li><a href="../../materials.html">材料</a></li></ul></nav></div></header>
    <main>
        <section class="page-hero"><div class="container"><div class="eyebrow"><i class="fas ${category.icon}"></i> Expanded Handbook</div><h1>${category.title}</h1><p>这一类专题用于补充个人站的能力证明和维护说明。</p></div></section>
        <section class="section-band"><div class="container"><div class="focus-grid">${cards}</div></div></section>
    </main>
    <footer class="site-footer"><div class="container"><div class="footer-bottom"><p>&copy; 2026 孙远鸣. Expanded handbook.</p></div></div></footer>
    <script src="../../js/main.js"></script>
</body>
</html>`;
}

function rootIndex() {
  const cards = categories.map((category) => `
                    <article class="surface-card">
                        <div class="card-icon"><i class="fas ${category.icon}"></i></div>
                        <h3>${category.title}</h3>
                        <p>包含 ${category.topics.length} 个专题页面，覆盖${category.topics.slice(0, 3).join("、")}等内容。</p>
                        <a class="text-link" href="${category.slug}/index.html">进入分类 <i class="fas fa-arrow-right"></i></a>
                    </article>`).join("\n");

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="孙远鸣个人作品集扩展手册，覆盖工程、研究、求职、合作、内容和产品化迭代。">
    <title>扩展手册 | 孙远鸣</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/dropdown.css">
    <link rel="stylesheet" href="../css/site.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="manifest" href="../manifest.webmanifest">
</head>
<body class="site-shell">
    <header><div class="container"><a class="site-brand" href="../index.html"><img src="../images/sym_photo.jpg" alt="孙远鸣个人照片" class="profile-img"><div class="profile-info"><h1>孙远鸣</h1><p class="title">Computer Science / Software Engineering</p><p class="keywords">研究 · 工程 · 写作</p></div></a><nav><ul><li><a href="../index.html">首页</a></li><li><a href="../dashboard.html">仪表盘</a></li><li><a href="index.html" class="active">扩展手册</a></li><li><a href="../projects.html">项目</a></li><li><a href="../materials.html">材料</a></li></ul></nav></div></header>
    <main>
        <section class="page-hero"><div class="container"><div class="eyebrow"><i class="fas fa-book"></i> Expanded Handbook</div><h1>扩展手册</h1><p>围绕工程、研究、求职、合作、内容和产品化迭代，生成可浏览、可维护、可继续替换真实材料的大规模专题库。</p></div></section>
        <section class="section-band"><div class="container"><div class="focus-grid">${cards}</div></div></section>
    </main>
    <footer class="site-footer"><div class="container"><div class="footer-bottom"><p>&copy; 2026 孙远鸣. Expanded handbook.</p></div></div></footer>
    <script src="../js/main.js"></script>
</body>
</html>`;
}

ensureDir(handbookDir);
fs.writeFileSync(path.join(handbookDir, "index.html"), rootIndex(), "utf8");
for (const category of categories) {
  const categoryDir = path.join(handbookDir, category.slug);
  ensureDir(categoryDir);
  fs.writeFileSync(path.join(categoryDir, "index.html"), categoryIndex(category), "utf8");
  category.topics.forEach((topic, index) => {
    const file = `${String(index + 1).padStart(2, "0")}-${slugify(topic)}.html`;
    fs.writeFileSync(path.join(categoryDir, file), pageTemplate(category, topic, index), "utf8");
  });
}

const totalPages = 1 + categories.length + categories.reduce((sum, category) => sum + category.topics.length, 0);
console.log(`Generated ${totalPages} expanded handbook pages in ${path.relative(root, handbookDir)}`);
