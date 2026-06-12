"use strict";

function firstText(value) {
        if (Array.isArray(value)) return value.find(Boolean) || "";
        return value || "";
    }

function trimText(value, maxLength) {
        const text = String(value || "").replace(/\s+/g, " ").trim();
        if (text.length <= maxLength) return text;
        return `${text.slice(0, Math.max(0, maxLength - 1))}…`;
    }

function formatDate(value) {
        if (!value) return "--";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        return date.toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" });
    }

const categoryLabels = {
    portfolio: "作品集",
    research: "研究",
    career: "求职申博",
    writing: "写作",
    utility: "工具",
    design: "设计",
    data: "开放数据"
};

const categoryDescriptions = {
    portfolio: "GitHub 与站点证据",
    research: "论文、模型与数据集",
    career: "岗位与能力关键词",
    writing: "博客选题和双语写作",
    utility: "开发、排期与假数据",
    design: "色彩、艺术和科技图像",
    data: "汇率与 GeoJSON 开放数据"
};

const liveApis = [
    {
        id: "github-repo",
        title: "GitHub Repository API",
        source: "GitHub REST",
        category: "portfolio",
        icon: "fa-code-branch",
        publicApisCategory: "Development",
        purpose: "把个人博客仓库的 Star、Fork、更新时间和语言变成实时工程证据。",
        endpoint: "https://api.github.com/repos/symyyds/symgo",
        docs: "https://docs.github.com/en/rest/repos/repos#get-a-repository",
        featured: true,
        parse(data) {
            return {
                summary: `${data.full_name || "symyyds/symgo"} · ${data.stargazers_count || 0} stars · ${data.forks_count || 0} forks`,
                facts: [
                    ["主语言", data.language || "未标注"],
                    ["最后更新", formatDate(data.updated_at)],
                    ["默认分支", data.default_branch || "main"]
                ]
            };
        }
    },
    {
        id: "github-user",
        title: "GitHub User API",
        source: "GitHub REST",
        category: "portfolio",
        icon: "fa-user-gear",
        publicApisCategory: "Development",
        purpose: "展示开发者公开主页、仓库数量和 GitHub 账号活跃度。",
        endpoint: "https://api.github.com/users/symyyds",
        docs: "https://docs.github.com/en/rest/users/users#get-a-user",
        parse(data) {
            return {
                summary: `${data.login || "symyyds"} · ${data.public_repos || 0} public repos`,
                facts: [
                    ["公开仓库", data.public_repos ?? "--"],
                    ["关注者", data.followers ?? "--"],
                    ["创建时间", formatDate(data.created_at)]
                ]
            };
        }
    },
    {
        id: "github-commits",
        title: "GitHub Commits API",
        source: "GitHub REST",
        category: "portfolio",
        icon: "fa-code-commit",
        publicApisCategory: "Development",
        purpose: "读取博客仓库最近提交，用时间线证明作品集持续维护，而不是一次性静态页面。",
        endpoint: "https://api.github.com/repos/symyyds/symgo/commits?per_page=3",
        docs: "https://docs.github.com/en/rest/commits/commits#list-commits",
        parse(data) {
            const commits = Array.isArray(data) ? data : [];
            const latest = commits[0]?.commit || {};
            return {
                summary: latest.message ? trimText(latest.message, 110) : `最近提交 ${commits.length} 条`,
                facts: [
                    ["提交数", commits.length],
                    ["作者", latest.author?.name || "--"],
                    ["时间", formatDate(latest.author?.date)]
                ]
            };
        }
    },
    {
        id: "github-contents",
        title: "GitHub Contents API",
        source: "GitHub REST",
        category: "portfolio",
        icon: "fa-folder-open",
        publicApisCategory: "Development",
        purpose: "读取公开仓库目录结构，可用于证明站点有论文、工具、材料、项目等真实模块。",
        endpoint: "https://api.github.com/repos/symyyds/symgo/contents",
        docs: "https://docs.github.com/en/rest/repos/contents#get-repository-content",
        parse(data) {
            const entries = Array.isArray(data) ? data : [];
            const dirs = entries.filter((entry) => entry.type === "dir").map((entry) => entry.name);
            return {
                summary: `根目录 ${entries.length} 个条目，包含 ${dirs.slice(0, 5).join(" · ") || "公开文件"}`,
                facts: [
                    ["目录数", dirs.length],
                    ["文件数", entries.filter((entry) => entry.type === "file").length],
                    ["核心目录", dirs.slice(0, 4).join(", ") || "--"]
                ]
            };
        }
    },
    {
        id: "remotive-jobs",
        title: "Remotive Jobs API",
        source: "Remotive",
        category: "career",
        icon: "fa-briefcase",
        publicApisCategory: "Jobs",
        purpose: "检索远程软件工程岗位，帮助求职版作品集展示和岗位关键词对齐。",
        endpoint: "https://remotive.com/api/remote-jobs?search=software%20engineer&limit=3",
        docs: "https://remotive.com/api-documentation",
        timeoutMs: 15000,
        parse(data) {
            const jobs = data.jobs || [];
            const job = jobs[0] || {};
            return {
                summary: `远程岗位 ${jobs.length} 条样例：${job.title || "Software Engineer"}`,
                facts: [
                    ["公司", job.company_name || "--"],
                    ["岗位", trimText(job.title, 66) || "--"],
                    ["地区", job.candidate_required_location || "Remote"]
                ]
            };
        }
    },
    {
        id: "themuse-jobs",
        title: "The Muse Jobs API",
        source: "The Muse",
        category: "career",
        icon: "fa-building",
        publicApisCategory: "Jobs",
        purpose: "检索软件工程岗位和公司信息，为简历/项目关键词优化提供参考。",
        endpoint: "https://www.themuse.com/api/public/jobs?category=Software%20Engineering&page=1",
        docs: "https://www.themuse.com/developers/api/v2",
        parse(data) {
            const results = data.results || [];
            const job = results[0] || {};
            return {
                summary: `岗位结果 ${results.length} 条：${job.name || "Software Engineering"}`,
                facts: [
                    ["公司", job.company?.name || "--"],
                    ["地点", job.locations?.[0]?.name || "--"],
                    ["等级", job.levels?.[0]?.name || "--"]
                ]
            };
        }
    },
    {
        id: "crossref-paper",
        title: "Crossref Works API",
        source: "Crossref",
        category: "research",
        icon: "fa-file-lines",
        publicApisCategory: "Science & Math",
        purpose: "用 DOI 读取论文题名、期刊/会议来源和发表年份，补强论文页元数据。",
        endpoint: "https://api.crossref.org/works/10.54254/2755-2721/69/20241624",
        docs: "https://api.crossref.org/swagger-ui/index.html",
        featured: true,
        parse(data) {
            const item = data.message || {};
            const title = firstText(item.title) || "论文条目";
            return {
                summary: title,
                facts: [
                    ["年份", item.published?.["date-parts"]?.[0]?.[0] || item.issued?.["date-parts"]?.[0]?.[0] || "--"],
                    ["来源", firstText(item["container-title"]) || "--"],
                    ["DOI", item.DOI || "--"]
                ]
            };
        }
    },
    {
        id: "openalex-work",
        title: "OpenAlex Works API",
        source: "OpenAlex",
        category: "research",
        icon: "fa-diagram-project",
        publicApisCategory: "Science & Math",
        purpose: "查询开放学术图谱中的论文、引用和开放获取状态，适合论文页自动补充证据。",
        endpoint: "https://api.openalex.org/works/https://doi.org/10.54254/2755-2721/69/20241624",
        docs: "https://docs.openalex.org/api-entities/works",
        featured: true,
        parse(data) {
            return {
                summary: data.display_name || "OpenAlex 论文条目",
                facts: [
                    ["引用数", data.cited_by_count ?? "--"],
                    ["年份", data.publication_year || "--"],
                    ["开放获取", data.open_access?.is_oa ? "是" : "否/未知"]
                ]
            };
        }
    },
    {
        id: "semantic-scholar",
        title: "Semantic Scholar Graph API",
        source: "Semantic Scholar",
        category: "research",
        icon: "fa-network-wired",
        publicApisCategory: "Science & Math",
        purpose: "从 DOI 查询论文引用、作者和来源，可作为论文影响力的备用数据源。",
        endpoint: "https://api.semanticscholar.org/graph/v1/paper/DOI:10.54254/2755-2721/69/20241624?fields=title,year,venue,citationCount,authors,url",
        docs: "https://api.semanticscholar.org/api-docs/graph",
        parse(data) {
            const authors = Array.isArray(data.authors) ? data.authors.slice(0, 3).map((author) => author.name).join(", ") : "--";
            return {
                summary: data.title || "Semantic Scholar 论文条目",
                facts: [
                    ["年份", data.year || "--"],
                    ["引用数", data.citationCount ?? "--"],
                    ["作者", authors || "--"]
                ]
            };
        }
    },
    {
        id: "zenodo",
        title: "Zenodo Records API",
        source: "Zenodo",
        category: "research",
        icon: "fa-database",
        publicApisCategory: "Science & Math",
        purpose: "检索可公开引用的数据集、软件和研究产物，适合以后扩展材料库。",
        endpoint: "https://zenodo.org/api/records?q=machine%20learning&size=3",
        docs: "https://developers.zenodo.org/",
        parse(data) {
            const hits = data.hits?.hits || [];
            return {
                summary: `找到 ${data.hits?.total || hits.length || 0} 条 Zenodo 记录`,
                facts: [
                    ["样例", hits[0]?.metadata?.title || "--"],
                    ["类型", hits[0]?.metadata?.resource_type?.title || "--"],
                    ["返回条数", hits.length]
                ]
            };
        }
    },
    {
        id: "dblp",
        title: "DBLP Search API",
        source: "DBLP",
        category: "research",
        icon: "fa-graduation-cap",
        publicApisCategory: "Science & Math",
        purpose: "检索计算机科学论文索引，适合给研究方向页补充相关论文和作者线索。",
        endpoint: "https://dblp.org/search/publ/api?q=random%20forest&format=json&h=3",
        docs: "https://dblp.org/faq/How+to+use+the+dblp+search+API.html",
        parse(data) {
            const hits = data.result?.hits?.hit || [];
            const info = hits[0]?.info || {};
            return {
                summary: `DBLP 返回 ${data.result?.hits?.["@total"] || hits.length || 0} 条论文索引`,
                facts: [
                    ["样例", info.title || "--"],
                    ["作者", typeof info.authors?.author === "string" ? info.authors.author : info.authors?.author?.[0]?.text || info.authors?.author?.[0] || "--"],
                    ["年份", info.year || "--"]
                ]
            };
        }
    },
    {
        id: "europe-pmc",
        title: "Europe PMC Search API",
        source: "Europe PMC",
        category: "research",
        icon: "fa-microscope",
        publicApisCategory: "Science & Math",
        purpose: "检索开放学术文献摘要和 DOI，可作为论文页的备用元数据来源。",
        endpoint: "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=random%20forest&format=json&pageSize=3",
        docs: "https://europepmc.org/RestfulWebService",
        parse(data) {
            const result = data.resultList?.result?.[0] || {};
            return {
                summary: `Europe PMC 返回 ${data.hitCount || 0} 条文献`,
                facts: [
                    ["样例", result.title || "--"],
                    ["期刊", result.journalTitle || "--"],
                    ["年份", result.pubYear || "--"]
                ]
            };
        }
    },
    {
        id: "openml-datasets",
        title: "OpenML Dataset API",
        source: "OpenML",
        category: "research",
        icon: "fa-table",
        publicApisCategory: "Machine Learning",
        purpose: "检索开放机器学习数据集，适合论文复现实验、项目案例和材料库扩展。",
        endpoint: "https://www.openml.org/api/v1/json/data/list/limit/3/status/active",
        docs: "https://docs.openml.org/APIs/",
        parse(data) {
            const datasets = data.data?.dataset || [];
            const first = datasets[0] || {};
            return {
                summary: `OpenML 返回 ${datasets.length} 个开放数据集`,
                facts: [
                    ["样例", first.name || "--"],
                    ["特征数", first.NumberOfFeatures ?? "--"],
                    ["样本数", first.NumberOfInstances ?? "--"]
                ]
            };
        }
    },
    {
        id: "launch-library",
        title: "Launch Library 2 API",
        source: "The Space Devs",
        category: "research",
        icon: "fa-rocket",
        publicApisCategory: "Science & Math",
        purpose: "读取航天发射任务数据，适合作为科研动态、开放科学数据和时间线组件素材。",
        endpoint: "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=3",
        docs: "https://thespacedevs.com/llapi",
        parse(data) {
            const launches = data.results || [];
            const launch = launches[0] || {};
            return {
                summary: `近期航天发射 ${data.count || launches.length || 0} 条：${launch.name || "Launch"}`,
                facts: [
                    ["机构", launch.launch_service_provider?.name || "--"],
                    ["时间", formatDate(launch.net)],
                    ["状态", launch.status?.name || "--"]
                ]
            };
        }
    },
    {
        id: "datamuse",
        title: "Datamuse Word API",
        source: "Datamuse",
        category: "writing",
        icon: "fa-pen-nib",
        publicApisCategory: "Text Analysis",
        purpose: "为英文摘要、项目描述和博客标题生成相关词，提升写作检索效率。",
        endpoint: "https://api.datamuse.com/words?ml=portfolio&max=6",
        docs: "https://www.datamuse.com/api/",
        parse(data) {
            const words = data.map((item) => item.word).slice(0, 6);
            return {
                summary: words.join(" · ") || "Datamuse related words",
                facts: [
                    ["返回词数", data.length],
                    ["最高分", data[0]?.score ?? "--"],
                    ["适用", "摘要/标题/关键词"]
                ]
            };
        }
    },
    {
        id: "dictionary",
        title: "Free Dictionary API",
        source: "DictionaryAPI",
        category: "writing",
        icon: "fa-spell-check",
        publicApisCategory: "Dictionaries",
        purpose: "给英文术语提供释义和音标，适合论文关键词和博客术语卡片。",
        endpoint: "https://api.dictionaryapi.dev/api/v2/entries/en/algorithm",
        docs: "https://dictionaryapi.dev/",
        parse(data) {
            const entry = data[0] || {};
            const meaning = entry.meanings?.[0];
            return {
                summary: `${entry.word || "algorithm"} · ${meaning?.partOfSpeech || "definition"}`,
                facts: [
                    ["音标", entry.phonetic || entry.phonetics?.[0]?.text || "--"],
                    ["释义", trimText(meaning?.definitions?.[0]?.definition, 86) || "--"],
                    ["词性", meaning?.partOfSpeech || "--"]
                ]
            };
        }
    },
    {
        id: "hacker-news",
        title: "Hacker News Search API",
        source: "Algolia HN",
        category: "writing",
        icon: "fa-newspaper",
        publicApisCategory: "News",
        purpose: "给技术博客提供趋势话题和讨论入口，适合做写作选题雷达。",
        endpoint: "https://hn.algolia.com/api/v1/search?query=machine%20learning%20portfolio&tags=story&hitsPerPage=3",
        docs: "https://hn.algolia.com/api",
        parse(data) {
            const first = data.hits?.[0] || {};
            return {
                summary: `检索到 ${data.nbHits || 0} 条 HN 讨论`,
                facts: [
                    ["热门标题", trimText(first.title, 70) || "--"],
                    ["点数", first.points ?? "--"],
                    ["评论", first.num_comments ?? "--"]
                ]
            };
        }
    },
    {
        id: "devto-articles",
        title: "DEV.to Articles API",
        source: "DEV Community",
        category: "writing",
        icon: "fa-pen-to-square",
        publicApisCategory: "News",
        purpose: "检索技术社区文章，用作博客选题、技术栈趋势和写作参考。",
        endpoint: "https://dev.to/api/articles?tag=machinelearning&per_page=3",
        docs: "https://developers.forem.com/api",
        parse(data) {
            const articles = Array.isArray(data) ? data : [];
            const article = articles[0] || {};
            return {
                summary: `DEV.to 返回 ${articles.length} 篇文章：${article.title || "tech article"}`,
                facts: [
                    ["作者", article.user?.name || "--"],
                    ["反应数", article.public_reactions_count ?? "--"],
                    ["发布时间", formatDate(article.published_at)]
                ]
            };
        }
    },
    {
        id: "mymemory-translate",
        title: "MyMemory Translation API",
        source: "MyMemory",
        category: "writing",
        icon: "fa-language",
        publicApisCategory: "Translation",
        purpose: "为英文摘要、项目标题和双语材料提供轻量翻译参考。",
        endpoint: "https://api.mymemory.translated.net/get?q=software%20engineering&langpair=en%7Czh-CN",
        docs: "https://mymemory.translated.net/doc/spec.php",
        parse(data) {
            const translated = data.responseData?.translatedText || "";
            return {
                summary: translated ? `software engineering → ${translated}` : "翻译结果已返回",
                facts: [
                    ["匹配度", data.responseData?.match ?? "--"],
                    ["语言", "en → zh-CN"],
                    ["来源", data.matches?.[0]?.created_by || "--"]
                ]
            };
        }
    },
    {
        id: "microlink",
        title: "Microlink Metadata API",
        source: "Microlink",
        category: "writing",
        icon: "fa-link",
        publicApisCategory: "URL Shorteners",
        purpose: "抽取网页标题、描述和截图元信息，适合博客引用卡片和项目链接预览。",
        endpoint: "https://api.microlink.io/?url=https%3A%2F%2Fsymgo.netlify.app",
        docs: "https://microlink.io/docs/api/getting-started/overview",
        parse(data) {
            const meta = data.data || {};
            return {
                summary: meta.title || "网页元信息已返回",
                facts: [
                    ["站点", meta.publisher || meta.author || "--"],
                    ["描述", trimText(meta.description, 78) || "--"],
                    ["图片", meta.image?.url ? "有" : "无/未知"]
                ]
            };
        }
    },
    {
        id: "cdnjs",
        title: "cdnjs Library API",
        source: "cdnjs",
        category: "utility",
        icon: "fa-cubes",
        publicApisCategory: "Development",
        purpose: "快速查询前端库 CDN 地址，适合工具页和技术栈说明。",
        endpoint: "https://api.cdnjs.com/libraries?search=three&fields=name,description,latest&limit=3",
        docs: "https://cdnjs.com/api",
        parse(data) {
            const first = data.results?.[0] || {};
            return {
                summary: `找到 ${data.total || data.results?.length || 0} 个 CDN 库`,
                facts: [
                    ["样例库", first.name || "--"],
                    ["最新地址", first.latest ? "已返回" : "--"],
                    ["用途", trimText(first.description, 66) || "--"]
                ]
            };
        }
    },
    {
        id: "npm-registry",
        title: "npm Registry Search API",
        source: "npm Registry",
        category: "utility",
        icon: "fa-cube",
        publicApisCategory: "Development",
        purpose: "查询前端生态包，适合技术栈选型、工具页依赖说明和项目复盘。",
        endpoint: "https://registry.npmjs.org/-/v1/search?text=portfolio&size=3",
        docs: "https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md",
        parse(data) {
            const objects = data.objects || [];
            const pkg = objects[0]?.package || {};
            return {
                summary: `npm 搜索返回 ${data.total || objects.length || 0} 个包`,
                facts: [
                    ["包名", pkg.name || "--"],
                    ["版本", pkg.version || "--"],
                    ["描述", trimText(pkg.description, 70) || "--"]
                ]
            };
        }
    },
    {
        id: "pypi-package",
        title: "PyPI Package API",
        source: "PyPI",
        category: "utility",
        icon: "fa-box",
        publicApisCategory: "Development",
        purpose: "读取 Python 包信息，适合 Python 学习页和项目技术栈说明。",
        endpoint: "https://pypi.org/pypi/requests/json",
        docs: "https://docs.pypi.org/api/json/",
        parse(data) {
            const info = data.info || {};
            return {
                summary: `${info.name || "requests"} · ${info.version || "--"}`,
                facts: [
                    ["License", info.license || "--"],
                    ["作者", info.author || "--"],
                    ["摘要", trimText(info.summary, 76) || "--"]
                ]
            };
        }
    },
    {
        id: "stackexchange",
        title: "Stack Exchange API",
        source: "Stack Exchange",
        category: "utility",
        icon: "fa-layer-group",
        publicApisCategory: "Development",
        purpose: "检索技术问答，给工程项目复盘和博客参考资料提供入口。",
        endpoint: "https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=activity&q=javascript%20portfolio&site=stackoverflow&pagesize=3",
        docs: "https://api.stackexchange.com/docs",
        parse(data) {
            const first = data.items?.[0] || {};
            return {
                summary: `Stack Overflow 返回 ${data.items?.length || 0} 条问题`,
                facts: [
                    ["问题", trimText(first.title, 72) || "--"],
                    ["回答数", first.answer_count ?? "--"],
                    ["已解决", first.is_answered ? "是" : "否/未知"]
                ]
            };
        }
    },
    {
        id: "sampleapis-coding",
        title: "SampleAPIs Coding Resources",
        source: "SampleAPIs",
        category: "utility",
        icon: "fa-list-check",
        publicApisCategory: "Development",
        purpose: "获取编程学习资源，适合 Python/深度学习导航页补充外部资源。",
        endpoint: "https://api.sampleapis.com/codingresources/codingResources",
        docs: "https://sampleapis.com/api-list/codingresources",
        parse(data) {
            const resources = Array.isArray(data) ? data : [];
            const resource = resources[0] || {};
            return {
                summary: `编程资源 ${resources.length} 条：${resource.description || resource.url || "coding resource"}`,
                facts: [
                    ["类型", resource.types || resource.type || "--"],
                    ["主题", resource.topics || resource.topic || "--"],
                    ["链接", resource.url ? "可访问" : "--"]
                ]
            };
        }
    },
    {
        id: "nager-date",
        title: "Nager.Date API",
        source: "Nager.Date",
        category: "utility",
        icon: "fa-calendar-days",
        publicApisCategory: "Calendar",
        purpose: "为申请、项目排期和内容计划补充节假日信息。",
        endpoint: "https://date.nager.at/api/v3/PublicHolidays/2026/CN",
        docs: "https://date.nager.at/Api",
        parse(data) {
            const first = data[0] || {};
            return {
                summary: `中国 2026 年节假日 ${data.length || 0} 条`,
                facts: [
                    ["首个节日", first.localName || first.name || "--"],
                    ["日期", first.date || "--"],
                    ["国家", first.countryCode || "CN"]
                ]
            };
        }
    },
    {
        id: "open-meteo-geocoding",
        title: "Open-Meteo Geocoding API",
        source: "Open-Meteo",
        category: "utility",
        icon: "fa-location-dot",
        publicApisCategory: "Geocoding",
        purpose: "把城市名称转换为经纬度和时区，适合给天气组件、联系页和项目活动页复用。",
        endpoint: "https://geocoding-api.open-meteo.com/v1/search?name=Beijing&count=1&language=zh&format=json",
        docs: "https://open-meteo.com/en/docs/geocoding-api",
        parse(data) {
            const place = data.results?.[0] || {};
            return {
                summary: place.name ? `${place.name} · ${place.country || ""}` : "地理编码结果",
                facts: [
                    ["纬度", place.latitude ?? "--"],
                    ["经度", place.longitude ?? "--"],
                    ["时区", place.timezone || "--"]
                ]
            };
        }
    },
    {
        id: "open-meteo",
        title: "Open-Meteo Forecast API",
        source: "Open-Meteo",
        category: "utility",
        icon: "fa-cloud-sun",
        publicApisCategory: "Weather",
        purpose: "可用于联系页、活动页或项目看板的天气/环境小组件。",
        endpoint: "https://api.open-meteo.com/v1/forecast?latitude=39.9042&longitude=116.4074&current=temperature_2m,weather_code&timezone=Asia%2FShanghai",
        docs: "https://open-meteo.com/en/docs",
        parse(data) {
            return {
                summary: `北京当前温度 ${data.current?.temperature_2m ?? "--"}${data.current_units?.temperature_2m || "°C"}`,
                facts: [
                    ["天气代码", data.current?.weather_code ?? "--"],
                    ["更新时间", data.current?.time || "--"],
                    ["时区", data.timezone || "--"]
                ]
            };
        }
    },
    {
        id: "timeapi",
        title: "TimeAPI Time Zone API",
        source: "TimeAPI",
        category: "utility",
        icon: "fa-clock",
        publicApisCategory: "Calendar",
        purpose: "读取时区信息，适合项目排期、国际合作和联系页时间提示。",
        endpoint: "https://timeapi.io/api/TimeZone/zone?timeZone=Asia/Shanghai",
        docs: "https://www.timeapi.io/swagger/index.html",
        parse(data) {
            return {
                summary: `${data.timeZone || "Asia/Shanghai"} · ${data.currentLocalTime || "local time"}`,
                facts: [
                    ["时区", data.timeZone || "--"],
                    ["偏移", data.currentUtcOffset?.seconds ? `${data.currentUtcOffset.seconds / 3600}h` : "--"],
                    ["夏令时", data.hasDayLightSaving ? "有" : "无/未知"]
                ]
            };
        }
    },
    {
        id: "usgs-earthquakes",
        title: "USGS Earthquake Feed",
        source: "USGS",
        category: "data",
        icon: "fa-chart-area",
        publicApisCategory: "Environment",
        purpose: "展示 GeoJSON 开放数据读取能力，适合数据可视化项目和 dashboard 经验补充。",
        endpoint: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
        docs: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php",
        parse(data) {
            const features = data.features || [];
            const first = features[0]?.properties || {};
            return {
                summary: `最近 24 小时地震事件 ${features.length} 条`,
                facts: [
                    ["地点", trimText(first.place, 74) || "--"],
                    ["震级", first.mag ?? "--"],
                    ["更新时间", first.time ? formatDate(first.time) : "--"]
                ]
            };
        }
    },
    {
        id: "art-institute",
        title: "Art Institute of Chicago API",
        source: "AIC",
        category: "design",
        icon: "fa-palette",
        publicApisCategory: "Art & Design",
        purpose: "为设计参考页或首页视觉模块提供可授权艺术作品元数据。",
        endpoint: "https://api.artic.edu/api/v1/artworks/search?q=computer&limit=3&fields=id,title,artist_title,image_id",
        docs: "https://api.artic.edu/docs/",
        parse(data) {
            const first = data.data?.[0] || {};
            return {
                summary: `艺术检索返回 ${data.pagination?.total || data.data?.length || 0} 条`,
                facts: [
                    ["作品", first.title || "--"],
                    ["作者", first.artist_title || "--"],
                    ["图像", first.image_id ? "可生成 IIIF 图片" : "--"]
                ]
            };
        }
    },
    {
        id: "color-api",
        title: "The Color API",
        source: "The Color API",
        category: "design",
        icon: "fa-eye-dropper",
        publicApisCategory: "Art & Design",
        purpose: "分析站点品牌色，帮助作品集视觉系统说明更专业。",
        endpoint: "https://www.thecolorapi.com/id?hex=116149",
        docs: "https://www.thecolorapi.com/docs",
        parse(data) {
            return {
                summary: `${data.name?.value || "Brand color"} · ${data.hex?.value || "#116149"}`,
                facts: [
                    ["RGB", data.rgb?.value || "--"],
                    ["HSL", data.hsl?.value || "--"],
                    ["色值", data.hex?.value || "--"]
                ]
            };
        }
    },
    {
        id: "xcolors",
        title: "xColors API",
        source: "xColors",
        category: "design",
        icon: "fa-swatchbook",
        publicApisCategory: "Art & Design",
        purpose: "生成随机色彩，适合做博客题图、项目标签和设计系统探索。",
        endpoint: "https://x-colors.yurace.pro/api/random",
        docs: "https://github.com/cheatsnake/xColors-api",
        parse(data) {
            return {
                summary: `随机色彩 ${data.hex || "--"}`,
                facts: [
                    ["HEX", data.hex || "--"],
                    ["RGB", data.rgb || "--"],
                    ["HSL", data.hsl || "--"]
                ]
            };
        }
    },
    {
        id: "emojihub",
        title: "EmojiHub API",
        source: "EmojiHub",
        category: "design",
        icon: "fa-icons",
        publicApisCategory: "Art & Design",
        purpose: "生成轻量符号素材，可用于标签、空状态和交互反馈的视觉探索。",
        endpoint: "https://emojihub.yurace.pro/api/random",
        docs: "https://github.com/cheatsnake/emojihub",
        parse(data) {
            return {
                summary: `${data.name || "emoji"} · ${data.category || "category"}`,
                facts: [
                    ["分组", data.group || "--"],
                    ["Unicode", data.unicode?.join(", ") || "--"],
                    ["HTML", data.htmlCode?.join(" ") || "--"]
                ]
            };
        }
    },
    {
        id: "nasa-images",
        title: "NASA Image and Video Library",
        source: "NASA Images",
        category: "design",
        icon: "fa-image",
        publicApisCategory: "Photography",
        purpose: "检索公开科技图像素材，可用于科研视觉、Hero 背景和设计参考。",
        endpoint: "https://images-api.nasa.gov/search?q=computer&media_type=image",
        docs: "https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf",
        parse(data) {
            const items = data.collection?.items || [];
            const first = items[0]?.data?.[0] || {};
            return {
                summary: `NASA 图片检索 ${items.length} 条：${first.title || "science image"}`,
                facts: [
                    ["中心", first.center || "--"],
                    ["日期", formatDate(first.date_created)],
                    ["素材", items[0]?.links?.[0]?.href ? "有预览图" : "--"]
                ]
            };
        }
    },
    {
        id: "dummyjson-posts",
        title: "DummyJSON Posts API",
        source: "DummyJSON",
        category: "utility",
        icon: "fa-vial",
        publicApisCategory: "Development",
        purpose: "提供结构化假数据，适合演示列表、搜索、分页和前端容错。",
        endpoint: "https://dummyjson.com/posts?limit=3",
        docs: "https://dummyjson.com/docs/posts",
        parse(data) {
            const posts = data.posts || [];
            const first = posts[0] || {};
            return {
                summary: `假数据文章 ${data.total || posts.length || 0} 条：${first.title || "post"}`,
                facts: [
                    ["返回条数", posts.length],
                    ["标签", first.tags?.slice(0, 3).join(", ") || "--"],
                    ["反应", first.reactions?.likes ?? first.reactions ?? "--"]
                ]
            };
        }
    },
    {
        id: "randomuser",
        title: "RandomUser API",
        source: "RandomUser",
        category: "utility",
        icon: "fa-users",
        publicApisCategory: "Test Data",
        purpose: "生成原型用户数据，适合演示简历工具、留言板、成员列表和 dashboard 卡片。",
        endpoint: "https://randomuser.me/api/?results=3",
        docs: "https://randomuser.me/documentation",
        parse(data) {
            const users = data.results || [];
            const user = users[0] || {};
            return {
                summary: `生成 ${users.length} 个测试用户：${[user.name?.first, user.name?.last].filter(Boolean).join(" ") || "Random User"}`,
                facts: [
                    ["国家", user.location?.country || "--"],
                    ["邮箱", user.email || "--"],
                    ["头像", user.picture?.thumbnail ? "可用" : "--"]
                ]
            };
        }
    },
    {
        id: "fakerapi-persons",
        title: "FakerAPI Persons",
        source: "FakerAPI",
        category: "utility",
        icon: "fa-address-card",
        publicApisCategory: "Test Data",
        purpose: "生成结构化人物假数据，用于工具页、表格页和原型交互演示。",
        endpoint: "https://fakerapi.it/api/v1/persons?_quantity=3",
        docs: "https://fakerapi.it/en",
        parse(data) {
            const persons = data.data || [];
            const person = persons[0] || {};
            return {
                summary: `FakerAPI 返回 ${persons.length} 条人物数据`,
                facts: [
                    ["姓名", `${person.firstname || ""} ${person.lastname || ""}`.trim() || "--"],
                    ["城市", person.address?.city || "--"],
                    ["邮箱", person.email || "--"]
                ]
            };
        }
    },
    {
        id: "fakestore",
        title: "FakeStore API",
        source: "FakeStore",
        category: "utility",
        icon: "fa-bag-shopping",
        publicApisCategory: "Test Data",
        purpose: "提供商品假数据，适合展示列表、筛选、评分和电商原型组件能力。",
        endpoint: "https://fakestoreapi.com/products?limit=3",
        docs: "https://fakestoreapi.com/docs",
        parse(data) {
            const products = Array.isArray(data) ? data : [];
            const product = products[0] || {};
            return {
                summary: `商品假数据 ${products.length} 条：${trimText(product.title, 74) || "Product"}`,
                facts: [
                    ["类别", product.category || "--"],
                    ["价格", product.price ? `$${product.price}` : "--"],
                    ["评分", product.rating?.rate ?? "--"]
                ]
            };
        }
    },
    {
        id: "github-search-portfolio",
        title: "GitHub Repository Search API",
        source: "GitHub Search",
        category: "portfolio",
        icon: "fa-magnifying-glass-chart",
        publicApisCategory: "Development",
        purpose: "Search JavaScript portfolio repositories to benchmark project presentation, naming and technology keywords.",
        endpoint: "https://api.github.com/search/repositories?q=portfolio%20language:javascript&per_page=3",
        docs: "https://docs.github.com/en/rest/search/search#search-repositories",
        parse(data) {
            const items = data.items || [];
            const first = items[0] || {};
            return {
                summary: `GitHub found ${data.total_count || items.length || 0} JavaScript portfolio repositories`,
                facts: [
                    ["Repository", first.full_name || "--"],
                    ["Stars", first.stargazers_count ?? "--"],
                    ["Language", first.language || "JavaScript"]
                ]
            };
        }
    },
    {
        id: "arxiv-random-forest",
        title: "arXiv Search API",
        source: "arXiv",
        category: "research",
        icon: "fa-scroll",
        publicApisCategory: "Science & Math",
        purpose: "Search random forest preprints for research trend tracking and citation discovery.",
        endpoint: "https://export.arxiv.org/api/query?search_query=all:random%20forest&start=0&max_results=3",
        docs: "https://info.arxiv.org/help/api/index.html",
        parse(data) {
            const text = typeof data === "string" ? data : "";
            const total = (text.match(/<entry>/g) || []).length;
            const title = (text.match(/<entry>[\s\S]*?<title>([\s\S]*?)<\/title>/) || [])[1];
            const published = (text.match(/<entry>[\s\S]*?<published>(.*?)<\/published>/) || [])[1];
            return {
                summary: `arXiv returned ${total} random forest preprints`,
                facts: [
                    ["Title", trimText((title || "").replace(/\s+/g, " "), 74) || "--"],
                    ["Published", formatDate(published)],
                    ["Use", "Research trends"]
                ]
            };
        }
    },
    {
        id: "world-bank-education",
        title: "World Bank Education Indicator",
        source: "World Bank",
        category: "data",
        icon: "fa-earth-asia",
        publicApisCategory: "Open Data",
        purpose: "Read education investment indicators for application planning, international context and research background.",
        endpoint: "https://api.worldbank.org/v2/country/CN/indicator/SE.XPD.TOTL.GD.ZS?format=json&per_page=3",
        docs: "https://datahelpdesk.worldbank.org/knowledgebase/topics/125589-developer-information",
        parse(data) {
            const rows = Array.isArray(data?.[1]) ? data[1] : [];
            const first = rows.find((row) => row.value !== null) || rows[0] || {};
            return {
                summary: `World Bank education indicator returned ${data?.[0]?.total || rows.length || 0} records`,
                facts: [
                    ["Country", first.country?.value || "China"],
                    ["Year", first.date || "--"],
                    ["Value", first.value === null || first.value === undefined ? "--" : Number(first.value).toFixed(2)]
                ]
            };
        }
    },
    {
        id: "open-trivia-cs",
        title: "Open Trivia Computer Science API",
        source: "Open Trivia DB",
        category: "utility",
        icon: "fa-circle-question",
        publicApisCategory: "Games & Comics",
        purpose: "Generate computer science quiz questions for interview drills, blog interaction and learning widgets.",
        endpoint: "https://opentdb.com/api.php?amount=3&category=18&type=multiple",
        docs: "https://opentdb.com/api_config.php",
        parse(data) {
            const questions = data.results || [];
            const first = questions[0] || {};
            return {
                summary: `Open Trivia returned ${questions.length} computer science questions`,
                facts: [
                    ["Difficulty", first.difficulty || "--"],
                    ["Question", trimText(first.question, 80) || "--"],
                    ["Answer", trimText(first.correct_answer, 50) || "--"]
                ]
            };
        }
    },
    {
        id: "frankfurter-rates",
        title: "Frankfurter Exchange Rates API",
        source: "Frankfurter",
        category: "data",
        icon: "fa-money-bill-transfer",
        publicApisCategory: "Finance",
        purpose: "Read USD to CNY/EUR exchange rates for conference budgets, application costs and collaboration estimates.",
        endpoint: "https://api.frankfurter.app/latest?from=USD&to=CNY,EUR",
        docs: "https://www.frankfurter.app/docs/",
        parse(data) {
            return {
                summary: `1 ${data.base || "USD"} = ${data.rates?.CNY ?? "--"} CNY / ${data.rates?.EUR ?? "--"} EUR`,
                facts: [
                    ["Date", data.date || "--"],
                    ["CNY", data.rates?.CNY ?? "--"],
                    ["EUR", data.rates?.EUR ?? "--"]
                ]
            };
        }
    },
    {
        id: "ipapi-context",
        title: "ipapi Visitor Context API",
        source: "ipapi",
        category: "utility",
        icon: "fa-location-crosshairs",
        publicApisCategory: "Geocoding",
        purpose: "Read coarse visitor network and geography context for contact pages, dashboards and deployment diagnostics.",
        endpoint: "https://ipapi.co/json/",
        docs: "https://ipapi.co/api/",
        parse(data) {
            return {
                summary: `${data.city || "Unknown city"} · ${data.country_name || data.country || "Unknown country"}`,
                facts: [
                    ["Region", [data.city, data.region].filter(Boolean).join(", ") || "--"],
                    ["Country", data.country_name || data.country || "--"],
                    ["Network", trimText(data.org, 58) || "--"]
                ]
            };
        }
    },
    {
        id: "agify-name",
        title: "Agify Name Statistics API",
        source: "Agify",
        category: "data",
        icon: "fa-chart-simple",
        publicApisCategory: "Data Validation",
        purpose: "Demonstrate lightweight statistical APIs for prototype forms, resume tools and mock profile validation.",
        endpoint: "https://api.agify.io?name=sun",
        docs: "https://agify.io/",
        parse(data) {
            return {
                summary: `Name ${data.name || "sun"} has estimated age ${data.age ?? "--"}`,
                facts: [
                    ["Samples", data.count ?? "--"],
                    ["Age", data.age ?? "--"],
                    ["Use", "Prototype data"]
                ]
            };
        }
    },
    {
        id: "genderize-name",
        title: "Genderize Name Statistics API",
        source: "Genderize",
        category: "data",
        icon: "fa-percent",
        publicApisCategory: "Data Validation",
        purpose: "Demonstrate probability-based API responses for bias discussion, statistical inference and prototype validation.",
        endpoint: "https://api.genderize.io?name=sun",
        docs: "https://genderize.io/",
        parse(data) {
            return {
                summary: `Name ${data.name || "sun"} gender statistic: ${data.gender || "unknown"} ${data.probability ?? "--"}`,
                facts: [
                    ["Samples", data.count ?? "--"],
                    ["Probability", data.probability ?? "--"],
                    ["Note", "Not identity data"]
                ]
            };
        }
    },
    {
        id: "nationalize-name",
        title: "Nationalize Name Statistics API",
        source: "Nationalize",
        category: "data",
        icon: "fa-globe",
        publicApisCategory: "Data Validation",
        purpose: "Return country probabilities for a name, useful for discussing data bias and internationalized prototypes.",
        endpoint: "https://api.nationalize.io?name=sun",
        docs: "https://nationalize.io/",
        parse(data) {
            const countries = data.country || [];
            const first = countries[0] || {};
            return {
                summary: `Name ${data.name || "sun"} returned ${countries.length} country probability samples`,
                facts: [
                    ["Top country", first.country_id || "--"],
                    ["Probability", first.probability ?? "--"],
                    ["Samples", data.count ?? "--"]
                ]
            };
        }
    },
    {
        id: "nager-date-us",
        title: "Nager.Date US Holidays API",
        source: "Nager.Date",
        category: "utility",
        icon: "fa-calendar-check",
        publicApisCategory: "Calendar",
        purpose: "Add US holiday information for application plans, conference timelines and cross-time-zone collaboration.",
        endpoint: "https://date.nager.at/api/v3/PublicHolidays/2026/US",
        docs: "https://date.nager.at/Api",
        parse(data) {
            const first = data[0] || {};
            return {
                summary: `US 2026 public holidays: ${data.length || 0}`,
                facts: [
                    ["First", first.localName || first.name || "--"],
                    ["Date", first.date || "--"],
                    ["Country", first.countryCode || "US"]
                ]
            };
        }
    },
    {
        id: "jsonplaceholder",
        title: "JSONPlaceholder API",
        source: "JSONPlaceholder",
        category: "utility",
        icon: "fa-code",
        publicApisCategory: "Development",
        purpose: "保留一个稳定的开发假数据源，方便演示前端请求、错误处理和卡片渲染。",
        endpoint: "https://jsonplaceholder.typicode.com/posts/1",
        docs: "https://jsonplaceholder.typicode.com/",
        parse(data) {
            return {
                summary: trimText(data.title, 92) || "测试数据返回成功",
                facts: [
                    ["Post ID", data.id || "--"],
                    ["User ID", data.userId || "--"],
                    ["Body", trimText(data.body, 72) || "--"]
                ]
            };
        }
    }
];

