(function () {
    "use strict";

    const apiGrid = document.querySelector("[data-api-grid]");
    if (!apiGrid) return;

    const functionPath = "/.netlify/functions/api-lab";
    const cacheKey = "symgo-api-lab-cache-v3";
    const timeoutMs = 32000;

    const statusNodes = {
        total: document.querySelector("[data-api-total]"),
        ok: document.querySelector("[data-api-ok]"),
        failed: document.querySelector("[data-api-failed]"),
        avg: document.querySelector("[data-api-avg]")
    };
    const searchInput = document.querySelector("[data-api-search]");
    const refreshAllButton = document.querySelector("[data-api-refresh-all]");
    const clearButton = document.querySelector("[data-api-clear]");
    const proxyGrid = document.querySelector("[data-api-proxy-grid]");
    const activityLog = document.querySelector("[data-api-log]");
    const coverageStrip = document.querySelector("[data-api-coverage]");
    const backendStatus = document.querySelector("[data-api-backend-status]");
    const backendEndpoint = document.querySelector("[data-api-backend-endpoint]");

    let currentFilter = "all";
    let currentSearch = "";
    let activeRequests = 0;
    let liveApis = [];
    let proxyCandidates = [];
    let categoryLabels = {};
    let categoryDescriptions = {};
    let apiResults = loadCache();
    let backendReady = false;

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function renderApiGlyph() {
        return '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="5" cy="10" r="2"/><circle cx="15" cy="5" r="2"/><circle cx="15" cy="15" r="2"/><path d="m6.8 9 6.4-3M6.8 11l6.4 3"/></svg>';
    }

    function trimText(value, maxLength) {
        const text = String(value || "").replace(/\s+/g, " ").trim();
        if (text.length <= maxLength) return text;
        return `${text.slice(0, Math.max(0, maxLength - 1))}...`;
    }

    function formatClock(value) {
        if (!value) return "--";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "--";
        return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    }

    function loadCache() {
        try {
            const raw = localStorage.getItem(cacheKey);
            if (!raw) return {};
            const parsed = JSON.parse(raw);
            const oneHour = 60 * 60 * 1000;
            return Object.fromEntries(Object.entries(parsed).filter(([, result]) => {
                return Date.now() - new Date(result.checkedAt || 0).getTime() < oneHour;
            }));
        } catch (error) {
            return {};
        }
    }

    function saveCache() {
        try {
            localStorage.setItem(cacheKey, JSON.stringify(apiResults));
        } catch (error) {
            // 本地缓存只是体验增强；隐私模式或容量限制不应影响页面主体功能。
        }
    }

    function isLocalStaticPreview() {
        return window.location.protocol === "file:" ||
            window.location.hostname === "127.0.0.1" ||
            window.location.hostname === "localhost";
    }

    function normalizeFailure(payload = {}, fallback = {}) {
        const statusCode = Number(payload.statusCode ?? fallback.statusCode);
        const latencyMs = Number(payload.latencyMs ?? fallback.latencyMs);
        return {
            id: payload.id || fallback.id,
            status: "failed",
            statusCode: Number.isFinite(statusCode) && statusCode > 0 ? statusCode : null,
            errorType: payload.errorType || fallback.errorType || "CLIENT_REQUEST_ERROR",
            message: payload.message || payload.error || fallback.message || "请求失败。",
            possibleCauses: Array.isArray(payload.possibleCauses)
                ? payload.possibleCauses
                : (Array.isArray(fallback.possibleCauses) ? fallback.possibleCauses : []),
            suggestions: Array.isArray(payload.suggestions)
                ? payload.suggestions
                : (Array.isArray(fallback.suggestions) ? fallback.suggestions : []),
            latencyMs: Number.isFinite(latencyMs) && latencyMs >= 0 ? latencyMs : null,
            summary: payload.summary || fallback.summary || "本次请求没有返回可用结果。",
            checkedAt: payload.checkedAt || fallback.checkedAt || new Date().toISOString(),
            source: payload.source || fallback.source || "netlify-function"
        };
    }

    function browserFailure(error, fallback = {}) {
        if (error?.details) return normalizeFailure(error.details, fallback);
        if (error?.name === "AbortError") {
            return normalizeFailure({}, {
                ...fallback,
                statusCode: 504,
                errorType: "CLIENT_TIMEOUT",
                message: "浏览器等待 Netlify Function 响应超时。",
                possibleCauses: ["Function 或上游服务响应时间过长。", "当前网络连接不稳定。"],
                suggestions: ["稍后重试。", "在线上检查 Netlify Function 日志与执行时长。"]
            });
        }
        return normalizeFailure({}, {
            ...fallback,
            statusCode: 0,
            errorType: "FUNCTION_UNREACHABLE",
            message: error?.message || "浏览器无法连接 Netlify Function。",
            possibleCauses: ["当前是没有 Serverless 环境的本地静态预览。", "线上 Function 路由尚未部署或网络连接失败。"],
            suggestions: ["本地使用 Netlify Dev 验证。", "线上确认 /.netlify/functions/api-lab?list=1 能返回 JSON。"]
        });
    }

    async function requestBackend(params, requestTimeoutMs = timeoutMs) {
        const controller = new AbortController();
        const timer = window.setTimeout(() => controller.abort(), requestTimeoutMs);
        const url = `${functionPath}?${new URLSearchParams(params).toString()}`;

        try {
            const response = await fetch(url, {
                signal: controller.signal,
                headers: { Accept: "application/json" }
            });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok) {
                const details = normalizeFailure(payload, {
                    statusCode: response.status,
                    errorType: "FUNCTION_HTTP_ERROR",
                    message: `后端返回 HTTP ${response.status}`
                });
                const error = new Error(details.message);
                error.details = details;
                throw error;
            }
            return payload;
        } finally {
            window.clearTimeout(timer);
        }
    }

    function getVisibleApis() {
        const search = currentSearch.trim().toLowerCase();
        return liveApis.filter((api) => {
            const categoryMatch = currentFilter === "all" || api.category === currentFilter;
            const searchable = `${api.title} ${api.source} ${api.purpose} ${api.publicApisCategory}`.toLowerCase();
            return categoryMatch && (!search || searchable.includes(search));
        });
    }

    function resultClass(result) {
        if (!result) return "idle";
        return result.status || "idle";
    }

    function resultLabel(result) {
        if (!result) return "待测试";
        if (result.status === "loading") return "代理中";
        if (result.status === "ok") return "后端可用";
        if (result.status === "failed") return "失败";
        return "待测试";
    }

    function diagnoseFailure(api, result) {
        const detail = normalizeFailure(result, {
            id: api?.id,
            message: "没有返回明确错误。",
            possibleCauses: ["后端没有提供结构化诊断字段。"],
            suggestions: ["检查 Netlify Function 日志与响应 JSON。"]
        });

        return {
            api: api?.title || result?.id || "未知 API",
            endpoint: `${functionPath}?id=${api?.id || result?.id || "--"}`,
            statusCode: detail.statusCode ?? "--",
            errorType: detail.errorType,
            message: detail.message,
            possibleCauses: detail.possibleCauses.length ? detail.possibleCauses : ["后端未返回可能原因。"],
            suggestions: detail.suggestions.length ? detail.suggestions : ["检查 Function 日志后重试。"],
            latency: Number.isFinite(detail.latencyMs) ? `${Math.round(detail.latencyMs)} ms` : "--",
            checkedAt: detail.checkedAt ? formatClock(detail.checkedAt) : "--"
        };
    }

    function renderFailureReason(api, result) {
        if (result?.status !== "failed") return "";
        const detail = diagnoseFailure(api, result);
        return `
            <div class="api-reason-panel" data-api-reason-panel="${escapeHtml(api.id)}" hidden>
                <div><strong>失败账号/接口</strong><span>${escapeHtml(detail.api)}</span></div>
                <div><strong>调用地址</strong><span>${escapeHtml(detail.endpoint)}</span></div>
                <div><strong>状态码</strong><span>${escapeHtml(detail.statusCode)}</span></div>
                <div><strong>错误类型</strong><span>${escapeHtml(detail.errorType)}</span></div>
                <div><strong>错误信息</strong><span>${escapeHtml(detail.message)}</span></div>
                <div><strong>可能原因</strong><span>${detail.possibleCauses.map(escapeHtml).join("；")}</span></div>
                <div><strong>处理建议</strong><span>${detail.suggestions.map(escapeHtml).join("；")}</span></div>
                <div><strong>响应耗时</strong><span>${escapeHtml(detail.latency)}</span></div>
                <div><strong>检查时间</strong><span>${escapeHtml(detail.checkedAt)}</span></div>
            </div>
        `;
    }

    function renderFacts(facts) {
        if (!Array.isArray(facts) || !facts.length) {
            return '<div class="api-facts"><span>等待后端代理返回结构化结果。</span></div>';
        }
        return `
            <div class="api-facts">
                ${facts.map(([label, value]) => `
                    <span><strong>${escapeHtml(label)}</strong>${escapeHtml(value)}</span>
                `).join("")}
            </div>
        `;
    }

    function renderSkeleton() {
        apiGrid.innerHTML = Array.from({ length: 6 }, (_, index) => `
            <article class="api-card api-card-skeleton premium-surface" aria-hidden="true">
                <div class="api-card-top">
                    <span class="api-icon">${renderApiGlyph()}</span>
                    <span class="api-status loading">加载中</span>
                </div>
                <div class="api-card-body">
                    <div class="api-meta-line"><span>Netlify</span><span>Function</span></div>
                    <h3>后端 API 目录加载中 ${index + 1}</h3>
                    <p>前端正在请求本站后端代理，而不是直接暴露外部 API endpoint。</p>
                </div>
                <div class="api-result loading">
                    <div class="api-result-head"><strong>Backend proxy</strong><span>--</span></div>
                    <p>等待服务端返回白名单和缓存策略。</p>
                    ${renderFacts([])}
                </div>
            </article>
        `).join("");
    }

    function renderCards() {
        const visibleApis = getVisibleApis();
        apiGrid.innerHTML = visibleApis.map((api) => {
            const result = apiResults[api.id];
            const status = resultClass(result);
            const latency = Number.isFinite(result?.latencyMs) ? `${Math.round(result.latencyMs)} ms` : "--";
            const checked = result?.checkedAt ? formatClock(result.checkedAt) : "尚未测试";
            const source = result?.source === "netlify-function" ? "Netlify Function" : "Backend proxy";
            const summary = result?.summary || "点击刷新后，前端会调用本站后端函数；函数再去请求外部 API、解析数据并返回摘要。";
            return `
                <article class="api-card premium-surface" data-api-card="${escapeHtml(api.id)}">
                    <div class="api-card-top">
                        <span class="api-icon">${renderApiGlyph()}</span>
                        <div class="api-card-status">
                            <span class="api-status ${status}">${resultLabel(result)}</span>
                            ${result?.status === "failed" ? `<button type="button" class="api-reason-button" data-api-reason="${escapeHtml(api.id)}"><i class="fas fa-circle-question"></i> 查询原因</button>` : ""}
                        </div>
                    </div>
                    <div class="api-card-body">
                        <div class="api-meta-line">
                            <span>${escapeHtml(categoryLabels[api.category] || api.category)}</span>
                            <span>${escapeHtml(api.publicApisCategory)}</span>
                            <span>后端代理</span>
                        </div>
                        <h3>${escapeHtml(api.title)}</h3>
                        <p>${escapeHtml(trimText(api.purpose, 118))}</p>
                    </div>
                    <div class="api-result ${status}">
                        <div class="api-result-head">
                            <strong>${escapeHtml(api.source)}</strong>
                            <span>${latency}</span>
                        </div>
                        <p>${escapeHtml(summary)}</p>
                        ${renderFacts(result?.facts)}
                        ${result?.message ? `<div class="api-error">${escapeHtml(result.message)}</div>` : ""}
                        ${renderFailureReason(api, result)}
                        <div class="api-backend-line"><i class="fas fa-server"></i> ${escapeHtml(source)} · ${escapeHtml(functionPath)}?id=${escapeHtml(api.id)}</div>
                    </div>
                    <div class="api-foot">
                        <span>上次检查：${escapeHtml(checked)}</span>
                        <div>
                            <button type="button" class="api-mini-button" data-api-refresh="${escapeHtml(api.id)}" aria-label="刷新 ${escapeHtml(api.title)}">
                                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M15.8 7.1A6.3 6.3 0 1 0 16 12"/><path d="M15.8 3.4v3.9h-3.9"/></svg>
                            </button>
                            <a class="api-mini-button" href="${escapeHtml(api.docs)}" target="_blank" rel="noopener noreferrer" aria-label="查看 ${escapeHtml(api.title)} 文档">
                                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8 4H4.8A1.8 1.8 0 0 0 3 5.8v9.4A1.8 1.8 0 0 0 4.8 17h9.4a1.8 1.8 0 0 0 1.8-1.8V12"/><path d="M11 3h6v6M17 3l-8 8"/></svg>
                            </a>
                        </div>
                    </div>
                </article>
            `;
        }).join("") || '<div class="empty-state api-empty">没有匹配的 API。换一个关键词或分类试试。</div>';

        updateSummary();
    }

    function renderProxyCandidates() {
        if (!proxyGrid) return;
        proxyGrid.innerHTML = proxyCandidates.map((item) => `
            <article class="proxy-api-card">
                <div>
                    <span class="proxy-tag">${escapeHtml(categoryLabels[item.category] || item.category)}</span>
                    <h3>${escapeHtml(item.title)}</h3>
                    <p>${escapeHtml(item.reason)}</p>
                </div>
                <div class="proxy-api-foot">
                    <span>${escapeHtml(item.source)}</span>
                    <strong>${escapeHtml(item.destination)}</strong>
                </div>
            </article>
        `).join("");
    }

    function renderCoverage() {
        if (!coverageStrip) return;
        const counts = liveApis.reduce((acc, api) => {
            acc[api.category] = (acc[api.category] || 0) + 1;
            return acc;
        }, {});
        coverageStrip.innerHTML = Object.keys(categoryLabels).map((category) => `
            <article>
                <strong>${counts[category] || 0}</strong>
                <span>${escapeHtml(categoryLabels[category])}</span>
                <small>${escapeHtml(categoryDescriptions[category] || "公开 API 能力")}</small>
            </article>
        `).join("");
    }

    function updateSummary() {
        const total = liveApis.length;
        const results = liveApis.map((api) => apiResults[api.id]).filter(Boolean);
        const ok = results.filter((result) => result.status === "ok").length;
        const failed = results.filter((result) => result.status === "failed").length;
        const latencies = results
            .filter((result) => result.status === "ok" && Number.isFinite(result.latencyMs))
            .map((result) => result.latencyMs);
        const avg = latencies.length ? `${Math.round(latencies.reduce((sum, value) => sum + value, 0) / latencies.length)} ms` : "--";

        if (statusNodes.total) statusNodes.total.textContent = total;
        if (statusNodes.ok) statusNodes.ok.textContent = ok;
        if (statusNodes.failed) statusNodes.failed.textContent = failed;
        if (statusNodes.avg) statusNodes.avg.textContent = avg;
    }

    function updateBackendStatus(state, detail) {
        if (backendStatus) {
            backendStatus.className = `api-backend-status ${state}`;
            backendStatus.innerHTML = detail;
        }
        if (backendEndpoint) backendEndpoint.textContent = functionPath;
    }

    function addLog(message, tone = "info") {
        if (!activityLog) return;
        const time = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        const entry = document.createElement("li");
        entry.className = tone;
        entry.innerHTML = `<span>${time}</span><strong>${escapeHtml(message)}</strong>`;
        activityLog.prepend(entry);
        while (activityLog.children.length > 7) activityLog.lastElementChild.remove();
    }

    async function loadBackendCatalog() {
        updateBackendStatus("loading", '<i class="fas fa-circle-notch fa-spin"></i> 正在连接 Netlify Functions 后端代理');
        renderSkeleton();

        try {
            const catalog = await requestBackend({ list: "1" });
            liveApis = Array.isArray(catalog.apis) ? catalog.apis : [];
            proxyCandidates = Array.isArray(catalog.proxyCandidates) ? catalog.proxyCandidates : [];
            categoryLabels = catalog.categoryLabels || {};
            categoryDescriptions = catalog.categoryDescriptions || {};
            backendReady = true;
            updateBackendStatus("ok", `<i class="fas fa-server"></i> 已连接后端代理 · ${escapeHtml(catalog.backend?.endpoint || functionPath)}`);
            addLog(`后端目录加载完成：${liveApis.length} 个 API 白名单`, "ok");
            renderCoverage();
            renderProxyCandidates();
            renderCards();
            updateSummary();
            autoRefreshFeaturedApis();
        } catch (error) {
            backendReady = false;
            const failure = browserFailure(error);
            const reason = failure.message;
            updateBackendStatus("failed", `<i class="fas fa-triangle-exclamation"></i> ${escapeHtml(reason)}`);
            apiGrid.innerHTML = `
                <div class="empty-state api-empty api-backend-empty">
                    <h3>后端代理暂时不可用</h3>
                    <p>这个页面现在设计为只调用本站 Netlify Functions。部署到 Netlify 后会访问 ${escapeHtml(functionPath)}；本地静态预览需要 Netlify Functions 环境。</p>
                    ${isLocalStaticPreview() ? "<p>当前看起来是本地静态预览，所以不会直接绕过后端去请求外部 API。</p>" : ""}
                </div>
            `;
            addLog(`后端目录加载失败：${reason}`, "failed");
            updateSummary();
        }
    }

    async function refreshApi(apiId, silent = false) {
        const api = liveApis.find((item) => item.id === apiId);
        if (!api || !backendReady) return;

        activeRequests += 1;
        apiResults[api.id] = {
            status: "loading",
            checkedAt: new Date().toISOString(),
            source: "netlify-function"
        };
        renderCards();
        updateRefreshState();

        try {
            const result = await requestBackend({ id: api.id }, api.timeoutMs || timeoutMs);
            apiResults[api.id] = result;
            if (!silent) {
                const tone = result.status === "ok" ? "ok" : "failed";
                const detail = result.status === "ok"
                    ? `${api.title} 后端代理可用，耗时 ${Math.round(result.latencyMs || 0)} ms`
                    : `${api.title} 后端代理失败：${result.message || "上游不可用"}`;
                addLog(detail, tone);
            }
        } catch (error) {
            const failure = browserFailure(error, {
                id: api.id,
                summary: "前端已按设计调用后端代理，但本次没有收到可用结果。"
            });
            apiResults[api.id] = failure;
            if (!silent) addLog(`${api.title} 后端代理失败：${failure.message}`, "failed");
        } finally {
            activeRequests = Math.max(0, activeRequests - 1);
            saveCache();
            renderCards();
            updateRefreshState();
        }
    }

    function updateRefreshState() {
        if (!refreshAllButton) return;
        const busy = activeRequests > 0;
        refreshAllButton.disabled = busy || !backendReady;
        refreshAllButton.innerHTML = busy
            ? '<i class="fas fa-spinner fa-spin"></i> 代理中'
            : '<i class="fas fa-rotate"></i> 刷新全部';
    }

    async function refreshAll() {
        if (!backendReady) return;
        const queue = [...liveApis];
        const workers = Array.from({ length: 4 }, async () => {
            while (queue.length) {
                const api = queue.shift();
                await refreshApi(api.id, true);
            }
        });
        addLog(`开始通过后端代理测试 ${liveApis.length} 个 API`, "info");
        await Promise.all(workers);
        const okCount = Object.values(apiResults).filter((result) => result.status === "ok").length;
        addLog(`后端代理测试完成：${okCount}/${liveApis.length} 个 API 当前可用`, okCount ? "ok" : "failed");
    }

    function bindEvents() {
        document.querySelectorAll("[data-api-filter]").forEach((button) => {
            button.addEventListener("click", () => {
                currentFilter = button.dataset.apiFilter || "all";
                document.querySelectorAll("[data-api-filter]").forEach((tab) => {
                    tab.classList.toggle("active", tab === button);
                });
                renderCards();
            });
        });

        if (searchInput) {
            searchInput.addEventListener("input", () => {
                currentSearch = searchInput.value || "";
                renderCards();
            });
        }

        apiGrid.addEventListener("click", (event) => {
            const refreshButton = event.target.closest("[data-api-refresh]");
            if (refreshButton) {
                refreshApi(refreshButton.dataset.apiRefresh);
                return;
            }

            const reasonButton = event.target.closest("[data-api-reason]");
            if (!reasonButton) return;
            const apiId = reasonButton.dataset.apiReason;
            const panel = apiGrid.querySelector(`[data-api-reason-panel="${CSS.escape(apiId)}"]`);
            if (!panel) return;
            const willOpen = panel.hasAttribute("hidden");
            panel.toggleAttribute("hidden", !willOpen);
            reasonButton.setAttribute("aria-expanded", String(willOpen));
            reasonButton.innerHTML = willOpen
                ? '<i class="fas fa-chevron-up"></i> 收起原因'
                : '<i class="fas fa-circle-question"></i> 查询原因';
        });

        if (refreshAllButton) {
            refreshAllButton.addEventListener("click", refreshAll);
        }

        if (clearButton) {
            clearButton.addEventListener("click", () => {
                apiResults = {};
                localStorage.removeItem(cacheKey);
                renderCards();
                addLog("已清空本地缓存结果；后端缓存仍由 Netlify 控制", "info");
            });
        }
    }

    function autoRefreshFeaturedApis() {
        const hasFreshCache = liveApis.some((api) => apiResults[api.id]?.status === "ok");
        if (hasFreshCache) return;
        const featured = liveApis.filter((api) => api.featured).slice(0, 4);
        window.setTimeout(() => {
            featured.forEach((api) => refreshApi(api.id, true));
            addLog("已自动通过后端代理抽样测试首屏关键 API", "info");
        }, 650);
    }

    bindEvents();
    renderSkeleton();
    updateRefreshState();
    loadBackendCatalog();
})();
