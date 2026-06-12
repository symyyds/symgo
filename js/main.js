document.addEventListener("DOMContentLoaded", function () {
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
                { label: "项目总览", href: "projects.html", desc: "工程项目与横向项目 case study" },
                { label: "工程项目", href: "projects.html#engineering-projects", desc: "独立开发、部署与维护能力" },
                { label: "横向项目", href: "projects.html#horizontal-projects", desc: "需求理解、协作交付与验收" },
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
                { label: "API 实验室", href: "tools/api_lab.html", desc: "public-apis 接入与健康检查" }
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
            { label: "项目展示", desc: "工程项目与横向项目 case study", href: "projects.html", icon: "fa-diagram-project" },
            { label: "材料库", desc: "CV、论文、项目证据和升学资料", href: "materials.html", icon: "fa-box-archive" },
            { label: "博客文章", desc: "升学经验、技术笔记和写作证明", href: "blog.html", icon: "fa-pen-nib" },
            { label: "AI助手", desc: "本地历史记录和文档问答", href: "ai.html", icon: "fa-wand-magic-sparkles" },
            { label: "复试抽题", desc: "专业课随机抽题练习", href: "test.html", icon: "fa-shuffle" },
            { label: "简历制作", desc: "在线简历工具原型", href: "tools/resume_builder.html", icon: "fa-file-signature" },
            { label: "API 实验室", desc: "public-apis 接入、健康检查和后端代理候选", href: "tools/api_lab.html", icon: "fa-plug" }
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
    }

    enhanceNavigation();
    initHeaderState();
    markActiveNav();
    window.addEventListener("hashchange", markActiveNav);
    initThemeToggle();
    initReadingProgress();
    initCommandPalette();
    initPageActionBar();
    initScrollTopButton();
    initContactValidation();
    refreshEnhancements();
    window.symgoRefreshEnhancements = refreshEnhancements;
    document.addEventListener("symgo:content-updated", refreshEnhancements);
});
