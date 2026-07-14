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
        const payload = detail.payload && typeof detail.payload === "object" ? detail.payload : {};
        const statusCode = Number(payload.statusCode || detail.httpStatus || 0) || "--";
        const errorType = payload.errorType || detail.errorType || "FUNCTION_UNREACHABLE";
        const message = payload.message || payload.error || detail.error || `HTTP ${detail.httpStatus || "--"}`;
        let possibleCauses = Array.isArray(payload.possibleCauses) ? payload.possibleCauses : [];
        let suggestions = Array.isArray(payload.suggestions) ? payload.suggestions : [];

        // 浏览器完全没有收到 JSON 时，才使用客户端网络层的兜底诊断。
        if (!possibleCauses.length) {
            possibleCauses = [
                detail.error
                    ? "浏览器没有成功取得 Netlify Function 的结构化 JSON。"
                    : "后端响应缺少 possibleCauses 字段。"
            ];
        }
        if (!suggestions.length) {
            suggestions = [
                detail.error
                    ? "本地使用 Netlify Dev；线上检查 Function 路由和部署日志。"
                    : "检查 Function 日志与响应契约。"
            ];
        }

        return {
            status: detail.status || "failed",
            endpoint: detail.endpoint || endpoint,
            statusCode,
            errorType,
            message,
            possibleCauses,
            suggestions,
            latencyMs: Number(payload.latencyMs ?? detail.latencyMs) || 0
        };
    }

    function setFailureReason(detail) {
        if (!reasonButton || !reasonPanel) return;
        const reason = diagnoseFailure(detail);
        reasonPanel.querySelector("[data-proxy-reason-status]").textContent = reason.status;
        reasonPanel.querySelector("[data-proxy-reason-endpoint]").textContent = reason.endpoint;
        reasonPanel.querySelector("[data-proxy-reason-code]").textContent = String(reason.statusCode);
        reasonPanel.querySelector("[data-proxy-reason-type]").textContent = reason.errorType;
        reasonPanel.querySelector("[data-proxy-reason-message]").textContent = reason.message;
        reasonPanel.querySelector("[data-proxy-reason-causes]").textContent = reason.possibleCauses.join("；");
        reasonPanel.querySelector("[data-proxy-reason-suggestions]").textContent = reason.suggestions.join("；");
        reasonPanel.querySelector("[data-proxy-reason-latency]").textContent = `${Math.round(reason.latencyMs)} ms`;
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

        const controller = new AbortController();
        const timer = window.setTimeout(() => controller.abort(), 32000);
        try {
            const response = await fetch(url, {
                signal: controller.signal,
                headers: { Accept: "application/json" }
            });
            const text = await response.text();
            let payload;
            try {
                payload = text ? JSON.parse(text) : {};
            } catch (error) {
                payload = { raw: text };
            }

            const failed = !response.ok || payload.status === "failed";
            const wrapped = {
                status: failed ? "failed" : "ok",
                httpStatus: response.status,
                latencyMs: Date.now() - started,
                endpoint: url,
                payload
            };
            writeOutput(wrapped);
            setStatus(
                failed ? "failed" : "ok",
                failed ? `${payload.errorType || "REQUEST_FAILED"} · ${wrapped.latencyMs} ms` : `代理成功 · ${wrapped.latencyMs} ms`
            );
            if (failed) setFailureReason(wrapped);
            else clearFailureReason();
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
        } finally {
            window.clearTimeout(timer);
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
