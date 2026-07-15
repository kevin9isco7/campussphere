const ApplicantApp = {
  application: null,

  async init() {
    requireSession();
    await buildLayout("dashboard");
    this.container = document.querySelector("#pageContent");
    await this.load();
  },

  async load() {
    this.container.innerHTML = `<section class="module-card applicant-shell"><p class="muted">Loading admission application...</p></section>`;
    try {
      const result = await Api.get("/applicant/application");
      this.application = result.application;
      this.render();
    } catch (error) {
      this.container.innerHTML = `<section class="module-card applicant-shell"><h1>Admission Application</h1><p class="muted">${escapeHtml(error.message)}</p></section>`;
    }
  },

  render() {
    const app = this.application;
    this.container.innerHTML = `
      <section class="page-header">
        <div>
          <p class="eyebrow">Student Admission</p>
          <h1>Admission Application</h1>
          <p class="muted">Application ${escapeHtml(app.application_no)} is currently <strong>${escapeHtml(app.status)}</strong>.</p>
        </div>
        <div class="toolbar">
          <button class="btn" id="refreshApplication" type="button">Refresh</button>
          <button class="btn btn-primary" id="submitApplication" type="button">Submit for verification</button>
        </div>
      </section>

      <section class="applicant-steps">
        ${this.step("1", "Account", "Created", true)}
        ${this.step("2", "Details", "Required", this.hasDetails())}
        ${this.step("3", "Documents", `${app.documents.length} uploaded`, app.documents.length > 0)}
        ${this.step("4", "Registration Fee", app.payment_status, app.payment_status === "Paid")}
        ${this.step("5", "Verification", app.status, ["Submitted", "Under Review", "Documents Verified", "Admitted", "Enrolled"].includes(app.status))}
      </section>

      <section class="applicant-grid">
        <article class="module-card applicant-shell">
          <div class="section-heading">
            <div>
              <h2>Applicant Details</h2>
              <p class="muted">Complete these fields before submitting.</p>
            </div>
          </div>
          <form class="form-stack" id="applicationForm">
            <div class="form-grid two">
              ${this.field("first_name", "First name", app.first_name)}
              ${this.field("last_name", "Last name", app.last_name)}
              ${this.field("date_of_birth", "Date of birth", app.date_of_birth, "date")}
              ${this.selectField("gender", "Gender", app.gender, ["Female", "Male", "Other"])}
              ${this.field("grade_applied", this.gradeLabel(), app.grade_applied)}
              ${this.field("guardian_name", "Guardian / Sponsor name", app.guardian_name)}
              ${this.field("guardian_phone", "Guardian / Sponsor phone", app.guardian_phone, "tel")}
              ${this.field("guardian_email", "Guardian / Sponsor email", app.guardian_email, "email", false)}
            </div>
            <label class="field">
              <span>Notes</span>
              <textarea class="input textarea" name="notes">${escapeHtml(app.notes)}</textarea>
            </label>
            <button class="btn btn-primary" type="submit">Save application details</button>
          </form>
        </article>

        <aside class="applicant-side">
          <article class="module-card">
            <h2>Registration Fee</h2>
            <p class="muted">This fee is non-refundable and must be recorded before submission.</p>
            <form class="form-stack" id="feeForm">
              <label class="field">
                <span>Amount paid</span>
                <input class="input" name="amount" type="number" min="1" step="0.01" value="${escapeHtml(app.registration_fee_amount === "0.00" ? "100.00" : app.registration_fee_amount)}" required>
              </label>
              <label class="field">
                <span>Payment reference</span>
                <input class="input" name="reference" value="${escapeHtml(app.registration_fee_reference)}" required>
              </label>
              <button class="btn" type="submit">Record payment</button>
            </form>
          </article>

          <article class="module-card">
            <h2>Upload Documents</h2>
            <p class="muted">Upload PDF or image documents for school verification.</p>
            <form class="form-stack" id="documentForm">
              <label class="field">
                <span>Document type</span>
                <select class="input" name="document_type">
                  ${["Birth Certificate", "Previous Report", "Passport Photo", "National ID", "Transcript", "Recommendation", "Other"].map((item) => `<option>${escapeHtml(item)}</option>`).join("")}
                </select>
              </label>
              <label class="field">
                <span>Document file</span>
                <input class="input" name="file" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" required>
              </label>
              <button class="btn" type="submit">Upload document</button>
            </form>
          </article>
        </aside>
      </section>

      <section class="module-card applicant-shell">
        <div class="section-heading">
          <div>
            <h2>Uploaded Documents</h2>
            <p class="muted">The admissions office will verify these files before admission.</p>
          </div>
        </div>
        ${this.documentsTable(app.documents)}
      </section>
    `;

    document.querySelector("#refreshApplication").addEventListener("click", () => this.load());
    document.querySelector("#applicationForm").addEventListener("submit", (event) => this.saveDetails(event));
    document.querySelector("#feeForm").addEventListener("submit", (event) => this.recordFee(event));
    document.querySelector("#documentForm").addEventListener("submit", (event) => this.uploadDocument(event));
    document.querySelector("#submitApplication").addEventListener("click", () => this.submit());
  },

  step(number, title, subtitle, complete) {
    return `
      <div class="applicant-step ${complete ? "complete" : ""}">
        <span>${escapeHtml(number)}</span>
        <strong>${escapeHtml(title)}</strong>
        <small>${escapeHtml(subtitle)}</small>
      </div>
    `;
  },

  gradeLabel() {
    const context = getPortalContext();
    return context.institution === "university" ? "Programme / Faculty" : "Grade / Class applying for";
  },

  hasDetails() {
    const app = this.application;
    return ["first_name", "last_name", "date_of_birth", "grade_applied", "guardian_name", "guardian_phone"].every((field) => {
      const value = String(app[field] || "").trim().toLowerCase();
      return value && value !== "pending";
    });
  },

  field(name, label, value, type = "text", required = true) {
    return `
      <label class="field">
        <span>${escapeHtml(label)}</span>
        <input class="input" name="${escapeHtml(name)}" type="${escapeHtml(type)}" value="${escapeHtml(value || "")}" ${required ? "required" : ""}>
      </label>
    `;
  },

  selectField(name, label, value, options) {
    return `
      <label class="field">
        <span>${escapeHtml(label)}</span>
        <select class="input" name="${escapeHtml(name)}" required>
          ${options.map((option) => `<option value="${escapeHtml(option)}" ${option === value ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
        </select>
      </label>
    `;
  },

  documentsTable(documents) {
    if (!documents.length) {
      return `<div class="empty-state">No documents uploaded yet.</div>`;
    }
    return `
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>File</th>
              <th>Status</th>
              <th>Uploaded</th>
            </tr>
          </thead>
          <tbody>
            ${documents.map((doc) => `
              <tr>
                <td>${escapeHtml(doc.document_type)}</td>
                <td><a href="${escapeHtml(this.documentHref(doc.file_path))}" target="_blank" rel="noopener">${escapeHtml(doc.file_name)}</a></td>
                <td><span class="status-pill">${escapeHtml(doc.status)}</span></td>
                <td>${escapeHtml(doc.created_at || "")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  },

  documentHref(path) {
    if (!path) return "#";
    if (/^https?:\/\//i.test(path)) return path;
    return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  },

  async saveDetails(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector("button");
    button.disabled = true;
    try {
      const result = await Api.put("/applicant/application", Object.fromEntries(new FormData(form)));
      this.application = result.application;
      toast(result.message);
      this.render();
    } catch (error) {
      toast(error.message);
    } finally {
      button.disabled = false;
    }
  },

  async recordFee(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector("button");
    button.disabled = true;
    try {
      const result = await Api.post("/applicant/registration-fee", Object.fromEntries(new FormData(form)));
      this.application = result.application;
      toast(result.message);
      this.render();
    } catch (error) {
      toast(error.message);
    } finally {
      button.disabled = false;
    }
  },

  async uploadDocument(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector("button");
    button.disabled = true;
    try {
      await Api.upload("/applicant/documents", new FormData(form), { timeoutMs: 60000 });
      toast("Document uploaded.");
      await this.load();
    } catch (error) {
      toast(error.message);
    } finally {
      button.disabled = false;
    }
  },

  async submit() {
    const button = document.querySelector("#submitApplication");
    button.disabled = true;
    button.textContent = "Submitting...";
    try {
      const result = await Api.post("/applicant/submit", {});
      this.application = result.application;
      toast(result.message);
      this.render();
    } catch (error) {
      toast(error.message);
    } finally {
      button.disabled = false;
      button.textContent = "Submit for verification";
    }
  },
};

document.addEventListener("DOMContentLoaded", () => ApplicantApp.init());
