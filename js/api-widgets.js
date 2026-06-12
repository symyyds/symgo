(function () {
    "use strict";

    const widgets = document.querySelectorAll("[data-api-widget]");
    if (!widgets.length) return;

    const functionPath = "/.netlify/functions/api-lab";
    const cachePrefix = "symgo-api-widget-v1";
    const cacheTtl = 20 * 60 * 1000;

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function formatClock(value) {
        if (!value) return "--";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "--";
        return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    }

    function cacheKey(group) {
        return `${cachePrefix}:${group}`;
    }

    function readCache(group) {
        try {
            const raw = localStorage.getItem(cacheKey(group));
            if (!raw) return null;
            const cached = JSON.parse(raw);
            if (Date.now() - new Date(cached.savedAt || 0).getTime() > cacheTtl) return null;
            return cached.payload;
        } catch (error) {
            return null;
        }
    }

    function writeCache(group, payload) {
        try {
            localStorage.setItem(cacheKey(group), JSON.stringify({
                savedAt: new Date().toISOString(),
                payload
            }));
        } catch (error) {
            // Widgets should still work when storage is blocked.
        }
    }

    async function requestGroup(group) {
        const controller = new AbortController();
        const timer = window.setTimeout(() => controller.abort(), 15000);
        try {
            const response = await fetch(`${functionPath}?group=${encodeURIComponent(group)}`, {
                signal: controller.signal,
                headers: { Accept: "application/json" }
            });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok || payload.status !== "ok") {
                throw new Error(payload.error || `HTTP ${response.status}`);
            }
            writeCache(group, payload.group);
            return payload.group;
        } finally {
            window.clearTimeout(timer);
        }
    }

    function factList(result) {
        const facts = Array.isArray(result.facts) ? result.facts.slice(0, 2) : [];
        if (!facts.length) return "";
        return `
            <div class="api-widget-facts">
                ${facts.map(([label, value]) => `<span><strong>${escapeHtml(label)}</strong>${escapeHtml(value)}</span>`).join("")}
            </div>
        `;
    }

    function renderWidget(root, group, stale = false) {
        const results = Array.isArray(group.results) ? group.results : [];
        const okResults = results.filter((result) => result.status === "ok");
        const avg = okResults.length
            ? `${Math.round(okResults.reduce((sum, result) => sum + Number(result.latency || 0), 0) / okResults.length)} ms`
            : "--";

        root.innerHTML = `
            <div class="api-widget-shell">
                <div class="api-widget-head">
                    <div>
                        <span class="section-kicker">LIVE PUBLIC API</span>
                        <h2><i class="fas ${escapeHtml(group.icon || "fa-plug")}"></i> ${escapeHtml(group.title)}</h2>
                        <p>${escapeHtml(group.description)}</p>
                    </div>
                    <div class="api-widget-meter ${group.failed ? "warn" : "ok"}">
                        <strong>${escapeHtml(group.ok || 0)}/${escapeHtml(group.total || results.length)}</strong>
                        <span>${stale ? "缓存结果" : "后端代理可用"}</span>
                    </div>
                </div>
                <div class="api-widget-stats">
                    <span><strong>${escapeHtml(results.length)}</strong>页面接入 API</span>
                    <span><strong>${escapeHtml(group.failed || 0)}</strong>失败</span>
                    <span><strong>${escapeHtml(avg)}</strong>平均耗时</span>
                    <span><strong>${escapeHtml(formatClock(group.checkedAt))}</strong>检查时间</span>
                </div>
                <div class="api-widget-grid">
                    ${results.map((result) => `
                        <article class="api-widget-card ${escapeHtml(result.status || "idle")}">
                            <div class="api-widget-card-top">
                                <span>${escapeHtml(result.id)}</span>
                                <strong>${escapeHtml(result.status === "ok" ? "OK" : "FAIL")}</strong>
                            </div>
                            <p>${escapeHtml(result.summary || result.error || "暂无返回摘要。")}</p>
                            ${factList(result)}
                        </article>
                    `).join("")}
                </div>
                <div class="api-widget-foot">
                    <span><i class="fas fa-server"></i> ${escapeHtml(functionPath)}?group=${escapeHtml(group.key)}</span>
                    <a class="text-link" href="${root.dataset.apiLabHref || "tools/api_lab.html"}">查看完整 API 实验室 <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>
        `;
    }

    function renderLoading(root) {
        const title = root.dataset.apiTitle || "Public API 后端数据加载中";
        root.innerHTML = `
            <div class="api-widget-shell loading">
                <div class="api-widget-head">
                    <div>
                        <span class="section-kicker">LIVE PUBLIC API</span>
                        <h2><i class="fas fa-circle-notch fa-spin"></i> ${escapeHtml(title)}</h2>
                        <p>正在通过 Netlify Function 获取当前页面相关的 public-apis 数据。</p>
                    </div>
                </div>
                <div class="api-widget-grid">
                    ${Array.from({ length: 4 }, () => `
                        <article class="api-widget-card loading">
                            <div class="api-widget-card-top"><span>proxy</span><strong>...</strong></div>
                            <p>后端代理请求中。</p>
                        </article>
                    `).join("")}
                </div>
            </div>
        `;
    }

    function renderError(root, group, error, cached) {
        if (cached) {
            renderWidget(root, cached, true);
            return;
        }

        root.innerHTML = `
            <div class="api-widget-shell failed">
                <div class="api-widget-head">
                    <div>
                        <span class="section-kicker">LIVE PUBLIC API</span>
                        <h2><i class="fas fa-triangle-exclamation"></i> 后端代理暂时不可用</h2>
                        <p>这个模块只调用本站 Netlify Function。错误：${escapeHtml(error.message || "请求失败")}</p>
                    </div>
                </div>
                <div class="api-widget-foot">
                    <span><i class="fas fa-server"></i> ${escapeHtml(functionPath)}?group=${escapeHtml(group)}</span>
                    <a class="text-link" href="${root.dataset.apiLabHref || "tools/api_lab.html"}">查看完整 API 实验室 <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>
        `;
    }

    widgets.forEach(async (root) => {
        const group = root.dataset.apiWidget;
        if (!group) return;
        const cached = readCache(group);
        renderLoading(root);
        try {
            const payload = await requestGroup(group);
            renderWidget(root, payload);
        } catch (error) {
            renderError(root, group, error, cached);
        }
    });
})();
