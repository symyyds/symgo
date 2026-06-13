(function () {
    "use strict";

    const endpoint = "/.netlify/functions/api-lab";
    const routeMap = {
        list: { list: "1" },
        id: { id: "github-repo" },
        group: { group: "home" },
        all: { all: "1" }
    };

    const statusNode = document.querySelector("[data-proxy-status]");
    const outputNode = document.querySelector("[data-proxy-output]");
    const endpointNode = document.querySelector("[data-proxy-endpoint]");
    const openLink = document.querySelector("[data-proxy-open]");
    const copyButton = document.querySelector("[data-proxy-copy]");
    const reasonButton = document.querySelector("[data-proxy-reason]");
    const reasonPanel = document.querySelector("[data-proxy-reason-panel]");
    const routeButtons = Array.from(document.querySelectorAll("[data-proxy-run]"));

    if (!outputNode) return;

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    function setStatus(state, message) {
        if (!statusNode) return;
        const icon = {
            loading: "fa-circle-notch fa-spin",
            ok: "fa-circle-check",
            failed: "fa-triangle-exclamation"
        }[state] || "fa-circle-info";
        statusNode.className = `api-backend-status ${state}`;
        statusNode.innerHTML = `<i class="fas ${icon}"></i> ${escapeHtml(message)}`;
    }

    function buildUrl(kind) {
        const params = routeMap[kind] || routeMap.list;
        return `${endpoint}?${new URLSearchParams(params).toString()}`;
    }

    function setEndpoint(kind) {
        const url = buildUrl(kind);
        if (endpointNode) endpointNode.textContent = url;
        if (openLink) openLink.href = url;
        routeButtons.forEach((button) => {
            button.classList.toggle("active", button.dataset.proxyRun === kind);
        });
        return url;
    }

    function writeOutput(payload) {
        outputNode.textContent = JSON.stringify(payload, null, 2);
    }

    function diagnoseFailure(detail) {
        const error = String(detail.error || detail.payload?.error || detail.payload?.message || `HTTP ${detail.httpStatus || "--"}`);
        const lower = error.toLowerCase();
        let cause = "本站后端函数或上游 API 没有返回可用结果。";
        let action = "查看 Netlify Function 日志，并确认当前路由参数在白名单内。";

        if (detail.httpStatus === 404 || /404|not found|未知/.test(lower)) {
            cause = "Netlify 没有找到该静态页面或 Function 路由，常见原因是站点未部署到当前仓库、publish 目录错误，或函数目录没有被发布。";
            action = "确认 Netlify build command 为 node scripts/build-static.js，publish directory 为 dist，functions directory 为 netlify/functions。";
        } else if (detail.httpStatus === 405 || /只支持 get|method/.test(lower)) {
            cause = "请求方法不符合后端函数约束；当前函数只接受 GET。";
            action = "保持前端使用 fetch GET 请求，不要改成 POST。";
        } else if (detail.httpStatus === 403 || /403|forbidden|rate limit|限流/.test(lower)) {
            cause = "上游 API 拒绝请求，通常是匿名额度、频率限制或缺少 Token。";
            action = "把 Token 配置到 Netlify 环境变量，由后端函数读取，不要写进前端。";
        } else if (detail.httpStatus >= 500 || /5\d\d|server|上游/.test(lower)) {
            cause = "后端函数可达，但上游服务或函数运行时出现异常。";
            action = "保留错误展示，检查 Netlify Functions 日志；如果长期失败，替换为更稳定的数据源。";
        } else if (/timeout|abort|超时/.test(lower)) {
            cause = "请求超时，可能是上游 API 响应慢或网络不稳定。";
            action = "提高对应 API 的 timeoutMs，减少返回数据量，或替换数据源。";
        } else if (/failed to fetch|network|load failed|fetch/.test(lower)) {
            cause = "浏览器没有连到本站 Netlify Function，可能是本地静态预览没有 Serverless 环境，或线上站点仍返回 404。";
            action = "在线上确认 /.netlify/functions/api-lab?list=1 能返回 JSON；本地需要 Netlify Dev 才能运行函数。";
        }

        return {
            status: detail.status || "failed",
            endpoint: detail.endpoint || endpoint,
            error,
            cause,
            action
        };
    }

    function setFailureReason(detail) {
        if (!reasonButton || !reasonPanel) return;
        const reason = diagnoseFailure(detail);
        reasonPanel.querySelector("[data-proxy-reason-status]").textContent = reason.status;
        reasonPanel.querySelector("[data-proxy-reason-endpoint]").textContent = reason.endpoint;
        reasonPanel.querySelector("[data-proxy-reason-error]").textContent = reason.error;
        reasonPanel.querySelector("[data-proxy-reason-cause]").textContent = reason.cause;
        reasonPanel.querySelector("[data-proxy-reason-action]").textContent = reason.action;
        reasonButton.hidden = false;
        reasonPanel.hidden = true;
        reasonButton.setAttribute("aria-expanded", "false");
        reasonButton.innerHTML = '<i class="fas fa-circle-question"></i> 查询原因';
    }

    function clearFailureReason() {
        if (reasonButton) reasonButton.hidden = true;
        if (reasonPanel) reasonPanel.hidden = true;
    }

    async function runProxy(kind) {
        const url = setEndpoint(kind);
        const started = Date.now();
        setStatus("loading", `正在请求 ${url}`);
        clearFailureReason();
        writeOutput({
            status: "loading",
            endpoint: url,
            message: "浏览器正在调用本站 Netlify Function"
        });

        try {
            const response = await fetch(url, { headers: { Accept: "application/json" } });
            const text = await response.text();
            let payload;
            try {
                payload = text ? JSON.parse(text) : {};
            } catch (error) {
                payload = { raw: text };
            }

            const wrapped = {
                status: response.ok ? "ok" : "failed",
                httpStatus: response.status,
                latencyMs: Date.now() - started,
                endpoint: url,
                payload
            };
            writeOutput(wrapped);
            setStatus(response.ok ? "ok" : "failed", response.ok ? `代理成功 · ${wrapped.latencyMs} ms` : `后端返回 HTTP ${response.status}`);
            if (response.ok) clearFailureReason();
            else setFailureReason(wrapped);
        } catch (error) {
            const reason = error.name === "AbortError" ? "请求超时" : error.message || "请求失败";
            const wrapped = {
                status: "failed",
                endpoint: url,
                latencyMs: Date.now() - started,
                error: reason
            };
            writeOutput(wrapped);
            setStatus("failed", reason);
            setFailureReason(wrapped);
        }
    }

    routeButtons.forEach((button) => {
        button.addEventListener("click", () => runProxy(button.dataset.proxyRun || "list"));
    });

    copyButton?.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(outputNode.textContent || "");
            setStatus("ok", "JSON 已复制");
        } catch (error) {
            setStatus("failed", "浏览器不允许复制，请手动选择 JSON");
        }
    });

    reasonButton?.addEventListener("click", () => {
        if (!reasonPanel) return;
        const willOpen = reasonPanel.hasAttribute("hidden");
        reasonPanel.toggleAttribute("hidden", !willOpen);
        reasonButton.setAttribute("aria-expanded", String(willOpen));
        reasonButton.innerHTML = willOpen
            ? '<i class="fas fa-chevron-up"></i> 收起原因'
            : '<i class="fas fa-circle-question"></i> 查询原因';
    });

    setEndpoint("list");
})();
