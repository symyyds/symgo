const fs = require("fs");
const path = require("path");
const { protectedSitemapPages } = require("./site-governance");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "dist");

const rootFiles = [
  "_headers",
  "_redirects",
  "404.html",
  "index.html",
  "dashboard.html",
  "profile.html",
  "resume.html",
  "research.html",
  "snapshot.html",
  "achievements.html",
  "services.html",
  "roadmap.html",
  "interview.html",
  "publications.html",
  "projects.html",
  "engineering-projects.html",
  "horizontal-projects.html",
  "materials.html",
  "blog.html",
  "ai.html",
  "api.html",
  "leave_message.html",
  "manifest.webmanifest",
  "robots.txt",
  "sitemap.xml"
];

// These are intentional public content/resource roots. Historical pages, build
// tooling and Netlify function source are not copied into the static publish dir.
const publicDirectories = [
  "css",
  "js",
  "images",
  "files",
  "blog",
  "tools",
  "library",
  "cases",
  "handbook",
  "evidence"
];

const primarySitePages = [
  "",
  "dashboard.html",
  "profile.html",
  "resume.html",
  "research.html",
  "snapshot.html",
  "achievements.html",
  "services.html",
  "roadmap.html",
  "interview.html",
  "publications.html",
  "projects.html",
  "engineering-projects.html",
  "horizontal-projects.html",
  "materials.html",
  "blog.html",
  "ai.html",
  "api.html",
  "leave_message.html"
];

const indexableGeneratedPages = new Set(protectedSitemapPages);
const generatedPlaceholderPrefixes = ["library/", "cases/", "handbook/", "evidence/"];
const explicitlyThinPages = new Set(["blog/paper-review-1.html"]);
const notebookHeadingPages = new Set([
  "tools/python/python三大程序结构.html",
  "tools/python/六大数据类型.html",
  "tools/python/面向对象编程.html"
]);
const supersededSourceAssets = new Set([
  "images/blog/baoyan/baoyan.png",
  "images/blog/25_skills/fig1.png",
  "images/movies/25_skills_movie.mp4"
]);
const skippedPublishPaths = new Set();

