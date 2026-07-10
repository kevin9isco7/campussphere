async function renderDashboard() {
  await buildLayout("dashboard");
  const page = document.querySelector("#pageContent");
  const context = getDashboardContext();
  const title = context.dashboardTitle || "Dashboard";
  const description = context.institutionName && context.roleName
    ? `${context.institutionName} ${context.roleName} portal overview across the modules available to this access path.`
    : "Operational overview across admissions, academics, finance, and services.";
  page.innerHTML = `
    <div class="page-header">
      <div>
        <h1>${escapeHtml(title)}</h1>
        <p class="muted">${escapeHtml(description)}</p>
      </div>
      <div class="toolbar">
        <button class="btn" id="printDashboard">Print</button>
        <button class="btn btn-primary" id="refreshDashboard">Refresh</button>
      </div>
    </div>
    <section class="stats-grid" id="statsGrid"></section>
    <section class="grid-2">
      <div class="card"><h2>Attendance Mix</h2><div id="attendanceChart" class="chart-bars"></div></div>
      <div class="card"><h2>Finance Status</h2><div id="financeChart" class="chart-bars"></div></div>
      <div class="card data-card grid-span-full"><h2>Recently Enrolled Students</h2><div class="table-wrap" id="recentStudents"></div></div>
    </section>
  `;

  async function load() {
    try {
      const result = await Api.get("/dashboard/summary");
      document.querySelector("#statsGrid").innerHTML = result.cards
        .map((card) => `<article class="card stat-card"><span>${escapeHtml(card.label)}</span><strong>${escapeHtml(card.value)}</strong></article>`)
        .join("");
      renderBars("#attendanceChart", result.charts.attendance, "status");
      renderBars("#financeChart", result.charts.finance, "status");
      renderRecent(result.recent_students);
    } catch (error) {
      toast(error.message);
    }
  }

  document.querySelector("#printDashboard").addEventListener("click", () => window.print());
  document.querySelector("#refreshDashboard").addEventListener("click", load);
  load();
}

function renderBars(selector, rows, labelKey) {
  const node = document.querySelector(selector);
  if (!rows.length) {
    node.innerHTML = `<div class="empty-state">No records yet.</div>`;
    return;
  }
  const max = Math.max(...rows.map((row) => Number(row.total)));
  node.innerHTML = rows
    .map((row) => {
      const width = max ? (Number(row.total) / max) * 100 : 0;
      return `<div class="chart-row"><span>${escapeHtml(row[labelKey])}</span><div class="bar"><span class="bar-fill" data-width="${width}"></span></div><strong>${escapeHtml(row.total)}</strong></div>`;
    })
    .join("");
  node.querySelectorAll(".bar-fill").forEach((bar) => {
    bar.style.width = `${bar.dataset.width}%`;
  });
}

function renderRecent(rows) {
  const node = document.querySelector("#recentStudents");
  if (!rows.length) {
    node.innerHTML = `<div class="empty-state">No student records yet.</div>`;
    return;
  }
  node.innerHTML = `<table class="data-table">
    <thead><tr><th>Admission No</th><th>Name</th><th>Created</th></tr></thead>
    <tbody>${rows
      .map((row) => `<tr><td>${escapeHtml(row.admission_no)}</td><td>${escapeHtml(row.first_name)} ${escapeHtml(row.last_name)}</td><td>${escapeHtml(row.created_at)}</td></tr>`)
      .join("")}</tbody>
  </table>`;
}

document.addEventListener("DOMContentLoaded", renderDashboard);

function getDashboardContext() {
  try {
    return JSON.parse(sessionStorage.getItem("portalContext") || "{}");
  } catch (_error) {
    return {};
  }
}
