const CrudPage = {
  moduleKey: null,
  meta: null,
  records: [],
  state: {
    page: 1,
    perPage: 10,
    search: "",
    filters: "",
    sort: "id",
    direction: "desc",
    editingId: null,
  },

  async init(moduleKey) {
    this.moduleKey = moduleKey;
    await buildLayout(moduleKey);
    await this.loadMeta();
    this.renderShell();
    await this.loadRecords();
  },

  async loadMeta() {
    const result = await Api.get(`/modules/${this.moduleKey}/meta`);
    this.meta = result.module;
  },

  renderShell() {
    const page = document.querySelector("#pageContent");
    page.innerHTML = `
      <div class="page-header">
        <div>
          <h1>${escapeHtml(this.meta.title)}</h1>
          <p class="muted">Create, search, filter, sort, export, print, update, and delete ${escapeHtml(this.meta.title.toLowerCase())} records.</p>
        </div>
        <div class="toolbar">
          <button class="btn" id="exportCsv">Export CSV</button>
          <button class="btn" id="printTable">Print</button>
          <button class="btn btn-primary" id="newRecord">New Record</button>
        </div>
      </div>
      ${this.moduleKey === "reports" ? `<div class="card" id="reportRunner"></div>` : ""}
      <section class="card data-card">
        <div class="toolbar crud-filter-toolbar">
          <input class="input module-search-input" id="moduleSearch" placeholder="Search ${escapeHtml(this.meta.title)}...">
          <select class="select module-filter-select" id="moduleFilter">
            <option value="">All records</option>
            ${this.filterOptions()}
          </select>
          <select class="select per-page-select" id="perPage">
            <option value="10">10 rows</option>
            <option value="25">25 rows</option>
            <option value="50">50 rows</option>
            <option value="100">100 rows</option>
          </select>
          <button class="btn" id="refreshTable">Refresh</button>
        </div>
        <div class="table-wrap" id="tableWrap"></div>
        <div class="pagination" id="pagination"></div>
      </section>
      <div class="modal-backdrop" id="recordModal">
        <form class="modal" id="recordForm">
          <div class="modal-header">
            <h2 id="modalTitle">New Record</h2>
            <button type="button" class="btn icon-btn" id="closeModal">x</button>
          </div>
          <div class="form-grid" id="formFields"></div>
          <div class="modal-footer">
            <span class="muted" id="formHint">Required fields must be completed.</span>
            <button class="btn btn-primary" type="submit">Save</button>
          </div>
        </form>
      </div>
    `;

    this.bindEvents();
    this.renderForm();
    if (this.moduleKey === "reports") this.renderReportRunner();
  },

  bindEvents() {
    document.querySelector("#newRecord").addEventListener("click", () => this.openModal());
    document.querySelector("#closeModal").addEventListener("click", () => this.closeModal());
    document.querySelector("#recordModal").addEventListener("click", (event) => {
      if (event.target.id === "recordModal") this.closeModal();
    });
    document.querySelector("#recordForm").addEventListener("submit", (event) => this.saveRecord(event));
    document.querySelector("#moduleSearch").addEventListener("input", debounce((event) => {
      this.state.search = event.target.value;
      this.state.page = 1;
      this.loadRecords();
    }, 300));
    document.querySelector("#perPage").addEventListener("change", (event) => {
      this.state.perPage = Number(event.target.value);
      this.state.page = 1;
      this.loadRecords();
    });
    document.querySelector("#moduleFilter").addEventListener("change", (event) => {
      this.state.filters = event.target.value;
      this.state.page = 1;
      this.loadRecords();
    });
    document.querySelector("#refreshTable").addEventListener("click", () => this.loadRecords());
    document.querySelector("#exportCsv").addEventListener("click", () => this.exportCsv());
    document.querySelector("#printTable").addEventListener("click", () => window.print());
  },

  renderForm(record = {}) {
    const fields = Object.entries(this.meta.fields)
      .map(([name, definition]) => {
        const label = definition.label || formatLabel(name);
        const required = definition.required ? "required" : "";
        const value = record[name] ?? "";
        const wide = definition.type === "textarea" ? "wide" : "";
        let control = "";
        if (definition.type === "select") {
          control = `<select class="select" name="${name}" ${required}>
            <option value="">Select ${escapeHtml(label)}</option>
            ${(definition.options || []).map((option) => `<option value="${escapeHtml(option)}" ${option === value ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
          </select>`;
        } else if (definition.type === "textarea") {
          control = `<textarea class="textarea" name="${name}" ${required}>${escapeHtml(value)}</textarea>`;
        } else {
          control = `<input class="input" name="${name}" type="${definition.type || "text"}" value="${escapeHtml(value)}" ${required}>`;
        }
        return `<label class="field ${wide}"><span>${escapeHtml(label)}</span>${control}</label>`;
      })
      .join("");
    document.querySelector("#formFields").innerHTML = fields;
  },

  async loadRecords() {
    const params = new URLSearchParams({
      page: this.state.page,
      per_page: this.state.perPage,
      search: this.state.search,
      sort: this.state.sort,
      direction: this.state.direction,
    });
    if (this.state.filters) params.set("filters", this.state.filters);
    try {
      const result = await Api.get(`/modules/${this.moduleKey}?${params.toString()}`);
      this.records = result.records;
      this.renderTable();
      this.renderPagination(result.pagination);
    } catch (error) {
      toast(error.message);
    }
  },

  renderTable() {
    const columns = [...new Set(["id", ...this.meta.list])];
    const body = this.records.length
      ? this.records
          .map((row) => `<tr>
            ${columns.map((column) => `<td data-label="${escapeHtml(formatLabel(column))}">${this.renderCell(row[column])}</td>`).join("")}
            <td data-label="Actions"><div class="row-actions">
              <button class="btn" data-edit="${row.id}">Edit</button>
              <button class="btn btn-danger" data-delete="${row.id}">Delete</button>
            </div></td>
          </tr>`)
          .join("")
      : `<tr><td colspan="${columns.length + 1}"><div class="empty-state">No records found.</div></td></tr>`;

    document.querySelector("#tableWrap").innerHTML = `<table class="data-table">
      <thead><tr>
        ${columns.map((column) => `<th data-sort="${column}">${escapeHtml(formatLabel(column))}</th>`).join("")}
        <th>Actions</th>
      </tr></thead>
      <tbody>${body}</tbody>
    </table>`;

    document.querySelectorAll("[data-sort]").forEach((header) => {
      header.addEventListener("click", () => {
        const sort = header.dataset.sort;
        this.state.direction = this.state.sort === sort && this.state.direction === "asc" ? "desc" : "asc";
        this.state.sort = sort;
        this.loadRecords();
      });
    });
    document.querySelectorAll("[data-edit]").forEach((button) => button.addEventListener("click", () => this.editRecord(button.dataset.edit)));
    document.querySelectorAll("[data-delete]").forEach((button) => button.addEventListener("click", () => this.deleteRecord(button.dataset.delete)));
  },

  renderCell(value) {
    if (value === null || value === undefined || value === "") return `<span class="muted">-</span>`;
    const text = escapeHtml(value);
    if (["Active", "Current", "Present", "Paid", "Published", "Approved", "Available", "Sent"].includes(String(value))) {
      return `<span class="badge">${text}</span>`;
    }
    return text;
  },

  filterOptions() {
    return Object.entries(this.meta.fields)
      .filter(([_name, definition]) => definition.type === "select" && Array.isArray(definition.options))
      .flatMap(([name, definition]) => definition.options.map((option) => `<option value="${name}:${escapeHtml(option)}">${escapeHtml(formatLabel(name))}: ${escapeHtml(option)}</option>`))
      .join("");
  },

  renderPagination(pagination) {
    document.querySelector("#pagination").innerHTML = `
      <span class="muted">Page ${pagination.page} of ${pagination.pages || 1} - ${pagination.total} records</span>
      <div class="toolbar">
        <button class="btn" id="prevPage" ${pagination.page <= 1 ? "disabled" : ""}>Previous</button>
        <button class="btn" id="nextPage" ${pagination.page >= pagination.pages ? "disabled" : ""}>Next</button>
      </div>
    `;
    document.querySelector("#prevPage").addEventListener("click", () => {
      this.state.page -= 1;
      this.loadRecords();
    });
    document.querySelector("#nextPage").addEventListener("click", () => {
      this.state.page += 1;
      this.loadRecords();
    });
  },

  openModal(record = null) {
    this.state.editingId = record?.id || null;
    document.querySelector("#modalTitle").textContent = record ? `Edit ${this.meta.title}` : `New ${this.meta.title}`;
    this.renderForm(record || {});
    document.querySelector("#recordModal").classList.add("open");
  },

  closeModal() {
    document.querySelector("#recordModal").classList.remove("open");
    document.querySelector("#recordForm").reset();
    this.state.editingId = null;
  },

  async editRecord(id) {
    try {
      const result = await Api.get(`/modules/${this.moduleKey}/${id}`);
      this.openModal(result.record);
    } catch (error) {
      toast(error.message);
    }
  },

  async saveRecord(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      if (this.state.editingId) {
        await Api.put(`/modules/${this.moduleKey}/${this.state.editingId}`, data);
        toast("Record updated.");
      } else {
        await Api.post(`/modules/${this.moduleKey}`, data);
        toast("Record created.");
      }
      this.closeModal();
      await this.loadRecords();
    } catch (error) {
      toast(error.message);
    }
  },

  async deleteRecord(id) {
    if (!confirm("Delete this record? This action cannot be undone.")) return;
    try {
      await Api.delete(`/modules/${this.moduleKey}/${id}`);
      toast("Record deleted.");
      await this.loadRecords();
    } catch (error) {
      toast(error.message);
    }
  },

  exportCsv() {
    const columns = [...new Set(["id", ...this.meta.list])];
    const lines = [columns.join(",")];
    this.records.forEach((row) => {
      lines.push(columns.map((column) => `"${String(row[column] ?? "").replaceAll('"', '""')}"`).join(","));
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${this.moduleKey}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  },

  renderReportRunner() {
    const reports = ["attendance", "students", "teachers", "finance", "library", "hostel", "transport", "exams"];
    document.querySelector("#reportRunner").innerHTML = `
      <h2>Operational Reports</h2>
      <div class="report-buttons">${reports.map((report) => `<button class="btn" data-report="${report}">${escapeHtml(formatLabel(report))}</button>`).join("")}</div>
      <div class="table-wrap" id="reportOutput"></div>
    `;
    document.querySelectorAll("[data-report]").forEach((button) => {
      button.addEventListener("click", () => this.runReport(button.dataset.report));
    });
  },

  async runReport(type) {
    try {
      const result = await Api.get(`/reports/${type}`);
      const rows = result.rows;
      const output = document.querySelector("#reportOutput");
      if (!rows.length) {
        output.innerHTML = `<div class="empty-state">No report rows found.</div>`;
        return;
      }
      const columns = Object.keys(rows[0]);
      output.innerHTML = `<table class="data-table">
        <thead><tr>${columns.map((column) => `<th>${escapeHtml(formatLabel(column))}</th>`).join("")}</tr></thead>
        <tbody>${rows.map((row) => `<tr>${columns.map((column) => `<td data-label="${escapeHtml(formatLabel(column))}">${this.renderCell(row[column])}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>`;
    } catch (error) {
      toast(error.message);
    }
  },
};

function debounce(fn, wait) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("[data-module]");
  if (root && root.dataset.module !== "dashboard") {
    CrudPage.init(root.dataset.module).catch((error) => toast(error.message));
  }
});
