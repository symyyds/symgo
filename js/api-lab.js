(function () {
    "use strict";

    const apiGrid = document.querySelector("[data-api-grid]");
    if (!apiGrid) return;

    const functionPath = "/.netlify/functions/api-lab";
    const cacheKey = "symgo-api-lab-cache-v2";
    const timeoutMs = 14000;

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
                throw new Error(payload.error || `后端 HTTP ${response.status}`);
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
        const error = String(result?.error || result?.summary || "没有返回明确错误。");
        const lower = error.toLowerCase();
        let reason = "后端代理已收到请求，但上游接口没有返回可用结果。";
        let action = "可以稍后重试，或在 Netlify Function 日志中查看该 API 的上游响应。";

        if (/403|rate limit|forbidden|限流|权限/.test(lower)) {
            reason = "上游接口拒绝了本次请求，常见原因是匿名额度限制、访问频率过高或需要额外请求头。";
            action = "降低调用频率，或在 Netlify 环境变量中配置对应 Token，再由后端读取。";
        } else if (/404|not found|未知 api|unknown/.test(lower)) {
            reason = "请求的白名单 id、分组或上游 endpoint 没有匹配到有效资源。";
            action = "检查 netlify/functions/lib/api-lab-config.js 中的 id、endpoint 和页面分组。";
        } else if (/5\d\d|server|上游 http 5/.test(lower)) {
            reason = "上游服务当前异常，本站后端代理正常返回了失败状态。";
            action = "保留错误展示并稍后重试；如果长期失败，应替换成更稳定的数据源。";
        } else if (/timeout|abort|超时/.test(lower)) {
            reason = "上游接口响应超过本站后端代理的超时时间。";
            action = "提高该 API 的 timeoutMs，或减少请求数据量，或替换更快的数据源。";
        } else if (/failed to fetch|network|load failed|后端不可用/.test(lower)) {
            reason = "浏览器没有成功连到本站 Netlify Function，常见原因是站点未部署 Functions、域名仍返回 404，或本地静态预览没有 Serverless 环境。";
            action = "确认 Netlify 站点绑定当前 GitHub 仓库，publish=dist，functions=netlify/functions。";
        }

        return {
            api: api?.title || result?.id || "未知 API",
            endpoint: `${functionPath}?id=${api?.id || result?.id || "--"}`,
            error,
            reason,
            action,
            checkedAt: result?.checkedAt ? formatClock(result.checkedAt) : "--"
        };
    }

    function renderFailureReason(api, result) {
        if (result?.status !== "failed") return "";
        const detail = diagnoseFailure(api, result);
        return `
            <div class="api-reason-panel" data-api-reason-panel="${escapeHtml(api.id)}" hidden>
                <div><strong>失败账号/接口</strong><span>${escapeHtml(detail.api)}</span></div>
                <div><strong>调用地址</strong><span>${escapeHtml(detail.endpoint)}</span></div>
                <div><strong>原始错误</strong><span>${escapeHtml(detail.error)}</span></div>
                <div><strong>判断原因</strong><span>${escapeHtml(detail.reason)}</span></div>
                <div><strong>处理建议</strong><span>${escapeHtml(detail.action)}</span></div>
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
                    <span class="api-icon"></span>
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
            const latency = result?.latency ? `${Math.round(result.latency)} ms` : "--";
            const checked = result?.checkedAt ? formatClock(result.checkedAt) : "尚未测试";
            const source = result?.source === "netlify-function" ? "Netlify Function" : "Backend proxy";
            const summary = result?.summary || "点击刷新后，前端会调用本站后端函数；函数再去请求外部 API、解析数据并返回摘要。";
            return `
                <article class="api-card premium-surface" data-api-card="${escapeHtml(api.id)}">
                    <div class="api-card-top">
                        <span class="api-icon"><i class="fas ${escapeHtml(api.icon)}"></i></span>
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
                        ${result?.error ? `<div class="api-error">${escapeHtml(result.error)}</div>` : ""}
                        ${renderFailureReason(api, result)}
                        <div class="api-backend-line"><i class="fas fa-server"></i> ${escapeHtml(source)} · ${escapeHtml(functionPath)}?id=${escapeHtml(api.id)}</div>
                    </div>
                    <div class="api-foot">
                        <span>上次检查：${escapeHtml(checked)}</span>
                        <div>
                            <button type="button" class="api-mini-button" data-api-refresh="${escapeHtml(api.id)}" aria-label="刷新 ${escapeHtml(api.title)}">
                                <i class="fas fa-rotate"></i>
                            </button>
                            <a class="api-mini-button" href="${escapeHtml(api.docs)}" target="_blank" rel="noopener noreferrer" aria-label="查看 ${escapeHtml(api.title)} 文档">
                                <i class="fas fa-arrow-up-right-from-square"></i>
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
            .filter((result) => result.status === "ok" && Number.isFinite(result.latency))
            .map((result) => result.latency);
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
            const reason = error.name === "AbortError" ? "后端连接超时" : error.message || "后端不可用";
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
                    ? `${api.title} 后端代理可用，耗时 ${Math.round(result.latency || 0)} ms`
                    : `${api.title} 后端代理失败：${result.error || "上游不可用"}`;
                addLog(detail, tone);
            }
        } catch (error) {
            const reason = error.name === "AbortError" ? "后端请求超时" : error.message || "请求失败";
            apiResults[api.id] = {
                id: api.id,
                status: "failed",
                latency: null,
                summary: "前端已按设计调用后端代理，但本次没有收到可用结果。",
                error: reason,
                checkedAt: new Date().toISOString(),
                source: "netlify-function"
            };
            if (!silent) addLog(`${api.title} 后端代理失败：${reason}`, "failed");
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
