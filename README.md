# Symgo Personal Portfolio

孙远鸣的个人博客与学术展示站，面向求职、申博和科研/横向合作展示。站点使用纯静态 HTML/CSS/JavaScript 构建，可部署到 Netlify。

## 主要页面

- `index.html`: 个人主页，展示研究方向、工程能力、论文入口、项目入口和联系方式。
- `publications.html`: 论文发表页，支持年份、类型、关键词筛选，并提供 PDF 占位下载入口。
- `projects.html`: 项目展示页，按工程项目和横向项目组织 case study。
- `blog.html`: 博客列表页，保留真实文章入口，并使用更短的卡片布局。
- `ai.html`: AI 学术助手页面，API Key 仅保存在访问者浏览器本地。
- `leave_message.html`: 本地留言板，留言保存到访问者浏览器 localStorage。

## 内容维护

论文和项目数据集中维护在 `js/site-data.js`:

- 修改 `publications` 数组可更新论文题目、发表位置、级别、摘要、标签和 PDF 链接。
- 修改 `projects` 数组可更新项目名称、分类、技术栈、具体工作、产出价值和链接。
- 真实论文 PDF 建议放到 `files/papers/`，再更新对应 `pdf` 字段。

## Netlify 部署

仓库包含 Netlify 配置:

- `netlify.toml`
- `_headers`
- `scripts/build-static.js`

Netlify 构建命令:

```bash
node scripts/build-static.js
```

发布目录:

```bash
dist
```

`dist` 使用白名单构建，只发布博客需要的页面、样式、脚本、图片、文件、博客和工具目录，不会公开 `old/`、`server/`、`test*.html` 等历史或开发文件。

## 安全说明

`ai.html` 不硬编码任何真实 API Key。首次使用时在页面中输入 DeepSeek API Key 并保存到本机浏览器即可。静态站点不要把真实密钥提交到仓库。
