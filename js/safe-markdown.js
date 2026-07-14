(function bootstrapSafeMarkdown(global) {
    "use strict";

    const MAX_RENDER_LENGTH = 500000;
    const allowedTags = [
        "h1", "h2", "h3", "h4", "h5", "h6",
        "p", "br", "hr", "strong", "em", "del", "blockquote",
        "pre", "code", "ul", "ol", "li",
        "table", "thead", "tbody", "tr", "th", "td",
        "a", "img", "span"
    ];
    const allowedAttributes = ["href", "src", "alt", "title", "class"];
    const allowedProtocols = new Set(["http:", "https:", "mailto:", "tel:"]);
    const allowedClassNames = new Set(["personal-photo", "task-list-item"]);
    const languageClassPattern = /^language-[a-z0-9_-]{1,40}$/i;
    const safeDataImagePattern = /^data:image\/(?:png|jpe?g|gif|webp);base64,[a-z0-9+/=\s]+$/i;

    function isSafeLink(rawValue) {
        const value = String(rawValue || "").trim();
        if (!value) return false;
        if (value.startsWith("#") || value.startsWith("/") || value.startsWith("./") || value.startsWith("../")) {
            return true;
        }

        try {
            return allowedProtocols.has(new URL(value, global.location.href).protocol);
        } catch (error) {
            return false;
        }
    }

    function isSafeImageSource(rawValue) {
        const value = String(rawValue || "").trim();
        if (!value) return false;
        if (safeDataImagePattern.test(value)) return true;
        if (value.startsWith("/") || value.startsWith("./") || value.startsWith("../")) return true;

        try {
            const protocol = new URL(value, global.location.href).protocol;
            return protocol === "http:" || protocol === "https:";
        } catch (error) {
            return false;
        }
    }

    function filterClasses(element) {
        const safeClasses = Array.from(element.classList).filter((className) => (
            allowedClassNames.has(className) || languageClassPattern.test(className)
        ));
        if (safeClasses.length) {
            element.className = safeClasses.join(" ");
        } else {
            element.removeAttribute("class");
        }
    }

    function hardenFragment(fragment) {
        fragment.querySelectorAll("[class]").forEach(filterClasses);

        fragment.querySelectorAll("a").forEach((anchor) => {
            if (!isSafeLink(anchor.getAttribute("href"))) {
                anchor.removeAttribute("href");
            }
            anchor.setAttribute("rel", "noopener noreferrer nofollow");
            anchor.setAttribute("target", "_blank");
        });

        fragment.querySelectorAll("img").forEach((image) => {
            if (!isSafeImageSource(image.getAttribute("src"))) {
                image.removeAttribute("src");
            }
            image.setAttribute("loading", "lazy");
            image.setAttribute("decoding", "async");
            image.setAttribute("referrerpolicy", "no-referrer");
        });
    }

    function render(target, untrustedHtml, plainTextFallback) {
        if (!(target instanceof Element)) return false;

        const markup = String(untrustedHtml || "");
        if (markup.length > MAX_RENDER_LENGTH) {
            target.textContent = "内容过长，安全预览已停止。请将文档拆分后重试。";
            target.dataset.safeRender = "rejected";
            return false;
        }

        if (!global.DOMPurify || typeof global.DOMPurify.sanitize !== "function") {
            target.textContent = String(plainTextFallback || "安全预览组件未加载，已拒绝渲染 HTML。");
            target.dataset.safeRender = "fallback";
            return false;
        }

        try {
            const fragment = global.DOMPurify.sanitize(markup, {
                ALLOWED_TAGS: allowedTags,
                ALLOWED_ATTR: allowedAttributes,
                ALLOW_ARIA_ATTR: false,
                ALLOW_DATA_ATTR: false,
                FORBID_TAGS: ["script", "style", "svg", "math", "form", "input", "button", "iframe", "object", "embed", "audio", "video"],
                RETURN_DOM_FRAGMENT: true,
                RETURN_TRUSTED_TYPE: false
            });
            hardenFragment(fragment);
            target.replaceChildren(fragment);
            target.dataset.safeRender = "sanitized";
            return true;
        } catch (error) {
            target.textContent = String(plainTextFallback || "内容无法安全渲染。");
            target.dataset.safeRender = "fallback";
            console.error("安全 Markdown 渲染失败", error);
            return false;
        }
    }

    function cloneRenderedContent(source, target) {
        if (!(source instanceof Element) || !(target instanceof Element)) return false;
        const clones = Array.from(source.childNodes, (node) => node.cloneNode(true));
        target.replaceChildren(...clones);
        return true;
    }

    global.SymgoSafeMarkdown = Object.freeze({
        render,
        cloneRenderedContent
    });
}(window));
