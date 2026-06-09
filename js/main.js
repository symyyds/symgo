document.addEventListener("DOMContentLoaded", function () {
    const isNestedPage = window.location.pathname.includes("/blog/") || window.location.pathname.includes("/tools/");
    const prefix = isNestedPage ? "../" : "";

    function enhanceNavigation() {
        const navList = document.querySelector("nav ul");
        if (!navList) return;

        const existing = new Set(Array.from(navList.querySelectorAll("a")).map((link) => link.getAttribute("href")));

        function insertItem(href, label, beforeSelector) {
            if (existing.has(href) || existing.has(prefix + href)) return;
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = prefix + href;
            a.textContent = label;
            li.appendChild(a);
            const before = beforeSelector ? navList.querySelector(beforeSelector)?.parentElement : null;
            navList.insertBefore(li, before || null);
            existing.add(prefix + href);
        }

        insertItem("profile.html", "档案", 'a[href$="publications.html"]');
        insertItem("dashboard.html", "仪表盘", 'a[href$="profile.html"]');
        insertItem("research.html", "研究", 'a[href$="publications.html"]');
        insertItem("achievements.html", "成就", 'a[href$="projects.html"]');
        insertItem("materials.html", "材料", 'a[href$="blog.html"]');
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
        const currentPage = pathParts[pathParts.length - 1] || "index.html";
        const currentSection = pathParts.length > 1 ? pathParts[pathParts.length - 2] : "";

        document.querySelectorAll("nav ul li a").forEach((link) => {
            const href = link.getAttribute("href") || "";
            const normalized = href.split("/").pop();
            const isHome = currentPage === "" && normalized === "index.html";
            const isBlogChild = currentSection === "blog" && normalized === "blog.html";
            const isToolChild = currentSection === "tools" && normalized === currentPage;
            const isToolMenu = currentSection === "tools" && href === "#";
            link.classList.toggle("active", normalized === currentPage || isHome || isBlogChild || isToolChild || isToolMenu);
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
            { label: "论文发表", desc: "论文、级别、PDF 与相关项目", href: "publications.html", icon: "fa-file-lines" },
            { label: "项目展示", desc: "工程项目与横向项目 case study", href: "projects.html", icon: "fa-diagram-project" },
            { label: "材料库", desc: "CV、论文、项目证据和升学资料", href: "materials.html", icon: "fa-box-archive" },
            { label: "博客文章", desc: "升学经验、技术笔记和写作证明", href: "blog.html", icon: "fa-pen-nib" },
            { label: "AI助手", desc: "本地历史记录和文档问答", href: "ai.html", icon: "fa-wand-magic-sparkles" },
            { label: "简历制作", desc: "在线简历工具原型", href: "tools/resume_builder.html", icon: "fa-file-signature" }
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
                    <input type="search" placeholder="搜索页面、材料、项目或功能">
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

    enhanceNavigation();
    initHeaderState();
    markActiveNav();
    initThemeToggle();
    initReadingProgress();
    initCommandPalette();
    initScrollTopButton();
    initContactValidation();
});
