(function () {
    const publications = [
        {
            year: "2026",
            type: "preprint",
            level: "预印本 / 投稿准备",
            title: "Learning Robust Representations for Academic Profile Mining",
            authors: "Sun Yuanming, Collaborator A, Collaborator B",
            venue: "Manuscript in preparation",
            role: "第一作者",
            topic: "AI",
            abstract: "围绕学术履历、项目经历和文本材料的结构化抽取，设计可解释的表示学习流程，用于辅助简历增强与科研经历整理。",
            pdf: "files/papers/placeholder-profile-mining.pdf",
            code: "projects.html#academic-ai",
            tags: ["Representation Learning", "NLP", "Profile Mining"]
        },
        {
            year: "2025",
            type: "conference",
            level: "会议论文 / CCF待替换",
            title: "A Lightweight Toolkit for Interview-Oriented Knowledge Organization",
            authors: "Sun Yuanming, Collaborator C",
            venue: "Student Research Workshop, 2025",
            role: "项目负责人",
            topic: "Software Engineering",
            abstract: "将保研、考研复试和求职准备中的材料清单、项目陈述、问答准备整合为可复用工具链，强调低成本维护和可迁移展示。",
            pdf: "files/papers/placeholder-toolkit.pdf",
            code: "projects.html#interview-toolkit",
            tags: ["Knowledge Management", "Tooling", "Static Web"]
        },
        {
            year: "2024",
            type: "journal",
            level: "期刊论文 / 等级待替换",
            title: "Static Personal Websites as Extended Academic Portfolios",
            authors: "Sun Yuanming",
            venue: "Undergraduate Research Notes, 2024",
            role: "独立作者",
            topic: "Human-Computer Interaction",
            abstract: "讨论个人网站在求职、申博、科研合作中的补充作用，并给出论文、项目、博客、资料下载等模块的内容组织建议。",
            pdf: "files/papers/placeholder-portfolio.pdf",
            code: "index.html",
            tags: ["Portfolio", "HCI", "Personal Website"]
        }
    ];

    const projects = [
        {
            id: "symgo-portfolio",
            category: "engineering",
            categoryLabel: "工程项目",
            status: "已上线",
            year: "2025 - 2026",
            name: "Symgo 个人博客与学术展示站",
            role: "独立开发 / 内容维护",
            stack: ["HTML", "CSS", "JavaScript", "Netlify"],
            summary: "将原有博客升级为求职与申博可用的个人展示站，集中呈现论文、项目、博客、工具和可下载材料。",
            work: [
                "重构首页信息架构，让访问者在首屏看到研究方向、工程能力和联系方式。",
                "新增论文发表页面，支持按年份、类型和关键词检索，并提供 PDF 占位下载入口。",
                "新增项目展示页面，把简历里放不下的项目背景、职责、产出和复盘展开。",
                "整理博客、工具箱、留言板、AI助手的导航状态，减少坏链接和重复 active 样式。"
            ],
            outcomes: [
                "适配 Netlify 静态部署，无需后端即可访问核心内容。",
                "为后续替换真实论文、项目链接、CV 和数据集预留结构化位置。"
            ],
            links: [
                { label: "站点首页", href: "index.html" },
                { label: "GitHub", href: "https://github.com/symyyds/symgo" }
            ]
        },
        {
            id: "interview-toolkit",
            category: "engineering",
            categoryLabel: "工程项目",
            status: "持续维护",
            year: "2025",
            name: "升学复试与保研资料工具包",
            role: "资料整理 / 经验沉淀 / 页面开发",
            stack: ["Content Design", "PDF/Docx", "HTML"],
            summary: "围绕保研推免、考研复试和导师联系，整理流程、术语、时间轴、材料清单和视频讲解，帮助低年级同学快速建立准备框架。",
            work: [
                "设计保研信息页，汇总官方入口、信息平台、常见术语和关键时间节点。",
                "维护复试技巧文章，补充简历打印、套磁邮件、面试表达和资料下载。",
                "将文档、压缩包、视频讲解与文章内容关联，形成可复用的资料入口。"
            ],
            outcomes: [
                "降低重复答疑成本，把口头经验沉淀为可分享页面。",
                "体现内容组织、用户视角和静态站资源管理能力。"
            ],
            links: [
                { label: "保研经验贴", href: "blog/baoyan.html" },
                { label: "复试技巧", href: "blog/25_skills.html" }
            ]
        },
        {
            id: "academic-ai",
            category: "engineering",
            categoryLabel: "工程项目",
            status: "实验功能",
            year: "2025",
            name: "本地历史记录学术助手",
            role: "前端功能开发",
            stack: ["JavaScript", "LocalStorage", "DeepSeek API"],
            summary: "实现支持多轮聊天、会话列表、文件预览、记录导入导出的学术助手页面，用于阅读材料、整理问题和生成初稿。",
            work: [
                "用 localStorage 保存多会话聊天记录，支持重命名、删除、导入和导出。",
                "接入 Markdown 渲染、代码高亮、PDF/Word 文本读取能力，增强学术文档问答体验。",
                "调整 API Key 策略，避免在静态站源码中暴露真实密钥。"
            ],
            outcomes: [
                "可作为个人工作流展示，说明对前端状态管理和静态部署限制的理解。",
                "后续可迁移为 Netlify Functions 或其他后端代理，进一步保护密钥。"
            ],
            links: [
                { label: "打开助手", href: "ai.html" }
            ]
        },
        {
            id: "resume-builder",
            category: "engineering",
            categoryLabel: "工程项目",
            status: "工具原型",
            year: "2025",
            name: "在线简历制作工具",
            role: "页面设计 / 交互开发",
            stack: ["HTML", "CSS", "JavaScript"],
            summary: "面向学生求职和升学申请的简历编辑工具，提供结构化输入、模板预览和内容生成入口。",
            work: [
                "设计教育经历、项目经历、技能、奖项等模块，帮助用户把材料按简历结构录入。",
                "提供模板化内容示例，降低从空白页开始写简历的阻力。",
                "与个人网站的项目展示页形成互补：简历放摘要，网站放细节。"
            ],
            outcomes: [
                "展示前端表单、状态组织和面向真实场景的工具设计能力。",
                "可继续扩展为 PDF 导出、ATS 检查、岗位匹配等功能。"
            ],
            links: [
                { label: "简历制作", href: "tools/resume_builder.html" }
            ]
        },
        {
            id: "industry-knowledge-base",
            category: "horizontal",
            categoryLabel: "横向项目",
            status: "方案设计",
            year: "2026",
            name: "企业知识库与材料自动整理平台",
            role: "需求梳理 / 原型设计 / 前端方案",
            stack: ["Requirement Analysis", "RAG", "Prototype", "Static Demo"],
            summary: "面向企业内部文档、项目材料和制度文件的知识库原型，目标是把零散资料整理为可检索、可追踪、可复用的信息资产。",
            work: [
                "拆解企业资料流转场景，设计上传、分类、检索、问答和引用追踪的核心流程。",
                "规划 RAG 问答、文档标签、权限分层和材料归档的模块边界。",
                "制作可演示的静态原型，用于沟通需求、评估开发成本和沉淀项目汇报材料。"
            ],
            outcomes: [
                "适合展示横向合作中的需求理解、方案表达和工程落地意识。",
                "后续可接入对象存储、向量数据库和 Netlify Functions/后端代理。"
            ],
            links: [
                { label: "方案占位", href: "projects.html#industry-knowledge-base" }
            ]
        },
        {
            id: "lab-data-dashboard",
            category: "horizontal",
            categoryLabel: "横向项目",
            status: "交付原型",
            year: "2025",
            name: "实验室数据看板与成果展示系统",
            role: "信息架构 / 可视化页面 / 部署支持",
            stack: ["Dashboard", "Data Visualization", "HTML", "JavaScript"],
            summary: "围绕实验室项目、论文、成员、数据统计和成果材料建立展示型看板，服务横向项目汇报、阶段验收和对外展示。",
            work: [
                "将论文、项目、成员、数据统计等内容抽象为统一展示模型，减少重复维护。",
                "设计成果概览、项目进度、资料下载和关键指标模块，方便汇报时快速定位。",
                "优化静态部署与资源路径，保证在公开链接、内网镜像或本地演示环境中都能访问。"
            ],
            outcomes: [
                "把科研团队的材料从文档堆转成可浏览、可检索、可演示的页面。",
                "体现横向项目中对交付、验收、展示和维护成本的关注。"
            ],
            links: [
                { label: "展示占位", href: "projects.html#lab-data-dashboard" }
            ]
        }
    ];

    const capabilities = [
        {
            area: "前端工程",
            level: "高级展示能力",
            score: 92,
            icon: "fa-layer-group",
            summary: "能从信息架构、视觉系统、响应式布局到静态部署完整交付个人作品集和工具页面。",
            evidence: ["Symgo 展示站重构", "博客短卡片与筛选", "工具箱多页面维护"],
            stack: ["HTML5", "CSS Grid", "Responsive UI", "Vanilla JS"]
        },
        {
            area: "AI 工具集成",
            level: "可演示原型",
            score: 86,
            icon: "fa-wand-magic-sparkles",
            summary: "能把大模型问答、文件解析、本地会话记录和密钥安全策略组织成可用工作流。",
            evidence: ["学术助手", "PDF/Word 文档解析", "本地历史记录"],
            stack: ["DeepSeek API", "Marked", "Highlight.js", "PDF.js", "Mammoth.js"]
        },
        {
            area: "内容与材料组织",
            level: "求职/申博导向",
            score: 90,
            icon: "fa-folder-tree",
            summary: "能把论文、项目、博客、CV、复试资料拆成可检索、可追问、可替换的证据模块。",
            evidence: ["论文发表页", "工程/横向项目页", "材料库"],
            stack: ["Case Study", "Knowledge Management", "Portfolio Writing"]
        },
        {
            area: "工程发布",
            level: "静态站生产化",
            score: 84,
            icon: "fa-cloud-arrow-up",
            summary: "能处理 Netlify 白名单构建、资源路径、headers、安全占位和公开部署流程。",
            evidence: ["netlify.toml", "dist 白名单构建", "无真实 API Key 暴露"],
            stack: ["Netlify", "Node Build Script", "GitHub", "Static Assets"]
        }
    ];

    const materials = [
        {
            type: "resume",
            typeLabel: "简历材料",
            title: "个人 CV",
            description: "求职、申博和合作沟通时的主入口材料，后续可替换为最新版本。",
            href: "files/CV.pdf",
            status: "可下载",
            tags: ["CV", "Resume", "Application"]
        },
        {
            type: "paper",
            typeLabel: "论文材料",
            title: "论文 PDF 占位包",
            description: "用于展示论文详情页的文件结构，真实论文可直接放入 files/papers/ 并替换链接。",
            href: "publications.html",
            status: "占位可替换",
            tags: ["Publication", "PDF", "Research"]
        },
        {
            type: "project",
            typeLabel: "项目证据",
            title: "工程项目 Case Study",
            description: "展示个人站、AI 助手、资料工具包和简历工具的背景、职责、技术与产出。",
            href: "projects.html",
            status: "持续维护",
            tags: ["Engineering", "Case Study", "Delivery"]
        },
        {
            type: "project",
            typeLabel: "横向材料",
            title: "横向项目方案模板",
            description: "用于表达需求理解、合作交付、验收汇报和可持续维护意识。",
            href: "projects.html#industry-knowledge-base",
            status: "方案占位",
            tags: ["Collaboration", "Proposal", "Dashboard"]
        },
        {
            type: "study",
            typeLabel: "升学材料",
            title: "保研信息模板",
            description: "保研/推免准备过程中的信息整理表，可作为经验文章的下载补充。",
            href: "files/baoyan/信息模板.xlsx",
            status: "可下载",
            tags: ["保研", "Excel", "Template"]
        },
        {
            type: "study",
            typeLabel: "升学材料",
            title: "复试技巧 PPT/PDF",
            description: "复试材料、导师联系、面试表达和资料准备的内容入口。",
            href: "files/25_skills/ppt.pdf",
            status: "可下载",
            tags: ["复试", "PDF", "Interview"]
        },
        {
            type: "tool",
            typeLabel: "工具演示",
            title: "Markdown 转 Word / 代码高亮工具",
            description: "展示对常用学习与写作工具的前端实现能力。",
            href: "tools/markdown_to_word.html",
            status: "可访问",
            tags: ["Tooling", "Markdown", "Frontend"]
        },
        {
            type: "blog",
            typeLabel: "写作证明",
            title: "博客文章与经验沉淀",
            description: "用真实文章展示长期维护、知识表达和面向他人的说明能力。",
            href: "blog.html",
            status: "持续更新",
            tags: ["Writing", "Blog", "Knowledge"]
        }
    ];

    const milestones = [
        { year: "2026", title: "个人展示站产品化", desc: "把论文、项目、材料、博客和工具重组为求职/申博证据系统。" },
        { year: "2025", title: "AI 工具与升学资料沉淀", desc: "围绕复试、保研、文档问答和简历工具持续补充可演示模块。" },
        { year: "2024", title: "技术博客与工具学习", desc: "沉淀 Git、Python、深度学习和个人效率工具相关内容。" }
    ];

    const dashboardStats = [
        { label: "核心页面", value: "11", desc: "首页、档案、研究、论文、项目、材料、仪表盘、成就、服务、路线图、博客" },
        { label: "项目档案", value: "6", desc: "4 个工程项目 + 2 个横向项目" },
        { label: "材料入口", value: "8", desc: "CV、论文、项目证据、升学资料、工具和写作证明" },
        { label: "发布质量", value: "A", desc: "白名单构建、SEO、404、headers、manifest、sitemap" }
    ];

    const achievements = [
        {
            year: "2026",
            title: "个人学术展示站产品化升级",
            type: "工程成果",
            level: "Portfolio System",
            description: "把旧博客升级为覆盖论文、项目、材料、研究方向、AI 助手和 Netlify 发布工程的展示系统。",
            proof: "projects.html#symgo-portfolio",
            tags: ["Static Site", "Portfolio", "Netlify"]
        },
        {
            year: "2025",
            title: "升学复试与保研资料体系沉淀",
            type: "内容成果",
            level: "Knowledge Asset",
            description: "把复试技巧、保研材料、导师联系和经验分享沉淀为可访问页面与下载资料。",
            proof: "blog/25_skills.html",
            tags: ["保研", "复试", "写作"]
        },
        {
            year: "2025",
            title: "学术 AI 助手原型",
            type: "工具成果",
            level: "Prototype",
            description: "实现本地会话、文档解析、Markdown 渲染和 API Key 本地保存策略。",
            proof: "ai.html",
            tags: ["AI", "LocalStorage", "PDF.js"]
        },
        {
            year: "2024",
            title: "Git / Python / 深度学习学习材料维护",
            type: "学习成果",
            level: "Long-term Notes",
            description: "持续整理技术学习材料、工具页面和博客笔记，形成长期维护习惯。",
            proof: "blog.html",
            tags: ["Git", "Python", "Learning"]
        }
    ];

    const services = [
        {
            title: "静态个人站/作品集搭建",
            audience: "求职、申博、个人品牌展示",
            deliverables: ["信息架构", "页面设计", "响应式前端", "Netlify 部署", "SEO 基础配置"],
            value: "把简历无法展开的论文、项目和材料做成公开证据库。"
        },
        {
            title: "项目材料与 Case Study 整理",
            audience: "面试复盘、横向项目汇报、实验室成果展示",
            deliverables: ["项目背景梳理", "职责拆解", "技术栈说明", "产出价值描述", "展示页面"],
            value: "把“做过什么”整理成别人能追问、能验证、能理解的材料。"
        },
        {
            title: "AI 文档助手原型",
            audience: "个人学习、实验室资料问答、企业文档整理",
            deliverables: ["聊天界面", "文件解析", "本地会话", "API Key 策略", "后端迁移建议"],
            value: "把大模型能力接到真实学习/科研/项目资料工作流里。"
        },
        {
            title: "学习资料与工具页面制作",
            audience: "课程笔记、教程分享、升学资料沉淀",
            deliverables: ["文章页面", "下载入口", "工具导航", "搜索筛选", "维护规范"],
            value: "把零散资料变成可访问、可复用、可长期维护的知识资产。"
        }
    ];

    const roadmap = [
        {
            phase: "Phase 1",
            title: "真实材料替换",
            status: "Next",
            items: ["替换真实 CV", "补充真实论文 PDF/DOI", "上传项目截图", "补齐 GitHub 仓库链接"]
        },
        {
            phase: "Phase 2",
            title: "项目证据增强",
            status: "Planned",
            items: ["每个项目补截图/流程图", "增加 STAR 面试讲法", "增加技术难点复盘", "增加指标或用户反馈"]
        },
        {
            phase: "Phase 3",
            title: "动态能力升级",
            status: "Planned",
            items: ["Netlify Forms 留言", "Serverless API 代理", "文档搜索索引", "项目更新日志"]
        },
        {
            phase: "Phase 4",
            title: "申博/求职专项版本",
            status: "Future",
            items: ["导师邮件入口", "岗位匹配页", "英文版本", "PDF 打印版 portfolio"]
        }
    ];

    const interviewStories = [
        {
            project: "Symgo 个人展示站",
            situation: "旧博客页面和功能比较简陋，无法承担求职/申博时的材料展示任务。",
            task: "需要把它升级成能展示论文、项目、材料、研究方向和工具能力的静态站。",
            action: "重构首页信息架构，新增论文/项目/材料/档案/研究/仪表盘等页面，补齐 Netlify 构建、SEO 和安全策略。",
            result: "形成一个可公开访问、可持续维护、可作为简历证据层的个人展示系统。"
        },
        {
            project: "学术 AI 助手",
            situation: "学习和科研资料分散在 PDF、Word、Markdown 和聊天记录里。",
            task: "需要一个能辅助阅读、问答和记录历史的前端原型。",
            action: "接入 Markdown 渲染、代码高亮、PDF/Word 文本提取、本地会话记录和 API Key 本地保存。",
            result: "展示了对 AI 工具工作流、静态站限制和用户隐私策略的理解。"
        },
        {
            project: "保研/复试资料体系",
            situation: "升学经验通常停留在口头分享和零散文档。",
            task: "需要把流程、材料、术语、技巧和下载资源组织成可复用页面。",
            action: "整理保研入口、信息模板、复试技巧文章和视频/文档资源，放入博客和材料库。",
            result: "降低重复答疑成本，也展示内容组织和长期维护能力。"
        }
    ];

    function normalize(text) {
        return (text || "").toString().trim().toLowerCase();
    }

    function renderPublications() {
        const root = document.querySelector("[data-publications]");
        if (!root) return;

        const yearFilter = document.querySelector("[data-pub-year]");
        const typeFilter = document.querySelector("[data-pub-type]");
        const searchInput = document.querySelector("[data-pub-search]");

        function paint() {
            const year = yearFilter ? yearFilter.value : "all";
            const type = typeFilter ? typeFilter.value : "all";
            const keyword = normalize(searchInput ? searchInput.value : "");

            const filtered = publications.filter((item) => {
                const haystack = normalize([item.title, item.authors, item.venue, item.abstract, item.topic, item.level, item.tags.join(" ")].join(" "));
                return (year === "all" || item.year === year)
                    && (type === "all" || item.type === type)
                    && (!keyword || haystack.includes(keyword));
            });

            if (!filtered.length) {
                root.innerHTML = '<div class="empty-state">没有符合条件的论文。换个年份、类型或关键词试试。</div>';
                return;
            }

            root.innerHTML = filtered.map((item) => `
                <article class="publication-card" data-year="${item.year}" data-type="${item.type}">
                    <div class="publication-top">
                        <div>
                            <div class="resume-date">${item.year} · ${item.role}</div>
                            <h2 class="publication-title">${item.title}</h2>
                            <p><strong>${item.authors}</strong></p>
                            <p>${item.venue}</p>
                        </div>
                        <span class="pill level">${item.level}</span>
                    </div>
                    <div class="tag-row">
                        <span class="pill status">${item.type}</span>
                        <span class="pill">${item.topic}</span>
                        ${item.tags.map((tag) => `<span class="pill">${tag}</span>`).join("")}
                    </div>
                    <p>${item.abstract}</p>
                    <div class="publication-actions">
                        <a class="text-link" href="${item.pdf}" target="_blank"><i class="fas fa-file-pdf"></i> PDF</a>
                        <a class="text-link" href="${item.code}"><i class="fas fa-diagram-project"></i> 相关项目</a>
                    </div>
                </article>
            `).join("");
        }

        [yearFilter, typeFilter, searchInput].forEach((el) => {
            if (!el) return;
            el.addEventListener(el.tagName === "INPUT" ? "input" : "change", paint);
        });

        paint();
    }

    function renderProjects() {
        const root = document.querySelector("[data-projects]");
        if (!root) return;

        const categoryTabs = document.querySelectorAll("[data-project-category]");
        const searchInput = document.querySelector("[data-project-search]");
        let activeCategory = "all";

        function paint() {
            const keyword = normalize(searchInput ? searchInput.value : "");
            const filtered = projects.filter((project) => {
                const haystack = normalize([project.name, project.role, project.summary, project.stack.join(" "), project.work.join(" "), project.outcomes.join(" "), project.status, project.categoryLabel].join(" "));
                return (activeCategory === "all" || project.category === activeCategory)
                    && (!keyword || haystack.includes(keyword));
            });

            if (!filtered.length) {
                root.innerHTML = '<div class="empty-state">没有符合条件的项目。可以清空搜索或切换状态。</div>';
                return;
            }

            const groups = [
                { key: "engineering", title: "工程项目", desc: "强调独立开发、工具构建、前端实现、部署与维护能力。" },
                { key: "horizontal", title: "横向项目", desc: "强调需求理解、合作交付、方案表达、汇报验收和可持续维护。" }
            ].filter((group) => filtered.some((project) => project.category === group.key));

            root.innerHTML = groups.map((group) => `
                <section class="project-category-block" aria-label="${group.title}">
                    <div class="project-category-head">
                        <div>
                            <span class="section-kicker">${group.key === "engineering" ? "ENGINEERING" : "COLLABORATION"}</span>
                            <h2>${group.title}</h2>
                        </div>
                        <p>${group.desc}</p>
                    </div>
                    <div class="project-list-group">
                        ${filtered.filter((project) => project.category === group.key).map((project, index) => `
                <article class="project-showcase" id="${project.id}">
                    <div class="project-head">
                        <div>
                            <div class="project-index">${String(index + 1).padStart(2, "0")}</div>
                            <div class="resume-date">${project.year} · ${project.categoryLabel} · ${project.role}</div>
                            <h2>${project.name}</h2>
                            <p class="project-meta">${project.summary}</p>
                        </div>
                        <div class="project-badges">
                            <span class="pill category">${project.categoryLabel}</span>
                            <span class="pill status">${project.status}</span>
                        </div>
                    </div>
                    <div class="tag-row">
                        ${project.stack.map((tag) => `<span class="pill">${tag}</span>`).join("")}
                    </div>
                    <div class="work-grid">
                        <div class="work-box">
                            <h4>我具体做了什么</h4>
                            <ul>${project.work.map((item) => `<li>${item}</li>`).join("")}</ul>
                        </div>
                        <div class="work-box">
                            <h4>产出与可展示价值</h4>
                            <ul>${project.outcomes.map((item) => `<li>${item}</li>`).join("")}</ul>
                        </div>
                    </div>
                    <div class="project-actions">
                        ${project.links.map((link) => `<a class="text-link" href="${link.href}" ${link.href.startsWith("http") ? 'target="_blank"' : ""}><i class="fas fa-arrow-up-right-from-square"></i> ${link.label}</a>`).join("")}
                    </div>
                </article>
                        `).join("")}
                    </div>
                </section>
            `).join("");
        }

        categoryTabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                categoryTabs.forEach((item) => item.classList.remove("active"));
                tab.classList.add("active");
                activeCategory = tab.dataset.projectCategory;
                paint();
            });
        });

        if (searchInput) searchInput.addEventListener("input", paint);
        paint();
    }

    function renderCapabilities() {
        const root = document.querySelector("[data-capabilities]");
        if (!root) return;

        root.innerHTML = capabilities.map((item) => `
            <article class="capability-card">
                <div class="capability-top">
                    <div class="card-icon"><i class="fas ${item.icon}"></i></div>
                    <div>
                        <span class="section-kicker">${item.level}</span>
                        <h2>${item.area}</h2>
                    </div>
                    <div class="capability-score">${item.score}</div>
                </div>
                <p>${item.summary}</p>
                <div class="meter" aria-label="${item.area} ${item.score}分">
                    <span style="width: ${item.score}%"></span>
                </div>
                <div class="evidence-grid">
                    ${item.evidence.map((evidence) => `<span><i class="fas fa-check"></i>${evidence}</span>`).join("")}
                </div>
                <div class="tag-row">${item.stack.map((tag) => `<span class="pill">${tag}</span>`).join("")}</div>
            </article>
        `).join("");
    }

    function renderMaterials() {
        const root = document.querySelector("[data-materials]");
        if (!root) return;

        const tabs = document.querySelectorAll("[data-material-filter]");
        const searchInput = document.querySelector("[data-material-search]");
        const empty = document.querySelector("[data-material-empty]");
        let active = "all";

        function paint() {
            const keyword = normalize(searchInput ? searchInput.value : "");
            const filtered = materials.filter((item) => {
                const haystack = normalize([item.typeLabel, item.title, item.description, item.status, item.tags.join(" ")].join(" "));
                return (active === "all" || item.type === active) && (!keyword || haystack.includes(keyword));
            });

            if (!filtered.length) {
                root.innerHTML = "";
                if (empty) empty.style.display = "block";
                return;
            }

            if (empty) empty.style.display = "none";
            root.innerHTML = filtered.map((item) => `
                <article class="material-card" data-type="${item.type}">
                    <div class="material-type">${item.typeLabel}</div>
                    <h2>${item.title}</h2>
                    <p>${item.description}</p>
                    <div class="tag-row">${item.tags.map((tag) => `<span class="pill">${tag}</span>`).join("")}</div>
                    <div class="material-actions">
                        <span class="pill status">${item.status}</span>
                        <a class="text-link" href="${item.href}" ${item.href.startsWith("http") || item.href.endsWith(".pdf") || item.href.endsWith(".xlsx") ? 'target="_blank"' : ""}>
                            打开材料 <i class="fas fa-arrow-up-right-from-square"></i>
                        </a>
                    </div>
                </article>
            `).join("");
        }

        tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                tabs.forEach((item) => item.classList.remove("active"));
                tab.classList.add("active");
                active = tab.dataset.materialFilter;
                paint();
            });
        });

        if (searchInput) searchInput.addEventListener("input", paint);
        paint();
    }

    function renderMilestones() {
        const root = document.querySelector("[data-milestones]");
        if (!root) return;

        root.innerHTML = milestones.map((item) => `
            <div class="resume-item">
                <div class="resume-date">${item.year}</div>
                <div class="resume-title">${item.title}</div>
                <div class="resume-desc">${item.desc}</div>
            </div>
        `).join("");
    }

    function renderDashboard() {
        const statsRoot = document.querySelector("[data-dashboard-stats]");
        if (statsRoot) {
            statsRoot.innerHTML = dashboardStats.map((item) => `
                <article class="metric-card dashboard-stat">
                    <div class="metric-number">${item.value}</div>
                    <div class="metric-label">${item.label}</div>
                    <p>${item.desc}</p>
                </article>
            `).join("");
        }

        const projectRoot = document.querySelector("[data-dashboard-projects]");
        if (projectRoot) {
            projectRoot.innerHTML = projects.map((project) => `
                <article class="dashboard-row">
                    <div>
                        <span class="pill category">${project.categoryLabel}</span>
                        <h3>${project.name}</h3>
                        <p>${project.summary}</p>
                    </div>
                    <div class="dashboard-row-meta">
                        <span>${project.year}</span>
                        <strong>${project.status}</strong>
                    </div>
                </article>
            `).join("");
        }

        const materialRoot = document.querySelector("[data-dashboard-materials]");
        if (materialRoot) {
            materialRoot.innerHTML = materials.slice(0, 6).map((item) => `
                <a class="mini-resource" href="${item.href}">
                    <span>${item.typeLabel}</span>
                    <strong>${item.title}</strong>
                </a>
            `).join("");
        }
    }

    function renderAchievements() {
        const root = document.querySelector("[data-achievements]");
        if (!root) return;

        root.innerHTML = achievements.map((item) => `
            <article class="achievement-card">
                <div class="achievement-year">${item.year}</div>
                <div>
                    <span class="section-kicker">${item.type} · ${item.level}</span>
                    <h2>${item.title}</h2>
                    <p>${item.description}</p>
                    <div class="tag-row">${item.tags.map((tag) => `<span class="pill">${tag}</span>`).join("")}</div>
                    <a class="text-link" href="${item.proof}">查看证明 <i class="fas fa-arrow-right"></i></a>
                </div>
            </article>
        `).join("");
    }

    function renderServices() {
        const root = document.querySelector("[data-services]");
        if (!root) return;

        root.innerHTML = services.map((item) => `
            <article class="service-card">
                <div class="card-icon"><i class="fas fa-briefcase"></i></div>
                <span class="section-kicker">${item.audience}</span>
                <h2>${item.title}</h2>
                <p>${item.value}</p>
                <div class="deliverable-list">
                    ${item.deliverables.map((deliverable) => `<span><i class="fas fa-check"></i>${deliverable}</span>`).join("")}
                </div>
            </article>
        `).join("");
    }

    function renderRoadmap() {
        const root = document.querySelector("[data-roadmap]");
        if (!root) return;

        root.innerHTML = roadmap.map((item) => `
            <article class="roadmap-card">
                <div class="roadmap-phase">${item.phase}</div>
                <div>
                    <span class="pill status">${item.status}</span>
                    <h2>${item.title}</h2>
                    <ul>${item.items.map((task) => `<li>${task}</li>`).join("")}</ul>
                </div>
            </article>
        `).join("");
    }

    function renderInterviewStories() {
        const root = document.querySelector("[data-interview-stories]");
        if (!root) return;

        root.innerHTML = interviewStories.map((item) => `
            <article class="story-card">
                <h2>${item.project}</h2>
                <dl>
                    <dt>S</dt><dd>${item.situation}</dd>
                    <dt>T</dt><dd>${item.task}</dd>
                    <dt>A</dt><dd>${item.action}</dd>
                    <dt>R</dt><dd>${item.result}</dd>
                </dl>
            </article>
        `).join("");
    }

    function initBlogFilters() {
        const cards = document.querySelectorAll("[data-blog-card]");
        if (!cards.length) return;

        const tabs = document.querySelectorAll("[data-blog-category]");
        const searchInput = document.querySelector("[data-blog-search]");
        const empty = document.querySelector("[data-blog-empty]");
        let active = "all";

        function apply() {
            const keyword = normalize(searchInput ? searchInput.value : "");
            let visible = 0;

            cards.forEach((card) => {
                const categoryMatch = active === "all" || card.dataset.category === active;
                const haystack = normalize(card.textContent);
                const searchMatch = !keyword || haystack.includes(keyword);
                const show = categoryMatch && searchMatch;
                card.style.display = show ? "" : "none";
                if (show) visible += 1;
            });

            if (empty) empty.style.display = visible ? "none" : "block";
        }

        tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                tabs.forEach((item) => item.classList.remove("active"));
                tab.classList.add("active");
                active = tab.dataset.blogCategory;
                apply();
            });
        });

        if (searchInput) searchInput.addEventListener("input", apply);
        apply();
    }

    function initApiKeyPanel() {
        const input = document.querySelector("[data-api-key-input]");
        const saveBtn = document.querySelector("[data-api-key-save]");
        const clearBtn = document.querySelector("[data-api-key-clear]");
        const status = document.querySelector("[data-api-key-status]");
        if (!input || !saveBtn) return;

        const storageKey = "deepseek_api_key";

        function refresh() {
            const saved = localStorage.getItem(storageKey);
            input.value = saved || "";
            if (status) {
                status.textContent = saved ? "已保存到本机浏览器，不会写入仓库。" : "未配置 API Key，聊天请求会失败。";
            }
        }

        saveBtn.addEventListener("click", () => {
            const value = input.value.trim();
            if (!value) {
                alert("请输入 API Key");
                return;
            }
            localStorage.setItem(storageKey, value);
            refresh();
        });

        if (clearBtn) {
            clearBtn.addEventListener("click", () => {
                localStorage.removeItem(storageKey);
                refresh();
            });
        }

        refresh();
    }

    window.symgoSite = {
        publications,
        projects,
        capabilities,
        materials,
        milestones,
        dashboardStats,
        achievements,
        services,
        roadmap,
        interviewStories,
        getApiKey: function () {
            return localStorage.getItem("deepseek_api_key") || "";
        }
    };

    document.addEventListener("DOMContentLoaded", () => {
        renderPublications();
        renderProjects();
        renderCapabilities();
        renderMaterials();
        renderMilestones();
        renderDashboard();
        renderAchievements();
        renderServices();
        renderRoadmap();
        renderInterviewStories();
        initBlogFilters();
        initApiKeyPanel();
    });
})();
