"use strict";

const crypto = require("crypto");

const {
    categoryLabels,
    categoryDescriptions,
    liveApis,
    proxyCandidates,
    apiGroups,
    apiToClient
} = require("./lib/api-lab-config");

const DEFAULT_TIMEOUT_MS = 9000;
const MAX_ALL_CONCURRENCY = 4;
const API_CACHE_TTL_MS = 5 * 60 * 1000;
const API_FAILURE_CACHE_TTL_MS = 60 * 1000;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 75;
const MAX_UPSTREAM_UNITS_PER_WINDOW = 80;
const BULK_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_BULK_REQUESTS_PER_WINDOW = 1;
const apiCache = new Map();
const apiInflight = new Map();
const rateLimitBuckets = new Map();

class ApiLabError extends Error {
    constructor(statusCode, errorType, message, possibleCauses, suggestions) {
        super(message);
        this.name = "ApiLabError";
        this.statusCode = statusCode;
        this.errorType = errorType;
        this.possibleCauses = possibleCauses;
        this.suggestions = suggestions;
    }
}

function json(statusCode, body, extraHeaders = {}) {
    return {
        statusCode,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Lab-Token",
            "X-Content-Type-Options": "nosniff",
            ...extraHeaders
        },
        body: JSON.stringify(body)
    };
}

function normalizeHeaders(headers = {}) {
    return Object.fromEntries(Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]));
}

function getClientIp(event) {
    const headers = normalizeHeaders(event.headers || {});
    return headers["x-nf-client-connection-ip"] ||
        String(headers["x-forwarded-for"] || "").split(",")[0].trim() ||
        headers["client-ip"] ||
        event.requestContext?.identity?.sourceIp ||
        "local-or-unknown";
}

function consumeRateLimit(key, limit, windowMs, cost = 1) {
    const now = Date.now();
    let bucket = rateLimitBuckets.get(key);
    if (!bucket || now >= bucket.resetAt) {
        bucket = { used: 0, resetAt: now + windowMs };
    }

    if (bucket.used + cost > limit) {
        rateLimitBuckets.set(key, bucket);
        return {
            allowed: false,
            limit,
            remaining: Math.max(0, limit - bucket.used),
            resetAt: bucket.resetAt,
            retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))
        };
    }

    bucket.used += cost;
    rateLimitBuckets.set(key, bucket);

    if (rateLimitBuckets.size > 2000) {
        for (const [bucketKey, entry] of rateLimitBuckets) {
            if (now >= entry.resetAt) rateLimitBuckets.delete(bucketKey);
        }
    }

    return {
        allowed: true,
        limit,
        remaining: Math.max(0, limit - bucket.used),
        resetAt: bucket.resetAt,
        retryAfterSeconds: 0
    };
}

function rateLimitHeaders(result) {
    return {
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": String(result.remaining),
        "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
        ...(result.allowed ? {} : { "Retry-After": String(result.retryAfterSeconds) })
    };
}

function failureBody({
    statusCode,
    errorType,
    message,
    possibleCauses,
    suggestions,
    latencyMs = 0,
    id,
    checkedAt = new Date().toISOString(),
    source = "netlify-function",
    extra = {}
}) {
    return {
        ...(id ? { id } : {}),
        status: "failed",
        statusCode,
        errorType,
        message,
        possibleCauses: Array.isArray(possibleCauses) ? possibleCauses : [],
        suggestions: Array.isArray(suggestions) ? suggestions : [],
        latencyMs,
        checkedAt,
        source,
        ...extra
    };
}

function timingSafeTokenEqual(provided, expected) {
    if (!provided || !expected) return false;
    const left = crypto.createHash("sha256").update(String(provided)).digest();
    const right = crypto.createHash("sha256").update(String(expected)).digest();
    return crypto.timingSafeEqual(left, right);
}

