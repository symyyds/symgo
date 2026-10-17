const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const htmlFiles = [];
const missing = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "dist", "server", "node_modules"].includes(entry.name)) continue;
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (entry.isFile() && entry.name.endsWith(".html")) htmlFiles.push(target);
  }
}

function cleanLocalRef(value) {
  if (!value || value.startsWith("#")) return "";
  if (/^(https?:)?\/\//i.test(value)) return "";
  if (/^(mailto|tel|javascript):/i.test(value)) return "";
  return value.split("#")[0].split("?")[0];
}

function resolveLocal(fromFile, href) {
  const clean = cleanLocalRef(href);
  if (!clean) return "";
  const base = clean.startsWith("/") ? root : path.dirname(fromFile);
  return path.resolve(base, clean.replace(/^\//, ""));
}

walk(root);

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const refs = [
    ...html.matchAll(/\s(?:href|src)=["']([^"']+)["']/gi)
  ].map((match) => match[1]);

  for (const ref of refs) {
    const target = resolveLocal(file, ref);
    if (!target) continue;
    if (target.endsWith(".html") || path.extname(target)) {
      if (!fs.existsSync(target)) {
        missing.push({
          file: path.relative(root, file).replace(/\\/g, "/"),
          ref
        });
      }
    }
  }
}

if (missing.length) {
  console.error(JSON.stringify(missing, null, 2));
  process.exit(1);
}

console.log(`Checked ${htmlFiles.length} HTML files; no missing local href/src references.`);
