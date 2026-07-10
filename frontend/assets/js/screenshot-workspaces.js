const EnhancedWorkspaces = {
  moduleKey: "",
  records: [],
  meta: null,
  state: {
    search: "",
    status: "",
    tab: "sms",
  },

  async init(moduleKey) {
    this.moduleKey = moduleKey;
    await buildLayout(moduleKey);
    const metaResult = await Api.get(`/modules/${moduleKey}/meta`);
    this.meta = metaResult.module;
    await this.loadRecords();
    this.render();
  },

  async loadRecords() {
    const params = new URLSearchParams({ per_page: 100, sort: "created_at", direction: "desc" });
    if (this.state.search) params.set("search", this.state.search);
    if (this.state.status) params.set("filters", `status:${this.state.status}`);
    const result = await Api.get(`/modules/${this.moduleKey}?${params.toString()}`);
    this.records = result.records;
  },

  render() {
    if (this.moduleKey === "admissions") this.renderAdmissions();
    if (this.moduleKey === "students") this.renderStudents();
    if (this.moduleKey === "communication") this.renderCommunication();
  },

  renderAdmissions() {
    const stats = admissionStats(this.records);
    document.querySelector("#pageContent").innerHTML = `
      <section class="page-header">
        <div>
          <h1>Admissions Management</h1>
          <p class="muted">Full pipeline: Application - Review - Interview - Decision - Enrollment.</p>
        </div>
        <div class="toolbar">
          <button class="btn" id="importAdmission">Import Excel</button>
          <button class="btn btn-primary" id="newRecord">Start New Admission</button>
        </div>
      </section>
      <section class="stats-grid compact-stats">
        ${renderKpi("New Applications", stats.submitted, "Awaiting review")}
        ${renderKpi("In Review", stats.reviewed, "Requires decision")}
        ${renderKpi("Interviews", stats.interviews, "Scheduled or completed")}
        ${renderKpi("Accepted", stats.accepted, "Awaiting enrollment")}
        ${renderKpi("Success Rate", `${stats.successRate}%`, `${stats.enrolled} enrolled`)}
      </section>
      <section class="pipeline-strip" aria-label="Admissions pipeline">
        <span data-width="${stats.total ? (stats.submitted / stats.total) * 100 : 0}"></span>
        <span data-width="${stats.total ? (stats.reviewed / stats.total) * 100 : 0}"></span>
        <span data-width="${stats.total ? (stats.accepted / stats.total) * 100 : 0}"></span>
        <span data-width="${stats.total ? (stats.enrolled / stats.total) * 100 : 0}"></span>
      </section>
      <section class="card data-card enhanced-card">
        <div class="card-toolbar">
          <div>
            <h2>Applicant Pipeline</h2>
            <p class="muted">Track applicants through every admissions stage.</p>
          </div>
          <div class="toolbar">
            <input class="input" id="workspaceSearch" placeholder="Search applicants...">
            <select class="select" id="statusFilter">
              <option value="">All Statuses</option>
              ${["Submitted", "Reviewed", "Accepted", "Rejected", "Enrolled"].map((status) => `<option value="${status}">${status}</option>`).join("")}
            </select>
            <button class="btn" id="exportCsv">Export CSV</button>
          </div>
        </div>
        <div class="table-wrap">${renderAdmissionsTable(this.records)}</div>
      </section>
      ${recordModalMarkup()}
    `;
    document.querySelectorAll(".pipeline-strip span").forEach((bar) => {
      bar.style.setProperty("--w", `${bar.dataset.width}%`);
    });
    this.bindCommonEvents(admissionFields());
    document.querySelector("#importAdmission").addEventListener("click", () => toast("Excel import workflow is ready for file mapping."));
  },

  renderStudents() {
    const stats = studentStats(this.records);
    document.querySelector("#pageContent").innerHTML = `
      <section class="page-header">
        <div>
          <h1>Student Directory</h1>
          <p class="muted">Comprehensive student records and real-time academic status.</p>
        </div>
        <div class="toolbar">
          <button class="btn" id="importStudents">Import</button>
          <button class="btn" id="printTable">Print</button>
          <button class="btn btn-primary" id="newRecord">New Student</button>
        </div>
      </section>
      <section class="stats-grid compact-stats">
        ${renderKpi("Total Students", stats.total, "All records")}
        ${renderKpi("Active", stats.active, "Currently enrolled")}
        ${renderKpi("Inactive", stats.inactive, "Not active")}
        ${renderKpi("New This Term", stats.newThisTerm, "Recent admissions")}
        ${renderKpi("Gender Ratio", `${stats.male}M / ${stats.female}F`, "Directory balance")}
      </section>
      <section class="card data-card enhanced-card">
        <div class="card-toolbar">
          <div class="toolbar">
            <input class="input" id="workspaceSearch" placeholder="Search by name or ID...">
            <select class="select" id="statusFilter">
              <option value="">All Statuses</option>
              ${["Active", "Inactive", "Graduated", "Transferred"].map((status) => `<option value="${status}">${status}</option>`).join("")}
            </select>
            <button class="btn" id="exportCsv">Export CSV</button>
          </div>
        </div>
        <div class="table-wrap">${renderStudentsTable(this.records)}</div>
      </section>
      ${recordModalMarkup()}
    `;
    this.bindCommonEvents(studentFields());
    document.querySelector("#importStudents").addEventListener("click", () => toast("Student import workspace is ready for CSV or Excel mapping."));
    document.querySelector("#printTable").addEventListener("click", () => window.print());
  },

  renderCommunication() {
    const stats = communicationStats(this.records);
    document.querySelector("#pageContent").innerHTML = `
      <section class="page-header">
        <div>
          <h1>Messaging & Notices</h1>
          <p class="muted">Create broadcasts, monitor SMS status, and review recent communication.</p>
        </div>
        <div class="toolbar">
          <button class="btn" id="exportCsv">Export CSV</button>
          <button class="btn btn-primary" id="newRecord">New Broadcast</button>
        </div>
      </section>
      <div class="workspace-tabs">
        <button class="${this.state.tab === "chat" ? "active" : ""}" data-tab="chat">Internal Chat</button>
        <button class="${this.state.tab === "sms" ? "active" : ""}" data-tab="sms">SMS / Email</button>
      </div>
      <section class="communication-grid">
        ${this.state.tab === "chat" ? renderChatPanel(this.records) : `<article class="card broadcast-card">
          <h2>Create Broadcast</h2>
          <p class="muted">Compose a message and select the target audience.</p>
          <form class="broadcast-form" id="quickBroadcastForm">
            <div class="segmented-control">
              <label><input type="radio" name="channel" value="SMS" checked><span>SMS</span></label>
              <label><input type="radio" name="channel" value="Email"><span>Email</span></label>
              <label><input type="radio" name="channel" value="Portal"><span>Portal</span></label>
            </div>
            <label class="field">
              <span>Target Audience</span>
              <select class="select" name="audience">
                ${["All", "Students", "Parents", "Teachers", "Staff"].map((item) => `<option value="${item}">${item}</option>`).join("")}
              </select>
            </label>
            <label class="field wide">
              <span>Subject</span>
              <input class="input" name="subject" placeholder="Broadcast subject" required>
            </label>
            <label class="field wide">
              <span>Message Content</span>
              <textarea class="textarea" name="body" placeholder="Type your SMS message here..." required></textarea>
            </label>
            <div class="broadcast-footer">
              <span class="muted" id="messageCounter">0 characters</span>
              <button class="btn btn-primary" type="submit">Send Broadcast</button>
            </div>
          </form>
        </article>`}
        <aside class="workspace-side">
          <article class="card status-card">
            <h2>System Status</h2>
            <div class="status-row"><span>SMS Gateway</span><strong class="online">Online</strong></div>
            <div class="status-row"><span>Available Credits</span><strong>${stats.credits}</strong></div>
            <div class="status-row"><span>Sent Messages</span><strong>${stats.sent}</strong></div>
          </article>
          <article class="card">
            <h2>Recent SMS Broadcasts</h2>
            <div class="recent-list">${renderRecentMessages(this.records)}</div>
          </article>
        </aside>
      </section>
      <section class="card data-card enhanced-card">
        <div class="card-toolbar">
          <div>
            <h2>Communication Log</h2>
            <p class="muted">Search sent, scheduled, and draft messages.</p>
          </div>
          <div class="toolbar">
            <input class="input" id="workspaceSearch" placeholder="Search messages...">
            <select class="select" id="statusFilter">
              <option value="">All Statuses</option>
              ${["Draft", "Scheduled", "Sent"].map((status) => `<option value="${status}">${status}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="table-wrap">${renderMessagesTable(this.records)}</div>
      </section>
      ${recordModalMarkup()}
    `;
    this.bindCommonEvents(messageFields());
    this.bindBroadcastEvents();
  },

  bindCommonEvents(fields) {
    document.querySelector("#newRecord")?.addEventListener("click", () => this.openModal(fields));
    document.querySelector("#closeModal")?.addEventListener("click", () => this.closeModal());
    document.querySelector("#recordModal")?.addEventListener("click", (event) => {
      if (event.target.id === "recordModal") this.closeModal();
    });
    document.querySelector("#recordForm")?.addEventListener("submit", (event) => this.saveRecord(event));
    document.querySelector("#workspaceSearch")?.addEventListener("input", debounce(async (event) => {
      this.state.search = event.target.value;
      await this.loadRecords();
      this.render();
    }, 300));
    document.querySelector("#statusFilter")?.addEventListener("change", async (event) => {
      this.state.status = event.target.value;
      await this.loadRecords();
      this.render();
    });
    document.querySelector("#exportCsv")?.addEventListener("click", () => exportRows(this.moduleKey, this.records));
    document.querySelectorAll("[data-edit-record]").forEach((button) => {
      button.addEventListener("click", () => this.editRecord(button.dataset.editRecord, fields));
    });
    document.querySelectorAll("[data-delete-record]").forEach((button) => {
      button.addEventListener("click", () => this.deleteRecord(button.dataset.deleteRecord));
    });
    document.querySelectorAll("[data-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        this.state.tab = button.dataset.tab;
        this.renderCommunication();
      });
    });
  },

  bindBroadcastEvents() {
    const form = document.querySelector("#quickBroadcastForm");
    const body = form?.querySelector("textarea[name='body']");
    body?.addEventListener("input", () => {
      document.querySelector("#messageCounter").textContent = `${body.value.length} characters`;
    });
    form?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      data.status = "Sent";
      try {
        await Api.post("/modules/communication", data);
        toast("Broadcast sent.");
        await this.loadRecords();
        this.renderCommunication();
      } catch (error) {
        toast(error.message);
      }
    });
  },

  openModal(fields, record = null) {
    document.querySelector("#modalTitle").textContent = record ? `Edit ${this.meta.title}` : `New ${this.meta.title}`;
    document.querySelector("#formFields").innerHTML = fields.map((field) => renderFormField(field, record || {})).join("");
    document.querySelector("#recordForm").dataset.editingId = record?.id || "";
    document.querySelector("#recordModal").classList.add("open");
  },

  closeModal() {
    document.querySelector("#recordModal").classList.remove("open");
    document.querySelector("#recordForm").reset();
    document.querySelector("#recordForm").dataset.editingId = "";
  },

  async editRecord(id, fields) {
    try {
      const result = await Api.get(`/modules/${this.moduleKey}/${id}`);
      this.openModal(fields, result.record);
    } catch (error) {
      toast(error.message);
    }
  },

  async saveRecord(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const editingId = form.dataset.editingId;
    try {
      if (editingId) {
        await Api.put(`/modules/${this.moduleKey}/${editingId}`, data);
        toast("Record updated.");
      } else {
        await Api.post(`/modules/${this.moduleKey}`, data);
        toast("Record created.");
      }
      this.closeModal();
      await this.loadRecords();
      this.render();
    } catch (error) {
      toast(error.message);
    }
  },

  async deleteRecord(id) {
    if (!confirm("Delete this record?")) return;
    try {
      await Api.delete(`/modules/${this.moduleKey}/${id}`);
      toast("Record deleted.");
      await this.loadRecords();
      this.render();
    } catch (error) {
      toast(error.message);
    }
  },
};

function renderKpi(title, value, caption) {
  return `<article class="card stat-card enhanced-stat"><span>${escapeHtml(title)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(caption)}</small></article>`;
}

function admissionStats(rows) {
  const total = rows.length;
  const count = (status) => rows.filter((row) => row.status === status).length;
  const enrolled = count("Enrolled");
  return {
    total,
    submitted: count("Submitted"),
    reviewed: count("Reviewed"),
    interviews: count("Reviewed") + count("Accepted"),
    accepted: count("Accepted"),
    enrolled,
    successRate: total ? Math.round((enrolled / total) * 100) : 0,
  };
}

function studentStats(rows) {
  const currentYear = new Date().getFullYear();
  return {
    total: rows.length,
    active: rows.filter((row) => row.status === "Active").length,
    inactive: rows.filter((row) => row.status === "Inactive").length,
    newThisTerm: rows.filter((row) => String(row.created_at || "").startsWith(String(currentYear))).length,
    male: rows.filter((row) => row.gender === "Male").length,
    female: rows.filter((row) => row.gender === "Female").length,
  };
}

function communicationStats(rows) {
  return {
    sent: rows.filter((row) => row.status === "Sent").length,
    credits: Math.max(0, 5000 - rows.filter((row) => row.channel === "SMS").length * 2),
  };
}

function renderAdmissionsTable(rows) {
  return `<table class="data-table">
    <thead><tr><th>App ID</th><th>Applicant</th><th>Grade</th><th>Guardian</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
    <tbody>${rows.length ? rows.map((row) => `<tr>
      <td data-label="App ID">${escapeHtml(row.application_no)}</td>
      <td data-label="Applicant"><div class="person-cell">${avatar(`${row.first_name} ${row.last_name}`)}<span><strong>${escapeHtml(`${row.first_name} ${row.last_name}`)}</strong><small>${escapeHtml(row.guardian_email || "No guardian email")}</small></span></div></td>
      <td data-label="Grade">${escapeHtml(row.grade_applied)}</td>
      <td data-label="Guardian">${escapeHtml(row.guardian_name)}</td>
      <td data-label="Date">${formatDate(row.created_at)}</td>
      <td data-label="Status">${statusBadge(row.status)}</td>
      <td data-label="Actions">${rowActions(row.id)}</td>
    </tr>`).join("") : emptyTable(7)}</tbody>
  </table>`;
}

function renderStudentsTable(rows) {
  return `<table class="data-table">
    <thead><tr><th>Photo</th><th>Student ID</th><th>Full Name</th><th>Gender</th><th>Email</th><th>Phone</th><th>Enrolled</th><th>Status</th><th>Actions</th></tr></thead>
    <tbody>${rows.length ? rows.map((row) => `<tr>
      <td data-label="Photo">${avatar(`${row.first_name} ${row.last_name}`)}</td>
      <td data-label="Student ID">${escapeHtml(row.admission_no)}</td>
      <td data-label="Full Name"><strong>${escapeHtml(`${row.first_name} ${row.last_name}`)}</strong></td>
      <td data-label="Gender">${escapeHtml(row.gender)}</td>
      <td data-label="Email">${escapeHtml(row.email || "-")}</td>
      <td data-label="Phone">${escapeHtml(row.phone || "-")}</td>
      <td data-label="Enrolled">${formatDate(row.created_at)}</td>
      <td data-label="Status">${statusBadge(row.status)}</td>
      <td data-label="Actions">${rowActions(row.id)}</td>
    </tr>`).join("") : emptyTable(9)}</tbody>
  </table>`;
}

function renderMessagesTable(rows) {
  return `<table class="data-table">
    <thead><tr><th>Subject</th><th>Channel</th><th>Audience</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
    <tbody>${rows.length ? rows.map((row) => `<tr>
      <td data-label="Subject"><strong>${escapeHtml(row.subject)}</strong></td>
      <td data-label="Channel">${escapeHtml(row.channel)}</td>
      <td data-label="Audience">${escapeHtml(row.audience)}</td>
      <td data-label="Status">${statusBadge(row.status)}</td>
      <td data-label="Date">${formatDate(row.created_at)}</td>
      <td data-label="Actions">${rowActions(row.id)}</td>
    </tr>`).join("") : emptyTable(6)}</tbody>
  </table>`;
}

function renderRecentMessages(rows) {
  const smsRows = rows.filter((row) => row.channel === "SMS").slice(0, 4);
  if (!smsRows.length) return `<div class="empty-state">No SMS broadcasts yet.</div>`;
  return smsRows.map((row) => `<article class="recent-item">
    <span>${escapeHtml(row.audience)}</span>
    <strong>${escapeHtml(row.subject)}</strong>
    <small>${escapeHtml(row.body || "")}</small>
    ${statusBadge(row.status)}
  </article>`).join("");
}

function renderChatPanel(rows) {
  const people = rows.slice(0, 6);
  return `<article class="card chat-card">
    <div>
      <h2>Internal Chat</h2>
      <p class="muted">Review recent staff, parent, and student conversations.</p>
    </div>
    <div class="chat-layout">
      <div class="chat-list">
        <input class="input" placeholder="Search chats..." aria-label="Search chats">
        ${people.length ? people.map((row) => `<button type="button" class="chat-person">
          ${avatar(row.subject || row.audience)}
          <span><strong>${escapeHtml(row.audience || "Campus")}</strong><small>${escapeHtml(row.subject || "No subject")}</small></span>
        </button>`).join("") : `<div class="empty-state">No conversations yet.</div>`}
      </div>
      <div class="chat-thread">
        <div class="chat-empty">
          <strong>No active conversation</strong>
          <span class="muted">Select a chat to review messages.</span>
        </div>
      </div>
    </div>
  </article>`;
}

function recordModalMarkup() {
  return `
    <div class="modal-backdrop" id="recordModal">
      <form class="modal" id="recordForm">
        <div class="modal-header">
          <h2 id="modalTitle">New Record</h2>
          <button type="button" class="btn icon-btn" id="closeModal">x</button>
        </div>
        <div class="form-grid" id="formFields"></div>
        <div class="modal-footer">
          <span class="muted">Complete required fields before saving.</span>
          <button class="btn btn-primary" type="submit">Save</button>
        </div>
      </form>
    </div>
  `;
}

function renderFormField(field, record) {
  const value = record[field.name] ?? field.value ?? "";
  const required = field.required ? "required" : "";
  const wide = field.type === "textarea" ? "wide" : "";
  if (field.type === "select") {
    return `<label class="field ${wide}"><span>${escapeHtml(field.label)}</span><select class="select" name="${field.name}" ${required}>
      <option value="">Select ${escapeHtml(field.label)}</option>
      ${field.options.map((option) => `<option value="${escapeHtml(option)}" ${option === value ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
    </select></label>`;
  }
  if (field.type === "textarea") {
    return `<label class="field wide"><span>${escapeHtml(field.label)}</span><textarea class="textarea" name="${field.name}" ${required}>${escapeHtml(value)}</textarea></label>`;
  }
  return `<label class="field ${wide}"><span>${escapeHtml(field.label)}</span><input class="input" type="${field.type || "text"}" name="${field.name}" value="${escapeHtml(value)}" ${required}></label>`;
}

function admissionFields() {
  return [
    { name: "application_no", label: "Application No", required: true, value: `APP-${Date.now().toString().slice(-6)}` },
    { name: "first_name", label: "First Name", required: true },
    { name: "last_name", label: "Last Name", required: true },
    { name: "date_of_birth", label: "Date of Birth", type: "date", required: true },
    { name: "gender", label: "Gender", type: "select", required: true, options: ["Female", "Male", "Other"] },
    { name: "grade_applied", label: "Grade / Programme", required: true },
    { name: "guardian_name", label: "Guardian", required: true },
    { name: "guardian_phone", label: "Guardian Phone", type: "tel", required: true },
    { name: "guardian_email", label: "Guardian Email", type: "email" },
    { name: "status", label: "Status", type: "select", required: true, options: ["Submitted", "Reviewed", "Accepted", "Rejected", "Enrolled"], value: "Submitted" },
    { name: "notes", label: "Notes", type: "textarea" },
  ];
}

function studentFields() {
  return [
    { name: "admission_no", label: "Student ID", required: true, value: `S-${Date.now().toString().slice(-4)}` },
    { name: "first_name", label: "First Name", required: true },
    { name: "last_name", label: "Last Name", required: true },
    { name: "date_of_birth", label: "Date of Birth", type: "date", required: true },
    { name: "gender", label: "Gender", type: "select", required: true, options: ["Female", "Male", "Other"] },
    { name: "class_id", label: "Class ID", type: "number" },
    { name: "email", label: "Email", type: "email" },
    { name: "phone", label: "Phone", type: "tel" },
    { name: "address", label: "Address", type: "textarea" },
    { name: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive", "Graduated", "Transferred"], value: "Active" },
  ];
}

function messageFields() {
  return [
    { name: "subject", label: "Subject", required: true },
    { name: "body", label: "Message", type: "textarea", required: true },
    { name: "channel", label: "Channel", type: "select", required: true, options: ["Email", "SMS", "Portal", "Push"], value: "SMS" },
    { name: "audience", label: "Audience", type: "select", required: true, options: ["All", "Students", "Parents", "Teachers", "Staff"], value: "All" },
    { name: "status", label: "Status", type: "select", required: true, options: ["Draft", "Scheduled", "Sent"], value: "Draft" },
  ];
}

function avatar(name) {
  const initials = String(name || "?").split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  return `<span class="avatar">${escapeHtml(initials || "?")}</span>`;
}

function personCell(name, subtext) {
  return `<div class="person-cell">${avatar(name)}<span><strong>${escapeHtml(name)}</strong><small>${escapeHtml(subtext || "")}</small></span></div>`;
}

function statusBadge(status) {
  return `<span class="badge status-${String(status || "").toLowerCase().replace(/\s+/g, "-")}">${escapeHtml(status || "-")}</span>`;
}

function rowActions(id) {
  return `<div class="row-actions"><button class="btn" data-edit-record="${id}">Edit</button><button class="btn btn-danger" data-delete-record="${id}">Delete</button></div>`;
}

function emptyTable(colspan) {
  return `<tr><td colspan="${colspan}"><div class="empty-state">No records yet.</div></td></tr>`;
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value).slice(0, 10) : date.toLocaleDateString();
}

function exportRows(moduleKey, rows) {
  if (!rows.length) {
    toast("No records to export.");
    return;
  }
  const columns = Object.keys(rows[0]);
  const lines = [columns.join(",")];
  rows.forEach((row) => lines.push(columns.map((column) => `"${String(row[column] ?? "").replaceAll('"', '""')}"`).join(",")));
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${moduleKey}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function debounce(fn, wait) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("[data-module]");
  const enhanced = ["admissions", "students", "communication"];
  if (root && enhanced.includes(root.dataset.module)) {
    EnhancedWorkspaces.init(root.dataset.module).catch((error) => toast(error.message));
  }
});
