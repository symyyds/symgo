const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const scriptPath = path.join(root, "js", "api-lab.js");
const source = fs.readFileSync(scriptPath, "utf8");
const endpoints = [...source.matchAll(/endpoint:\s*"([^"]+)"/g)].map((match) => match[1]);
const siteOrigin = process.env.API_LAB_ORIGIN || "https://symgo.netlify.app";

async function checkEndpoint(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  const started = Date.now();

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        Origin: siteOrigin,
        "User-Agent": "symgo-api-lab-check"
      }
    });
    const cors = response.headers.get("access-control-allow-origin");
    const contentType = response.headers.get("content-type") || "";
    return {
      url,
      ok: response.ok && Boolean(cors),
      status: response.status,
      cors: cors || "",
      contentType,
      ms: Date.now() - started
    };
  } catch (error) {
    return {
      url,
      ok: false,
      error: error.name === "AbortError" ? "timeout" : error.message,
      ms: Date.now() - started
    };
  } finally {
    clearTimeout(timeout);
  }
}

(async () => {
  const queue = [...endpoints];
  const results = [];
  const workers = Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const endpoint = queue.shift();
      results.push(await checkEndpoint(endpoint));
    }
  });
  await Promise.all(workers);

  const failed = results.filter((result) => !result.ok);
  for (const result of results.sort((a, b) => a.url.localeCompare(b.url))) {
    const state = result.ok ? "OK" : "FAIL";
    const detail = result.error || `HTTP ${result.status}, CORS ${result.cors || "missing"}`;
    console.log(`${state} ${result.ms}ms ${detail} ${result.url}`);
  }

  console.log(`SUMMARY ok=${results.length - failed.length} fail=${failed.length} total=${results.length}`);
  if (failed.length) process.exit(1);
})();