function hasBulkAuthorization(event) {
    const expected = process.env.API_LAB_BULK_TOKEN;
    if (!expected) return false;
    const headers = normalizeHeaders(event.headers || {});
    const authorization = String(headers.authorization || "");
    const bearer = authorization.match(/^Bearer\s+(.+)$/i)?.[1];
    const provided = headers["x-api-lab-token"] || bearer;
    return timingSafeTokenEqual(provided, expected);
}

function getApi(id) {
    return liveApis.find((api) => api.id === id);
}

function getGroup(key) {
    if (!Object.prototype.hasOwnProperty.call(apiGroups, key)) return null;
    const group = apiGroups[key];
    if (!group) return null;
    return {
        key,
        ...group,
        apis: group.ids.map(getApi).filter(Boolean)
    };
}

function requestHeaders(api) {
    const headers = {
        Accept: "application/json",
        "User-Agent": "symgo-api-lab/1.0 (+https://symweb.netlify.app)"
    };

    if (api.id.startsWith("github-") && process.env.GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
        headers["X-GitHub-Api-Version"] = "2022-11-28";
    }

    return headers;
}

function createUpstreamHttpError(statusCode) {
    if (statusCode === 401 || statusCode === 403) {
        return new ApiLabError(
            statusCode,
            "UPSTREAM_AUTHORIZATION",
            `上游服务拒绝访问（HTTP ${statusCode}）。`,
            ["匿名访问额度已用尽。", "上游要求授权凭证或特定请求头。", "上游限制了当前运行区域或出口网络。"],
            ["降低调用频率后重试。", "如接口支持 Token，请仅在 Netlify 环境变量中配置。", "长期不可用时更换稳定且授权条件清晰的数据源。"]
        );
    }

    if (statusCode === 404) {
        return new ApiLabError(
            statusCode,
            "UPSTREAM_NOT_FOUND",
            "上游资源不存在或 endpoint 已变更（HTTP 404）。",
            ["上游接口版本或路径已调整。", "配置中的固定资源已经被删除。"],
            ["核对官方文档中的当前 endpoint。", "更新白名单配置后重新验证解析器。"]
        );
    }

    if (statusCode === 429) {
        return new ApiLabError(
            statusCode,
            "UPSTREAM_RATE_LIMIT",
            "上游服务已触发频率限制（HTTP 429）。",
            ["匿名请求额度已耗尽。", "短时间内请求过于集中。"],
            ["等待上游限流窗口结束后再试。", "使用本站缓存与抽样刷新，避免重复全量调用。", "如有官方 Token，只能通过 Netlify 环境变量提供。"]
        );
    }

    if (statusCode >= 500) {
        return new ApiLabError(
            statusCode,
            "UPSTREAM_SERVER_ERROR",
            `上游服务暂时异常（HTTP ${statusCode}）。`,
            ["上游服务正在维护或发生故障。", "上游网关暂时无法连接其数据源。"],
            ["稍后重试。", "持续失败时检查上游状态页并评估替代数据源。"]
        );
    }

    return new ApiLabError(
        statusCode,
        "UPSTREAM_HTTP_ERROR",
        `上游服务返回了不可用状态（HTTP ${statusCode}）。`,
        ["请求参数不再符合上游接口要求。", "上游访问策略发生变化。"],
        ["核对官方文档和白名单 endpoint。", "在服务端日志中确认响应状态，不要把凭证放到浏览器。"]
    );
}

