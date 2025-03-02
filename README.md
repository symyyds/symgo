# 科研工作者个人网站模板

这是一个专为科研工作者设计的简洁、专业的个人网站模板，旨在帮助学者展示学术成果、研究方向和专业形象。网站采用纯HTML、CSS和简单JavaScript实现，无需复杂框架，易于维护和定制。

## 主要特点

- **学术展示**：突出研究领域、论文发表、学术活动
- **内容管理**：支持Markdown博客（技术报告、研究笔记）
- **专业联络**：清晰展示联系方式与学术履历
- **低维护成本**：无需编程知识，内容更新简单
- **响应式设计**：适配电脑、平板和手机等各种设备

## 文件结构

```
科研个人网站/
├── index.html              # 网站首页
├── about.html              # 关于我页面
├── publications.html       # 论文发表页面
├── blog.html               # 博客列表页面
├── resources.html          # 学术资源页面
├── contact.html            # 联系方式页面
├── blog/                   # 博客文章目录
│   └── paper-review-1.html # 示例博客文章
├── css/                    # 样式文件
│   └── style.css           # 主样式表
├── js/                     # JavaScript文件
│   └── main.js             # 主脚本文件
├── images/                 # 图片资源
│   ├── profile.jpg         # 个人照片
│   └── blog/               # 博客图片
└── files/                  # 可下载文件(PDF等)
    └── CV.pdf              # 简历
```

## 使用指南

### 基本网站设置

1. 修改个人信息：
   - 打开各HTML文件，更新姓名、职位、机构和研究领域
   - 替换 `images/profile.jpg` 为您的个人照片

2. 自定义配色：
   - 在 `css/style.css` 文件开头的 `:root` 部分修改颜色变量

### 添加论文

在 `publications.html` 文件中，使用以下模板添加您的论文：

```html
<div class="publication-item" data-year="年份" data-type="类型" data-topic="主题">
    <h3 class="publication-title">论文标题</h3>
    <p class="publication-authors"><strong>您的姓名</strong>, 合作者A, 合作者B</p>
    <p class="publication-journal">期刊名称, 卷(期), 页码</p>
    <p class="publication-abstract">摘要内容...</p>
    <div class="publication-links">
        <a href="#" class="pub-link"><i class="fas fa-external-link-alt"></i> 查看论文</a>
        <a href="#" class="pub-link"><i class="fas fa-download"></i> PDF下载</a>
        <!-- 根据需要添加更多链接 -->
    </div>
</div>
```

### 发布博客文章

1. **准备Markdown文件**：
   - 使用您喜欢的Markdown编辑器（如Obsidian、Typora）撰写文章
   - 包含标题、日期、分类和正文内容

2. **转换为HTML**：
   - 复制 `blog/paper-review-1.html` 作为模板
   - 更新元数据（标题、日期、分类等）
   - 将Markdown内容粘贴到 `blog-post-content` 区域中

3. **添加到博客列表**：
   - 在 `blog.html` 文件中添加新的博客卡片，链接到您的新文章

### 添加学术资源

在 `resources.html` 页面中，可以按类别添加有用的学术资源链接，包括数据库、工具、预印本平台等。

## 自定义建议

- **颜色方案**：调整 `css/style.css` 中的颜色变量以匹配您的机构或个人品牌
- **字体**：更改 `font-family` 属性以使用您喜欢的字体
- **图标**：本模板使用 Font Awesome 图标，可在 [Font Awesome网站](https://fontawesome.com/icons) 查找更多图标

## 维护提示

- 定期更新论文列表和学术成果
- 保持博客内容更新，分享研究见解和学术活动
- 确保所有链接都是有效的，特别是外部资源链接
- 检查并更新联系信息，以便潜在合作者能够联系到您

## 技术说明

- 本模板使用纯HTML、CSS和vanilla JavaScript构建
- 使用CSS变量实现一致的颜色主题
- 响应式布局适应不同屏幕尺寸
- 博客文章支持数学公式（使用KaTeX）和代码高亮（使用Prism.js）

## 支持

如有问题或需要帮助，请联系：

- 电子邮件：your-email@example.com
- 网站：https://your-website.com 