const proxyCandidates = [
    {
        title: "NASA APOD / Earth",
        source: "NASA Open APIs",
        category: "design",
        reason: "需要 API Key 或 DEMO_KEY 有限额，适合通过 Netlify Functions 读取环境变量后代理。",
        destination: "首页 Hero 背景、科研视觉素材、设计灵感墙"
    },
    {
        title: "OpenWeatherMap",
        source: "Weather",
        category: "utility",
        reason: "需要个人 Key，不能写进静态前端。",
        destination: "联系页天气组件、活动日程小卡"
    },
    {
        title: "NewsAPI / Guardian / New York Times",
        source: "News",
        category: "writing",
        reason: "多数新闻 API 限制浏览器来源并需要 Key。",
        destination: "技术写作选题雷达、研究动态列表"
    },
    {
        title: "Unsplash / Pexels",
        source: "Photography",
        category: "design",
        reason: "需要 Access Key，且要遵守署名和缓存策略。",
        destination: "项目封面图、博客题图、视觉案例库"
    },
    {
        title: "Google Books / Gutendex",
        source: "Books",
        category: "research",
        reason: "图书搜索接口容易受区域、限流或慢响应影响，适合做缓存后再展示。",
        destination: "阅读清单、学习路径、博客参考书目"
    },
    {
        title: "Open Library / Wikipedia / Hugging Face",
        source: "Knowledge",
        category: "research",
        reason: "公开可用但在不同运行时偶发连接失败，适合后端缓存后作为稳定内容源。",
        destination: "阅读清单、百科摘要、模型生态和博客引用卡片"
    },
    {
        title: "arXiv / PatentsView / GBIF",
        source: "Research Data",
        category: "research",
        reason: "和科研/专利/开放科学相关，但响应较慢或返回格式不稳定，适合服务端定时同步。",
        destination: "论文预印本、专利趋势、开放科学数据集"
    },
    {
        title: "CORE / Elsevier / Scopus",
        source: "Academic",
        category: "research",
        reason: "学术数据库通常需要 Key 或机构权限。",
        destination: "论文页引用、期刊等级、作者画像增强"
    },
    {
        title: "YouTube Data API",
        source: "Video",
        category: "portfolio",
        reason: "需要 Key/OAuth，公开站点不应裸露配额凭证。",
        destination: "公开视频讲解、项目 Demo、课程材料入口"
    },
    {
        title: "LinkedIn / GitHub OAuth",
        source: "Career",
        category: "career",
        reason: "涉及 OAuth、用户身份和隐私数据，必须走后端授权流程。",
        destination: "求职档案同步、公开经历验证、推荐信材料入口"
    },
    {
        title: "Arbeitnow Job Board",
        source: "Jobs",
        category: "career",
        reason: "公开接口对部分环境会返回 403，适合后端代理并做缓存。",
        destination: "欧洲岗位雷达、求职关键词采样和岗位趋势"
    },
    {
        title: "KONTESTS / AI Dev Jobs / GraphQL Jobs",
        source: "Career",
        category: "career",
        reason: "接口响应波动或需要 GraphQL POST，适合后端代理后整理成统一岗位/竞赛雷达。",
        destination: "算法竞赛日历、AI 岗位聚合和求职技能地图"
    },
    {
        title: "World Bank / OECD / 学校排名数据",
        source: "Open Data",
        category: "data",
        reason: "公开数据接口常有慢响应和分页，适合服务端缓存后再给前端展示。",
        destination: "申博国家/学校信息、教育指标和材料准备看板"
    },
    {
        title: "Frankfurter / ExchangeRate API",
        source: "Finance",
        category: "data",
        reason: "汇率接口对网络和上游状态敏感，适合定时缓存，避免打开页面时遇到 5xx。",
        destination: "会议预算、留学费用估算、国际合作材料"
    },
    {
        title: "Papers with Code / Docker Hub 深度同步",
        source: "Development",
        category: "research",
        reason: "Papers with Code 缺少稳定浏览器 CORS，Docker Hub 响应波动较大；都适合 Netlify Functions 缓存代理。",
        destination: "技术栈热度、模型论文与代码仓库追踪"
    },
    {
        title: "Icon Horse / Shields.io / GitHub Readme Stats",
        source: "Open Source",
        category: "design",
        reason: "返回图片或 SVG，更适合作为静态资源或服务端缓存，不进入 JSON 健康检查流。",
        destination: "项目徽章、站点 favicon、GitHub 统计卡片"
    }
];

