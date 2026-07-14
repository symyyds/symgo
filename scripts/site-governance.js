const protectedHorizontalProjects = [
  {
    slug: "iot-flexible-access-trusted-control",
    title: "电力物联网柔性接入与可信管控",
    summary: "把真实横向项目材料脱敏整理为端边协同、自动注册、可信认证、示范应用和验收证据链。",
    icon: "fa-tower-broadcast",
    image: "iot-access-screenshot.png",
    imageAlt: "电力物联网柔性接入项目脱敏截图",
    tags: ["真实项目", "EdgeX", "验收材料"]
  },
  {
    slug: "ningxia-multi-energy-architecture",
    title: "宁夏多能互补综合能源系统",
    summary: "把国网宁夏电力科技项目最终验收材料整理为能源预测、多能流耦合、源网荷储架构和成果验收证据链。",
    icon: "fa-bolt",
    image: "energy-architecture-screenshot.png",
    imageAlt: "宁夏多能互补项目源网荷储架构截图",
    tags: ["真实项目", "综合能源", "验收材料"]
  },
  {
    slug: "minning-green-power-ipv6-terminal-access",
    title: "闽宁绿电小镇 IPv6 终端接入网",
    summary: "把终端接入网 IPv6 数据通信验收材料整理为地址规划、合规检查、QoS 建模、追踪溯源平台和试点应用证据链。",
    icon: "fa-network-wired",
    image: "ipv6-sdn-qos-screenshot.png",
    imageAlt: "闽宁绿电小镇 IPv6 项目网络拓扑截图",
    tags: ["真实项目", "IPv6", "追踪溯源"]
  }
];

const protectedEvidenceRelativeFiles = protectedHorizontalProjects.map(
  (project) => `horizontal-projects/${project.slug}.html`
);

const protectedSitemapPages = [
  "evidence/horizontal-projects/",
  ...protectedEvidenceRelativeFiles.map((file) => `evidence/${file}`)
];

module.exports = {
  protectedHorizontalProjects,
  protectedEvidenceRelativeFiles,
  protectedSitemapPages
};
