const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "dist");

const rootFiles = [
  "_headers",
  "_redirects",
  "404.html",
  "index.html",
  "dashboard.html",
  "profile.html",
  "research.html",
  "snapshot.html",
  "achievements.html",
  "services.html",
  "roadmap.html",
  "interview.html",
  "publications.html",
  "projects.html",
  "materials.html",
  "blog.html",
  "ai.html",
  "leave_message.html",
  "manifest.webmanifest",
  "robots.txt",
  "sitemap.xml",
];

const directories = ["css", "js", "images", "files", "blog", "tools"];
const sitePages = [
  "",
  "dashboard.html",
  "profile.html",
  "research.html",
  "snapshot.html",
  "achievements.html",
  "services.html",
  "roadmap.html",
  "interview.html",
  "publications.html",
  "projects.html",
  "materials.html",
  "blog.html",
  "ai.html",
  "leave_message.html",
];

function resetDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(relativePath) {
  const from = path.join(root, relativePath);
  const to = path.join(outDir, relativePath);
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

function copyDir(relativePath) {
  const from = path.join(root, relativePath);
  const to = path.join(outDir, relativePath);
  if (!fs.existsSync(from)) return;
  fs.cpSync(from, to, { recursive: true });
}

function rewriteHtmlUrls(siteUrl) {
  for (const file of fs.readdirSync(outDir, { recursive: true })) {
    if (!file.endsWith(".html")) continue;
    const target = path.join(outDir, file);
    let html = fs.readFileSync(target, "utf8");
    html = html.replace(/https:\/\/symgo\.netlify\.app/g, siteUrl);
    fs.writeFileSync(target, html, "utf8");
  }
}

resetDir(outDir);
rootFiles.forEach(copyFile);
directories.forEach(copyDir);

const siteUrl = (process.env.URL || process.env.DEPLOY_PRIME_URL || "https://symgo.netlify.app").replace(/\/$/, "");
rewriteHtmlUrls(siteUrl);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitePages.map((page) => `  <url><loc>${siteUrl}/${page}</loc><priority>${page ? "0.8" : "1.0"}</priority></url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemap, "utf8");
fs.writeFileSync(path.join(outDir, "robots.txt"), `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`, "utf8");

console.log(`Static site built to ${path.relative(root, outDir)}`);