function describeFailure(error) {
    if (error instanceof ApiLabError) return error;

    if (error?.name === "AbortError") {
        return new ApiLabError(
            504,
            "UPSTREAM_TIMEOUT",
            "上游请求超过本站代理的等待时间。",
            ["上游当前响应缓慢。", "返回数据量过大或网络链路不稳定。"],
            ["稍后重试。", "减少上游返回条数或为该白名单项设置合理的 timeoutMs。", "长期超时应替换数据源。"]
        );
    }

    if (error instanceof SyntaxError) {
        return new ApiLabError(
            502,
            "UPSTREAM_PARSE_ERROR",
            "上游响应已返回，但本站无法按预期格式解析。",
            ["上游响应结构发生变化。", "接口返回了不完整或非预期数据。"],
            ["检查该白名单项的 parse 函数。", "用脱敏后的上游样例补充解析测试。"]
        );
    }

    if (error instanceof TypeError || /fetch|network|socket|dns/i.test(error?.message || "")) {
        return new ApiLabError(
            502,
            "UPSTREAM_NETWORK_ERROR",
            "本站代理未能连接到上游服务。",
            ["上游域名暂时不可达。", "DNS、TLS 或出口网络发生短时故障。"],
            ["稍后重试并检查 Netlify Function 日志。", "确认上游域名仍支持服务端访问。"]
        );
    }

    return new ApiLabError(
        502,
        "UPSTREAM_PROCESSING_ERROR",
        "上游响应无法转换为本站需要的结构化结果。",
        ["上游返回字段发生变化。", "当前白名单解析器未覆盖该响应。"],
        ["检查对应 API 的 parse 函数和脱敏响应样例。", "修复解析器后再恢复该数据源。"]
    );
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

        if (!response.ok) throw createUpstreamHttpError(response.status);
        const trimmed = text.trim();
        const isJson = contentType.includes("json") || trimmed.startsWith("{") || trimmed.startsWith("[");

        let data = text;
        if (isJson && text) {
            try {
                data = JSON.parse(text);
            } catch (error) {
                throw new ApiLabError(
                    502,
                    "UPSTREAM_INVALID_JSON",
                    "上游声明返回 JSON，但响应内容不是有效 JSON。",
                    ["上游网关返回了 HTML 错误页。", "响应被截断或接口格式发生变化。"],
                    ["检查 Netlify Function 日志中的上游状态。", "核对 content-type 与解析策略。"]
                );
            }
        }

        return {
            data,
            latencyMs: Date.now() - started,
            upstreamStatus: response.status
        };
    } finally {
        clearTimeout(timeout);
    }
}

async function fetchJsonWithRetry(api) {
    let lastError;
    for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
            return await fetchJson(api);
        } catch (error) {
            lastError = error;
            const retryable = error.name === "AbortError" ||
                /fetch|network|timeout|超时/i.test(error.message || "") ||
                error.errorType === "UPSTREAM_SERVER_ERROR";
            if (!retryable || attempt === 2) throw error;
            await new Promise((resolve) => setTimeout(resolve, 350 * (attempt + 1)));
        }
    }
    throw lastError;
}

async function resolveApi(api) {
    const cached = apiCache.get(api.id);
    const cacheTtl = cached?.result?.status === "ok" ? API_CACHE_TTL_MS : API_FAILURE_CACHE_TTL_MS;
    if (cached && Date.now() - cached.savedAt < cacheTtl) {
        return {
            ...cached.result,
            cached: true
        };
    }

    if (apiInflight.has(api.id)) {
        return apiInflight.get(api.id);
    }

    const promise = resolveApiFresh(api).finally(() => {
        apiInflight.delete(api.id);
    });
    apiInflight.set(api.id, promise);
    return promise;
}

