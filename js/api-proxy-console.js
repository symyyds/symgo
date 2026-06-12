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

    async function runProxy(kind) {
        const url = setEndpoint(kind);
        const started = Date.now();
        setStatus("loading", `正在请求 ${url}`);
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
        } catch (error) {
            const reason = error.name === "AbortError" ? "请求超时" : error.message || "请求失败";
            writeOutput({
                status: "failed",
                endpoint: url,
                latencyMs: Date.now() - started,
                error: reason
            });
            setStatus("failed", reason);
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

    setEndpoint("list");
})();
