const defaultData = {
  about: "兴物城建集团有限公司聚焦城市基础设施与民生工程，围绕‘品质交付、长期主义、数字化管理’推进项目全生命周期管理。",
  stats: [
    { label: "覆盖区域", value: "12+" },
    { label: "累计项目", value: "200+" },
    { label: "在建项目", value: "30+" },
    { label: "安全天数", value: "3000+" }
  ],
  business: ["市政工程", "房屋建筑", "园林生态", "城市更新", "工程管理", "智慧工地"],
  projects: [
    { name: "城市道路综合改造项目", detail: "覆盖主干道提升、雨污分流与慢行系统。" },
    { name: "片区保障性住房建设", detail: "高标准装配化施工与智慧安防联动。" },
    { name: "河道生态修复工程", detail: "水生态修复与滨水公共空间提升。" }
  ],
  news: [
    "【2026-05-26】官网V1.0项目启动：完成信息架构与技术方案评审。",
    "【2026-05-20】集团召开数字化管理专题会议。",
    "【2026-05-12】重点工程项目通过阶段性质量验收。"
  ],
  contact: "商务合作：biz@xwcjjt.com｜招聘咨询：hr@xwcjjt.com｜总部地址：请在上线前替换为最新官方地址。"
};

const storeKey = "xwcj_site_content_v1";
const loadData = () => JSON.parse(localStorage.getItem(storeKey) || "null") || defaultData;
const saveData = (data) => localStorage.setItem(storeKey, JSON.stringify(data));

function render() {
  const data = loadData();
  document.getElementById("aboutText").textContent = data.about;
  document.getElementById("contactText").textContent = data.contact;

  const statsGrid = document.getElementById("statsGrid");
  statsGrid.innerHTML = data.stats.map(s => `<div class="stat"><b>${s.value}</b><span>${s.label}</span></div>`).join("");

  document.getElementById("businessList").innerHTML = data.business.map(i => `<li>${i}</li>`).join("");

  document.getElementById("projectList").innerHTML = data.projects
    .map(p => `<article class="p-card"><h3>${p.name}</h3><p>${p.detail}</p></article>`).join("");

  document.getElementById("newsList").innerHTML = data.news.map(n => `<li>${n}</li>`).join("");

  document.getElementById("adminJson").value = JSON.stringify(data, null, 2);
  document.getElementById("year").textContent = new Date().getFullYear();
}

render();

const adminModal = document.getElementById("adminModal");
document.getElementById("openAdmin").onclick = () => adminModal.classList.remove("hidden");
document.getElementById("closeAdmin").onclick = () => adminModal.classList.add("hidden");

document.getElementById("saveAdmin").onclick = () => {
  try {
    const next = JSON.parse(document.getElementById("adminJson").value);
    saveData(next);
    render();
    alert("保存成功，页面已刷新。");
  } catch {
    alert("JSON格式有误，请检查后重试。");
  }
};

document.getElementById("resetAdmin").onclick = () => {
  saveData(defaultData);
  render();
};
