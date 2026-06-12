"use strict";

const {
    categoryLabels,
    categoryDescriptions,
    liveApis,
    proxyCandidates,
    apiToClient
} = require("./lib/api-lab-config");

const DEFAULT_TIMEOUT_MS = 9000;
const MAX_ALL_CONCURRENCY = 4;

function json(statusCode, body, extraHeaders = {}) {
    return {
        statusCode,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            ...extraHeaders
        },
        body: JSON.stringify(body)
    };
}

function getApi(id) {
    return liveApis.find((api) => api.id === id);
}

function requestHeaders(api) {
    const headers = {
        Accept: "application/json",
        "User-Agent": "symgo-api-lab/1.0 (+https://symgo.netlify.app)"
    };

    if (api.id.startsWith("github-") && process.env.GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
        headers["X-GitHub-Api-Version"] = "2022-11-28";
    }

    return headers;
}

async function fetchJson(api) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), api.timeoutMs || DEFAULT_TIMEOUT_MS);
    const started = Date.now();

    try {
        const response = await fetch(api.endpoint, {
            signal: controller.signal,
            headers: requestHeaders(api)
        });
        const contentType = response.headers.get("content-type") || "";
        const text = await response.text();

        if (!response.ok) {
            throw new Error(`上游 HTTP ${response.status}`);
        }
        if (!contentType.includes("json") && !text.trim().startsWith("{") && !text.trim().startsWith("[")) {
            throw new Error(`上游不是 JSON：${contentType || "unknown content-type"}`);
        }

        return {
            data: text ? JSON.parse(text) : null,
            latency: Date.now() - started,
            upstreamStatus: response.status
        };
    } finally {
        clearTimeout(timeout);
    }
}

async function resolveApi(api) {
    const checkedAt = new Date().toISOString();
    const started = Date.now();

    try {
        const { data, latency, upstreamStatus } = await fetchJson(api);
        const parsed = api.parse(data);
        return {
            id: api.id,
            status: "ok",
            latency,
            upstreamStatus,
            summary: parsed.summary || "上游 API 已返回数据。",
            facts: Array.isArray(parsed.facts) ? parsed.facts : [],
            checkedAt,
            source: "netlify-function"
        };
    } catch (error) {
        return {
            id: api.id,
            status: "failed",
            latency: Date.now() - started,
            summary: "后端代理已收到请求，但上游 API 当前没有返回可用结果。",
            error: error.name === "AbortError" ? "上游请求超时" : error.message || "请求失败",
            checkedAt,
            source: "netlify-function"
        };
    }
}

async function resolveAll() {
    const queue = [...liveApis];
    const results = [];
    const workers = Array.from({ length: MAX_ALL_CONCURRENCY }, async () => {
        while (queue.length) {
            const api = queue.shift();
            results.push(await resolveApi(api));
        }
    });

    await Promise.all(workers);
    return results.sort((a, b) => a.id.localeCompare(b.id));
}

exports.handler = async (event) => {
    if (event.httpMethod === "OPTIONS") {
        return json(204, {});
    }
    if (event.httpMethod !== "GET") {
        return json(405, { error: "只支持 GET 请求。" });
    }

    const query = event.queryStringParameters || {};

    if (query.list === "1") {
        return json(200, {
            apis: liveApis.map(apiToClient),
            proxyCandidates,
            categoryLabels,
            categoryDescriptions,
            backend: {
                mode: "netlify-functions",
                endpoint: "/.netlify/functions/api-lab",
                supports: ["list", "id", "all"],
                secretPolicy: "API Key 只允许放在 Netlify 环境变量中，前端永不暴露。"
            }
        }, {
            "Cache-Control": "public, max-age=60, s-maxage=300"
        });
    }

    if (query.all === "1") {
        const results = await resolveAll();
        return json(200, {
            status: "ok",
            total: results.length,
            ok: results.filter((result) => result.status === "ok").length,
            failed: results.filter((result) => result.status === "failed").length,
            checkedAt: new Date().toISOString(),
            results
        }, {
            "Cache-Control": "public, max-age=30, s-maxage=180"
        });
    }

    const api = getApi(query.id);
    if (!api) {
        return json(404, {
            status: "failed",
            error: "未知 API id。请先调用 ?list=1 获取白名单。",
            availableIds: liveApis.map((item) => item.id)
        });
    }

    return json(200, await resolveApi(api), {
        "Cache-Control": "public, max-age=45, s-maxage=240"
    });
};
