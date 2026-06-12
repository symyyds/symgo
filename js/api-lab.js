(function () {
    "use strict";

    const apiGrid = document.querySelector("[data-api-grid]");
    if (!apiGrid) return;

    const statusNodes = {
        total: document.querySelector("[data-api-total]"),
        ok: document.querySelector("[data-api-ok]"),
        failed: document.querySelector("[data-api-failed]"),
        avg: document.querySelector("[data-api-avg]")
    };
    const searchInput = document.querySelector("[data-api-search]");
    const refreshAllButton = document.querySelector("[data-api-refresh-all]");
    const clearButton = document.querySelector("[data-api-clear]");
    const proxyGrid = document.querySelector("[data-api-proxy-grid]");
    const activityLog = document.querySelector("[data-api-log]");

    const cacheKey = "symgo-api-lab-cache-v1";
    const timeoutMs = 9000;
    let currentFilter = "all";
    let currentSearch = "";
    let activeRequests = 0;

    const categoryLabels = {
        portfolio: "作品集",
        research: "研究",
        writing: "写作",
        utility: "工具",
        design: "设计"
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
            id: "open-library",
            title: "Open Library Search API",
            source: "Open Library",
            category: "research",
            icon: "fa-book-open-reader",
            publicApisCategory: "Books",
            purpose: "为学习路径、阅读清单和博客文章自动推荐开放图书条目。",
            endpoint: "https://openlibrary.org/search.json?q=machine%20learning&limit=3",
            docs: "https://openlibrary.org/developers/api",
            parse(data) {
                const first = data.docs?.[0] || {};
                return {
                    summary: `检索到 ${data.numFound || 0} 本相关图书`,
                    facts: [
                        ["首条书名", first.title || "--"],
                        ["作者", first.author_name?.slice(0, 2).join(", ") || "--"],
                        ["首版年份", first.first_publish_year || "--"]
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
            id: "wikipedia",
            title: "Wikipedia REST API",
            source: "Wikimedia",
            category: "writing",
            icon: "fa-globe",
            publicApisCategory: "Knowledge",
            purpose: "为博客主题和论文关键词提供百科摘要，辅助写作和术语解释。",
            endpoint: "https://en.wikipedia.org/api/rest_v1/page/summary/Random_forest",
            docs: "https://www.mediawiki.org/wiki/API",
            featured: true,
            parse(data) {
                return {
                    summary: data.title ? `${data.title}: ${trimText(data.extract, 118)}` : "Wikipedia 摘要",
                    facts: [
                        ["语言", data.lang || "en"],
                        ["类型", data.type || "--"],
                        ["页面", data.content_urls?.desktop?.page ? "可访问" : "--"]
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
        }
    ];

    let apiResults = loadCache();

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

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

    function formatClock(value) {
        if (!value) return "--";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "--";
        return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    }

    function loadCache() {
        try {
            const raw = localStorage.getItem(cacheKey);
            if (!raw) return {};
            const parsed = JSON.parse(raw);
            const oneHour = 60 * 60 * 1000;
            return Object.fromEntries(Object.entries(parsed).filter(([, result]) => {
                return Date.now() - new Date(result.checkedAt || 0).getTime() < oneHour;
            }));
        } catch (error) {
            return {};
        }
    }

    function saveCache() {
        try {
            localStorage.setItem(cacheKey, JSON.stringify(apiResults));
        } catch (error) {
            // Cache is a convenience only; private browsing or storage limits should not break the page.
        }
    }

    function getVisibleApis() {
        const search = currentSearch.trim().toLowerCase();
        return liveApis.filter((api) => {
            const categoryMatch = currentFilter === "all" || api.category === currentFilter;
            const searchable = `${api.title} ${api.source} ${api.purpose} ${api.publicApisCategory}`.toLowerCase();
            return categoryMatch && (!search || searchable.includes(search));
        });
    }

    function resultClass(result) {
        if (!result) return "idle";
        return result.status || "idle";
    }

    function resultLabel(result) {
        if (!result) return "待测试";
        if (result.status === "loading") return "测试中";
        if (result.status === "ok") return "可用";
        if (result.status === "failed") return "失败";
        return "待测试";
    }

    function renderFacts(facts) {
        if (!Array.isArray(facts) || !facts.length) {
            return '<div class="api-facts"><span>等待刷新后展示结构化结果。</span></div>';
        }
        return `
            <div class="api-facts">
                ${facts.map(([label, value]) => `
                    <span><strong>${escapeHtml(label)}</strong>${escapeHtml(value)}</span>
                `).join("")}
            </div>
        `;
    }

    function renderCards() {
        const visibleApis = getVisibleApis();
        apiGrid.innerHTML = visibleApis.map((api) => {
            const result = apiResults[api.id];
            const status = resultClass(result);
            const latency = result?.latency ? `${Math.round(result.latency)} ms` : "--";
            const checked = result?.checkedAt ? formatClock(result.checkedAt) : "尚未测试";
            const summary = result?.summary || "点击刷新后，会显示这个公开 API 的实时返回摘要。";
            return `
                <article class="api-card premium-surface" data-api-card="${escapeHtml(api.id)}">
                    <div class="api-card-top">
                        <span class="api-icon"><i class="fas ${escapeHtml(api.icon)}"></i></span>
                        <span class="api-status ${status}">${resultLabel(result)}</span>
                    </div>
                    <div class="api-card-body">
                        <div class="api-meta-line">
                            <span>${escapeHtml(categoryLabels[api.category] || api.category)}</span>
                            <span>${escapeHtml(api.publicApisCategory)}</span>
                        </div>
                        <h3>${escapeHtml(api.title)}</h3>
                        <p>${escapeHtml(api.purpose)}</p>
                    </div>
                    <div class="api-result ${status}">
                        <div class="api-result-head">
                            <strong>${escapeHtml(api.source)}</strong>
                            <span>${latency}</span>
                        </div>
                        <p>${escapeHtml(summary)}</p>
                        ${renderFacts(result?.facts)}
                        ${result?.error ? `<div class="api-error">${escapeHtml(result.error)}</div>` : ""}
                    </div>
                    <div class="api-foot">
                        <span>上次检查：${escapeHtml(checked)}</span>
                        <div>
                            <button type="button" class="api-mini-button" data-api-refresh="${escapeHtml(api.id)}" aria-label="刷新 ${escapeHtml(api.title)}">
                                <i class="fas fa-rotate"></i>
                            </button>
                            <a class="api-mini-button" href="${escapeHtml(api.docs)}" target="_blank" rel="noopener noreferrer" aria-label="查看 ${escapeHtml(api.title)} 文档">
                                <i class="fas fa-arrow-up-right-from-square"></i>
                            </a>
                        </div>
                    </div>
                </article>
            `;
        }).join("") || '<div class="empty-state api-empty">没有匹配的 API。换一个关键词或分类试试。</div>';

        updateSummary();
    }

    function renderProxyCandidates() {
        if (!proxyGrid) return;
        proxyGrid.innerHTML = proxyCandidates.map((item) => `
            <article class="proxy-api-card">
                <div>
                    <span class="proxy-tag">${escapeHtml(categoryLabels[item.category] || item.category)}</span>
                    <h3>${escapeHtml(item.title)}</h3>
                    <p>${escapeHtml(item.reason)}</p>
                </div>
                <div class="proxy-api-foot">
                    <span>${escapeHtml(item.source)}</span>
                    <strong>${escapeHtml(item.destination)}</strong>
                </div>
            </article>
        `).join("");
    }

    function updateSummary() {
        const total = liveApis.length;
        const results = liveApis.map((api) => apiResults[api.id]).filter(Boolean);
        const ok = results.filter((result) => result.status === "ok").length;
        const failed = results.filter((result) => result.status === "failed").length;
        const latencies = results.filter((result) => result.status === "ok" && Number.isFinite(result.latency)).map((result) => result.latency);
        const avg = latencies.length ? `${Math.round(latencies.reduce((sum, value) => sum + value, 0) / latencies.length)} ms` : "--";

        if (statusNodes.total) statusNodes.total.textContent = total;
        if (statusNodes.ok) statusNodes.ok.textContent = ok;
        if (statusNodes.failed) statusNodes.failed.textContent = failed;
        if (statusNodes.avg) statusNodes.avg.textContent = avg;
    }

    function addLog(message, tone = "info") {
        if (!activityLog) return;
        const time = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        const entry = document.createElement("li");
        entry.className = tone;
        entry.innerHTML = `<span>${time}</span><strong>${escapeHtml(message)}</strong>`;
        activityLog.prepend(entry);
        while (activityLog.children.length > 6) activityLog.lastElementChild.remove();
    }

    async function fetchWithTimeout(url) {
        const controller = new AbortController();
        const timer = window.setTimeout(() => controller.abort(), timeoutMs);
        try {
            const response = await fetch(url, {
                mode: "cors",
                signal: controller.signal,
                headers: { Accept: "application/json" }
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        } finally {
            window.clearTimeout(timer);
        }
    }

    async function refreshApi(apiId, silent = false) {
        const api = liveApis.find((item) => item.id === apiId);
        if (!api) return;

        activeRequests += 1;
        apiResults[api.id] = {
            status: "loading",
            checkedAt: new Date().toISOString()
        };
        renderCards();

        const started = performance.now();
        try {
            const data = await fetchWithTimeout(api.endpoint);
            const parsed = api.parse(data);
            const latency = performance.now() - started;
            apiResults[api.id] = {
                status: "ok",
                latency,
                summary: parsed.summary,
                facts: parsed.facts,
                checkedAt: new Date().toISOString()
            };
            if (!silent) addLog(`${api.title} 可用，耗时 ${Math.round(latency)} ms`, "ok");
        } catch (error) {
            const reason = error.name === "AbortError" ? "请求超时" : error.message || "请求失败";
            apiResults[api.id] = {
                status: "failed",
                latency: performance.now() - started,
                summary: "这个 API 当前没有返回可用结果，页面已保留降级说明。",
                error: reason,
                checkedAt: new Date().toISOString()
            };
            if (!silent) addLog(`${api.title} 失败：${reason}`, "failed");
        } finally {
            activeRequests = Math.max(0, activeRequests - 1);
            saveCache();
            renderCards();
            updateRefreshState();
        }
    }

    function updateRefreshState() {
        if (!refreshAllButton) return;
        const busy = activeRequests > 0;
        refreshAllButton.disabled = busy;
        refreshAllButton.innerHTML = busy
            ? '<i class="fas fa-spinner fa-spin"></i> 测试中'
            : '<i class="fas fa-rotate"></i> 刷新全部';
    }

    async function refreshAll() {
        const queue = [...liveApis];
        const workers = Array.from({ length: 4 }, async () => {
            while (queue.length) {
                const api = queue.shift();
                await refreshApi(api.id, true);
            }
        });
        addLog(`开始测试 ${liveApis.length} 个 public-apis 相关接口`, "info");
        await Promise.all(workers);
        const okCount = Object.values(apiResults).filter((result) => result.status === "ok").length;
        addLog(`测试完成：${okCount}/${liveApis.length} 个 API 当前可用`, okCount ? "ok" : "failed");
    }

    function bindEvents() {
        document.querySelectorAll("[data-api-filter]").forEach((button) => {
            button.addEventListener("click", () => {
                currentFilter = button.dataset.apiFilter || "all";
                document.querySelectorAll("[data-api-filter]").forEach((tab) => {
                    tab.classList.toggle("active", tab === button);
                });
                renderCards();
            });
        });

        if (searchInput) {
            searchInput.addEventListener("input", () => {
                currentSearch = searchInput.value || "";
                renderCards();
            });
        }

        apiGrid.addEventListener("click", (event) => {
            const button = event.target.closest("[data-api-refresh]");
            if (!button) return;
            refreshApi(button.dataset.apiRefresh);
        });

        if (refreshAllButton) {
            refreshAllButton.addEventListener("click", refreshAll);
        }

        if (clearButton) {
            clearButton.addEventListener("click", () => {
                apiResults = {};
                localStorage.removeItem(cacheKey);
                renderCards();
                addLog("已清空本地缓存结果", "info");
            });
        }
    }

    function autoRefreshFeaturedApis() {
        const hasFreshCache = liveApis.some((api) => apiResults[api.id]?.status === "ok");
        if (hasFreshCache) return;
        const featured = liveApis.filter((api) => api.featured).slice(0, 4);
        window.setTimeout(() => {
            featured.forEach((api) => refreshApi(api.id, true));
            addLog("已自动抽样测试首屏关键 API", "info");
        }, 650);
    }

    bindEvents();
    renderProxyCandidates();
    renderCards();
    updateSummary();
    autoRefreshFeaturedApis();
})();