async function resolveApiFresh(api) {
    const checkedAt = new Date().toISOString();
    const started = Date.now();

    try {
        const { data, latencyMs, upstreamStatus } = await fetchJsonWithRetry(api);
        let parsed;
        try {
            parsed = api.parse(data);
            if (!parsed || typeof parsed !== "object") throw new Error("Parser did not return an object");
        } catch (error) {
            throw new ApiLabError(
                502,
                "UPSTREAM_PARSE_ERROR",
                "上游响应已返回，但本站无法按当前白名单规则解析。",
                ["上游响应字段或数据类型发生变化。", "该接口的 parse 函数未覆盖当前响应。"],
                ["检查对应白名单项的 parse 函数。", "使用脱敏响应样例补充解析回归测试。"]
            );
        }
        const result = {
            id: api.id,
            status: "ok",
            statusCode: upstreamStatus,
            latencyMs,
            upstreamStatus,
            summary: parsed.summary || "上游 API 已返回数据。",
            facts: Array.isArray(parsed.facts) ? parsed.facts : [],
            checkedAt,
            source: "netlify-function"
        };
        apiCache.set(api.id, {
            savedAt: Date.now(),
            result
        });
        return result;
    } catch (error) {
        const detail = describeFailure(error);
        const result = failureBody({
            id: api.id,
            statusCode: detail.statusCode,
            errorType: detail.errorType,
            message: detail.message,
            possibleCauses: detail.possibleCauses,
            suggestions: detail.suggestions,
            latencyMs: Date.now() - started,
            checkedAt,
            extra: {
                summary: "后端代理已收到请求，但上游 API 当前没有返回可用结果。",
                error: detail.message
            }
        });
        apiCache.set(api.id, {
            savedAt: Date.now(),
            result
        });
        return result;
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

async function resolveGroup(groupKey) {
    const started = Date.now();
    const group = getGroup(groupKey);
    if (!group) return null;

    const queue = [...group.apis];
    const results = [];
    const workers = Array.from({ length: Math.min(MAX_ALL_CONCURRENCY, Math.max(1, queue.length)) }, async () => {
        while (queue.length) {
            const api = queue.shift();
            results.push(await resolveApi(api));
        }
    });

    await Promise.all(workers);

    return {
        key: group.key,
        title: group.title,
        description: group.description,
        page: group.page,
        icon: group.icon,
        total: results.length,
        ok: results.filter((result) => result.status === "ok").length,
        failed: results.filter((result) => result.status === "failed").length,
        statusCode: 200,
        latencyMs: Date.now() - started,
        checkedAt: new Date().toISOString(),
        apis: group.apis.map(apiToClient),
        results: results.sort((a, b) => a.id.localeCompare(b.id))
    };
}

exports.handler = async (event) => {
    if (event.httpMethod === "OPTIONS") {
        return json(204, {}, { "Cache-Control": "no-store" });
    }
    if (event.httpMethod !== "GET") {
        return json(405, failureBody({
            statusCode: 405,
            errorType: "METHOD_NOT_ALLOWED",
            message: "API Lab 只支持 GET 请求。",
            possibleCauses: ["客户端使用了 POST、PUT、PATCH 或 DELETE。"],
            suggestions: ["使用 ?list=1、?id=<白名单 id> 或 ?group=<分组> 发起 GET 请求。"]
        }), {
            Allow: "GET, OPTIONS",
            "Cache-Control": "no-store"
        });
    }

    const query = event.queryStringParameters || {};
    const clientIp = getClientIp(event);
    const requestLimit = consumeRateLimit(
        `request:${clientIp}`,
        MAX_REQUESTS_PER_WINDOW,
        RATE_LIMIT_WINDOW_MS
    );

    if (!requestLimit.allowed) {
        return json(429, failureBody({
            statusCode: 429,
            errorType: "RATE_LIMITED",
            message: "请求过于频繁，API Lab 已暂时拒绝本次调用。",
            possibleCauses: ["同一访客在一分钟内触发了过多 Function 请求。", "页面被重复刷新或自动化脚本持续调用。"],
            suggestions: [`等待约 ${requestLimit.retryAfterSeconds} 秒后重试。`, "优先使用页面缓存，不要高频轮询公开数据。"]
        }), {
            "Cache-Control": "no-store",
            ...rateLimitHeaders(requestLimit)
        });
    }

    const requestLimitResponseHeaders = rateLimitHeaders(requestLimit);

    if (query.list === "1") {
        return json(200, {
            status: "ok",
            statusCode: 200,
            latencyMs: 0,
            apis: liveApis.map(apiToClient),
            proxyCandidates,
            categoryLabels,
            categoryDescriptions,
            groups: Object.fromEntries(Object.entries(apiGroups).map(([key, group]) => [
                key,
                {
                    title: group.title,
                    description: group.description,
                    page: group.page,
                    icon: group.icon,
                    ids: group.ids,
                    apis: group.ids.map(getApi).filter(Boolean).map(apiToClient)
                }
            ])),
            backend: {
                mode: "netlify-functions",
                endpoint: "/.netlify/functions/api-lab",
                supports: ["list", "id", "group", "authenticated-all"],
                limits: {
                    requestsPerMinute: MAX_REQUESTS_PER_WINDOW,
                    upstreamUnitsPerMinute: MAX_UPSTREAM_UNITS_PER_WINDOW,
                    bulk: "?all=1 仅允许携带服务端 API_LAB_BULK_TOKEN 的健康检查调用"
                },
                secretPolicy: "API Key 与批量健康检查令牌只允许放在 Netlify 环境变量中，前端永不暴露。"
            }
        }, {
            "Cache-Control": "public, max-age=60, s-maxage=300"
        });
    }

    if (query.group) {
        const configuredGroup = getGroup(query.group);
        if (!configuredGroup) {
            return json(404, failureBody({
                statusCode: 404,
                errorType: "UNKNOWN_GROUP",
                message: "请求的 API group 不在白名单中。",
                possibleCauses: ["group 名称拼写错误。", "页面仍在使用已经移除的分组名称。"],
                suggestions: ["先调用 ?list=1 获取当前可用分组。"],
                extra: { availableGroups: Object.keys(apiGroups) }
            }), {
                "Cache-Control": "no-store",
                ...requestLimitResponseHeaders
            });
        }

        const upstreamLimit = consumeRateLimit(
            `upstream:${clientIp}`,
            MAX_UPSTREAM_UNITS_PER_WINDOW,
            RATE_LIMIT_WINDOW_MS,
            configuredGroup.apis.length
        );
        if (!upstreamLimit.allowed) {
            return json(429, failureBody({
                statusCode: 429,
                errorType: "UPSTREAM_BUDGET_EXCEEDED",
                message: "本访客的上游调用预算已用尽，分组请求未执行。",
                possibleCauses: ["短时间内刷新了多个数据分组。", "同一页面或多个标签页重复触发实时组件。"],
                suggestions: [`等待约 ${upstreamLimit.retryAfterSeconds} 秒后重试。`, "保留浏览器缓存并减少自动刷新频率。"]
            }), {
                "Cache-Control": "no-store",
                ...rateLimitHeaders(upstreamLimit)
            });
        }

        const group = await resolveGroup(query.group);
        if (!group) {
            return json(500, failureBody({
                statusCode: 500,
                errorType: "GROUP_RESOLUTION_ERROR",
                message: "已验证的 API group 无法解析。",
                possibleCauses: ["白名单配置在请求期间发生异常。"],
                suggestions: ["检查 Function 日志与 api-lab-config.js。"]
            }), { "Cache-Control": "no-store" });
        }

        return json(200, {
            status: "ok",
            group
        }, {
            "Cache-Control": "public, max-age=45, s-maxage=240"
        });
    }

    if (query.all === "1") {
        if (!hasBulkAuthorization(event)) {
            return json(403, failureBody({
                statusCode: 403,
                errorType: "BULK_AUTH_REQUIRED",
                message: "全量健康检查已被保护，浏览器匿名请求不能执行 ?all=1。",
                possibleCauses: ["请求没有携带有效的服务端批量检查令牌。", "批量路由只为受控监控任务保留。"],
                suggestions: ["普通页面请使用 ?id=<白名单 id> 或 ?group=<分组>。", "受控监控任务应在服务端读取 API_LAB_BULK_TOKEN，禁止把令牌写进前端。"]
            }), {
                "Cache-Control": "no-store",
                ...requestLimitResponseHeaders
            });
        }

        const bulkLimit = consumeRateLimit(
            `bulk:${clientIp}`,
            MAX_BULK_REQUESTS_PER_WINDOW,
            BULK_LIMIT_WINDOW_MS
        );
        if (!bulkLimit.allowed) {
            return json(429, failureBody({
                statusCode: 429,
                errorType: "BULK_RATE_LIMITED",
                message: "全量健康检查频率超过安全限制，本次调用未执行。",
                possibleCauses: ["同一监控来源在十分钟内重复执行了全量检查。"],
                suggestions: [`等待约 ${bulkLimit.retryAfterSeconds} 秒后再运行健康检查。`, "日常页面展示请改用缓存后的分组接口。"]
            }), {
                "Cache-Control": "no-store",
                ...rateLimitHeaders(bulkLimit)
            });
        }

        const upstreamLimit = consumeRateLimit(
            `upstream:${clientIp}`,
            MAX_UPSTREAM_UNITS_PER_WINDOW,
            RATE_LIMIT_WINDOW_MS,
            liveApis.length
        );
        if (!upstreamLimit.allowed) {
            return json(429, failureBody({
                statusCode: 429,
                errorType: "UPSTREAM_BUDGET_EXCEEDED",
                message: "当前上游调用预算不足以执行全量健康检查。",
                possibleCauses: ["同一监控来源刚执行过分组或单项检查。"],
                suggestions: [`等待约 ${upstreamLimit.retryAfterSeconds} 秒后重试。`]
            }), {
                "Cache-Control": "no-store",
                ...rateLimitHeaders(upstreamLimit)
            });
        }

        const started = Date.now();
        const results = await resolveAll();
        return json(200, {
            status: "ok",
            statusCode: 200,
            latencyMs: Date.now() - started,
            total: results.length,
            ok: results.filter((result) => result.status === "ok").length,
            failed: results.filter((result) => result.status === "failed").length,
            checkedAt: new Date().toISOString(),
            results
        }, {
            "Cache-Control": "no-store",
            ...requestLimitResponseHeaders
        });
    }

    const api = getApi(query.id);
    if (!api) {
        return json(404, failureBody({
            statusCode: 404,
            errorType: "UNKNOWN_API_ID",
            message: "请求的 API id 不在白名单中。",
            possibleCauses: ["id 拼写错误。", "客户端仍在调用已经移除的白名单项。"],
            suggestions: ["先调用 ?list=1 获取当前可用 id。", "后端不会接受任意外部 URL。"],
            extra: { availableIds: liveApis.map((item) => item.id) }
        }), {
            "Cache-Control": "no-store",
            ...requestLimitResponseHeaders
        });
    }

    const upstreamLimit = consumeRateLimit(
        `upstream:${clientIp}`,
        MAX_UPSTREAM_UNITS_PER_WINDOW,
        RATE_LIMIT_WINDOW_MS
    );
    if (!upstreamLimit.allowed) {
        return json(429, failureBody({
            id: api.id,
            statusCode: 429,
            errorType: "UPSTREAM_BUDGET_EXCEEDED",
            message: "本访客的上游调用预算已用尽，本次 API 请求未执行。",
            possibleCauses: ["短时间内连续刷新了大量 API。", "多个标签页同时执行了批量单项测试。"],
            suggestions: [`等待约 ${upstreamLimit.retryAfterSeconds} 秒后重试。`, "使用已有缓存结果，避免持续轮询。"]
        }), {
            "Cache-Control": "no-store",
            ...rateLimitHeaders(upstreamLimit)
        });
    }

    const result = await resolveApi(api);
    return json(200, result, {
        "Cache-Control": result.status === "ok"
            ? "public, max-age=45, s-maxage=240"
            : "public, max-age=10, s-maxage=60"
    });
};
