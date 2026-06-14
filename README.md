# Symgo Personal Portfolio

孙远鸣的个人博客与学术展示站，面向求职、申博、科研交流和横向合作展示。站点使用纯静态 HTML/CSS/JavaScript 构建，并通过 Netlify 白名单构建发布到 `dist`。

## 页面结构

- `index.html`: 首页，总览研究、工程、项目证据和材料入口。
- `dashboard.html`: 作品集仪表盘，总览页面、项目、材料和发布质量。
- `profile.html`: 个人档案，展示能力矩阵、技术栈和成长路线。
- `resume.html`: 阶段成果档案，整合本科阶段完整简历，并预留研究生阶段成果。
- `research.html`: 研究方向，展示问题意识、方法栈和未来课题。
- `snapshot.html`: 一页式档案，适合快速发给导师、HR 或合作方。
- `achievements.html`: 成就与证明，预留奖项、证书、工程成果和内容成果。
- `publications.html`: 论文发表页，支持年份、类型、关键词筛选和 PDF 入口。
- `projects.html`: 项目总览入口，分流到工程项目和横向项目两个独立页面。
- `engineering-projects.html`: 工程项目页，展示独立开发、工具构建、API 接入和部署维护能力。
- `horizontal-projects.html`: 横向项目页，展示需求理解、材料治理、协作交付和验收证据。
- `materials.html`: 材料库，可筛选搜索 CV、论文、项目证据、升学资料和工具演示。
- `services.html`: 合作与能力服务，说明可提供的展示站、材料整理和 AI 原型能力。
- `roadmap.html`: 路线图，说明真实材料替换、项目证据增强和动态能力升级计划。
- `interview.html`: 面试故事库，用 STAR 结构整理项目讲法。
- `blog.html`: 博客列表页，保留真实文章入口，并使用更短的卡片布局。
- `ai.html`: AI 学术助手页面，API Key 仅保存在访问者浏览器本地。
- `leave_message.html`: 本地留言板，留言保存到访问者浏览器 `localStorage`。

## 内容维护

论文、项目、能力矩阵、材料库、成就、服务、路线图和面试故事集中维护在 `js/site-data.js`。

- 修改 `publications` 数组可更新论文题目、发表位置、级别、摘要、标签和 PDF 链接。
- 修改 `projects` 数组可更新项目名称、分类、技术栈、具体工作、产出价值和链接。
- 修改 `materials` 数组可更新 CV、论文、项目证据、升学资料和工具入口。
- 修改 `interviewStories` 数组可更新 STAR 面试讲法。

## Netlify 部署

Netlify 构建命令:

```bash
node scripts/build-static.js
```

发布目录:

```bash
dist
```

`dist` 使用白名单构建，只发布站点需要的页面、样式、脚本、图片、文件、博客和工具目录。构建脚本会根据 Netlify 的 `URL` / `DEPLOY_PRIME_URL` 自动重写 sitemap、robots 和页面 canonical/OG URL。

## 安全说明

`ai.html` 不硬编码任何真实 API Key。首次使用时在页面中输入 DeepSeek API Key，并保存到本机浏览器即可。静态站点不要把真实密钥提交到仓库。