function normalizePath(value) {
  return value.split(path.sep).join("/").replace(/^\.\//, "");
}

function resetDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function isDevelopmentArtifact(relativePath, isDirectory) {
  const normalized = normalizePath(relativePath);
  const segments = normalized.toLowerCase().split("/");
  const basename = segments.at(-1) || "";
  const blockedSegments = new Set([
    ".git",
    ".netlify",
    ".ipynb_checkpoints",
    "node_modules",
    "old",
    "server",
    "scripts",
    "test",
    "tests",
    "tmp",
    "temp",
    "scratch",
    "__pycache__"
  ]);

  if (segments.some((segment) => blockedSegments.has(segment))) return true;
  if (isDirectory) return false;
  if (basename === "test.html" || basename === "test1.html") return true;
  if (/\.(?:ipynb|pyc|pyo|bak|orig|tmp|temp)$/i.test(basename)) return true;
  if (/^(?:\.ds_store|thumbs\.db|desktop\.ini)$/i.test(basename)) return true;
  if (/^~\$/.test(basename)) return true;
  if (/(?:^|[._-])(?:test|spec|tmp|temp|scratch)(?:[._-]|$)/i.test(basename)) return true;
  return false;
}

function shouldExcludeFromPublish(relativePath, isDirectory) {
  const normalized = normalizePath(relativePath);
  return isDevelopmentArtifact(normalized, isDirectory) || (!isDirectory && supersededSourceAssets.has(normalized));
}

function copyFile(relativePath) {
  const from = path.join(root, relativePath);
  const to = path.join(outDir, relativePath);
  if (!fs.existsSync(from)) throw new Error(`Required public file is missing: ${relativePath}`);
  if (shouldExcludeFromPublish(relativePath, false)) {
    skippedPublishPaths.add(normalizePath(relativePath));
    return;
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

function copyDir(relativePath) {
  const from = path.join(root, relativePath);
  const to = path.join(outDir, relativePath);
  if (!fs.existsSync(from)) throw new Error(`Required public directory is missing: ${relativePath}`);

  fs.cpSync(from, to, {
    recursive: true,
    filter(source) {
      const relativeSource = normalizePath(path.relative(root, source));
      const isDirectory = fs.statSync(source).isDirectory();
      const blocked = shouldExcludeFromPublish(relativeSource, isDirectory);
      if (blocked) skippedPublishPaths.add(relativeSource);
      return !blocked;
    }
  });
}

function collectFiles(dir, predicate = () => true) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { recursive: true })
    .map((entry) => path.join(dir, entry))
    .filter((target) => fs.existsSync(target) && fs.statSync(target).isFile() && predicate(target));
}

function outputPageForFile(relativeFile) {
  const normalized = normalizePath(relativeFile);
  if (normalized === "index.html") return "";
  if (normalized.endsWith("/index.html")) return normalized.replace(/index\.html$/, "");
  return normalized;
}

function outputFileForPage(page) {
  return page === ""
    ? "index.html"
    : page.endsWith("/")
      ? `${page}index.html`
      : page;
}

function isIndexablePage(relativeFile) {
  const page = outputPageForFile(relativeFile);
  if (relativeFile === "404.html" || explicitlyThinPages.has(page)) return false;
  if (generatedPlaceholderPrefixes.some((prefix) => page.startsWith(prefix))) {
    return indexableGeneratedPages.has(page);
  }
  return true;
}

function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function upsertHeadTag(html, matcher, tag) {
  if (matcher.test(html)) return html.replace(matcher, tag);
  return html.replace(/<\/head>/i, `    ${tag}\n</head>`);
}

function injectSeoMetadata(html, relativeFile, siteUrl) {
  const page = outputPageForFile(relativeFile);
  const canonicalUrl = encodeURI(`${siteUrl}/${page}`);
  const escapedUrl = escapeAttribute(canonicalUrl);
  const robots = isIndexablePage(relativeFile) ? "index,follow" : "noindex,follow";

  let output = html.replace(/https:\/\/symgo\.netlify\.app/g, siteUrl);
  if (notebookHeadingPages.has(relativeFile)) {
    let headingIndex = 0;
    output = output.replace(/<h1\b([^>]*)>([\s\S]*?)<\/h1>/gi, (match, attributes, content) => {
      headingIndex += 1;
      return headingIndex === 1 ? match : `<h2${attributes}>${content}</h2>`;
    });
  }
  output = upsertHeadTag(
    output,
    /<link(?=[^>]*\brel=["']canonical["'])[^>]*>/i,
    `<link rel="canonical" href="${escapedUrl}">`
  );
  output = upsertHeadTag(
    output,
    /<meta(?=[^>]*\bproperty=["']og:url["'])[^>]*>/i,
    `<meta property="og:url" content="${escapedUrl}">`
  );
  output = upsertHeadTag(
    output,
    /<meta(?=[^>]*\bname=["']robots["'])[^>]*>/i,
    `<meta name="robots" content="${robots}">`
  );
  return output;
}

function rewriteHtmlMetadata(siteUrl) {
  const htmlFiles = collectFiles(outDir, (target) => target.toLowerCase().endsWith(".html"));
  for (const target of htmlFiles) {
    const relativeFile = normalizePath(path.relative(outDir, target));
    const html = fs.readFileSync(target, "utf8");
    fs.writeFileSync(target, injectSeoMetadata(html, relativeFile, siteUrl), "utf8");
  }
  return htmlFiles.length;
}

function collectSitemapPages() {
  const pages = [...primarySitePages, ...protectedSitemapPages];
  for (const directory of ["blog", "tools"]) {
    const directoryPath = path.join(outDir, directory);
    for (const target of collectFiles(directoryPath, (file) => file.toLowerCase().endsWith(".html"))) {
      const relativeFile = normalizePath(path.relative(outDir, target));
      if (isIndexablePage(relativeFile)) pages.push(outputPageForFile(relativeFile));
    }
  }

  return Array.from(new Set(pages)).filter((page) => {
    const file = path.join(outDir, outputFileForPage(page));
    return fs.existsSync(file) && isIndexablePage(normalizePath(path.relative(outDir, file)));
  });
}

function pagePriority(page) {
  if (page === "") return "1.0";
  if (["publications.html", "engineering-projects.html", "horizontal-projects.html", "resume.html"].includes(page)) return "0.9";
  if (page.startsWith("evidence/horizontal-projects/")) return "0.8";
  if (page.startsWith("blog/")) return "0.7";
  if (page.startsWith("tools/")) return "0.6";
  return "0.8";
}

function writeSitemapAndRobots(siteUrl) {
  const pages = collectSitemapPages();
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((page) => `  <url><loc>${encodeURI(`${siteUrl}/${page}`)}</loc><priority>${pagePriority(page)}</priority></url>`).join("\n")}
</urlset>
`;
  fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemap, "utf8");
  fs.writeFileSync(path.join(outDir, "robots.txt"), `User-agent: *
Allow: /
Disallow: /old/
Disallow: /test.html
Disallow: /test1.html
Disallow: /*.ipynb$

Sitemap: ${siteUrl}/sitemap.xml
`, "utf8");
  return pages.length;
}

function validateBuildOutput() {
  const outputFiles = collectFiles(outDir).map((target) => normalizePath(path.relative(outDir, target)));
  const forbidden = outputFiles.filter((file) => shouldExcludeFromPublish(file, false));
  if (forbidden.length) {
    throw new Error(`Non-public source artifacts leaked into dist: ${forbidden.join(", ")}`);
  }

  for (const page of protectedSitemapPages.slice(1)) {
    if (!fs.existsSync(path.join(outDir, page))) {
      throw new Error(`Protected project page missing from dist: ${page}`);
    }
  }

  const horizontalIndexPath = path.join(outDir, "evidence", "horizontal-projects", "index.html");
  const horizontalIndex = fs.readFileSync(horizontalIndexPath, "utf8");
  for (const page of protectedSitemapPages.slice(1)) {
    const filename = path.posix.basename(page);
    if (!horizontalIndex.includes(`href="${filename}`)) {
      throw new Error(`Protected project entry missing from generated index: ${filename}`);
    }
  }

  const sitemap = fs.readFileSync(path.join(outDir, "sitemap.xml"), "utf8");
  if (/\/old\/|\/test1?\.html|\.ipynb|\/library\/|\/cases\/|\/handbook\//i.test(sitemap)) {
    throw new Error("Sitemap contains a historical, test, notebook or generated placeholder URL.");
  }

  for (const relativeFile of outputFiles.filter((file) => file.endsWith(".html"))) {
    const html = fs.readFileSync(path.join(outDir, relativeFile), "utf8");
    const canonicalCount = (html.match(/<link(?=[^>]*\brel=["']canonical["'])[^>]*>/gi) || []).length;
    const robotsCount = (html.match(/<meta(?=[^>]*\bname=["']robots["'])[^>]*>/gi) || []).length;
    const openGraphUrlCount = (html.match(/<meta(?=[^>]*\bproperty=["']og:url["'])[^>]*>/gi) || []).length;
    if (canonicalCount !== 1 || robotsCount !== 1 || openGraphUrlCount !== 1) {
      throw new Error(`SEO metadata must appear exactly once in ${relativeFile}.`);
    }
  }
}

function reportLargeAssets() {
  const warningBytes = 10 * 1024 * 1024;
  const largeAssets = collectFiles(outDir)
    .map((target) => ({
      path: normalizePath(path.relative(outDir, target)),
      bytes: fs.statSync(target).size
    }))
    .filter((asset) => asset.bytes > warningBytes)
    .sort((a, b) => b.bytes - a.bytes);

  for (const asset of largeAssets) {
    console.warn(`Performance warning: ${asset.path} is ${(asset.bytes / 1024 / 1024).toFixed(1)} MB.`);
  }
}

resetDir(outDir);
rootFiles.forEach(copyFile);
publicDirectories.forEach(copyDir);

const siteUrl = (
  process.env.SITE_URL ||
  process.env.URL ||
  process.env.DEPLOY_PRIME_URL ||
  "https://symgo.netlify.app"
).replace(/\/$/, "");

const htmlCount = rewriteHtmlMetadata(siteUrl);
const sitemapCount = writeSitemapAndRobots(siteUrl);
validateBuildOutput();
reportLargeAssets();

console.log(`Static site built to ${path.relative(root, outDir)}: ${htmlCount} HTML files, ${sitemapCount} indexed URLs, ${skippedPublishPaths.size} non-public source artifacts excluded.`);
