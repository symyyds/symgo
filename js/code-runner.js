(function bootstrapCodeRunner() {
    "use strict";

    const MAX_CODE_LENGTH = 100000;
    const EXECUTION_TIMEOUT_MS = 3000;
    const MAX_OUTPUT_LINES = 200;
    const MAX_OUTPUT_LINE_LENGTH = 4000;
    const allowedHighlightThemes = new Set([
        "monokai-sublime", "github", "atom-one-dark", "vs2015",
        "dracula", "nord", "tokyo-night-dark"
    ]);
    const highlightThemePaths = Object.freeze({
        dracula: "base16/dracula"
    });

    const sandboxDocument = `<!doctype html>
<html><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; worker-src blob:; connect-src 'none'; img-src 'none'; media-src 'none'; font-src 'none'; style-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'">
</head><body><script>
(() => {
    "use strict";
    const host = window.parent;
    let activeWorker = null;
    const forward = (payload) => host.postMessage({ source: "symgo-code-sandbox", ...payload }, "*");

    window.addEventListener("message", (event) => {
        const request = event.data;
        if (event.source !== host || !request) return;
        if (request.type === "cancel") {
            if (activeWorker) activeWorker.terminate();
            activeWorker = null;
            return;
        }
        if (request.type !== "run" || typeof request.token !== "string") return;
        if (activeWorker) activeWorker.terminate();

        const workerSource = [
            '"use strict";',
            'const __runnerSend = self.postMessage.bind(self);',
            'const __runnerSerialize = (value) => {',
            '  if (typeof value === "string") return value;',
            '  if (typeof value === "undefined") return "undefined";',
            '  if (typeof value === "bigint") return value.toString() + "n";',
            '  try { const json = JSON.stringify(value); return json === undefined ? String(value) : json; }',
            '  catch (error) { try { return String(value); } catch (ignored) { return "[无法序列化的值]"; } }',
            '};',
            'const __runnerWrite = (level, values) => __runnerSend({ type: "output", level, text: values.map(__runnerSerialize).join(" ") });',
            'self.console = Object.freeze({',
            '  log: (...values) => __runnerWrite("log", values),',
            '  info: (...values) => __runnerWrite("info", values),',
            '  warn: (...values) => __runnerWrite("warn", values),',
            '  error: (...values) => __runnerWrite("error", values)',
            '});',
            'const __runnerDisable = (name) => {',
            '  try { Object.defineProperty(self, name, { value: undefined, configurable: false, writable: false }); }',
            '  catch (error) { try { self[name] = undefined; } catch (ignored) {} }',
            '};',
            '["fetch", "XMLHttpRequest", "WebSocket", "EventSource", "importScripts", "Worker", "SharedWorker", "indexedDB", "caches", "BroadcastChannel"].forEach(__runnerDisable);',
            '(async () => {',
            String(request.code || ""),
            '})().then((value) => __runnerSend({ type: "complete", value: __runnerSerialize(value) }))',
            '   .catch((error) => __runnerSend({ type: "failure", name: error && error.name || "Error", message: error && error.message || String(error) }));'
        ].join("\\n");

        try {
            const blobUrl = URL.createObjectURL(new Blob([workerSource], { type: "text/javascript" }));
            activeWorker = new Worker(blobUrl);
            URL.revokeObjectURL(blobUrl);
            activeWorker.addEventListener("message", (workerEvent) => {
                const payload = workerEvent.data;
                if (payload && typeof payload.type === "string") {
                    forward({ token: request.token, ...payload });
                    if (payload.type === "complete" || payload.type === "failure") {
                        activeWorker.terminate();
                        activeWorker = null;
                    }
                }
            });
            activeWorker.addEventListener("error", (workerError) => {
                forward({
                    token: request.token,
                    type: "failure",
                    name: "SyntaxError",
                    message: workerError.message || "代码解析失败"
                });
                activeWorker.terminate();
                activeWorker = null;
                workerError.preventDefault();
            });
        } catch (error) {
            forward({
                token: request.token,
                type: "failure",
                name: error && error.name || "SandboxError",
                message: error && error.message || "无法启动隔离运行环境"
            });
        }
    });
})();
<\/script></body></html>`;

    const defaultCode = {
        javascript: `// JavaScript 会在无同源权限、禁网的临时 Worker 中运行
function helloWorld() {
    console.log("Hello, World!");
    return "运行成功！";
}

return helloWorld();`,
        python: `# Python 代码（仅支持查看和编辑）
def hello_world():
    print("Hello, World!")

hello_world()`,
        java: `// Java 代码（仅支持查看和编辑）
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
        cpp: `// C++ 代码（仅支持查看和编辑）
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`
    };

    const output = document.getElementById("output");
    const runButton = document.getElementById("run-btn");
    const languageSelect = document.getElementById("language-select");
    const languageInfo = document.getElementById("language-info");
    let activeExecution = null;

    const editor = CodeMirror.fromTextArea(document.getElementById("code-editor"), {
        lineNumbers: true,
        mode: "javascript",
        theme: "monokai",
        indentUnit: 4,
        autoCloseBrackets: true,
        matchBrackets: true,
        lineWrapping: true
    });

    function setOutputStatus(message, className) {
        output.replaceChildren();
        const line = document.createElement("div");
        if (className) line.className = className;
        line.textContent = message;
        output.appendChild(line);
    }

    function appendOutput(message, level) {
        if (output.children.length >= MAX_OUTPUT_LINES) return;
        const line = document.createElement("div");
        line.className = level === "error" || level === "warn" ? "error-output" : "console-output";
        line.textContent = String(message || "").slice(0, MAX_OUTPUT_LINE_LENGTH);
        output.appendChild(line);
    }

    function stopActiveExecution() {
        if (!activeExecution) return;
        const execution = activeExecution;
        activeExecution = null;
        window.clearTimeout(execution.timeoutId);
        window.removeEventListener("message", execution.onMessage);
        try {
            execution.frame.contentWindow.postMessage({ type: "cancel" }, "*");
        } catch (error) {
            // The opaque sandbox may already be gone; removal below is still safe.
        }
        window.setTimeout(() => execution.frame.remove(), 50);
        runButton.disabled = languageSelect.value !== "javascript";
    }

    function runInSandbox(code) {
        stopActiveExecution();
        setOutputStatus("正在启动隔离运行环境…", "console-output");
        runButton.disabled = true;

        const token = `${Date.now()}-${crypto.getRandomValues(new Uint32Array(1))[0]}`;
        const frame = document.createElement("iframe");
        frame.className = "code-execution-sandbox";
        frame.setAttribute("sandbox", "allow-scripts");
        frame.setAttribute("aria-hidden", "true");
        frame.setAttribute("tabindex", "-1");
        frame.referrerPolicy = "no-referrer";
        frame.title = "临时代码隔离环境";
        frame.srcdoc = sandboxDocument;

        const finish = () => stopActiveExecution();
        const onMessage = (event) => {
            const payload = event.data;
            if (event.source !== frame.contentWindow || !payload || payload.source !== "symgo-code-sandbox" || payload.token !== token) {
                return;
            }

            if (payload.type === "output") {
                if (output.textContent.includes("正在启动隔离运行环境")) output.replaceChildren();
                appendOutput(payload.text, payload.level);
                return;
            }

            if (payload.type === "complete") {
                if (output.textContent.includes("正在启动隔离运行环境")) output.replaceChildren();
                if (payload.value && payload.value !== "undefined") appendOutput(`返回值：${payload.value}`, "log");
                if (!output.children.length) appendOutput("运行完成（无输出）", "log");
                finish();
                return;
            }

            if (payload.type === "failure") {
                setOutputStatus(`${payload.name || "Error"}：${payload.message || "运行失败"}`, "error-output");
                finish();
            }
        };

        const timeoutId = window.setTimeout(() => {
            setOutputStatus(`运行已在 ${EXECUTION_TIMEOUT_MS / 1000} 秒后终止，可能存在死循环或耗时任务。`, "error-output");
            stopActiveExecution();
        }, EXECUTION_TIMEOUT_MS);

        activeExecution = { frame, onMessage, timeoutId };
        window.addEventListener("message", onMessage);
        frame.addEventListener("load", () => {
            if (activeExecution && activeExecution.frame === frame) {
                frame.contentWindow.postMessage({ type: "run", token, code }, "*");
            }
        }, { once: true });
        document.body.appendChild(frame);
    }

    function updateCodePreview() {
        const language = languageSelect.value;
        const previewElement = document.getElementById("code-preview");
        const codeElement = previewElement.querySelector("code");
        const requestedTheme = document.getElementById("highlight-theme-select").value;
        const theme = allowedHighlightThemes.has(requestedTheme) ? requestedTheme : "github";

        document.querySelectorAll("link[data-highlight-theme]").forEach((link) => link.remove());
        const themeLink = document.createElement("link");
        themeLink.rel = "stylesheet";
        const themePath = highlightThemePaths[theme] || theme;
        themeLink.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/${themePath}.min.css`;
        themeLink.dataset.highlightTheme = theme;
        document.head.appendChild(themeLink);

        codeElement.className = `language-${language}`;
        codeElement.textContent = editor.getValue();
        codeElement.removeAttribute("data-highlighted");
        hljs.highlightElement(codeElement);
        previewElement.style.display = "block";
    }

    languageSelect.addEventListener("change", (event) => {
        const language = Object.hasOwn(defaultCode, event.target.value) ? event.target.value : "javascript";
        stopActiveExecution();
        editor.setOption("mode", language === "python" ? "python" : language === "javascript" ? "javascript" : "text/x-c++src");
        editor.setValue(defaultCode[language]);
        runButton.disabled = language !== "javascript";
        languageInfo.textContent = language === "javascript"
            ? "JavaScript 在无同源权限、禁网的临时沙箱中运行，最长 3 秒"
            : "该语言仅支持代码编辑，不支持运行";
        updateCodePreview();
    });

    document.getElementById("theme-select").addEventListener("change", (event) => {
        editor.setOption("theme", event.target.value);
    });

    runButton.addEventListener("click", () => {
        const code = editor.getValue();
        if (code.length > MAX_CODE_LENGTH) {
            setOutputStatus(`代码超过 ${MAX_CODE_LENGTH.toLocaleString("zh-CN")} 字符，已拒绝运行。`, "error-output");
            return;
        }
        runInSandbox(code);
    });

    document.getElementById("export-btn").addEventListener("click", async () => {
        const previewElement = document.getElementById("code-preview");
        try {
            const canvas = await html2canvas(previewElement, {
                backgroundColor: "#272822",
                scale: 2,
                padding: 0,
                margin: 0,
                borderRadius: 0
            });
            const link = document.createElement("a");
            link.download = `code-${languageSelect.value}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (error) {
            setOutputStatus(`导出图片失败：${error.message || String(error)}`, "error-output");
        }
    });

    document.getElementById("highlight-theme-select").addEventListener("change", updateCodePreview);
    editor.on("change", updateCodePreview);
    window.addEventListener("pagehide", stopActiveExecution, { once: true });

    editor.setValue(defaultCode.javascript);
    languageInfo.textContent = "JavaScript 在无同源权限、禁网的临时沙箱中运行，最长 3 秒";
    updateCodePreview();
}());
