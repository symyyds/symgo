const endpoint = "https://api.deepseek.com/chat/completions";
const requestLog = new Map();

function json(statusCode, body) {
  const payload = statusCode >= 400
    ? { status: "failed", statusCode, ...body }
    : body;
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
    body: JSON.stringify(payload),
  };
}

function clientIp(event) {
  return event.headers["x-nf-client-connection-ip"]
    || event.headers["x-forwarded-for"]?.split(",")[0].trim()
    || "unknown";
}

function allowed(ip) {
  const now = Date.now();
  const windowMs = 60_000;
  const recent = (requestLog.get(ip) || []).filter((time) => now - time < windowMs);
  if (recent.length >= 10) return false;
  recent.push(now);
  requestLog.set(ip, recent);
  return true;
}

function normalizeMessages(input) {
  if (!Array.isArray(input)) return [];
  return input.slice(-12).map((message) => ({
    role: message?.role === "assistant" ? "assistant" : "user",
    content: String(message?.content || "").slice(0, 48_000),
  })).filter((message) => message.content.trim());
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json(204, {});
  if (event.httpMethod !== "POST") {
    return json(405, { status: "failed", errorType: "METHOD_NOT_ALLOWED", message: "只支持 POST 请求。" });
  }
  if (!allowed(clientIp(event))) {
    return json(429, { status: "failed", errorType: "RATE_LIMITED", message: "请求过于频繁，请一分钟后再试。" });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return json(503, {
      status: "failed",
      errorType: "SERVER_CONFIGURATION",
      message: "服务端尚未配置 DEEPSEEK_API_KEY。",
      suggestion: "请在 Netlify Site configuration > Environment variables 中配置密钥后重新部署。",
    });
  }

  let body;
  try {
    if ((event.body || "").length > 900_000) return json(413, { status: "failed", errorType: "PAYLOAD_TOO_LARGE", message: "请求内容过大。" });
    body = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { status: "failed", errorType: "INVALID_JSON", message: "请求 JSON 无法解析。" });
  }

  const messages = normalizeMessages(body.messages);
  if (!messages.length) return json(400, { status: "failed", errorType: "EMPTY_MESSAGES", message: "请至少提供一条有效消息。" });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  const started = Date.now();
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "你是一个严谨的学术与技术材料助手。区分材料事实、合理推断和未知信息；不得编造论文、项目、指标或引用；回答使用清晰的中文结构。",
          },
          ...messages,
        ],
        temperature: 0.35,
        max_tokens: 2400,
        stream: false,
      }),
      signal: controller.signal,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return json(response.status, {
        status: "failed",
        statusCode: response.status,
        errorType: response.status === 401 || response.status === 403 ? "UPSTREAM_AUTHORIZATION" : "UPSTREAM_ERROR",
        message: payload.error?.message || `上游返回 HTTP ${response.status}`,
        latencyMs: Date.now() - started,
      });
    }
    const reply = payload.choices?.[0]?.message?.content;
    if (!reply) return json(502, { status: "failed", errorType: "EMPTY_UPSTREAM_RESPONSE", message: "上游没有返回文本内容。", latencyMs: Date.now() - started });
    return json(200, {
      status: "success",
      reply,
      model: payload.model || process.env.DEEPSEEK_MODEL || "deepseek-chat",
      usage: payload.usage || null,
      latencyMs: Date.now() - started,
    });
  } catch (error) {
    return json(error.name === "AbortError" ? 504 : 502, {
      status: "failed",
      errorType: error.name === "AbortError" ? "UPSTREAM_TIMEOUT" : "UPSTREAM_NETWORK",
      message: error.name === "AbortError" ? "上游请求超时。" : "无法连接上游模型服务。",
      latencyMs: Date.now() - started,
    });
  } finally {
    clearTimeout(timeout);
  }
};