function apiToClient(api) {
    return {
        id: api.id,
        title: api.title,
        source: api.source,
        category: api.category,
        icon: api.icon,
        publicApisCategory: api.publicApisCategory,
        purpose: api.purpose,
        docs: api.docs,
        featured: Boolean(api.featured)
    };
}

const apiGroups = {
    home: {
        title: "首页实时证据雷达",
        description: "把 GitHub、论文、岗位和写作趋势压缩成首页可扫描的公开数据证据。",
        page: "index.html",
        icon: "fa-satellite-dish",
        ids: ["github-repo", "github-user", "github-commits", "github-search-portfolio", "crossref-paper", "openalex-work", "remotive-jobs", "hacker-news", "npm-registry", "frankfurter-rates"]
    },
    publications: {
        title: "论文学术元数据核验",
        description: "用 Crossref、OpenAlex、Semantic Scholar、DBLP 等公开学术 API 补充论文出处、引用、索引和数据集线索。",
        page: "publications.html",
        icon: "fa-file-circle-check",
        ids: ["crossref-paper", "openalex-work", "semantic-scholar", "dblp", "europe-pmc", "zenodo", "openml-datasets", "arxiv-random-forest", "world-bank-education"]
    },
    projects: {
        title: "工程项目外部信号",
        description: "用 GitHub、npm、PyPI、Stack Overflow 和 CDN API 证明项目不是孤立页面，而是连接真实开发生态。",
        page: "projects.html",
        icon: "fa-code-branch",
        ids: ["github-repo", "github-commits", "github-contents", "github-search-portfolio", "cdnjs", "npm-registry", "pypi-package", "stackexchange", "sampleapis-coding", "open-trivia-cs", "jsonplaceholder"]
    },
    blog: {
        title: "博客写作趋势雷达",
        description: "用 HN、DEV.to、Datamuse、词典、翻译和网页元信息 API 服务选题、术语和引用卡片。",
        page: "blog.html",
        icon: "fa-pen-nib",
        ids: ["hacker-news", "devto-articles", "datamuse", "dictionary", "mymemory-translate", "microlink", "open-trivia-cs"]
    },
    research: {
        title: "研究开放数据窗口",
        description: "把开放科学、航天、地震、NASA 图像和机器学习数据集接入研究方向页，展示跨源数据理解能力。",
        page: "research.html",
        icon: "fa-microscope",
        ids: ["launch-library", "usgs-earthquakes", "nasa-images", "openml-datasets", "zenodo", "europe-pmc", "openalex-work", "arxiv-random-forest", "world-bank-education"]
    },
    profile: {
        title: "职业与协作环境信号",
        description: "把岗位、公司、日程、时间和地理信息 API 接到个人档案页，说明求职申博材料可以接入真实外部上下文。",
        page: "profile.html",
        icon: "fa-user-check",
        ids: ["remotive-jobs", "themuse-jobs", "randomuser", "fakerapi-persons", "nager-date", "nager-date-us", "timeapi", "open-meteo-geocoding", "ipapi-context"]
    },
    materials: {
        title: "材料库设计与演示数据",
        description: "用艺术、色彩、假数据、商品数据和天气 API 给材料库提供封面、标签、原型与环境信息素材。",
        page: "materials.html",
        icon: "fa-box-archive",
        ids: ["art-institute", "color-api", "xcolors", "emojihub", "dummyjson-posts", "fakestore", "open-meteo", "agify-name", "genderize-name", "nationalize-name", "jsonplaceholder"]
    },
    dashboard: {
        title: "作品集运行状态抽样",
        description: "用少量代表性 API 给仪表盘提供实时健康抽样，不让仪表盘承担全量 40 个接口的请求压力。",
        page: "dashboard.html",
        icon: "fa-chart-line",
        ids: ["github-repo", "crossref-paper", "npm-registry", "hacker-news", "open-meteo", "frankfurter-rates", "ipapi-context"]
    }
};

module.exports = {
    categoryLabels,
    categoryDescriptions,
    liveApis,
    proxyCandidates,
    apiGroups,
    apiToClient
};
