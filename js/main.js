(function () {
    function getAssetPrefix() {
        const pathParts = window.location.pathname.split("/").filter(Boolean);
        if (!pathParts.length) return "";
        const lastPart = pathParts[pathParts.length - 1];
        const depth = lastPart.includes(".") ? pathParts.length - 1 : pathParts.length;
        return depth > 0 ? "../".repeat(depth) : "";
    }

    const prefix = getAssetPrefix();

    const navigationGroups = [
        { label: "首页", href: "index.html", icon: "fa-house" },
        {
            label: "关于我",
            icon: "fa-user-graduate",
            children: [
                { label: "个人档案", href: "profile.html", desc: "能力矩阵与经历概览" },
                { label: "阶段成果", href: "resume.html", desc: "本科成果与研究生阶段预留" },
                { label: "作品集仪表盘", href: "dashboard.html", desc: "页面、材料与质量总览" },
                { label: "研究方向", href: "research.html", desc: "问题意识与未来课题" },
                { label: "一页式档案", href: "snapshot.html", desc: "快速发给导师或 HR" },
                { label: "成就与证明", href: "achievements.html", desc: "成果、荣誉与沉淀" },
                { label: "路线图", href: "roadmap.html", desc: "后续补强计划" }
            ]
        },
        {
            label: "成果与证据",
            icon: "fa-layer-group",
            children: [
                { label: "论文发表", href: "publications.html", desc: "论文、级别、PDF 与关联项目" },
                { label: "项目总览", href: "projects.html", desc: "工程项目与横向项目入口" },
                { label: "工程项目", href: "engineering-projects.html", desc: "独立开发、部署与维护能力" },
                { label: "横向项目", href: "horizontal-projects.html", desc: "需求理解、协作交付与验收" },
                { label: "材料库", href: "materials.html", desc: "CV、论文、证明与申请材料" },
                { label: "证据档案", href: "evidence/index.html", desc: "可追问材料与证据链" },
                { label: "合作服务", href: "services.html", desc: "可交付原型与展示材料" },
                { label: "面试故事", href: "interview.html", desc: "STAR 项目复盘" }
            ]
        },
        {
            label: "知识库",
            icon: "fa-book-open",
            children: [
                { label: "博客文章", href: "blog.html", desc: "技术、升学与写作记录" },
                { label: "作品集知识库", href: "library/index.html", desc: "项目深化、FAQ 与更新日志" },
                { label: "案例库", href: "cases/index.html", desc: "模块级案例复盘" },
                { label: "扩展手册", href: "handbook/index.html", desc: "工程、研究、求职与合作专题" }
            ]
        },
        {
            label: "工具",
            icon: "fa-screwdriver-wrench",
            children: [
                { label: "AI 助手", href: "ai.html", desc: "本地历史记录与文档问答" },
                { label: "代码高亮", href: "tools/code_runner.html", desc: "代码展示与片段处理" },
                { label: "Markdown 工具", href: "tools/markdown_to_word.html", desc: "Markdown 转换与排版" },
                { label: "Python 学习", href: "tools/python_nav.html", desc: "Python 内容导航" },
                { label: "深度学习", href: "tools/deep_learning.html", desc: "学习路径与资料入口" },
                { label: "复试抽题", href: "test.html", desc: "专业课随机抽题练习" },
                { label: "简历制作", href: "tools/resume_builder.html", desc: "结构化简历编辑工具" },
                { label: "API 代理", href: "tools/netlify_api_proxy.html", desc: "函数端点、白名单和 JSON 返回" },
                { label: "API 实验室", href: "tools/api_lab.html", desc: "public-apis 接入与健康检查" },
                { label: "PyTorch 教程", href: "tools/pytorch.html", desc: "PyTorch 深度学习入门教程" }
            ]
        },
        { label: "联系", href: "leave_message.html", icon: "fa-message" }
    ];

    function enhanceNavigation() {
        const navList = document.querySelector("nav ul");
        if (!navList) return;

        navList.className = "nav-menu";
        navList.innerHTML = "";

        function buildHref(href) {
            if (!href || href.startsWith("http") || href.startsWith("#")) return href;
            return prefix + href;
        }

        function createLink(item) {
            const link = document.createElement("a");
            link.href = buildHref(item.href);
            link.className = item.desc ? "nav-dropdown-link" : "";
            link.innerHTML = item.desc
                ? `<span>${item.label}</span><small>${item.desc}</small>`
                : `<i class="fas ${item.icon}" aria-hidden="true"></i><span>${item.label}</span>`;
            return link;
        }

        navigationGroups.forEach((item) => {
            const li = document.createElement("li");
            if (!item.children) {
                li.className = "nav-single";
                li.appendChild(createLink(item));
                navList.appendChild(li);
                return;
            }

            li.className = "nav-group";
            const button = document.createElement("button");
            button.type = "button";
            button.className = "nav-group-toggle";
            button.setAttribute("aria-expanded", "false");
            button.innerHTML = `<i class="fas ${item.icon}" aria-hidden="true"></i><span>${item.label}</span><i class="fas fa-chevron-down nav-chevron" aria-hidden="true"></i>`;

            const dropdown = document.createElement("div");
            dropdown.className = "nav-dropdown";
            item.children.forEach((child) => dropdown.appendChild(createLink(child)));

            li.appendChild(button);
            li.appendChild(dropdown);
            navList.appendChild(li);
        });

        const groups = Array.from(navList.querySelectorAll(".nav-group"));
        function closeGroups(except) {
            groups.forEach((group) => {
                if (group === except) return;
                group.classList.remove("open");
                group.querySelector(".nav-group-toggle")?.setAttribute("aria-expanded", "false");
            });
        }

        groups.forEach((group) => {
            const button = group.querySelector(".nav-group-toggle");
            let hoverTimer;
            if (!button) return;
            function openGroup() {
                clearTimeout(hoverTimer);
                closeGroups(group);
                group.classList.add("open");
                button.setAttribute("aria-expanded", "true");
            }

            function queueCloseGroup() {
                clearTimeout(hoverTimer);
                hoverTimer = setTimeout(() => {
                    group.classList.remove("open");
                    button.setAttribute("aria-expanded", "false");
                }, 160);
            }

            group.addEventListener("mouseover", (event) => {
                if (group.contains(event.relatedTarget)) return;
                openGroup();
            });
            group.addEventListener("mouseout", (event) => {
                if (group.contains(event.relatedTarget)) return;
                queueCloseGroup();
            });
            button.addEventListener("click", (event) => {
                event.stopPropagation();
                const willOpen = !group.classList.contains("open");
                closeGroups(group);
                group.classList.toggle("open", willOpen);
                button.setAttribute("aria-expanded", String(willOpen));
            });
        });

        navList.addEventListener("click", (event) => {
            if (event.target.closest("a")) closeGroups();
        });

        document.addEventListener("click", (event) => {
            if (!event.target.closest("nav")) closeGroups();
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeGroups();
        });
    }

    function initHeaderState() {
        const header = document.querySelector("header");
        if (!header) return;

        function update() {
            header.classList.toggle("scrolled", window.scrollY > 50);
        }

        window.addEventListener("scroll", update, { passive: true });
        update();
    }

    function markActiveNav() {
        const pathParts = window.location.pathname.split("/").filter(Boolean);
        const currentPath = pathParts.join("/") || "index.html";
        const currentTopSection = currentPath.includes("/") ? currentPath.split("/")[0] : "";
        const currentHash = window.location.hash;

        function normalizePath(href) {
            if (!href || href === "#") return { hash: "", path: href };
            try {
                const url = new URL(href, window.location.href);
                return {
                    hash: url.hash,
                    path: url.pathname.split("/").filter(Boolean).join("/") || "index.html"
                };
            } catch (error) {
                return {
                    hash: href.includes("#") ? `#${href.split("#")[1].split("?")[0]}` : "",
                    path: href.split("#")[0].split("?")[0]
                };
            }
        }

        document.querySelectorAll("nav a").forEach((link) => {
            const href = link.getAttribute("href") || "";
            const target = normalizePath(href);
            const targetPath = target.path;
            const targetTopSection = targetPath.includes("/") ? targetPath.split("/")[0] : "";
            const isExact = targetPath === currentPath && (target.hash ? target.hash === currentHash : !currentHash);
            const isHome = currentPath === "index.html" && targetPath === "index.html";
            const isSectionIndex = currentTopSection && targetPath === `${currentTopSection}/index.html`;
            const isBlogChild = currentTopSection === "blog" && targetPath === "blog.html";
            const isToolChild = currentTopSection === "tools" && targetPath === currentPath;
            const isGeneratedSection = ["library", "cases", "handbook", "evidence"].includes(currentTopSection) && targetTopSection === currentTopSection;
            const isActive = isExact || isHome || isSectionIndex || isBlogChild || isToolChild || isGeneratedSection;
            link.classList.toggle("active", isActive);
            if (isActive) link.setAttribute("aria-current", "page");
            else link.removeAttribute("aria-current");
        });

        document.querySelectorAll(".nav-group").forEach((group) => {
            const isActiveGroup = Boolean(group.querySelector("a.active"));
            group.classList.toggle("active", isActiveGroup);
            group.querySelector(".nav-group-toggle")?.classList.toggle("active", isActiveGroup);
        });
    }

    function initThemeToggle() {
        const storageKey = "symgo-theme";
        if (localStorage.getItem(storageKey) === "dark") document.body.classList.add("dark-mode");

        const button = document.createElement("button");
        button.className = "floating-tool theme-toggle";
        button.type = "button";
        button.setAttribute("aria-label", "切换明暗主题");
        button.innerHTML = '<i class="fas fa-circle-half-stroke"></i>';
        document.body.appendChild(button);

        button.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            localStorage.setItem(storageKey, document.body.classList.contains("dark-mode") ? "dark" : "light");
        });
    }

    function showToast(message) {
        let toast = document.querySelector(".site-toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.className = "site-toast";
            toast.setAttribute("role", "status");
            toast.setAttribute("aria-live", "polite");
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(showToast.timer);
        showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
    }

    function initReadingProgress() {
        const progress = document.createElement("div");
        progress.className = "reading-progress";
        progress.innerHTML = "<span></span>";
        document.body.appendChild(progress);

        const bar = progress.querySelector("span");
        function update() {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
            bar.style.width = `${ratio * 100}%`;
        }

        window.addEventListener("scroll", update, { passive: true });
        update();
    }

    function initCommandPalette() {
        const items = [
            { label: "首页", desc: "总体入口与精选项目", href: "index.html", icon: "fa-house" },
            { label: "作品集仪表盘", desc: "页面、项目、材料和质量总览", href: "dashboard.html", icon: "fa-chart-line" },
            { label: "个人档案", desc: "能力矩阵与技术栈", href: "profile.html", icon: "fa-id-card" },
            { label: "阶段成果档案", desc: "本科阶段完整简历与研究生阶段预留", href: "resume.html", icon: "fa-timeline" },
            { label: "研究方向", desc: "问题意识、方法栈和未来课题", href: "research.html", icon: "fa-microscope" },
            { label: "一页式档案", desc: "适合快速发给导师或 HR", href: "snapshot.html", icon: "fa-bolt" },
            { label: "成就与证明", desc: "工程成果、内容成果和学习沉淀", href: "achievements.html", icon: "fa-award" },
            { label: "合作与能力服务", desc: "可提供的原型、材料和展示能力", href: "services.html", icon: "fa-handshake" },
            { label: "路线图", desc: "下一步材料替换和能力升级计划", href: "roadmap.html", icon: "fa-route" },
            { label: "面试故事库", desc: "STAR 结构项目复盘", href: "interview.html", icon: "fa-comments" },
            { label: "作品集知识库", desc: "项目深挖、研究笔记、FAQ 和更新日志", href: "library/index.html", icon: "fa-book-open" },
            { label: "案例备忘录", desc: "20 个模块级案例复盘", href: "cases/index.html", icon: "fa-layer-group" },
            { label: "扩展手册", desc: "工程、研究、求职、合作、内容和产品化专题", href: "handbook/index.html", icon: "fa-book" },
            { label: "证据档案库", desc: "项目、论文、合作和申请材料的证据链", href: "evidence/index.html", icon: "fa-boxes-stacked" },
            { label: "论文发表", desc: "论文、级别、PDF 与相关项目", href: "publications.html", icon: "fa-file-lines" },
            { label: "项目总览", desc: "工程项目与横向项目入口", href: "projects.html", icon: "fa-diagram-project" },
            { label: "工程项目", desc: "独立开发、工具构建、API 接入和部署维护", href: "engineering-projects.html", icon: "fa-code-branch" },
            { label: "横向项目", desc: "需求理解、材料治理、协作交付和验收证据", href: "horizontal-projects.html", icon: "fa-handshake-angle" },
            { label: "材料库", desc: "CV、论文、项目证据和升学资料", href: "materials.html", icon: "fa-box-archive" },
            { label: "博客文章", desc: "升学经验、技术笔记和写作证明", href: "blog.html", icon: "fa-pen-nib" },
            { label: "AI助手", desc: "本地历史记录和文档问答", href: "ai.html", icon: "fa-wand-magic-sparkles" },
            { label: "复试抽题", desc: "专业课随机抽题练习", href: "test.html", icon: "fa-shuffle" },
            { label: "简历制作", desc: "在线简历工具原型", href: "tools/resume_builder.html", icon: "fa-file-signature" },
            { label: "Netlify API 代理", desc: "后端函数调用、JSON 返回和白名单控制台", href: "tools/netlify_api_proxy.html", icon: "fa-server" },
            { label: "API 实验室", desc: "public-apis 接入、健康检查和后端代理候选", href: "tools/api_lab.html", icon: "fa-plug" },
            { label: "代码高亮", desc: "代码展示与片段处理工具", href: "tools/code_runner.html", icon: "fa-code" },
            { label: "Markdown 工具", desc: "Markdown 转 Word 排版工具", href: "tools/markdown_to_word.html", icon: "fa-file-word" },
            { label: "Python 导航", desc: "Python 学习内容导航合集", href: "tools/python_nav.html", icon: "fa-python" },
            { label: "深度学习", desc: "深度学习学习路径与资料入口", href: "tools/deep_learning.html", icon: "fa-brain" },
            { label: "PyTorch 教程", desc: "PyTorch 深度学习入门教程", href: "tools/pytorch.html", icon: "fa-fire" }
        ];

        const openButton = document.createElement("button");
        openButton.className = "floating-tool command-open";
        openButton.type = "button";
        openButton.setAttribute("aria-label", "打开快速导航");
        openButton.innerHTML = '<i class="fas fa-magnifying-glass"></i>';
        document.body.appendChild(openButton);

        const palette = document.createElement("div");
        palette.className = "command-palette";
        palette.innerHTML = `
            <div class="command-dialog" role="dialog" aria-modal="true" aria-label="快速导航">
                <div class="command-head">
                    <i class="fas fa-magnifying-glass"></i>
                    <input type="search" aria-label="搜索页面、材料、项目或功能" placeholder="搜索页面、材料、项目或功能">
                    <button type="button" aria-label="关闭"><i class="fas fa-xmark"></i></button>
                </div>
                <div class="command-results"></div>
            </div>
        `;
        document.body.appendChild(palette);

        const input = palette.querySelector("input");
        const results = palette.querySelector(".command-results");
        const closeButton = palette.querySelector(".command-head button");

        function render(keyword = "") {
            const term = keyword.trim().toLowerCase();
            const filtered = items.filter((item) => `${item.label} ${item.desc}`.toLowerCase().includes(term));
            results.innerHTML = filtered.map((item) => `
                <a class="command-item" href="${prefix + item.href}">
                    <span><i class="fas ${item.icon}"></i></span>
                    <strong>${item.label}</strong>
                    <small>${item.desc}</small>
                </a>
            `).join("") || '<div class="empty-state">没有匹配结果</div>';
        }

        function openPalette() {
            palette.classList.add("open");
            render(input.value);
            input.focus();
        }

        function closePalette() {
            palette.classList.remove("open");
        }

        openButton.addEventListener("click", openPalette);
        closeButton.addEventListener("click", closePalette);
        input.addEventListener("input", () => render(input.value));
        palette.addEventListener("click", (event) => {
            if (event.target === palette) closePalette();
        });
        document.addEventListener("keydown", (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                openPalette();
            }
            if (event.key === "Escape") closePalette();
        });
        render();
    }

    function initPageActionBar() {
        if (document.querySelector(".page-action-bar")) return;

        const bar = document.createElement("div");
        bar.className = "page-action-bar";
        bar.setAttribute("aria-label", "页面操作");
        bar.innerHTML = `
            <button type="button" data-page-action="copy" aria-label="复制当前页面链接"><i class="fas fa-link"></i></button>
            <button type="button" data-page-action="print" aria-label="打印或另存为 PDF"><i class="fas fa-print"></i></button>
            <button type="button" data-page-action="top" aria-label="返回页面顶部"><i class="fas fa-arrow-up"></i></button>
        `;
        document.body.appendChild(bar);

        bar.addEventListener("click", async (event) => {
            const button = event.target.closest("button");
            if (!button) return;

            const action = button.dataset.pageAction;
            if (action === "top") {
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }

            if (action === "print") {
                window.print();
                return;
            }

            if (action === "copy") {
                const url = window.location.href;
                try {
                    if (navigator.clipboard?.writeText) {
                        await navigator.clipboard.writeText(url);
                    } else {
                        const input = document.createElement("input");
                        input.value = url;
                        input.style.position = "fixed";
                        input.style.opacity = "0";
                        document.body.appendChild(input);
                        input.select();
                        document.execCommand("copy");
                        input.remove();
                    }
                    showToast("页面链接已复制");
                } catch (error) {
                    showToast("复制失败，请手动复制地址栏链接");
                }
            }
        });
    }

    function initScrollTopButton() {
        const scrollTopBtn = document.getElementById("scroll-top");
        if (!scrollTopBtn) return;

        window.addEventListener("scroll", () => {
            scrollTopBtn.classList.toggle("show", window.scrollY > 300);
        }, { passive: true });

        scrollTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    function initContactValidation() {
        const contactForm = document.getElementById("contact-form");
        if (!contactForm) return;

        function isValidEmail(email) {
            return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.toLowerCase());
        }

        function showError(input, message) {
            const formGroup = input.parentElement;
            let errorElement = formGroup.querySelector(".error-message");
            if (!errorElement) {
                errorElement = document.createElement("div");
                errorElement.className = "error-message";
                formGroup.appendChild(errorElement);
            }
            errorElement.innerText = message;
            errorElement.style.display = "block";
            input.classList.add("error");
        }

        contactForm.addEventListener("submit", (event) => {
            const email = contactForm.querySelector('input[type="email"]');
            if (email && !isValidEmail(email.value)) {
                event.preventDefault();
                showError(email, "请输入有效的电子邮件地址");
            }
        });
    }

    function sanitizeLinks() {
        document.querySelectorAll('a[target="_blank"]').forEach((link) => {
            const rel = new Set((link.getAttribute("rel") || "").split(/\s+/).filter(Boolean));
            rel.add("noopener");
            rel.add("noreferrer");
            link.setAttribute("rel", Array.from(rel).join(" "));
        });

        document.querySelectorAll("a").forEach((link) => {
            const href = link.getAttribute("href");
            if (href !== "#" && href !== "") return;
            const text = link.textContent.trim();
            if (text === "工具箱" || link.closest(".nav-group")) return;
            link.setAttribute("role", "button");
            link.setAttribute("aria-disabled", "true");
            link.classList.add("is-disabled-link");
            link.addEventListener("click", (event) => {
                event.preventDefault();
                showToast("这个入口还在整理，已先保留为占位。");
            });
        });
    }

    let sectionCompassObserver;

    function getMainContent() {
        return document.querySelector("main");
    }

    function getReadableText(root) {
        return (root?.innerText || "")
            .replace(/\s+/g, " ")
            .trim();
    }

    function getPageHeadings(root) {
        return Array.from(root?.querySelectorAll("h2, h3") || [])
            .map((heading) => ({
                node: heading,
                text: heading.textContent.trim().replace(/\s+/g, " ")
            }))
            .filter((item) => item.text.length > 1)
            .slice(0, 10);
    }

    function ensureHeadingId(heading, index) {
        if (!heading.id) heading.id = `section-${index + 1}`;
        return heading.id;
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function getPageTitle() {
        return document.querySelector(".page-hero h1, .hero-redesign h1, .resume-hero h1, main h1")?.textContent.trim()
            || document.title.split("|")[0].trim();
    }

    function getPageKeywords(root) {
        const text = getReadableText(root);
        const seedWords = [
            "研究", "工程", "项目", "论文", "材料", "证据", "API", "Netlify", "AI", "横向",
            "简历", "博客", "Python", "深度学习", "物联网", "能源", "IPv6", "导师", "求职", "申博",
            "Dashboard", "Portfolio", "Publication", "Research", "Engineering", "Serverless"
        ];
        const keywords = [];

        seedWords.forEach((word) => {
            if (text.includes(word) && !keywords.includes(word)) keywords.push(word);
        });

        const englishWords = text.match(/[A-Za-z][A-Za-z0-9+#.-]{2,}/g) || [];
        englishWords.forEach((word) => {
            const clean = word.replace(/[.,;:!?]/g, "");
            if (clean.length < 3) return;
            if (/^(the|and|for|with|from|this|that|html|http|https|www)$/i.test(clean)) return;
            if (!keywords.some((item) => item.toLowerCase() === clean.toLowerCase())) keywords.push(clean);
        });

        getPageHeadings(root).forEach((item) => {
            item.text.split(/[、，,·\s/|]+/).forEach((part) => {
                const clean = part.trim();
                if (clean.length >= 2 && clean.length <= 18 && !keywords.includes(clean)) keywords.push(clean);
            });
        });

        return keywords.slice(0, 12);
    }

    function getPageActions(root) {
        return Array.from(root?.querySelectorAll(".btn[href], .text-link[href], .project-actions a[href], .publication-actions a[href], .material-actions a[href]") || [])
            .filter((link) => !link.closest(".page-motion-ticker") && !link.closest(".page-constellation"))
            .map((link) => ({
                text: link.textContent.trim().replace(/\s+/g, " "),
                href: link.getAttribute("href")
            }))
            .filter((item) => item.text && item.href && item.href !== "#")
            .slice(0, 6);
    }

    function getCurrentPageKey() {
        const parts = window.location.pathname.split("/").filter(Boolean);
        return parts.pop() || "index.html";
    }

    function getCurrentPagePath() {
        let pagePath = decodeURIComponent(window.location.pathname || "")
            .replace(/\\/g, "/")
            .replace(/^\/+/, "");
        const distIndex = pagePath.lastIndexOf("dist/");
        if (distIndex >= 0) pagePath = pagePath.slice(distIndex + 5);
        if (!pagePath || pagePath.endsWith("/")) pagePath += "index.html";
        return pagePath;
    }

    function localAsset(path) {
        if (!path || path.startsWith("http") || path.startsWith("#") || path.startsWith("/")) return path;
        return `${prefix}${path}`;
    }

    const visualEvidencePresets = {
        "index.html": {
            kicker: "Portfolio Visual System",
            title: "真实页面截图组成的作品集现场",
            copy: "把首页、项目、论文、材料库和 API 实验室变成可见证据，让访问者先看到界面完成度，再进入具体材料。",
            metrics: [
                { label: "视觉证据", value: 92 },
                { label: "项目深度", value: 88 },
                { label: "学术信号", value: 76 },
                { label: "部署完成", value: 96 }
            ],
            items: [
                { title: "首页首屏", label: "Home", href: "index.html", src: "images/site-screenshots/home.png" },
                { title: "工程项目", label: "Engineering", href: "engineering-projects.html", src: "images/site-screenshots/engineering-projects.png" },
                { title: "横向项目", label: "Horizontal", href: "horizontal-projects.html", src: "images/site-screenshots/horizontal-projects.png" },
                { title: "论文发表", label: "Publication", href: "publications.html", src: "images/site-screenshots/publications.png" },
                { title: "材料库", label: "Library", href: "materials.html", src: "images/site-screenshots/materials.png" },
                { title: "API 实验室", label: "API", href: "tools/api_lab.html", src: "images/site-screenshots/api-lab.png" }
            ]
        },
        "projects.html": {
            kicker: "Project Evidence",
            title: "项目入口先给界面证据",
            copy: "工程项目和横向项目都保留截图入口，避免项目总览变成只有文字的目录页。",
            metrics: [
                { label: "工程项目", value: 90 },
                { label: "横向项目", value: 88 },
                { label: "证据链", value: 84 },
                { label: "可追问", value: 91 }
            ],
            items: [
                { title: "工程项目页", label: "Engineering", href: "engineering-projects.html", src: "images/site-screenshots/engineering-projects.png" },
                { title: "横向项目页", label: "Horizontal", href: "horizontal-projects.html", src: "images/site-screenshots/horizontal-projects.png" },
                { title: "物联网项目", label: "IoT", href: "horizontal-projects.html#iot-flexible-access-trusted-control", src: "images/horizontal-projects/iot-access-screenshot.png" },
                { title: "IPv6 项目", label: "IPv6", href: "horizontal-projects.html#minning-green-power-ipv6-terminal-access", src: "images/horizontal-projects/ipv6-sdn-qos-screenshot.png" },
                { title: "综合能源", label: "Energy", href: "horizontal-projects.html#ningxia-multi-energy-architecture", src: "images/horizontal-projects/energy-architecture-screenshot.png" }
            ]
        },
        "engineering-projects.html": {
            kicker: "Engineering Gallery",
            title: "工程项目截图与工具界面",
            copy: "用实际页面截图展示个人站、AI 助手、简历工具和 API 实验室的产品完成度。",
            metrics: [
                { label: "独立开发", value: 94 },
                { label: "工具化", value: 86 },
                { label: "API 接入", value: 89 },
                { label: "维护性", value: 90 }
            ],
            items: [
                { title: "工程项目总屏", label: "Page", href: "engineering-projects.html", src: "images/site-screenshots/engineering-projects.png" },
                { title: "个人展示站", label: "Portfolio", href: "index.html", src: "images/engineering-projects/symgo-portfolio-screenshot.png" },
                { title: "学术 AI 助手", label: "AI", href: "ai.html", src: "images/engineering-projects/academic-ai-assistant-screenshot.png" },
                { title: "API 实验室", label: "API", href: "tools/api_lab.html", src: "images/engineering-projects/public-api-lab-screenshot.png" },
                { title: "简历制作", label: "Resume", href: "tools/resume_builder.html", src: "images/engineering-projects/resume-builder-screenshot.png" }
            ]
        },
        "horizontal-projects.html": {
            kicker: "Horizontal Project Gallery",
            title: "横向项目图谱与脱敏界面",
            copy: "用脱敏截图和系统结构图表达真实合作项目的复杂度、技术链路和成果证据。",
            metrics: [
                { label: "真实项目", value: 95 },
                { label: "脱敏边界", value: 90 },
                { label: "成果指标", value: 87 },
                { label: "技术链路", value: 89 }
            ],
            items: [
                { title: "横向项目总屏", label: "Page", href: "horizontal-projects.html", src: "images/site-screenshots/horizontal-projects.png" },
                { title: "柔性接入", label: "IoT", href: "evidence/horizontal-projects/iot-flexible-access-trusted-control.html#visual-proof", src: "images/horizontal-projects/iot-access-screenshot.png" },
                { title: "可信认证链路", label: "Trust", href: "evidence/horizontal-projects/iot-flexible-access-trusted-control.html#visual-proof", src: "images/horizontal-projects/iot-trusted-flow-visual.png" },
                { title: "IPv6 接入网", label: "IPv6", href: "evidence/horizontal-projects/minning-green-power-ipv6-terminal-access.html#visual-proof", src: "images/horizontal-projects/ipv6-sdn-qos-screenshot.png" },
                { title: "综合能源架构", label: "Energy", href: "evidence/horizontal-projects/ningxia-multi-energy-architecture.html#visual-proof", src: "images/horizontal-projects/energy-architecture-screenshot.png" },
                { title: "预测调度", label: "Schedule", href: "evidence/horizontal-projects/ningxia-multi-energy-architecture.html#visual-proof", src: "images/horizontal-projects/energy-prediction-scheduling-visual.png" }
            ]
        },
        "publications.html": {
            kicker: "Publication Preview",
            title: "论文首图与学术材料预览",
            copy: "论文卡片保留首页截图、PDF 入口和 DOI/链接，让学术成果不只停留在标题层面。",
            metrics: [
                { label: "论文首图", value: 90 },
                { label: "PDF 入口", value: 86 },
                { label: "元数据", value: 78 },
                { label: "可替换", value: 92 }
            ],
            items: [
                { title: "论文页截图", label: "Page", href: "publications.html", src: "images/site-screenshots/publications.png" },
                { title: "SSA-RF 论文首图", label: "ACE", href: "files/papers/sun-2024-sparrow-random-forest-weight-class.pdf", src: "images/publications/sun-2024-sparrow-random-forest-weight-class.png" },
                { title: "Profile Mining 占位", label: "Preprint", href: "files/papers/placeholder-profile-mining.pdf", src: "images/publications/placeholder-profile-mining.png" },
                { title: "Toolkit 占位", label: "Workshop", href: "files/papers/placeholder-toolkit.pdf", src: "images/publications/placeholder-toolkit.png" }
            ]
        },
        "materials.html": {
            kicker: "Material Gallery",
            title: "材料库不只列文件，也展示证据外观",
            copy: "把简历、论文、项目页、博客和 API 实验室截图集中展示，让材料入口更像申请/求职资料中台。",
            metrics: [
                { label: "材料入口", value: 92 },
                { label: "筛选检索", value: 84 },
                { label: "视觉证明", value: 88 },
                { label: "后续扩展", value: 93 }
            ],
            items: [
                { title: "材料库截图", label: "Library", href: "materials.html", src: "images/site-screenshots/materials.png" },
                { title: "阶段成果", label: "Resume", href: "resume.html", src: "images/site-screenshots/resume.png" },
                { title: "论文发表", label: "Papers", href: "publications.html", src: "images/site-screenshots/publications.png" },
                { title: "博客索引", label: "Blog", href: "blog.html", src: "images/site-screenshots/blog.png" },
                { title: "API 实验室", label: "API", href: "tools/api_lab.html", src: "images/site-screenshots/api-lab.png" }
            ]
        },
        "resume.html": {
            kicker: "Resume Evidence",
            title: "本科成果与后续阶段的视觉档案",
            copy: "简历页加入页面截图和成果材料预览，方便后续继续补研究生阶段成果。",
            metrics: [
                { label: "本科成果", value: 86 },
                { label: "阶段预留", value: 82 },
                { label: "材料链接", value: 78 },
                { label: "展示完整", value: 88 }
            ],
            items: [
                { title: "阶段成果页", label: "Page", href: "resume.html", src: "images/site-screenshots/resume.png" },
                { title: "本科简历截图", label: "CV", href: "resume.html", src: "images/resume/undergraduate-resume.png" },
                { title: "材料库", label: "Library", href: "materials.html", src: "images/site-screenshots/materials.png" },
                { title: "项目总览", label: "Projects", href: "projects.html", src: "images/site-screenshots/engineering-projects.png" }
            ]
        },
        "blog.html": {
            kicker: "Writing Gallery",
            title: "写作内容配上封面和页面截图",
            copy: "博客页用封面、站内截图和内容分类展示长期写作沉淀，不再只有标题列表。",
            metrics: [
                { label: "写作资产", value: 84 },
                { label: "封面质量", value: 82 },
                { label: "检索体验", value: 78 },
                { label: "长期维护", value: 88 }
            ],
            items: [
                { title: "博客索引截图", label: "Blog", href: "blog.html", src: "images/site-screenshots/blog.png" },
                { title: "保研经验", label: "Guide", href: "blog/baoyan.html", src: "images/blog/baoyan/baoyan.png" },
                { title: "复试技巧", label: "Interview", href: "blog/25_skills.html", src: "images/blog/25_skills/fig1.png" },
                { title: "材料库", label: "Library", href: "materials.html", src: "images/site-screenshots/materials.png" }
            ]
        },
        "api_lab.html": {
            kicker: "API Visual Console",
            title: "API 代理和错误诊断也要可视化",
            copy: "把接口实验室、后端代理、健康检查和失败原因查询做成可展示的工程页面。",
            metrics: [
                { label: "接口覆盖", value: 88 },
                { label: "后端代理", value: 86 },
                { label: "错误解释", value: 82 },
                { label: "页面嵌入", value: 84 }
            ],
            items: [
                { title: "API 实验室截图", label: "API", href: "tools/api_lab.html", src: "images/site-screenshots/api-lab.png" },
                { title: "代理控制台", label: "Proxy", href: "tools/netlify_api_proxy.html", src: "images/engineering-projects/public-api-lab-screenshot.png" },
                { title: "工程项目", label: "Engineering", href: "engineering-projects.html", src: "images/site-screenshots/engineering-projects.png" },
                { title: "材料库", label: "Library", href: "materials.html", src: "images/site-screenshots/materials.png" }
            ]
        },
        "tools/markdown_to_word.html": {
            kicker: "Tool Screenshot Lab",
            title: "Markdown 工具页加入真实渲染截图",
            copy: "工具页不再只是表单和说明文字，而是把编辑器、预览区和导出流程做成可展示的产品证据。",
            metrics: [
                { label: "工具完整度", value: 86 },
                { label: "截图证据", value: 90 },
                { label: "交互清晰度", value: 82 },
                { label: "可复用性", value: 84 }
            ],
            items: [
                { title: "Markdown 转 Word 工具", label: "Markdown", href: "tools/markdown_to_word.html", src: "images/site-screenshots/markdown-to-word.png" },
                { title: "代码高亮工具", label: "Code", href: "tools/code_runner.html", src: "images/site-screenshots/code-runner.png" },
                { title: "Python 学习导航", label: "Python", href: "tools/python_nav.html", src: "images/site-screenshots/python-nav.png" },
                { title: "深度学习资料", label: "DL", href: "tools/deep_learning.html", src: "images/site-screenshots/deep-learning.png" },
                { title: "API 实验室", label: "API", href: "tools/api_lab.html", src: "images/site-screenshots/api-lab.png" }
            ]
        },
        "tools/code_runner.html": {
            kicker: "Tool Screenshot Lab",
            title: "代码工具页也要有视觉证据",
            copy: "把工具入口、代码展示、页面结构和相关学习资料通过截图串起来，形成可被快速理解的工程展示。",
            metrics: [
                { label: "代码体验", value: 84 },
                { label: "页面证据", value: 88 },
                { label: "学习入口", value: 80 },
                { label: "工具链路", value: 82 }
            ],
            items: [
                { title: "代码高亮工具", label: "Code", href: "tools/code_runner.html", src: "images/site-screenshots/code-runner.png" },
                { title: "Markdown 转 Word 工具", label: "Markdown", href: "tools/markdown_to_word.html", src: "images/site-screenshots/markdown-to-word.png" },
                { title: "Python 学习导航", label: "Python", href: "tools/python_nav.html", src: "images/site-screenshots/python-nav.png" },
                { title: "工程项目页", label: "Engineering", href: "engineering-projects.html", src: "images/site-screenshots/engineering-projects.png" }
            ]
        },
        "tools/python_nav.html": {
            kicker: "Learning Visual Map",
            title: "Python 学习页增加截图化导航",
            copy: "学习资料页通过真实截图、章节蓝图和卡片信号条展示内容结构，减少纯文字目录感。",
            metrics: [
                { label: "章节组织", value: 86 },
                { label: "导航清晰", value: 84 },
                { label: "截图证据", value: 88 },
                { label: "资料可达", value: 82 }
            ],
            items: [
                { title: "Python 学习导航", label: "Python", href: "tools/python_nav.html", src: "images/site-screenshots/python-nav.png" },
                { title: "深度学习资料", label: "Deep Learning", href: "tools/deep_learning.html", src: "images/site-screenshots/deep-learning.png" },
                { title: "代码高亮工具", label: "Code", href: "tools/code_runner.html", src: "images/site-screenshots/code-runner.png" },
                { title: "手册入口", label: "Handbook", href: "handbook/index.html", src: "images/site-screenshots/handbook.png" }
            ]
        },
        "tools/deep_learning.html": {
            kicker: "Learning Visual Map",
            title: "深度学习资料页补齐图像化入口",
            copy: "把视频、资料和学习路径整理成可视化的学习证据，让页面看起来更像课程作品集而不是资料列表。",
            metrics: [
                { label: "学习路径", value: 85 },
                { label: "视觉素材", value: 90 },
                { label: "内容密度", value: 82 },
                { label: "可维护性", value: 84 }
            ],
            items: [
                { title: "深度学习资料", label: "Deep Learning", href: "tools/deep_learning.html", src: "images/site-screenshots/deep-learning.png" },
                { title: "Python 学习导航", label: "Python", href: "tools/python_nav.html", src: "images/site-screenshots/python-nav.png" },
                { title: "Markdown 转 Word 工具", label: "Markdown", href: "tools/markdown_to_word.html", src: "images/site-screenshots/markdown-to-word.png" },
                { title: "知识库入口", label: "Library", href: "library/index.html", src: "images/site-screenshots/library.png" }
            ]
        }
    };

    const coreVisualFallbacks = {
        "profile.html": { shot: "profile", label: "Profile", kind: "个人档案" },
        "research.html": { shot: "research", label: "Research", kind: "研究方向" },
        "dashboard.html": { shot: "dashboard", label: "Dashboard", kind: "作品集仪表盘" },
        "achievements.html": { shot: "achievements", label: "Achievement", kind: "成就证明" },
        "roadmap.html": { shot: "roadmap", label: "Roadmap", kind: "长期路线图" },
        "snapshot.html": { shot: "snapshot", label: "Snapshot", kind: "一页式档案" },
        "services.html": { shot: "services", label: "Service", kind: "合作服务" },
        "interview.html": { shot: "interview", label: "Interview", kind: "面试故事" },
        "ai.html": { shot: "ai", label: "AI", kind: "学术助手" },
        "leave_message.html": { shot: "leave-message", label: "Contact", kind: "联系入口" },
        "netlify_api_proxy.html": { shot: "netlify-api-proxy", label: "Proxy", kind: "API 代理控制台", href: "tools/netlify_api_proxy.html" },
        "resume_builder.html": { shot: "resume-builder", label: "Builder", kind: "简历制作工具", href: "tools/resume_builder.html" },
        "handbook/index.html": { shot: "handbook", label: "Handbook", kind: "扩展手册", href: "handbook/index.html" },
        "evidence/index.html": { shot: "evidence", label: "Evidence", kind: "证据档案库", href: "evidence/index.html" },
        "library/index.html": { shot: "library", label: "Library", kind: "知识库入口", href: "library/index.html" },
        "cases/index.html": { shot: "cases", label: "Cases", kind: "案例索引", href: "cases/index.html" },
        "evidence/horizontal-projects/iot-flexible-access-trusted-control.html": { shot: "iot-evidence-page", label: "IoT", kind: "物联网横向项目证据页", href: "evidence/horizontal-projects/iot-flexible-access-trusted-control.html" },
        "evidence/horizontal-projects/ningxia-multi-energy-architecture.html": { shot: "ningxia-evidence-page", label: "Energy", kind: "宁夏多能互补横向项目证据页", href: "evidence/horizontal-projects/ningxia-multi-energy-architecture.html" },
        "evidence/horizontal-projects/minning-green-power-ipv6-terminal-access.html": { shot: "ipv6-evidence-page", label: "IPv6", kind: "IPv6 终端接入网横向项目证据页", href: "evidence/horizontal-projects/minning-green-power-ipv6-terminal-access.html" }
    };

    function getVisualEvidencePreset() {
        const pagePath = getCurrentPagePath();
        const pageKey = getCurrentPageKey();
        if (visualEvidencePresets[pagePath]) return visualEvidencePresets[pagePath];
        if (coreVisualFallbacks[pagePath]) return buildFallbackVisualPreset(coreVisualFallbacks[pagePath], pagePath);
        if (pagePath !== "index.html" && pageKey === "index.html") return null;
        if (visualEvidencePresets[pageKey]) return visualEvidencePresets[pageKey];

        const fallback = coreVisualFallbacks[pageKey];
        if (!fallback) return null;

        return buildFallbackVisualPreset(fallback, pageKey);
    }

    function buildFallbackVisualPreset(fallback, fallbackHref) {
        const pageTitle = getPageTitle();
        return {
            kicker: `${fallback.label} Visual Proof`,
            title: `${pageTitle}的截图证据与相关入口`,
            copy: `${fallback.kind}页面补充真实渲染截图，并关联论文、项目、材料库和工具入口，让访问者能从当前页面继续追踪完整证据链。`,
            metrics: [
                { label: "页面完成", value: 88 },
                { label: "视觉证明", value: 84 },
                { label: "关联入口", value: 82 },
                { label: "可维护", value: 90 }
            ],
            items: [
                { title: pageTitle, label: fallback.label, href: fallback.href || fallbackHref, src: `images/site-screenshots/${fallback.shot}.png` },
                { title: "项目总览", label: "Projects", href: "projects.html", src: "images/site-screenshots/projects.png" },
                { title: "论文发表", label: "Papers", href: "publications.html", src: "images/site-screenshots/publications.png" },
                { title: "材料库", label: "Library", href: "materials.html", src: "images/site-screenshots/materials.png" },
                { title: "工程项目", label: "Engineering", href: "engineering-projects.html", src: "images/site-screenshots/engineering-projects.png" }
            ]
        };
    }

    function renderVisualEvidenceDeck() {
        const main = getMainContent();
        if (!main) return;

        const preset = getVisualEvidencePreset();
        if (!preset || !preset.items?.length) return;

        let deck = main.querySelector(".site-visual-showcase");
        if (!deck) {
            deck = document.createElement("section");
            deck.className = "site-visual-showcase";
            deck.setAttribute("aria-label", "视觉证据看板");
            const intel = main.querySelector(".page-intel-strip");
            const hero = main.querySelector(".page-hero, .hero-redesign, .resume-hero");
            if (intel) intel.insertAdjacentElement("afterend", deck);
            else if (hero) hero.insertAdjacentElement("afterend", deck);
            else main.prepend(deck);
        }

        const items = preset.items.slice(0, 6);
        const primary = items[0];
        const rest = items.slice(1);
        const metrics = preset.metrics || [];
        const metricAverage = Math.round(metrics.reduce((sum, item) => sum + item.value, 0) / Math.max(metrics.length, 1));

        deck.innerHTML = `
            <div class="visual-showcase-inner">
                <div class="visual-showcase-head">
                    <div>
                        <span>${escapeHtml(preset.kicker)}</span>
                        <h2>${escapeHtml(preset.title)}</h2>
                    </div>
                    <p>${escapeHtml(preset.copy)}</p>
                </div>
                <div class="visual-showcase-layout">
                    <div class="screenshot-stage">
                        <a class="screenshot-card screenshot-card-main" href="${localAsset(primary.href)}">
                            <img src="${localAsset(primary.src)}" alt="${escapeHtml(primary.title)}截图" loading="lazy" decoding="async">
                            <span>${escapeHtml(primary.label)}</span>
                            <strong>${escapeHtml(primary.title)}</strong>
                        </a>
                        <div class="screenshot-stack">
                            ${rest.map((item, index) => `
                                <a class="screenshot-card" href="${localAsset(item.href)}" style="--shot-index:${index}">
                                    <img src="${localAsset(item.src)}" alt="${escapeHtml(item.title)}截图" loading="lazy" decoding="async">
                                    <span>${escapeHtml(item.label)}</span>
                                    <strong>${escapeHtml(item.title)}</strong>
                                </a>
                            `).join("")}
                        </div>
                    </div>
                    <aside class="visual-radar-panel">
                        <div class="radar-dial" style="--score:${metricAverage * 3.6}deg">
                            <strong>${metricAverage}</strong>
                            <span>Visual Index</span>
                        </div>
                        <div class="signal-bars">
                            ${metrics.map((metric) => `
                                <div class="signal-bar" style="--bar:${metric.value}%">
                                    <span>${escapeHtml(metric.label)}</span>
                                    <strong>${metric.value}</strong>
                                    <em></em>
                                </div>
                            `).join("")}
                        </div>
                    </aside>
                </div>
            </div>
        `;
    }

    function renderCardScreenshotThumbs() {
        const main = getMainContent();
        if (!main) return;

        const preset = getVisualEvidencePreset();
        const shots = (preset?.items || [])
            .filter((item) => item.src && item.href)
            .slice(0, 6);
        if (!shots.length) return;

        const cardSelectors = [
            ".surface-card",
            ".material-card",
            ".capability-card",
            ".roadmap-card",
            ".achievement-card",
            ".service-card",
            ".story-card",
            ".library-card",
            ".resource-card",
            ".framework-card",
            ".nav-card",
            ".example-card",
            ".case-block",
            ".handbook-section",
            ".evidence-section"
        ].join(",");

        Array.from(main.querySelectorAll(cardSelectors))
            .filter((card) => {
                if (card.closest(".site-visual-showcase, .page-constellation, .page-media-filmstrip, .page-intel-strip, .section-signal, .section-blueprint, header, footer")) return false;
                if (card.querySelector(":scope > .card-proof-thumb")) return false;
                if (card.querySelector("img, video, canvas, iframe")) return false;
                return getReadableText(card).length >= 80;
            })
            .slice(0, 36)
            .forEach((card, index) => {
                const shot = shots[index % shots.length];
                const isCardLink = card.matches("a");
                const thumb = document.createElement(isCardLink ? "div" : "a");
                thumb.className = "card-proof-thumb";
                thumb.innerHTML = `
                    <img src="${localAsset(shot.src)}" alt="${escapeHtml(shot.title)} screenshot" loading="lazy" decoding="async">
                    <span>${escapeHtml(shot.label || "Visual")}</span>
                `;
                if (!isCardLink) {
                    thumb.setAttribute("href", localAsset(shot.href));
                    thumb.setAttribute("aria-label", `${shot.title} screenshot`);
                } else {
                    thumb.setAttribute("aria-hidden", "true");
                }
                card.classList.add("has-card-proof-thumb");
                card.prepend(thumb);
            });
    }

    function initAmbientLayer() {
        if (document.querySelector(".ambient-stage")) return;

        const stage = document.createElement("div");
        stage.className = "ambient-stage";
        stage.setAttribute("aria-hidden", "true");
        stage.innerHTML = '<span class="ambient-grid"></span><span class="ambient-ribbon one"></span><span class="ambient-ribbon two"></span>';
        document.body.prepend(stage);

        if (window.matchMedia("(pointer: fine)").matches) {
            window.addEventListener("pointermove", (event) => {
                document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
                document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
            }, { passive: true });
        }
    }

    function renderPageIntelligence() {
        const main = getMainContent();
        if (!main) return;

        const text = getReadableText(main);
        const charCount = text.replace(/\s/g, "").length;
        const headings = getPageHeadings(main);
        const images = Array.from(main.querySelectorAll("img")).filter((img) => !img.closest(".page-intel-strip") && !img.closest(".page-constellation"));
        const links = Array.from(main.querySelectorAll("a[href]")).filter((link) => !link.closest(".page-intel-strip") && !link.closest(".page-motion-ticker") && !link.closest(".page-constellation"));
        const readingMinutes = Math.max(1, Math.ceil(charCount / 650));
        const pageTitle = getPageTitle();

        const cards = [
            { icon: "fa-hourglass-half", label: "阅读时间", value: `${readingMinutes} min` },
            { icon: "fa-diagram-project", label: "内容区块", value: `${Math.max(1, headings.length)}` },
            { icon: "fa-image", label: "视觉素材", value: `${images.length}` },
            { icon: "fa-link", label: "可点入口", value: `${links.length}` }
        ];

        let strip = main.querySelector(".page-intel-strip");
        if (!strip) {
            strip = document.createElement("section");
            strip.className = "page-intel-strip";
            strip.setAttribute("aria-label", "页面情报概览");
            const hero = main.querySelector(".page-hero, .hero-redesign, .resume-hero");
            if (hero) hero.insertAdjacentElement("afterend", strip);
            else main.prepend(strip);
        }

        strip.innerHTML = `
            <div class="page-intel-copy">
                <span>Page Signal</span>
                <strong>${escapeHtml(pageTitle)}</strong>
            </div>
            <div class="page-intel-grid">
                ${cards.map((card) => `
                    <div class="page-intel-card">
                        <i class="fas ${card.icon}" aria-hidden="true"></i>
                        <span>${escapeHtml(card.label)}</span>
                        <strong>${escapeHtml(card.value)}</strong>
                    </div>
                `).join("")}
            </div>
        `;
    }

    function renderMotionTicker() {
        const main = getMainContent();
        if (!main) return;

        const headings = getPageHeadings(main).slice(0, 7);
        const actions = Array.from(main.querySelectorAll(".text-link[href], .btn[href]"))
            .filter((link) => !link.closest(".page-constellation"))
            .map((link) => ({
                text: link.textContent.trim().replace(/\s+/g, " "),
                href: link.getAttribute("href")
            }))
            .filter((item) => item.text && item.href)
            .slice(0, 5);
        const items = [
            ...headings.map((item, index) => ({
                text: item.text,
                href: `#${ensureHeadingId(item.node, index)}`
            })),
            ...actions
        ].slice(0, 8);

        let ticker = main.querySelector(".page-motion-ticker");
        if (items.length < 3) {
            ticker?.remove();
            return;
        }

        if (!ticker) {
            ticker = document.createElement("section");
            ticker.className = "page-motion-ticker";
            ticker.setAttribute("aria-label", "页面重点速览");
            const intel = main.querySelector(".page-intel-strip");
            if (intel) intel.insertAdjacentElement("afterend", ticker);
            else main.prepend(ticker);
        }

        const track = [...items, ...items].map((item) => `
            <a href="${item.href}">
                <i class="fas fa-sparkles" aria-hidden="true"></i>
                <span>${escapeHtml(item.text)}</span>
            </a>
        `).join("");
        ticker.innerHTML = `<div class="motion-track">${track}</div>`;
    }

    function renderMediaFilmstrip() {
        const main = getMainContent();
        if (!main) return;

        const images = Array.from(main.querySelectorAll("img"))
            .filter((img) => {
                const src = img.getAttribute("src") || "";
                return src && !img.closest("header") && !img.closest(".site-visual-showcase") && !img.closest(".page-media-filmstrip") && !img.closest(".page-constellation") && !img.classList.contains("profile-img");
            })
            .slice(0, 8);

        let strip = main.querySelector(".page-media-filmstrip");
        if (images.length < 2) {
            strip?.remove();
            return;
        }

        if (!strip) {
            strip = document.createElement("section");
            strip.className = "page-media-filmstrip";
            strip.setAttribute("aria-label", "页面视觉素材速览");
            const ticker = main.querySelector(".page-motion-ticker");
            const intel = main.querySelector(".page-intel-strip");
            if (ticker) ticker.insertAdjacentElement("afterend", strip);
            else if (intel) intel.insertAdjacentElement("afterend", strip);
            else main.prepend(strip);
        }

        strip.innerHTML = `
            <div class="filmstrip-head">
                <span>Visual Deck</span>
                <strong>${images.length} 张页面素材</strong>
            </div>
            <div class="filmstrip-track">
                ${images.map((img, index) => {
                    const src = img.currentSrc || img.src || img.getAttribute("src");
                    const alt = img.getAttribute("alt") || `页面视觉素材 ${index + 1}`;
                    return `<a href="${src}" target="_blank" rel="noopener noreferrer"><img src="${src}" alt="${escapeHtml(alt)}" loading="lazy"></a>`;
                }).join("")}
            </div>
        `;
    }

    function renderPageConstellation() {
        const main = getMainContent();
        if (!main) return;

        const headings = getPageHeadings(main).slice(0, 6);
        const keywords = getPageKeywords(main);
        const actions = getPageActions(main);
        const pageTitle = getPageTitle();
        const signals = headings.length + keywords.length + actions.length;
        let constellation = main.querySelector(".page-constellation");

        if (signals < 4) {
            constellation?.remove();
            return;
        }

        if (!constellation) {
            constellation = document.createElement("section");
            constellation.className = "page-constellation";
            constellation.setAttribute("aria-label", "页面内容星图");
            const filmstrip = main.querySelector(".page-media-filmstrip");
            const ticker = main.querySelector(".page-motion-ticker");
            const intel = main.querySelector(".page-intel-strip");
            if (filmstrip) filmstrip.insertAdjacentElement("afterend", constellation);
            else if (ticker) ticker.insertAdjacentElement("afterend", constellation);
            else if (intel) intel.insertAdjacentElement("afterend", constellation);
            else main.prepend(constellation);
        }

        const orbitNodes = headings.length ? headings : keywords.slice(0, 6).map((keyword) => ({ text: keyword }));
        constellation.innerHTML = `
            <div class="constellation-visual" aria-hidden="true">
                <div class="constellation-core">
                    <span>Focus</span>
                    <strong>${escapeHtml(pageTitle)}</strong>
                </div>
                ${orbitNodes.slice(0, 6).map((item, index) => `
                    <span class="constellation-node node-${index + 1}">
                        <i class="fas fa-circle"></i>
                        <em>${escapeHtml(item.text)}</em>
                    </span>
                `).join("")}
            </div>
            <div class="constellation-panel">
                <div class="constellation-heading">
                    <span>Content Map</span>
                    <h2>页面内容星图</h2>
                    <p>自动从本页章节、关键词和操作入口生成，用来把长页面变成可扫读的视觉导航。</p>
                </div>
                <div class="keyword-lattice">
                    ${keywords.slice(0, 10).map((keyword, index) => `<span style="--chip-index:${index}">${escapeHtml(keyword)}</span>`).join("")}
                </div>
                ${actions.length ? `
                    <div class="action-cluster">
                        ${actions.map((action, index) => `
                            <a href="${action.href}" style="--action-index:${index}">
                                <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>
                                <span>${escapeHtml(action.text)}</span>
                            </a>
                        `).join("")}
                    </div>
                ` : ""}
            </div>
        `;
    }

    function renderSectionSignals() {
        const main = getMainContent();
        if (!main) return;

        const skipClasses = [
            "page-hero",
            "hero-redesign",
            "resume-hero",
            "page-intel-strip",
            "page-motion-ticker",
            "page-media-filmstrip",
            "page-constellation",
            "site-visual-showcase",
            "section-blueprint"
        ];

        const sections = Array.from(main.querySelectorAll(":scope > section, :scope > .resume-builder-container, :scope > .markdown-converter-container, :scope > .resource-grid, :scope > .nav-grid, :scope > .video-section, .handbook-section, .evidence-section, .case-block"))
            .filter((section) => {
                if (skipClasses.some((className) => section.classList.contains(className))) return false;
                if (section.closest(".page-constellation, .page-media-filmstrip, .page-intel-strip, .site-visual-showcase")) return false;
                const text = getReadableText(section);
                if (section.matches(".resume-builder-container, .markdown-converter-container, .resource-grid, .nav-grid, .video-section")) return text.length >= 50;
                return text.length >= 90;
            })
            .slice(0, 18);

        sections.forEach((section, index) => {
            const host = section.querySelector(":scope > .container") || section;
            let signal = host.querySelector(":scope > .section-signal");
            const title = section.querySelector("h2, h3, h1")?.textContent.trim().replace(/\s+/g, " ") || `Section ${index + 1}`;
            const contentText = Array.from(host.childNodes)
                .filter((node) => !(node.nodeType === 1 && (node.classList?.contains("section-signal") || node.classList?.contains("section-blueprint"))))
                .map((node) => node.textContent || "")
                .join(" ")
                .replace(/\s+/g, " ")
                .trim();
            const charCount = contentText.replace(/\s/g, "").length;
            const readingMinutes = Math.max(1, Math.ceil(charCount / 520));
            const links = Array.from(section.querySelectorAll("a[href]")).filter((link) => !link.closest(".section-signal, .section-blueprint")).length;
            const images = Array.from(section.querySelectorAll("img")).filter((img) => !img.closest(".section-signal, .section-blueprint")).length;
            const energy = Math.min(100, 26 + readingMinutes * 12 + links * 7 + images * 9);

            if (!signal) {
                signal = document.createElement("div");
                signal.className = "section-signal";
                signal.setAttribute("aria-label", "内容区块信号");
                host.prepend(signal);
            }

            signal.style.setProperty("--section-meter", `${energy}%`);
            signal.innerHTML = `
                <span class="section-signal-index">S${String(index + 1).padStart(2, "0")}</span>
                <div class="section-signal-main">
                    <strong>${escapeHtml(title)}</strong>
                    <span><em></em></span>
                </div>
                <div class="section-signal-metrics">
                    <span><i class="fas fa-clock" aria-hidden="true"></i>${readingMinutes}m</span>
                    <span><i class="fas fa-link" aria-hidden="true"></i>${links}</span>
                    <span><i class="fas fa-image" aria-hidden="true"></i>${images}</span>
                </div>
            `;
        });
    }

    function renderSectionBlueprints() {
        const main = getMainContent();
        if (!main) return;

        const skipClasses = [
            "page-hero",
            "hero-redesign",
            "resume-hero",
            "page-intel-strip",
            "page-motion-ticker",
            "page-media-filmstrip",
            "page-constellation",
            "site-visual-showcase"
        ];

        const sections = Array.from(main.querySelectorAll(":scope > section, :scope > .resume-builder-container, :scope > .markdown-converter-container, :scope > .resource-grid, :scope > .nav-grid, :scope > .video-section, .handbook-section, .evidence-section, .case-block"))
            .filter((section) => {
                if (skipClasses.some((className) => section.classList.contains(className))) return false;
                if (section.closest(".page-constellation, .page-media-filmstrip, .page-intel-strip, .site-visual-showcase")) return false;
                const text = getReadableText(section);
                if (section.matches(".resume-builder-container, .markdown-converter-container, .resource-grid, .nav-grid, .video-section")) return text.length >= 50;
                return text.length >= 150;
            })
            .slice(0, 14);

        function getBlueprintKind(section) {
            const text = getReadableText(section);
            if (section.querySelector("[data-api-widget], .api-card, .proxy-api-card") || /API|Functions|接口|代理/.test(text)) {
                return { label: "接口", icon: "fa-plug" };
            }
            if (section.querySelector(".publication-card") || /论文|PDF|DOI|Publication/i.test(text)) {
                return { label: "论文", icon: "fa-file-lines" };
            }
            if (section.querySelector(".project-showcase, .project-actions") || /项目|交付|验收|工程/.test(text)) {
                return { label: "项目", icon: "fa-diagram-project" };
            }
            if (section.querySelector("img") || /截图|视觉|证据|材料/.test(text)) {
                return { label: "证据", icon: "fa-image" };
            }
            return { label: "内容", icon: "fa-layer-group" };
        }

        sections.forEach((section, index) => {
            const host = section.querySelector(":scope > .container") || section;
            let blueprint = host.querySelector(":scope > .section-blueprint");
            const rawText = Array.from(host.childNodes)
                .filter((node) => !(node.nodeType === 1 && (node.classList?.contains("section-signal") || node.classList?.contains("section-blueprint"))))
                .map((node) => node.textContent || "")
                .join(" ")
                .replace(/\s+/g, " ")
                .trim();
            const charCount = rawText.replace(/\s/g, "").length;
            const title = section.querySelector("h2, h3, h1")?.textContent.trim().replace(/\s+/g, " ") || `Section ${index + 1}`;
            const links = Array.from(section.querySelectorAll("a[href]")).filter((link) => !link.closest(".section-signal, .section-blueprint")).length;
            const images = Array.from(section.querySelectorAll("img")).filter((img) => !img.closest(".section-signal, .section-blueprint")).length;
            const cards = Array.from(section.querySelectorAll(".surface-card, .project-showcase, .publication-card, .material-card, .blog-card, .timeline-card")).length;
            const lists = Array.from(section.querySelectorAll("ul, ol")).filter((list) => !list.closest(".section-signal, .section-blueprint")).length;
            const codeBlocks = section.querySelectorAll("pre, code").length;
            const kind = getBlueprintKind(section);
            const density = Math.min(100, Math.max(12, Math.ceil(charCount / 22)));
            const evidence = Math.min(100, 18 + images * 18 + links * 9 + cards * 8);
            const structure = Math.min(100, 24 + lists * 16 + cards * 12 + codeBlocks * 10);
            const action = Math.min(100, 16 + links * 14 + Math.min(cards, 4) * 8);
            const average = Math.round((density + evidence + structure + action) / 4);
            const cells = [density, evidence, structure, action, average, Math.max(18, 100 - Math.abs(density - structure))];
            const metrics = [
                { label: "密度", value: `${Math.max(1, Math.ceil(charCount / 520))}m`, meter: density, icon: "fa-align-left" },
                { label: "证据", value: `${images + links}`, meter: evidence, icon: "fa-shield-halved" },
                { label: "结构", value: `${cards + lists}`, meter: structure, icon: "fa-table-cells-large" },
                { label: "行动", value: `${links}`, meter: action, icon: "fa-arrow-up-right-from-square" }
            ];

            if (!blueprint) {
                blueprint = document.createElement("div");
                blueprint.className = "section-blueprint";
                blueprint.setAttribute("aria-label", "章节视觉蓝图");
                const signal = host.querySelector(":scope > .section-signal");
                if (signal) signal.insertAdjacentElement("afterend", blueprint);
                else host.prepend(blueprint);
            }

            blueprint.style.setProperty("--blueprint-score", `${average * 3.6}deg`);
            blueprint.innerHTML = `
                <div class="blueprint-map" aria-hidden="true">
                    <span class="blueprint-map-label">S${String(index + 1).padStart(2, "0")}</span>
                    <div class="blueprint-track-lines">
                        ${metrics.map((metric, metricIndex) => `<span style="--line-meter:${metric.meter}%;--line-index:${metricIndex}"></span>`).join("")}
                    </div>
                    <div class="blueprint-cell-grid">
                        ${cells.map((cell, cellIndex) => `<span style="--cell-level:${cell}%;--cell-index:${cellIndex}"></span>`).join("")}
                    </div>
                </div>
                <div class="blueprint-copy">
                    <span class="blueprint-kind"><i class="fas ${kind.icon}" aria-hidden="true"></i>${escapeHtml(kind.label)}蓝图</span>
                    <strong>${escapeHtml(title)}</strong>
                    <div class="blueprint-metrics">
                        ${metrics.map((metric) => `
                            <span style="--metric-meter:${metric.meter}%">
                                <i class="fas ${metric.icon}" aria-hidden="true"></i>
                                <em>${escapeHtml(metric.label)}</em>
                                <b>${escapeHtml(metric.value)}</b>
                            </span>
                        `).join("")}
                    </div>
                </div>
                <div class="blueprint-score" aria-hidden="true">
                    <strong>${average}</strong>
                    <span>Index</span>
                </div>
            `;
        });
    }

    function renderCardMicroWidgets() {
        const main = getMainContent();
        if (!main) return;

        const cardSelectors = [
            ".publication-card",
            ".project-showcase",
            ".surface-card",
            ".material-card",
            ".capability-card",
            ".blog-card",
            ".timeline-card",
            ".metric-card",
            ".roadmap-card",
            ".achievement-card",
            ".service-card",
            ".story-card",
            ".library-card",
            ".resource-card",
            ".framework-card",
            ".nav-card",
            ".video-card",
            ".example-card",
            ".case-block",
            ".handbook-section",
            ".evidence-section",
            ".api-card",
            ".api-widget-card",
            ".proxy-api-card"
        ].join(",");

        function getCardKind(card) {
            if (card.matches(".project-showcase")) return { label: "Project", icon: "fa-diagram-project" };
            if (card.matches(".publication-card")) return { label: "Paper", icon: "fa-file-lines" };
            if (card.matches(".material-card")) return { label: "Material", icon: "fa-box-archive" };
            if (card.matches(".blog-card")) return { label: "Post", icon: "fa-pen-nib" };
            if (card.matches(".handbook-section")) return { label: "Guide", icon: "fa-book-open" };
            if (card.matches(".evidence-section")) return { label: "Proof", icon: "fa-shield-halved" };
            if (card.matches(".api-card, .api-widget-card, .proxy-api-card")) return { label: "API", icon: "fa-plug" };
            if (card.matches(".metric-card")) return { label: "Metric", icon: "fa-chart-simple" };
            return { label: "Signal", icon: "fa-sparkles" };
        }

        Array.from(main.querySelectorAll(cardSelectors))
            .filter((card) => {
                if (card.closest(".site-visual-showcase, .page-constellation, .page-media-filmstrip, .page-intel-strip, .section-signal, header, footer")) return false;
                return getReadableText(card).length >= 40;
            })
            .slice(0, 80)
            .forEach((card) => {
                const kind = getCardKind(card);
                const text = getReadableText(card);
                const links = Array.from(card.querySelectorAll("a[href]")).filter((link) => !link.closest(".card-micro-widget")).length;
                const images = Array.from(card.querySelectorAll("img")).filter((img) => !img.closest(".card-micro-widget")).length;
                const density = Math.min(99, Math.max(1, Math.ceil(text.replace(/\s/g, "").length / 90)));
                let widget = card.querySelector(":scope > .card-micro-widget");

                card.classList.add("has-card-micro-widget");
                if (!widget) {
                    widget = document.createElement("div");
                    widget.className = "card-micro-widget";
                    widget.setAttribute("aria-hidden", "true");
                    card.appendChild(widget);
                }

                widget.innerHTML = `
                    <span class="micro-kind"><i class="fas ${kind.icon}" aria-hidden="true"></i>${escapeHtml(kind.label)}</span>
                    <span><i class="fas fa-link" aria-hidden="true"></i>${links}</span>
                    <span><i class="fas fa-image" aria-hidden="true"></i>${images}</span>
                    <span><i class="fas fa-wave-square" aria-hidden="true"></i>${density}</span>
                `;
            });
    }

    function renderCardSignalStrips() {
        const main = getMainContent();
        if (!main) return;

        const cardSelectors = [
            ".publication-card",
            ".project-showcase",
            ".surface-card",
            ".material-card",
            ".capability-card",
            ".blog-card",
            ".timeline-card",
            ".roadmap-card",
            ".achievement-card",
            ".service-card",
            ".story-card",
            ".library-card",
            ".resource-card",
            ".framework-card",
            ".nav-card",
            ".video-card",
            ".example-card",
            ".case-block",
            ".handbook-section",
            ".evidence-section"
        ].join(",");

        Array.from(main.querySelectorAll(cardSelectors))
            .filter((card) => {
                if (card.closest(".site-visual-showcase, .page-constellation, .page-media-filmstrip, .page-intel-strip, .section-signal, .section-blueprint, header, footer")) return false;
                return getReadableText(card).length >= 70;
            })
            .slice(0, 90)
            .forEach((card) => {
                const textLength = getReadableText(card).replace(/\s/g, "").length;
                const links = card.querySelectorAll("a[href]").length;
                const images = card.querySelectorAll("img").length;
                const headings = card.querySelectorAll("h2, h3, h4").length;
                const values = [
                    Math.min(100, 18 + textLength / 18),
                    Math.min(100, 16 + links * 24),
                    Math.min(100, 16 + images * 30),
                    Math.min(100, 20 + headings * 20)
                ];
                let strip = card.querySelector(":scope > .card-signal-strip");

                card.classList.add("has-card-signal-strip");
                if (!strip) {
                    strip = document.createElement("div");
                    strip.className = "card-signal-strip";
                    strip.setAttribute("aria-hidden", "true");
                    card.appendChild(strip);
                }

                strip.innerHTML = values.map((value, index) => `<span style="--strip-meter:${value}%;--strip-index:${index}"></span>`).join("");
            });
    }

    function renderSectionCompass() {
        const main = getMainContent();
        if (!main) return;

        document.querySelector(".section-compass")?.remove();
        if (sectionCompassObserver) sectionCompassObserver.disconnect();

        const headings = getPageHeadings(main).slice(0, 8);
        if (headings.length < 3) return;

        const compass = document.createElement("nav");
        compass.className = "section-compass";
        compass.setAttribute("aria-label", "章节雷达");
        compass.innerHTML = `
            <span class="section-compass-title">Sections</span>
            ${headings.map((item, index) => {
                const id = ensureHeadingId(item.node, index);
                return `<a href="#${id}" data-compass-target="${id}"><span>${index + 1}</span><em>${item.text}</em></a>`;
            }).join("")}
        `;
        document.body.appendChild(compass);

        const links = Array.from(compass.querySelectorAll("a"));
        function activate(id) {
            links.forEach((link) => link.classList.toggle("active", link.dataset.compassTarget === id));
        }

        if ("IntersectionObserver" in window) {
            sectionCompassObserver = new IntersectionObserver((entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0];
                if (visible) activate(visible.target.id);
            }, { rootMargin: "-18% 0px -68% 0px", threshold: 0.01 });
            headings.forEach((item) => sectionCompassObserver.observe(item.node));
        }
        activate(headings[0].node.id);
    }

    function renderGlobalVisualWidgets() {
        initAmbientLayer();
        renderPageIntelligence();
        renderVisualEvidenceDeck();
        renderCardScreenshotThumbs();
        renderMotionTicker();
        renderMediaFilmstrip();
        renderPageConstellation();
        renderSectionSignals();
        renderSectionBlueprints();
        renderCardMicroWidgets();
        renderCardSignalStrips();
        renderSectionCompass();
    }

    function initPageEnhancements() {
        const main = document.querySelector("main");
        if (main && !main.querySelector(".page-side-rail")) {
            const rail = document.createElement("aside");
            rail.className = "page-side-rail";
            rail.setAttribute("aria-label", "页面快速定位");

            const headings = Array.from(main.querySelectorAll("h2"))
                .filter((heading) => heading.textContent.trim().length > 0)
                .slice(0, 8);
            if (headings.length >= 2) {
                rail.innerHTML = `
                    <div class="rail-title">On this page</div>
                    ${headings.map((heading, index) => {
                        if (!heading.id) heading.id = `section-${index + 1}`;
                        return `<a href="#${heading.id}">${heading.textContent.trim()}</a>`;
                    }).join("")}
                `;
                main.appendChild(rail);
            }
        }

        const revealItems = document.querySelectorAll(".section-band, .surface-card, .project-showcase, .publication-card, .handbook-section, .evidence-section, .blog-card, .timeline-card, .metric-card, .material-card, .capability-card");
        revealItems.forEach((item, index) => {
            item.classList.add("reveal-ready");
            item.style.setProperty("--reveal-delay", `${Math.min(index, 8) * 35}ms`);
        });

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("reveal-in");
                    observer.unobserve(entry.target);
                });
            }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
            revealItems.forEach((item) => observer.observe(item));
        } else {
            revealItems.forEach((item) => item.classList.add("reveal-in"));
        }

        document.querySelectorAll(".publication-card, .project-showcase, .surface-card, .material-card, .capability-card, .blog-card").forEach((card) => {
            card.classList.add("premium-surface");
        });

        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && window.matchMedia("(pointer: fine)").matches) {
            document.querySelectorAll(".premium-surface").forEach((card) => {
                if (card.dataset.tiltReady === "true") return;
                card.dataset.tiltReady = "true";
                card.addEventListener("pointermove", (event) => {
                    const rect = card.getBoundingClientRect();
                    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
                    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
                    card.style.setProperty("--tilt-x", `${(-y * 3).toFixed(2)}deg`);
                    card.style.setProperty("--tilt-y", `${(x * 3).toFixed(2)}deg`);
                    card.style.setProperty("--glow-x", `${event.clientX - rect.left}px`);
                    card.style.setProperty("--glow-y", `${event.clientY - rect.top}px`);
                }, { passive: true });
                card.addEventListener("pointerleave", () => {
                    card.style.setProperty("--tilt-x", "0deg");
                    card.style.setProperty("--tilt-y", "0deg");
                    card.style.removeProperty("--glow-x");
                    card.style.removeProperty("--glow-y");
                });
            });
        }
    }

    function refreshEnhancements() {
        sanitizeLinks();
        initPageEnhancements();
        renderGlobalVisualWidgets();
    }

    enhanceNavigation();
    initHeaderState();
    markActiveNav();
    window.addEventListener("hashchange", markActiveNav);
    initThemeToggle();
    initReadingProgress();
    initCommandPalette();
    initPageActionBar();
    renderGlobalVisualWidgets();
    initScrollTopButton();
    initContactValidation();
    refreshEnhancements();
    window.symgoRefreshEnhancements = refreshEnhancements;
    document.addEventListener("symgo:content-updated", refreshEnhancements);
})();
