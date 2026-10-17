(function () {
    function getPrefix() {
        const parts = window.location.pathname.split("/").filter(Boolean);
        if (!parts.length) return "";
        const last = parts[parts.length - 1];
        const depth = last.includes(".") ? parts.length - 1 : parts.length;
        return depth > 0 ? "../".repeat(depth) : "";
    }

    function wrapContent() {
        if (document.body.classList.contains("legacy-ready")) return;
        document.body.classList.add("legacy-ready");
        document.body.classList.add("legacy-page");

        const prefix = getPrefix();
        const title = document.title || "学习资料";
        const sourceRoot = document.querySelector("main") || document.body;
        const existingNodes = Array.from(sourceRoot.childNodes).filter((node) => {
            if (node.nodeType !== Node.ELEMENT_NODE) return true;
            const tag = node.tagName.toLowerCase();
            return tag !== "script" && tag !== "header" && tag !== "footer";
        });
        const content = document.createElement("article");
        content.className = document.body.classList.contains("template-preview") ? "legacy-content legacy-template-board" : "legacy-content";
        existingNodes.forEach((node) => content.appendChild(node));
        content.querySelectorAll("h1").forEach((heading) => {
            const replacement = document.createElement("h2");
            for (const attribute of heading.attributes) replacement.setAttribute(attribute.name, attribute.value);
            replacement.append(...heading.childNodes);
            heading.replaceWith(replacement);
        });

        const topbar = document.createElement("header");
        topbar.className = "legacy-topbar";
        topbar.innerHTML = `
            <div class="legacy-shell">
                <a class="legacy-brand" href="${prefix}index.html">
                    <img src="${prefix}images/sym_photo.jpg" alt="孙远鸣">
                    <span>孙远鸣作品集</span>
                </a>
                <nav class="legacy-nav" aria-label="归档页面导航">
                    <a href="${prefix}index.html">首页</a>
                    <a href="${prefix}projects.html">项目</a>
                    <a href="${prefix}blog.html">博客</a>
                    <a href="${prefix}tools/python_nav.html">Python导航</a>
                    <a href="${prefix}materials.html">材料</a>
                </nav>
            </div>
        `;

        const hero = document.createElement("section");
        hero.className = "legacy-hero";
        hero.innerHTML = `
            <div class="legacy-shell">
                <div class="legacy-kicker">Archive / Learning Material</div>
                <h1>${title}</h1>
                <p>这是从旧博客或学习资料中保留下来的页面，已接入统一的作品集阅读外壳，方便继续浏览、复盘和引用。</p>
            </div>
        `;

        const layout = document.createElement("main");
        layout.className = "legacy-shell legacy-layout";

        const toc = document.createElement("aside");
        toc.className = "legacy-toc";
        toc.setAttribute("aria-label", "页面目录");
        const headings = Array.from(content.querySelectorAll("h1, h2, h3")).slice(0, 14);
        toc.innerHTML = `<div class="legacy-toc-title">Contents</div>`;
        headings.forEach((heading, index) => {
            if (!heading.id) heading.id = `legacy-section-${index + 1}`;
            const link = document.createElement("a");
            link.href = `#${heading.id}`;
            link.textContent = heading.textContent.trim() || `Section ${index + 1}`;
            toc.appendChild(link);
        });
        if (!headings.length) toc.innerHTML += '<span class="legacy-toc-empty">暂无目录</span>';

        layout.appendChild(content);
        layout.appendChild(toc);

        document.body.innerHTML = "";
        document.body.appendChild(topbar);
        document.body.appendChild(hero);
        document.body.appendChild(layout);

        const backTop = document.createElement("button");
        backTop.className = "legacy-back-top";
        backTop.type = "button";
        backTop.setAttribute("aria-label", "返回顶部");
        backTop.textContent = "↑";
        backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
        document.body.appendChild(backTop);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", wrapContent);
    } else {
        wrapContent();
    }
})();
