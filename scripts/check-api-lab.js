const { handler } = require("../netlify/functions/api-lab");
const { liveApis } = require("../netlify/functions/lib/api-lab-config");

function event(queryStringParameters) {
  return {
    httpMethod: "GET",
    queryStringParameters
  };
}

async function callFunction(params) {
  const response = await handler(event(params));
  const body = response.body ? JSON.parse(response.body) : {};
  return {
    statusCode: response.statusCode,
    body
  };
}

async function runWithConcurrency(items, concurrency, worker) {
  const queue = [...items];
  const results = [];
  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length) {
      const item = queue.shift();
      results.push(await worker(item));
    }
  });
  await Promise.all(workers);
  return results;
}

(async () => {
  const list = await callFunction({ list: "1" });
  if (list.statusCode !== 200) {
    throw new Error(`Function list failed with HTTP ${list.statusCode}`);
  }
  if (!Array.isArray(list.body.apis) || list.body.apis.length !== liveApis.length) {
    throw new Error(`Function list returned ${list.body.apis?.length || 0}/${liveApis.length} APIs`);
  }

  const results = await runWithConcurrency(liveApis, 6, async (api) => {
    const started = Date.now();
    try {
      const response = await callFunction({ id: api.id });
      return {
        id: api.id,
        title: api.title,
        ok: response.statusCode === 200 && response.body.status === "ok",
        statusCode: response.statusCode,
        status: response.body.status,
        error: response.body.error || "",
        ms: Date.now() - started
      };
    } catch (error) {
      return {
        id: api.id,
        title: api.title,
        ok: false,
        error: error.message,
        ms: Date.now() - started
      };
    }
  });

  const failed = results.filter((result) => !result.ok);
  for (const result of results.sort((a, b) => a.id.localeCompare(b.id))) {
    const state = result.ok ? "OK" : "FAIL";
    const detail = result.error || `${result.status || "unknown"} HTTP ${result.statusCode || "--"}`;
    console.log(`${state} ${result.ms}ms ${detail} ${result.id} ${result.title}`);
  }

  console.log(`SUMMARY ok=${results.length - failed.length} fail=${failed.length} total=${results.length}`);
  if (failed.length) process.exit(1);
})();
