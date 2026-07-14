(function () {
    const publications = [
        {
            year: "2024",
            type: "proceedings",
            status: "verified",
            levelGroup: "published",
            level: "Proceedings / Applied and Computational Engineering",
            title: "Weight class prediction based on sparrow search algorithm optimised random forest model",
            authors: "Yuanming Sun",
            venue: "Applied and Computational Engineering, Vol. 69, pp. 109-115, 2024",
            role: "作者",
            topic: "Machine Learning",
            abstract: "基于麻雀搜索算法优化随机森林模型，用于体重类别预测；围绕年龄、身高、体重和 BMI 等特征完成相关性分析，并对传统随机森林与优化模型的预测效果进行比较。",
            pdf: "files/papers/sun-2024-sparrow-random-forest-weight-class.pdf",
            cover: "images/publications/sun-2024-sparrow-random-forest-weight-class.png",
            code: "https://www.ewadirect.com/proceedings/ace/article/view/14846",
            doi: "10.54254/2755-2721/69/20241624",
            tags: ["Random Forest", "Sparrow Search Algorithm", "BMI", "Classification"]
        },
        {
            year: "待补充",
            type: "placeholder",
            status: "placeholder",
            levelGroup: "pending",
            level: "待补充 / 非正式成果",
            title: "研究生阶段论文槽位 A（待补充）",
            authors: "待补充",
            venue: "尚无可核验发表信息",
            role: "待补充",
            topic: "研究方向待补充",
            abstract: "此位置仅保留未来论文的页面结构。获得真实题目、作者、投稿状态、平台和 PDF 后再更新，不作为当前论文成果统计。",
            pdf: "files/papers/placeholder-profile-mining.pdf",
            cover: "images/publications/placeholder-profile-mining.png",
            code: "engineering-projects.html#academic-ai",
            tags: ["题目待补充", "作者待补充", "平台待补充"]
        },
        {
            year: "待补充",
            type: "placeholder",
            status: "placeholder",
            levelGroup: "pending",
            level: "待补充 / 非正式成果",
            title: "研究生阶段论文槽位 B（待补充）",
            authors: "待补充",
            venue: "尚无可核验发表信息",
            role: "待补充",
            topic: "研究方向待补充",
            abstract: "此位置用于未来会议论文或研究手稿。当前没有真实题目、合作者、会议和等级信息，因此明确标记为待补充。",
            pdf: "files/papers/placeholder-toolkit.pdf",
            cover: "images/publications/placeholder-toolkit.png",
            code: "engineering-projects.html#interview-toolkit",
            tags: ["题目待补充", "作者待补充", "平台待补充"]
        },
        {
            year: "待补充",
            type: "placeholder",
            status: "placeholder",
            levelGroup: "pending",
            level: "待补充 / 非正式成果",
            title: "研究生阶段论文槽位 C（待补充）",
            authors: "待补充",
            venue: "尚无可核验发表信息",
            role: "待补充",
            topic: "研究方向待补充",
            abstract: "此位置用于未来期刊论文、预印本或研究说明。页面会保留 DOI、外部文章和 PDF 字段，但不会伪装成已发表论文。",
            pdf: "files/papers/placeholder-portfolio.pdf",
            cover: "images/publications/placeholder-portfolio.png",
            code: "index.html",
            tags: ["题目待补充", "作者待补充", "平台待补充"]
        }
    ];

    const projects = [
        {
            id: "symgo-portfolio",
            category: "engineering",
            categoryLabel: "工程项目",
            status: "已上线",
            year: "2025 - 2026",
            name: "Symgo 个人博客与学术展示站",
            role: "独立开发 / 内容维护",
            cover: "images/engineering-projects/symgo-portfolio-screenshot.png",
            stack: ["HTML", "CSS", "JavaScript", "Netlify"],
            summary: "将原有博客升级为求职与申博可用的个人展示站，集中呈现论文、项目、博客、工具和可下载材料。",
            work: [
                "重构首页信息架构，让访问者在首屏看到研究方向、工程能力和联系方式。",
                "新增论文发表页面，支持按年份、类型和关键词检索，并提供 PDF 占位下载入口。",
                "新增项目展示页面，把简历里放不下的项目背景、职责、产出和复盘展开。",
                "整理博客、工具箱、留言板、AI助手的导航状态，减少坏链接和重复 active 样式。"
            ],
            outcomes: [
                "适配 Netlify 静态部署，无需后端即可访问核心内容。",
                "为后续替换真实论文、项目链接、CV 和数据集预留结构化位置。"
            ],
            links: [
                { label: "站点首页", href: "index.html" },
                { label: "GitHub", href: "https://github.com/symyyds/symgo" }
            ]
        },
        {
            id: "interview-toolkit",
            category: "engineering",
            categoryLabel: "工程项目",
            status: "持续维护",
            year: "2025",
            name: "升学复试与保研资料工具包",
            role: "资料整理 / 经验沉淀 / 页面开发",
            cover: "images/engineering-projects/interview-toolkit-screenshot.png",
            stack: ["Content Design", "PDF/Docx", "HTML"],
            summary: "围绕保研推免、考研复试和导师联系，整理流程、术语、时间轴、材料清单和视频讲解，帮助低年级同学快速建立准备框架。",
            work: [
                "设计保研信息页，汇总官方入口、信息平台、常见术语和关键时间节点。",
                "维护复试技巧文章，补充简历打印、套磁邮件、面试表达和资料下载。",
                "将文档、压缩包、视频讲解与文章内容关联，形成可复用的资料入口。"
            ],
            outcomes: [
                "降低重复答疑成本，把口头经验沉淀为可分享页面。",
                "体现内容组织、用户视角和静态站资源管理能力。"
            ],
            links: [
                { label: "保研经验贴", href: "blog/baoyan.html" },
                { label: "复试技巧", href: "blog/25_skills.html" }
            ]
        },
        {
            id: "academic-ai",
            category: "engineering",
            categoryLabel: "工程项目",
            status: "安全代理原型",
            year: "2025 - 2026",
            name: "Netlify 安全代理学术助手",
            role: "前端功能 / Function 安全边界",
            cover: "images/engineering-projects/academic-ai-assistant-screenshot.png",
            stack: ["JavaScript", "Netlify Functions", "LocalStorage", "PDF.js", "Mammoth.js"],
            summary: "实现支持多轮上下文、本地会话与 TXT/Markdown/PDF/DOCX 文本提取的学术助手；模型密钥只从 Netlify 环境变量读取。",
            work: [
                "用 localStorage 仅保存多会话消息与标题，不保存 API Key、Token 或服务端配置。",
                "在浏览器侧提取 TXT、Markdown、PDF 和 DOCX 的可读文本，并限制文件大小、页数与上下文长度。",
                "通过 Netlify Function 调用上游模型，加入请求大小限制、每 IP 限流、超时和结构化错误。"
            ],
            outcomes: [
                "前端不再出现密钥输入框，也不会把模型密钥写入 HTML、JavaScript 或 localStorage。",
                "未配置 DEEPSEEK_API_KEY 时会如实显示服务端配置错误，不伪装成功或回退到浏览器直连。"
            ],
            links: [
                { label: "打开助手", href: "ai.html" }
            ]
        },
        {
            id: "resume-builder",
            category: "engineering",
            categoryLabel: "工程项目",
            status: "工具原型",
            year: "2025",
            name: "在线简历制作工具",
            role: "页面设计 / 交互开发",
            cover: "images/engineering-projects/resume-builder-screenshot.png",
            stack: ["HTML", "CSS", "JavaScript"],
            summary: "面向学生求职和升学申请的简历编辑工具，提供结构化输入、模板预览和内容生成入口。",
            work: [
                "设计教育经历、项目经历、技能、奖项等模块，帮助用户把材料按简历结构录入。",
                "提供模板化内容示例，降低从空白页开始写简历的阻力。",
                "与个人网站的项目展示页形成互补：简历放摘要，网站放细节。"
            ],
            outcomes: [
                "展示前端表单、状态组织和面向真实场景的工具设计能力。",
                "可继续扩展为 PDF 导出、ATS 检查、岗位匹配等功能。"
            ],
            links: [
                { label: "简历制作", href: "tools/resume_builder.html" }
            ]
        },
        {
            id: "public-api-lab",
            category: "engineering",
            categoryLabel: "工程项目",
            status: "实时接入",
            year: "2026",
            name: "Public API 实验室",
            role: "API 选型 / 后端代理 / 页面植入",
            cover: "images/engineering-projects/public-api-lab-screenshot.png",
            stack: ["public-apis", "Netlify Functions", "Serverless Proxy", "Static UI"],
            summary: "参考 public-apis/public-apis，把适合个人博客、论文展示、项目证据、求职申博和写作辅助的免费公开 API 接入成可实时测试、可跨页面复用的后端代理控制台。",
            work: [
                "筛选 50 个和个人站相关的公开 API，覆盖 GitHub、Crossref、OpenAlex、arXiv、岗位、开发生态、AI 数据集、词典、新闻、天气、汇率、教育开放数据、题库、假数据和设计素材等场景。",
                "把 endpoint、解析器和请求头放到 Netlify Functions 后端白名单，前端页面只传 API id 或页面 group，不暴露任意外部 URL。",
                "实现并发健康检查、请求超时、结果缓存、失败降级、分类筛选和关键词搜索，并把页面分组结果植入首页、论文、项目、博客、研究、档案、材料和仪表盘。"
            ],
            outcomes: [
                "把个人站从静态展示升级为可验证的 API 集成作品。",
                "展示对第三方接口治理、密钥保护、Serverless 后端和前端容错的理解。"
            ],
            links: [
                { label: "API 实验室", href: "tools/api_lab.html" },
                { label: "public-apis", href: "https://github.com/public-apis/public-apis" }
            ]
        },
        {
            id: "industry-knowledge-base",
            category: "horizontal",
            categoryLabel: "横向项目",
            status: "待补充 / 非正式项目",
            year: "待补充",
            name: "横向合作方案槽位 A（待补充）",
            role: "待补充",
            stack: ["Requirement Analysis", "RAG", "Prototype", "Static Demo"],
            summary: "此卡仅保留未来横向合作项目所需的展示结构；当前没有可核验的合作单位、项目周期或交付材料，不计入真实项目统计。",
            work: [
                "待补充项目背景、需要解决的问题与公开边界。",
                "待补充本人职责、技术路线、关键工作与阶段时间线。",
                "待补充真实截图、架构图、交付文档与验收依据。"
            ],
            outcomes: [
                "当前无可核验成果，不展示虚构指标。",
                "获得真实材料后再替换本槽位。"
            ],
            links: [
                { label: "方案占位", href: "horizontal-projects.html#industry-knowledge-base" }
            ]
        },
        {
            id: "lab-data-dashboard",
            category: "horizontal",
            categoryLabel: "横向项目",
            status: "待补充 / 非正式项目",
            year: "待补充",
            name: "横向项目展示槽位 B（待补充）",
            role: "待补充",
            stack: ["Dashboard", "Data Visualization", "HTML", "JavaScript"],
            summary: "此卡用于预留未来实验室或合作项目的展示位置；当前没有公开可核验的系统、单位或验收信息，不计入真实项目统计。",
            work: [
                "待补充业务背景、数据来源与本人承担的具体工作。",
                "待补充系统架构、流程图、真实界面与验证方法。",
                "涉及合作单位时须先完成脱敏和公开授权核验。"
            ],
            outcomes: [
                "当前无可核验成果，不展示虚构用户数、指标或验收结论。",
                "获得真实项目材料后再替换本槽位。"
            ],
            links: [
                { label: "展示占位", href: "horizontal-projects.html#lab-data-dashboard" }
            ]
        },
        {
            id: "iot-flexible-access-trusted-control",
            category: "horizontal",
            categoryLabel: "横向项目",
            status: "示范应用 / 验收材料",
            year: "2024 - 2025",
            name: "面向物联体系的柔性配置接入与可信认证管控关键技术研究及应用",
            role: "项目组成员 / 方案整理 / 边缘物联接入与可信管控材料支持",
            cover: "images/horizontal-projects/iot-access-screenshot.png",
            stack: ["电力物联网", "EdgeX Foundry", "Docker", "OpenHarmony", "openEuler", "MQTT", "Modbus", "SM2", "CNN-LSTM", "边缘计算"],
            summary: "面向电力物联网终端多厂家、多协议、现场配置复杂和安全认证链条不完整的问题，参与整理端边协同柔性接入、自动注册、可信认证与边缘管控方案，并支撑示范应用、测试验收和成果材料沉淀。",
            work: [
                "梳理电力物联终端接入场景中的设备异构、协议不统一、点表配置依赖人工和安全认证不足等关键问题，将项目材料组织为背景、方案、测试、应用和成果证据链。",
                "围绕 OpenHarmony 端侧设备、openEuler 边缘节点、Docker 容器化和 EdgeX Foundry 框架，整理端边协同运行环境、MQTT/Modbus 自动注册和 Device Profile 统一建模流程。",
                "参与可信管控方案材料整理，覆盖设备身份表示、SM2 签名验签、加密传输、nonce 防重放、安全接入 SDK、证书链路和平台数据上报等环节。",
                "将智能开关、烟感传感器、边缘代理设备和物联管理平台联调过程沉淀为可展示的测试与应用说明，支撑项目汇报、测试报告、应用证明和验收材料。"
            ],
            outcomes: [
                "形成边缘物联设备接入管理软件 V1.0 相关展示材料，并完成第三方测试报告、应用证明、查新报告、工作报告和技术报告的证据整理。",
                "在配电站房环境监测、供电所微电网设备接入等场景完成示范应用说明，覆盖数据采集、边缘处理、平台上报和命令交互链路。",
                "沉淀专利受理、论文录用、软著、测试验收和项目执行材料，可用于求职/申博时说明横向项目中的需求理解、技术归纳、协作交付和验收意识。"
            ],
            links: [
                { label: "项目页锚点", href: "horizontal-projects.html#iot-flexible-access-trusted-control" },
                { label: "横向项目证据", href: "evidence/horizontal-projects/iot-flexible-access-trusted-control.html" },
                { label: "证据看板", href: "evidence/horizontal-projects/iot-flexible-access-trusted-control.html#evidence-dashboard" },
                { label: "成果矩阵", href: "evidence/horizontal-projects/iot-flexible-access-trusted-control.html#artifact-list" },
                { label: "文档索引", href: "evidence/horizontal-projects/iot-flexible-access-trusted-control.html#document-atlas" }
            ]
        },
        {
            id: "ningxia-multi-energy-architecture",
            category: "horizontal",
            categoryLabel: "横向项目",
            status: "验收完成 / 科技项目",
            year: "2022 - 2024",
            name: "基于分布式多能互补的新型城镇综合能源系统信息与物理架构研究",
            role: "项目材料整理 / 技术路线归纳 / 验收展示支撑",
            cover: "images/horizontal-projects/energy-architecture-screenshot.png",
            stack: ["综合能源系统", "源网荷储", "CNN-Bi-LSTM", "Attention LSTM", "PSO", "多目标遗传算法", "多能流耦合", "35kV", "储能", "Spring Boot", "Shiro"],
            summary: "围绕宁夏典型城镇分布式新能源接入、冷热电多能供需波动、能量梯级利用和源网荷储协同架构，整理可研、任务书、实施方案、技术/工作报告、查新报告、成果清单和验收材料，形成可公开展示的横向项目档案。",
            work: [
                "阅读并归纳 117 份最终验收材料，将可研评审、任务书、执行情况表、实施试点方案、技术报告、工作报告、查新报告、成果信息表、验收申请和会议纪要串成公开版证据链。",
                "把项目三条研究主线整理为：典型城镇源-荷侧能量供需随机波动性与匹配度研究、多品位能量梯级利用的能量流耦合供给策略、分布式能源互联系统源网荷储多能协同物理架构设计。",
                "梳理基于注意力机制的 LSTM/CNN-Bi-LSTM 可再生能源出力预测、需求侧负荷预测、粒子群优化 PSO 与多目标遗传算法协同调度等技术线索，提炼为求职/申博可讲述的模型与系统能力。",
                "围绕银川镇北堡供电所等典型场景，整理 35kV 接入、30kW 新能源、100kW 以上储能、多类型能源流耦合、协议转换、边缘网关组网和能源数据互联平台等架构信息。",
                "将论文录用、发明专利受理、试点方案评审、查新报告、自验收报告、成果及创新信息表等材料转化为不暴露合同、审计、联系方式和签章页的公网展示口径。"
            ],
            outcomes: [
                "完成项目系列报告 1 套、宁夏地区新型城镇综合能源系统典型试点方案 1 份，并形成验收申请、自验收、工作报告、技术报告、查新报告和成果信息表等材料闭环。",
                "成果指标包括 EI 检索论文 2 篇，以及 3 项发明专利受理：可再生能源发电预测、K 均值聚类与随机森林无功负荷预测、负荷聚合商源荷协调多目标优化调度。",
                "公开材料显示太阳能短期出力预测准确率约 91%、风能短期出力预测约 92%、需求侧短期负荷预测约 90%，能源利用效率提升约 15%-18%，系统经济性提升约 10%-40%。",
                "项目沉淀了从资料调研、模型预测、优化调度、物理架构设计到验收答辩的问题拆解方式，可展示真实横向合作中的技术理解、材料治理和交付意识。"
            ],
            links: [
                { label: "项目页锚点", href: "horizontal-projects.html#ningxia-multi-energy-architecture" },
                { label: "横向项目证据", href: "evidence/horizontal-projects/ningxia-multi-energy-architecture.html" },
                { label: "证据看板", href: "evidence/horizontal-projects/ningxia-multi-energy-architecture.html#evidence-dashboard" },
                { label: "成果矩阵", href: "evidence/horizontal-projects/ningxia-multi-energy-architecture.html#artifact-list" },
                { label: "文档索引", href: "evidence/horizontal-projects/ningxia-multi-energy-architecture.html#document-atlas" }
            ]
        },
        {
            id: "minning-green-power-ipv6-terminal-access",
            category: "horizontal",
            categoryLabel: "横向项目",
            status: "验收材料 / IPv6 终端接入网 / 5229YC240009",
            year: "2024.02 - 2025.12",
            name: "基于闽宁绿电小镇的终端接入网 IPv6 数据通信技术研究及应用",
            role: "项目材料整理 / 技术路线归纳 / 验收证据结构化",
            cover: "images/horizontal-projects/ipv6-sdn-qos-screenshot.png",
            stack: ["IPv6", "电力物联网", "边缘物联代理", "地址规划", "合规性检查", "追踪溯源", "QoS", "GRL-ATE", "SDN", "NAT64/DNS64", "AIOps", "软件著作权"],
            summary: "围绕闽宁绿电小镇源网荷储业务和多类型终端接入场景，整理 44 份验收材料，将 IPv6 地址规划、边缘物联代理合规检查、终端接入网性能建模、地址监测与追踪溯源平台等内容转化为可公开展示的横向项目档案。",
            work: [
                "阅读并归纳可研、综合计划、任务书、工作报告、技术报告、系统/软硬件测试报告、查新报告、应用证明、专利、论文、软著、成果及创新信息表、自验收报告、研究方案、应用报告、技术规范书和项目汇报 PPT 等 44 份材料，形成公开版证据链。",
                "将项目主线整理为 IPv6 地址全生命周期管理：规划、分配、使用、监测、追踪、审计、回收，并解释其面向电力终端接入网的价值。",
                "提炼“业务-安全-地理”三维语义化 IPv6 地址编码、一体化标识、O(1) 终端身份解析、边缘物联代理准入、地址合规性动态检测、追踪溯源平台等技术点。",
                "梳理终端接入网性能需求建模和差异化 QoS 保障：图强化学习自适应流量工程 GRL-ATE、SDN 控制面拓扑感知路由、关键业务时延和 QoS 违规率指标。",
                "把专利、论文、软著、应用证明、测试报告和自验收材料转写成不公开合同、审计、经费、联系方式和签章页的项目展示口径。"
            ],
            outcomes: [
                "形成 IPv6 数据通信装置 1 套、IPv6 地址监测与分析/追踪溯源平台 1 套，并在闽宁绿电小镇相关变电站、线路和闽宁供电所试点应用。",
                "成果包含受理发明专利 4 项、软件著作权 2 项、论文 4 篇、项目系列报告 1 套、技术规范/研究方案/应用报告/成果转化方案等验收材料。",
                "公开材料记录 IPv6 网络 QoS 提升 20%、毫秒级响应、关键业务端到端延迟约 7ms、合规性检测单次决策约 2.4ms、地址管理平均响应约 20ms、关键任务业务 QoS 违规率 9.6%。",
                "项目可用于说明真实横向合作中的资料抽取、技术归纳、系统架构理解、测试验收表达和脱敏公开边界意识。"
            ],
            links: [
                { label: "项目页锚点", href: "horizontal-projects.html#minning-green-power-ipv6-terminal-access" },
                { label: "横向项目证据", href: "evidence/horizontal-projects/minning-green-power-ipv6-terminal-access.html" },
                { label: "证据看板", href: "evidence/horizontal-projects/minning-green-power-ipv6-terminal-access.html#evidence-dashboard" },
                { label: "成果矩阵", href: "evidence/horizontal-projects/minning-green-power-ipv6-terminal-access.html#artifact-list" },
                { label: "文档索引", href: "evidence/horizontal-projects/minning-green-power-ipv6-terminal-access.html#document-atlas" }
            ]
        }
    ];

    const capabilities = [
        {
            area: "前端工程",
            level: "可核验页面交付",
            icon: "fa-layer-group",
            summary: "能从信息架构、视觉系统、响应式布局到静态部署完整交付个人作品集和工具页面。",
            evidence: ["Symgo 展示站重构", "博客短卡片与筛选", "工具箱多页面维护"],
            stack: ["HTML5", "CSS Grid", "Responsive UI", "Vanilla JS"]
        },
        {
            area: "AI 工具集成",
            level: "安全代理原型",
            icon: "fa-wand-magic-sparkles",
            summary: "能把大模型问答、文件解析、本地会话记录和密钥安全策略组织成可用工作流。",
            evidence: ["学术助手", "PDF/Word 文档解析", "本地历史记录"],
            stack: ["Netlify Functions", "DeepSeek API", "PDF.js", "Mammoth.js"]
        },
        {
            area: "内容与材料组织",
            level: "求职/申博证据结构",
            icon: "fa-folder-tree",
            summary: "能把论文、项目、博客、CV、复试资料拆成可检索、可追问、可替换的证据模块。",
            evidence: ["论文发表页", "工程/横向项目页", "材料库"],
            stack: ["Case Study", "Knowledge Management", "Portfolio Writing"]
        },
        {
            area: "工程发布",
            level: "静态站构建与部署",
            icon: "fa-cloud-arrow-up",
            summary: "能处理 Netlify 白名单构建、资源路径、headers、安全占位和公开部署流程。",
            evidence: ["netlify.toml", "dist 白名单构建", "无真实 API Key 暴露"],
            stack: ["Netlify", "Node Build Script", "GitHub", "Static Assets"]
        }
    ];

    const materials = [
        {
            type: "resume",
            typeLabel: "简历材料",
            title: "阶段成果档案",
            description: "把本科阶段完整简历内容转成网页化展示，并预留研究生阶段科研、项目、论文、奖助和实习成果更新区。",
            href: "resume.html",
            status: "本科内容已接入",
            tags: ["Resume", "Undergraduate", "Graduate Reserved"]
        },
        {
            type: "resume",
            typeLabel: "简历材料",
            title: "个人 CV",
            description: "求职、申博和合作沟通时的主入口材料，已替换为本科阶段个人简历 PDF。",
            href: "files/CV.pdf",
            status: "可下载",
            tags: ["CV", "Resume", "Application"]
        },
        {
            type: "paper",
            typeLabel: "论文材料",
            title: "论文 PDF 与占位包",
            description: "已接入一篇真实论文 PDF，其余占位论文可继续替换为正式发表版本、DOI、代码和数据集。",
            href: "publications.html",
            status: "真实论文已接入",
            tags: ["Publication", "PDF", "Research"]
        },
        {
            type: "project",
            typeLabel: "项目证据",
            title: "工程项目 Case Study",
            description: "展示个人站、AI 助手、资料工具包和简历工具的背景、职责、技术与产出。",
            href: "engineering-projects.html",
            status: "持续维护",
            tags: ["Engineering", "Case Study", "Delivery"]
        },
        {
            type: "project",
            typeLabel: "横向材料",
            title: "横向项目方案模板",
            description: "用于表达需求理解、合作交付、验收汇报和可持续维护意识。",
            href: "horizontal-projects.html#industry-knowledge-base",
            status: "方案占位",
            tags: ["Collaboration", "Proposal", "Dashboard"]
        },
        {
            type: "project",
            typeLabel: "横向材料",
            title: "电力物联网横向项目档案",
            description: "把物联体系柔性配置接入、可信认证管控、示范应用和验收材料整理为可公开展示的项目证据页。",
            href: "evidence/horizontal-projects/iot-flexible-access-trusted-control.html",
            status: "真实项目档案",
            tags: ["IoT", "EdgeX", "Trusted Control", "Acceptance"]
        },
        {
            type: "project",
            typeLabel: "横向材料",
            title: "宁夏多能互补横向项目档案",
            description: "把分布式多能互补、新型城镇综合能源系统信息与物理架构研究的 117 份验收材料整理为公开版项目展示。",
            href: "evidence/horizontal-projects/ningxia-multi-energy-architecture.html",
            status: "真实项目档案",
            tags: ["综合能源", "源网荷储", "CNN-Bi-LSTM", "验收"]
        },
        {
            type: "project",
            typeLabel: "横向材料",
            title: "闽宁绿电小镇 IPv6 终端接入网项目档案",
            description: "把终端接入网 IPv6 数据通信技术研究及应用的 44 份验收材料整理为公开版项目画像，突出地址规划、合规检查、QoS 建模和追踪溯源平台。",
            href: "evidence/horizontal-projects/minning-green-power-ipv6-terminal-access.html",
            status: "真实项目档案",
            tags: ["IPv6", "电力物联网", "QoS", "追踪溯源"]
        },
        {
            type: "study",
            typeLabel: "升学材料",
            title: "保研信息模板",
            description: "保研/推免准备过程中的信息整理表，可作为经验文章的下载补充。",
            href: "files/baoyan/信息模板.xlsx",
            status: "可下载",
            tags: ["保研", "Excel", "Template"]
        },
        {
            type: "study",
            typeLabel: "升学材料",
            title: "复试技巧 PPT/PDF",
            description: "复试材料、导师联系、面试表达和资料准备的内容入口。",
            href: "files/25_skills/ppt.pdf",
            status: "可下载",
            tags: ["复试", "PDF", "Interview"]
        },
        {
            type: "tool",
            typeLabel: "工具演示",
            title: "Markdown 转 Word / 代码高亮工具",
            description: "展示对常用学习与写作工具的前端实现能力。",
            href: "tools/markdown_to_word.html",
            status: "可访问",
            tags: ["Tooling", "Markdown", "Frontend"]
        },
        {
            type: "blog",
            typeLabel: "写作证明",
            title: "博客文章与经验沉淀",
            description: "用真实文章展示长期维护、知识表达和面向他人的说明能力。",
            href: "blog.html",
            status: "持续更新",
            tags: ["Writing", "Blog", "Knowledge"]
        }
    ];

    const milestones = [
        { year: "2026", title: "个人展示站产品化", desc: "把论文、项目、材料、博客和工具重组为求职/申博证据系统。" },
        { year: "2025", title: "AI 工具与升学资料沉淀", desc: "围绕复试、保研、文档问答和简历工具持续补充可演示模块。" },
        { year: "2024", title: "技术博客与工具学习", desc: "沉淀 Git、Python、深度学习和个人效率工具相关内容。" }
    ];

    const dashboardStats = [
        { label: "核心页面", value: "14", desc: "首页、档案、阶段成果、研究、论文、项目总览、工程项目、横向项目、材料、仪表盘、成就、服务、路线图、博客" },
        { label: "已录入项目", value: "8", desc: "5 个现有工程/工具原型 + 3 个真实横向项目档案；2 个待补充槽位不计入" },
        { label: "已核验论文", value: "1", desc: "另保留 3 个明确标注的研究生阶段待补充槽位" },
        { label: "发布检查", value: "4 项", desc: "受控构建、静态链接、格式检查与浏览器多断点核验" }
    ];

    const achievements = [
        {
            year: "2026",
            title: "个人学术展示站产品化升级",
            type: "工程成果",
            level: "Portfolio System",
            description: "把旧博客升级为覆盖论文、项目、材料、研究方向、AI 助手和 Netlify 发布工程的展示系统。",
            proof: "engineering-projects.html#symgo-portfolio",
            tags: ["Static Site", "Portfolio", "Netlify"]
        },
        {
            year: "2025",
            title: "电力物联网横向项目材料沉淀",
            type: "横向项目",
            level: "IoT / Edge Computing",
            description: "围绕柔性配置接入、自动注册、可信认证管控、第三方测试和示范应用，整理公开可展示的横向项目证据页。",
            proof: "evidence/horizontal-projects/iot-flexible-access-trusted-control.html",
            tags: ["电力物联网", "EdgeX", "验收材料"]
        },
        {
            year: "2024",
            title: "综合能源横向项目验收材料沉淀",
            type: "横向项目",
            level: "Integrated Energy / Source-Grid-Load-Storage",
            description: "围绕宁夏地区分布式多能互补项目，整理 117 份最终验收材料，提炼预测模型、协同调度、物理架构和验收成果。",
            proof: "evidence/horizontal-projects/ningxia-multi-energy-architecture.html",
            tags: ["综合能源", "CNN-Bi-LSTM", "PSO"]
        },
        {
            year: "2026",
            title: "闽宁绿电小镇 IPv6 终端接入网材料沉淀",
            type: "横向项目",
            level: "Power IoT / IPv6 Terminal Access",
            description: "围绕终端接入网 IPv6 数据通信技术研究，整理 44 份验收材料，提炼地址全生命周期、边缘代理合规检查、QoS 建模和追踪溯源平台。",
            proof: "evidence/horizontal-projects/minning-green-power-ipv6-terminal-access.html",
            tags: ["IPv6", "电力物联网", "追踪溯源"]
        },
        {
            year: "2025",
            title: "升学复试与保研资料体系沉淀",
            type: "内容成果",
            level: "Knowledge Asset",
            description: "把复试技巧、保研材料、导师联系和经验分享沉淀为可访问页面与下载资料。",
            proof: "blog/25_skills.html",
            tags: ["保研", "复试", "写作"]
        },
        {
            year: "2025",
            title: "安全代理学术 AI 助手原型",
            type: "工具成果",
            level: "Netlify Function Prototype",
            description: "实现本地会话、文档文本提取和 Netlify Function 模型代理；密钥只存于服务端环境变量。",
            proof: "ai.html",
            tags: ["AI", "Netlify Functions", "PDF.js"]
        },
        {
            year: "2024",
            title: "Git / Python / 深度学习学习材料维护",
            type: "学习成果",
            level: "Long-term Notes",
            description: "持续整理技术学习材料、工具页面和博客笔记，形成长期维护习惯。",
            proof: "blog.html",
            tags: ["Git", "Python", "Learning"]
        }
    ];

    const services = [
        {
            title: "静态个人站/作品集搭建",
            audience: "求职、申博、个人品牌展示",
            deliverables: ["信息架构", "页面设计", "响应式前端", "Netlify 部署", "SEO 基础配置"],
            value: "把简历无法展开的论文、项目和材料做成公开证据库。"
        },
        {
            title: "项目材料与 Case Study 整理",
            audience: "面试复盘、横向项目汇报、实验室成果展示",
            deliverables: ["项目背景梳理", "职责拆解", "技术栈说明", "产出价值描述", "展示页面"],
            value: "把“做过什么”整理成别人能追问、能验证、能理解的材料。"
        },
        {
            title: "AI 文档助手原型",
            audience: "个人学习、实验室资料问答、企业文档整理",
            deliverables: ["聊天界面", "文件文本提取", "本地会话", "Netlify 安全代理", "错误与限流状态"],
            value: "把大模型能力接到真实学习/科研/项目资料工作流里。"
        },
        {
            title: "学习资料与工具页面制作",
            audience: "课程笔记、教程分享、升学资料沉淀",
            deliverables: ["文章页面", "下载入口", "工具导航", "搜索筛选", "维护规范"],
            value: "把零散资料变成可访问、可复用、可长期维护的知识资产。"
        }
    ];

    const roadmap = [
        {
            phase: "Phase 1",
            title: "研究生阶段真实材料补充",
            status: "待真实内容",
            items: ["论文与课题", "专利与竞赛", "实习与合作", "阶段总结"]
        },
        {
            phase: "Phase 2",
            title: "现有项目证据增强",
            status: "持续维护",
            items: ["补充获准公开的截图", "更新技术难点复盘", "补充可核验指标", "同步公开文档"]
        },
        {
            phase: "Phase 3",
            title: "动态能力维护",
            status: "进行中",
            items: ["API 上游健康治理", "AI Function 环境配置", "文档搜索索引", "项目更新日志"]
        },
        {
            phase: "Phase 4",
            title: "申博/求职专项版本",
            status: "Future",
            items: ["导师邮件入口", "岗位匹配页", "英文版本", "PDF 打印版 portfolio"]
        }
    ];

    const interviewStories = [
        {
            project: "Symgo 个人展示站",
            situation: "旧博客页面和功能比较简陋，无法承担求职/申博时的材料展示任务。",
            task: "需要把它升级成能展示论文、项目、材料、研究方向和工具能力的静态站。",
            action: "重构首页信息架构，新增论文/项目/材料/档案/研究/仪表盘等页面，补齐 Netlify 构建、SEO 和安全策略。",
            result: "形成一个可公开访问、可持续维护、可作为简历证据层的个人展示系统。"
        },
        {
            project: "学术 AI 助手",
            situation: "学习和科研资料分散在 PDF、Word、Markdown 和聊天记录里。",
            task: "需要一个能辅助阅读、问答和记录历史，同时不在浏览器保存模型密钥的原型。",
            action: "实现 PDF/Word/TXT/Markdown 文本提取、本地会话记录和 Netlify Function 模型代理，并加入大小限制、限流、超时与结构化错误。",
            result: "前端不再接触模型密钥；服务端未配置环境变量时会如实报告配置状态。"
        },
        {
            project: "保研/复试资料体系",
            situation: "升学经验通常停留在口头分享和零散文档。",
            task: "需要把流程、材料、术语、技巧和下载资源组织成可复用页面。",
            action: "整理保研入口、信息模板、复试技巧文章和视频/文档资源，放入博客和材料库。",
            result: "降低重复答疑成本，也展示内容组织和长期维护能力。"
        },
        {
            project: "宁夏多能互补综合能源项目",
            situation: "项目最终验收材料包含可研、任务书、实施方案、技术报告、工作报告、查新报告、成果清单、验收申请和会议纪要，信息密度高且不适合全文公开。",
            task: "需要把真实横向项目转化成求职/申博可读的公开项目档案，同时保留技术含量和验收证据链。",
            action: "我从 117 份材料中提取项目编号、周期、单位、三项研究内容、模型指标、试点方案、论文专利和验收口径，整理为综合能源系统项目页面与证据页。",
            result: "形成了可展示的横向项目经历，能讲清楚 CNN-Bi-LSTM 预测、PSO 协同调度、源网荷储架构和材料脱敏边界。"
        },
        {
            project: "闽宁绿电小镇 IPv6 终端接入网项目",
            situation: "项目验收材料覆盖 IPv6 地址规划、边缘物联代理、性能建模、平台开发、论文专利和应用证明，同时包含合同、审计、经费等不适合公开的信息。",
            task: "需要把 44 份有效材料转化为求职/申博可读的横向项目档案，并保证公开内容不泄露内部材料边界。",
            action: "我提取项目编号、周期、单位、四项研究主线、平台成果、QoS 指标、论文专利软著和试点应用，把它们组织成项目卡片、证据页、材料库和成就条目。",
            result: "形成了可讲述的 IPv6 终端接入网项目经历，能说明地址全生命周期管理、合规检查、追踪溯源平台和复杂验收材料治理能力。"
        }
    ];

    function normalize(text) {
        return (text || "").toString().trim().toLowerCase();
    }

    function contentUpdated() {
        document.dispatchEvent(new Event("symgo:content-updated"));
    }

    function setResultSummary(anchor, visible, total, label) {
        if (!anchor) return;
        let summary = anchor.parentElement.querySelector(".result-summary");
        if (!summary) {
            summary = document.createElement("div");
            summary.className = "result-summary";
            anchor.parentElement.appendChild(summary);
        }
        summary.innerHTML = `<i class="fas fa-filter"></i><span>当前显示 <strong>${visible}</strong> / ${total} ${label}</span>`;
    }

    function renderPublicationPreview(item) {
        const isPlaceholder = item.status === "placeholder";
        const label = isPlaceholder ? `${item.title} 占位说明页` : `${item.title} 论文第一页截图`;
        if (item.cover) {
            return `
                <a class="publication-preview${isPlaceholder ? " placeholder-preview" : ""}" href="${item.pdf}" target="_blank" rel="noopener noreferrer" aria-label="打开 ${isPlaceholder ? "占位说明" : item.title + " PDF"}">
                    <img src="${item.cover}" alt="${label}" loading="lazy" decoding="async">
                    <span><i class="fas fa-file-pdf"></i> ${isPlaceholder ? "占位说明 · 非论文全文" : "查看 PDF 全文"}</span>
                </a>
            `;
        }

        return `
            <a class="publication-preview placeholder" href="${item.pdf}" target="_blank" rel="noopener noreferrer" aria-label="打开 ${item.title} PDF">
                <i class="fas fa-file-pdf"></i>
                <span>PDF 预览待补充</span>
            </a>
        `;
    }

    function renderPublications() {
        const root = document.querySelector("[data-publications]");
        if (!root) return;

        const yearFilter = document.querySelector("[data-pub-year]");
        const typeFilter = document.querySelector("[data-pub-type]");
        const topicFilter = document.querySelector("[data-pub-topic]");
        const levelFilter = document.querySelector("[data-pub-level]");
        const searchInput = document.querySelector("[data-pub-search]");

        function paint() {
            const year = yearFilter ? yearFilter.value : "all";
            const type = typeFilter ? typeFilter.value : "all";
            const topic = topicFilter ? topicFilter.value : "all";
            const level = levelFilter ? levelFilter.value : "all";
            const keyword = normalize(searchInput ? searchInput.value : "");

            const filtered = publications.filter((item) => {
                const haystack = normalize([item.title, item.authors, item.venue, item.abstract, item.topic, item.level, item.tags.join(" ")].join(" "));
                return (year === "all" || item.year === year)
                    && (type === "all" || item.type === type)
                    && (topic === "all" || item.topic.includes(topic))
                    && (level === "all" || item.levelGroup === level)
                    && (!keyword || haystack.includes(keyword));
            });

            const verifiedTotal = publications.filter((item) => item.status === "verified").length;
            const pendingTotal = publications.filter((item) => item.status === "placeholder").length;
            setResultSummary(root, filtered.length, publications.length, `条记录（${verifiedTotal} 篇已核验论文 + ${pendingTotal} 个待补充槽位）`);

            if (!filtered.length) {
                root.innerHTML = '<div class="empty-state">没有符合条件的论文。换个年份、类型或关键词试试。</div>';
                contentUpdated();
                return;
            }

            root.innerHTML = filtered.map((item) => `
                <article class="publication-card${item.status === "placeholder" ? " is-placeholder-publication" : " is-verified-publication"}" data-year="${item.year}" data-type="${item.type}" data-topic="${item.topic}" data-level="${item.levelGroup}">
                    ${renderPublicationPreview(item)}
                    <div class="publication-body">
                        <div class="publication-top">
                            <div>
                                <div class="resume-date">${item.year} · ${item.role}</div>
                                <h2 class="publication-title">${item.title}</h2>
                                <p><strong>${item.authors}</strong></p>
                                <p>${item.venue}</p>
                            </div>
                            <span class="pill level">${item.level}</span>
                        </div>
                        <div class="tag-row">
                            <span class="pill status">${item.status === "placeholder" ? "待补充槽位" : "已核验"}</span>
                            <span class="pill">${item.topic}</span>
                            ${item.tags.map((tag) => `<span class="pill">${tag}</span>`).join("")}
                        </div>
                        <dl class="publication-facts" aria-label="论文元数据">
                            <div><dt>年份</dt><dd>${item.year}</dd></div>
                            <div><dt>发表平台</dt><dd>${item.venue}</dd></div>
                            <div><dt>本人贡献</dt><dd>${item.role}</dd></div>
                            <div><dt>DOI</dt><dd>${item.doi || "待补充"}</dd></div>
                        </dl>
                        <p>${item.abstract}</p>
                        <div class="publication-actions">
                            <a class="text-link" href="${item.pdf}" target="_blank" rel="noopener noreferrer"><i class="fas fa-file-pdf"></i> ${item.status === "placeholder" ? "占位说明" : "PDF 全文"}</a>
                            ${item.code ? `<a class="text-link" href="${item.code}" ${item.code.startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : ""}><i class="fas ${item.code.startsWith("http") ? "fa-arrow-up-right-from-square" : "fa-diagram-project"}"></i> ${item.status === "placeholder" ? "相关工程材料" : (item.code.startsWith("http") ? "论文官网" : "相关项目")}</a>` : ""}
                            ${item.doi ? `<a class="text-link" href="https://doi.org/${item.doi}" target="_blank" rel="noopener noreferrer"><i class="fas fa-fingerprint"></i> DOI</a>` : ""}
                        </div>
                    </div>
                </article>
            `).join("");
            contentUpdated();
        }

        [yearFilter, typeFilter, topicFilter, levelFilter, searchInput].forEach((el) => {
            if (!el) return;
            el.addEventListener(el.tagName === "INPUT" ? "input" : "change", paint);
        });

        paint();
    }

    function renderProjects() {
        const root = document.querySelector("[data-projects]");
        if (!root) return;

        const categoryTabs = document.querySelectorAll("[data-project-category]");
        const searchInput = document.querySelector("[data-project-search]");
        const fixedCategory = root.dataset.projectPageCategory || "";
        let activeCategory = fixedCategory || "all";

        function getProjectPage(project) {
            return project.category === "engineering" ? "engineering-projects.html" : "horizontal-projects.html";
        }

        function getProjectHref(project) {
            return `${getProjectPage(project)}#${project.id}`;
        }

        function normalizeProjectLink(link) {
            const projectHashMatch = link.href.match(/^projects\.html#(.+)$/);
            if (!projectHashMatch) return link.href;
            const targetProject = projects.find((project) => project.id === projectHashMatch[1]);
            return targetProject ? getProjectHref(targetProject) : link.href;
        }

        function syncCategoryToHash() {
            if (!window.location.hash) return;
            const targetId = window.location.hash.slice(1);
            const targetProject = projects.find((project) => project.id === targetId);
            if (!targetProject) return;
            if (fixedCategory && targetProject.category !== fixedCategory) {
                window.location.replace(`${getProjectHref(targetProject)}`);
                return;
            }
            activeCategory = targetProject.category;
            categoryTabs.forEach((tab) => {
                tab.classList.toggle("active", tab.dataset.projectCategory === targetProject.category);
            });
        }

        function paint() {
            const keyword = normalize(searchInput ? searchInput.value : "");
            const filtered = projects.filter((project) => {
                const haystack = normalize([project.name, project.role, project.summary, project.stack.join(" "), project.work.join(" "), project.outcomes.join(" "), project.status, project.categoryLabel].join(" "));
                return (!fixedCategory || project.category === fixedCategory)
                    && (activeCategory === "all" || project.category === activeCategory)
                    && (!keyword || haystack.includes(keyword));
            });

            const totalForView = fixedCategory ? projects.filter((project) => project.category === fixedCategory).length : projects.length;
            setResultSummary(root, filtered.length, totalForView, "个项目");

            if (!filtered.length) {
                root.innerHTML = '<div class="empty-state">没有符合条件的项目。可以清空搜索或切换状态。</div>';
                contentUpdated();
                return;
            }

            const groups = [
                { key: "engineering", title: "工程项目", desc: "强调独立开发、工具构建、前端实现、部署与维护能力。" },
                { key: "horizontal", title: "横向项目", desc: "强调需求理解、合作交付、方案表达、汇报验收和可持续维护。" }
            ].filter((group) => filtered.some((project) => project.category === group.key));

            root.innerHTML = groups.map((group) => `
                <section class="project-category-block" id="${group.key}-projects" aria-label="${group.title}" tabindex="-1">
                    <div class="project-category-head">
                        <div>
                            <span class="section-kicker">${group.key === "engineering" ? "ENGINEERING" : "COLLABORATION"}</span>
                            <h2>${group.title}</h2>
                        </div>
                        <p>${group.desc}</p>
                    </div>
                    <div class="project-list-group">
                        ${filtered.filter((project) => project.category === group.key).map((project, index) => `
                <article class="project-showcase" id="${project.id}">
                    ${project.cover
                        ? `<a class="project-cover-link" href="${getProjectHref(project)}"><img class="project-cover" src="${project.cover}" alt="${project.name} 视觉证据图" loading="lazy" decoding="async"></a>`
                        : `<div class="project-cover-placeholder" role="img" aria-label="${project.name} 公开截图待补充"><span>VISUAL EVIDENCE</span><strong>公开截图待补充</strong><small>未使用无关图片或虚构界面代替</small></div>`}
                    <div class="project-head">
                        <div>
                            <div class="project-index">${String(index + 1).padStart(2, "0")}</div>
                            <div class="resume-date">${project.year} · ${project.categoryLabel} · ${project.role}</div>
                            <h2>${project.name}</h2>
                            <p class="project-meta">${project.summary}</p>
                        </div>
                        <div class="project-badges">
                            <span class="pill category">${project.categoryLabel}</span>
                            <span class="pill status">${project.status}</span>
                        </div>
                    </div>
                    <div class="tag-row">
                        ${project.stack.map((tag) => `<span class="pill">${tag}</span>`).join("")}
                    </div>
                    <dl class="project-fact-grid">
                        <div><dt>背景与问题</dt><dd>${project.summary}</dd></div>
                        <div><dt>我的职责</dt><dd>${project.role}</dd></div>
                        <div><dt>技术路线</dt><dd>${project.stack.join(" / ")}</dd></div>
                        <div><dt>验证依据</dt><dd>${project.outcomes[0] || "公开验证材料待补充"}</dd></div>
                    </dl>
                    <div class="project-timeline" aria-label="项目阶段信息">
                        <span>时间范围</span><strong>${project.year}</strong><span>当前状态</span><strong>${project.status}</strong>
                    </div>
                    <div class="work-grid">
                        <div class="work-box">
                            <h4>关键工作</h4>
                            <ul>${project.work.map((item) => `<li>${item}</li>`).join("")}</ul>
                        </div>
                        <div class="work-box">
                            <h4>成果与验证方式</h4>
                            <ul>${project.outcomes.map((item) => `<li>${item}</li>`).join("")}</ul>
                        </div>
                    </div>
                    <div class="project-actions">
                        <a class="text-link" href="${getProjectHref(project)}"><i class="fas fa-link"></i> 固定链接</a>
                        ${project.links.map((link) => {
                            const href = normalizeProjectLink(link);
                            return `<a class="text-link" href="${href}" ${href.startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : ""}><i class="fas fa-arrow-up-right-from-square"></i> ${link.label}</a>`;
                        }).join("")}
                    </div>
                </article>
                        `).join("")}
                    </div>
                </section>
            `).join("");

            contentUpdated();
            scheduleProjectHashScroll();
        }

        function scrollToProjectHash(behavior = "auto") {
            if (!window.location.hash) return;
            const target = document.getElementById(window.location.hash.slice(1));
            if (!target) return;
            const headerHeight = document.querySelector("header")?.offsetHeight || 0;
            target.style.scrollMarginTop = `${headerHeight + 18}px`;
            target.scrollIntoView({ block: "start", behavior });
            const targetTop = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerHeight - 18);
            window.scrollTo({ top: targetTop, behavior: behavior === "smooth" ? "smooth" : "auto" });
        }

        function scheduleProjectHashScroll(behavior = "auto") {
            if (!window.location.hash) return;
            requestAnimationFrame(() => scrollToProjectHash(behavior));
            setTimeout(() => scrollToProjectHash(behavior), 80);
            setTimeout(() => scrollToProjectHash(behavior), 320);
            setTimeout(() => scrollToProjectHash("auto"), 700);
        }

        categoryTabs.forEach((tab) => {
            if (fixedCategory && tab.dataset.projectCategory !== fixedCategory) {
                tab.hidden = true;
                return;
            }
            if (fixedCategory && tab.dataset.projectCategory === fixedCategory) {
                tab.classList.add("active");
            }
            tab.addEventListener("click", () => {
                categoryTabs.forEach((item) => item.classList.remove("active"));
                tab.classList.add("active");
                activeCategory = tab.dataset.projectCategory;
                paint();
            });
        });

        window.addEventListener("hashchange", () => {
            syncCategoryToHash();
            paint();
            scheduleProjectHashScroll("smooth");
        });
        window.addEventListener("load", () => scheduleProjectHashScroll("auto"));
        window.addEventListener("pageshow", () => scheduleProjectHashScroll("auto"));

        if (searchInput) searchInput.addEventListener("input", paint);
        syncCategoryToHash();
        paint();
    }

    function redirectLegacyProjectHash() {
        const isProjectHub = window.location.pathname.endsWith("/projects.html") || window.location.pathname.endsWith("projects.html");
        if (!isProjectHub || !window.location.hash) return;
        const projectId = window.location.hash.slice(1);
        const project = projects.find((item) => item.id === projectId);
        if (!project) return;
        const targetPage = project.category === "engineering" ? "engineering-projects.html" : "horizontal-projects.html";
        window.location.replace(`${targetPage}#${project.id}`);
    }

    function renderCapabilities() {
        const root = document.querySelector("[data-capabilities]");
        if (!root) return;

        root.innerHTML = capabilities.map((item) => `
            <article class="capability-card">
                <div class="capability-top">
                    <div class="card-icon"><i class="fas ${item.icon}"></i></div>
                    <div>
                        <span class="section-kicker">${item.level}</span>
                        <h2>${item.area}</h2>
                    </div>
                    <div class="capability-score">${item.evidence.length} 组证据</div>
                </div>
                <p>${item.summary}</p>
                <div class="evidence-grid">
                    ${item.evidence.map((evidence) => `<span><i class="fas fa-check"></i>${evidence}</span>`).join("")}
                </div>
                <div class="tag-row">${item.stack.map((tag) => `<span class="pill">${tag}</span>`).join("")}</div>
            </article>
        `).join("");
    }

    function renderMaterials() {
        const root = document.querySelector("[data-materials]");
        if (!root) return;

        const tabs = document.querySelectorAll("[data-material-filter]");
        const searchInput = document.querySelector("[data-material-search]");
        const empty = document.querySelector("[data-material-empty]");
        let active = "all";

        function paint() {
            const keyword = normalize(searchInput ? searchInput.value : "");
            const filtered = materials.filter((item) => {
                const haystack = normalize([item.typeLabel, item.title, item.description, item.status, item.tags.join(" ")].join(" "));
                return (active === "all" || item.type === active) && (!keyword || haystack.includes(keyword));
            });

            setResultSummary(root, filtered.length, materials.length, "份材料");

            if (!filtered.length) {
                root.innerHTML = "";
                if (empty) empty.style.display = "block";
                contentUpdated();
                return;
            }

            if (empty) empty.style.display = "none";
            root.innerHTML = filtered.map((item) => `
                <article class="material-card" data-type="${item.type}">
                    <div class="material-type">${item.typeLabel}</div>
                    <h2>${item.title}</h2>
                    <p>${item.description}</p>
                    <div class="tag-row">${item.tags.map((tag) => `<span class="pill">${tag}</span>`).join("")}</div>
                    <div class="material-actions">
                        <span class="pill status">${item.status}</span>
                        <a class="text-link" href="${item.href}" ${item.href.startsWith("http") || item.href.endsWith(".pdf") || item.href.endsWith(".xlsx") ? 'target="_blank" rel="noopener noreferrer"' : ""}>
                            打开材料 <i class="fas fa-arrow-up-right-from-square"></i>
                        </a>
                    </div>
                </article>
            `).join("");
            contentUpdated();
        }

        tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                tabs.forEach((item) => item.classList.remove("active"));
                tab.classList.add("active");
                active = tab.dataset.materialFilter;
                paint();
            });
        });

        if (searchInput) searchInput.addEventListener("input", paint);
        paint();
    }

    function renderMilestones() {
        const root = document.querySelector("[data-milestones]");
        if (!root) return;

        root.innerHTML = milestones.map((item) => `
            <div class="resume-item">
                <div class="resume-date">${item.year}</div>
                <div class="resume-title">${item.title}</div>
                <div class="resume-desc">${item.desc}</div>
            </div>
        `).join("");
    }

    function renderDashboard() {
        const statsRoot = document.querySelector("[data-dashboard-stats]");
        if (statsRoot) {
            statsRoot.innerHTML = dashboardStats.map((item) => `
                <article class="metric-card dashboard-stat">
                    <div class="metric-number">${item.value}</div>
                    <div class="metric-label">${item.label}</div>
                    <p>${item.desc}</p>
                </article>
            `).join("");
        }

        const projectRoot = document.querySelector("[data-dashboard-projects]");
        if (projectRoot) {
            projectRoot.innerHTML = projects.map((project) => `
                <article class="dashboard-row">
                    <div>
                        <span class="pill category">${project.categoryLabel}</span>
                        <h3>${project.name}</h3>
                        <p>${project.summary}</p>
                    </div>
                    <div class="dashboard-row-meta">
                        <span>${project.year}</span>
                        <strong>${project.status}</strong>
                    </div>
                </article>
            `).join("");
        }

        const materialRoot = document.querySelector("[data-dashboard-materials]");
        if (materialRoot) {
            materialRoot.innerHTML = materials.slice(0, 6).map((item) => `
                <a class="mini-resource" href="${item.href}">
                    <span>${item.typeLabel}</span>
                    <strong>${item.title}</strong>
                </a>
            `).join("");
        }
    }

    function renderAchievements() {
        const root = document.querySelector("[data-achievements]");
        if (!root) return;

        root.innerHTML = achievements.map((item) => `
            <article class="achievement-card">
                <div class="achievement-year">${item.year}</div>
                <div>
                    <span class="section-kicker">${item.type} · ${item.level}</span>
                    <h2>${item.title}</h2>
                    <p>${item.description}</p>
                    <div class="tag-row">${item.tags.map((tag) => `<span class="pill">${tag}</span>`).join("")}</div>
                    <a class="text-link" href="${item.proof}">查看证明 <i class="fas fa-arrow-right"></i></a>
                </div>
            </article>
        `).join("");
    }

    function renderServices() {
        const root = document.querySelector("[data-services]");
        if (!root) return;

        root.innerHTML = services.map((item) => `
            <article class="service-card">
                <div class="card-icon"><i class="fas fa-briefcase"></i></div>
                <span class="section-kicker">${item.audience}</span>
                <h2>${item.title}</h2>
                <p>${item.value}</p>
                <div class="deliverable-list">
                    ${item.deliverables.map((deliverable) => `<span><i class="fas fa-check"></i>${deliverable}</span>`).join("")}
                </div>
            </article>
        `).join("");
    }

    function renderRoadmap() {
        const root = document.querySelector("[data-roadmap]");
        if (!root) return;

        root.innerHTML = roadmap.map((item) => `
            <article class="roadmap-card">
                <div class="roadmap-phase">${item.phase}</div>
                <div>
                    <span class="pill status">${item.status}</span>
                    <h2>${item.title}</h2>
                    <ul>${item.items.map((task) => `<li>${task}</li>`).join("")}</ul>
                </div>
            </article>
        `).join("");
    }

    function renderInterviewStories() {
        const root = document.querySelector("[data-interview-stories]");
        if (!root) return;

        root.innerHTML = interviewStories.map((item) => `
            <article class="story-card">
                <h2>${item.project}</h2>
                <dl>
                    <dt>S</dt><dd>${item.situation}</dd>
                    <dt>T</dt><dd>${item.task}</dd>
                    <dt>A</dt><dd>${item.action}</dd>
                    <dt>R</dt><dd>${item.result}</dd>
                </dl>
            </article>
        `).join("");
    }

    function initBlogFilters() {
        const cards = document.querySelectorAll("[data-blog-card]");
        if (!cards.length) return;

        const tabs = document.querySelectorAll("[data-blog-category]");
        const searchInput = document.querySelector("[data-blog-search]");
        const yearFilter = document.querySelector("[data-blog-year]");
        const tagFilter = document.querySelector("[data-blog-tag]");
        const empty = document.querySelector("[data-blog-empty]");
        const anchor = document.querySelector(".blog-grid.clean");
        let active = "all";

        function apply() {
            const keyword = normalize(searchInput ? searchInput.value : "");
            const year = yearFilter ? yearFilter.value : "all";
            const tag = tagFilter ? tagFilter.value : "all";
            let visible = 0;

            cards.forEach((card) => {
                const categoryMatch = active === "all" || card.dataset.category === active;
                const yearMatch = year === "all" || card.dataset.year === year;
                const tagMatch = tag === "all" || normalize(card.dataset.tags).includes(normalize(tag));
                const haystack = normalize(card.textContent);
                const searchMatch = !keyword || haystack.includes(keyword);
                const show = categoryMatch && yearMatch && tagMatch && searchMatch;
                card.style.display = show ? "" : "none";
                if (show) visible += 1;
            });

            setResultSummary(anchor, visible, cards.length, "篇文章");
            if (empty) empty.style.display = visible ? "none" : "block";
            contentUpdated();
        }

        tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                tabs.forEach((item) => item.classList.remove("active"));
                tab.classList.add("active");
                active = tab.dataset.blogCategory;
                apply();
            });
        });

        if (searchInput) searchInput.addEventListener("input", apply);
        if (yearFilter) yearFilter.addEventListener("change", apply);
        if (tagFilter) tagFilter.addEventListener("change", apply);
        apply();
    }

    window.symgoSite = {
        publications,
        projects,
        capabilities,
        materials,
        milestones,
        dashboardStats,
        achievements,
        services,
        roadmap,
        interviewStories
    };

    document.addEventListener("DOMContentLoaded", () => {
        redirectLegacyProjectHash();
        renderPublications();
        renderProjects();
        renderCapabilities();
        renderMaterials();
        renderMilestones();
        renderDashboard();
        renderAchievements();
        renderServices();
        renderRoadmap();
        renderInterviewStories();
        initBlogFilters();
    });
})();
