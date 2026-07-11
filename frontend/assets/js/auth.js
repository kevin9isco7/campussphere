function authSvg(paths) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths}</svg>`;
}

const AuthIcons = {
  school: authSvg('<path d="M3 21h18"></path><path d="M5 21V7l7-4 7 4v14"></path><path d="M9 21v-6h6v6"></path>'),
  university: authSvg('<path d="M22 10 12 5 2 10l10 5 10-5Z"></path><path d="M6 12v5c3 2 9 2 12 0v-5"></path>'),
  student: authSvg('<path d="M22 10 12 5 2 10l10 5 10-5Z"></path><path d="M6 12v5c3 2 9 2 12 0v-5"></path>'),
  teacher: authSvg('<rect x="3" y="4" width="18" height="13" rx="2"></rect><path d="M8 21h8"></path><path d="M12 17v4"></path><path d="M8 9h8"></path>'),
  parent: authSvg('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.9"></path>'),
  admin: authSvg('<path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6l-8-4Z"></path><path d="m9 12 2 2 4-5"></path>'),
  finance: authSvg('<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 10h18"></path><path d="M8 15h1"></path><path d="M12 15h4"></path>'),
  library: authSvg('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z"></path>'),
  people: authSvg('<path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"></path><circle cx="9.5" cy="7" r="4"></circle><path d="M19 8v6"></path><path d="M22 11h-6"></path>'),
  registrar: authSvg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"></path><path d="M14 2v6h6"></path><path d="M8 13h8"></path>'),
  dean: authSvg('<path d="M3 21h18"></path><path d="M4 10h16"></path><path d="M6 10V7l6-4 6 4v3"></path><path d="M8 21v-7"></path><path d="M16 21v-7"></path>'),
  hod: authSvg('<path d="M4 19V5"></path><path d="M4 19h16"></path><path d="M8 16v-4"></path><path d="M12 16V8"></path><path d="M16 16v-6"></path>'),
};

const AuthFlow = {
  institutions: {
    secondary: {
      key: "secondary",
      name: "Secondary School",
      icon: AuthIcons.school,
      badge: "School Operations",
      headline: "Run learner records, guardians, classes, finance, and daily school services.",
      scope: "Best for basic, junior, senior, and K-12 institutions that need tight control over learners, guardians, classes, fees, daily attendance, and school services.",
      description:
        "Manage secondary school operations including students, teachers, parents, attendance, examinations, finance, library, transport, hostel, and administration.",
      capabilities: ["SIS", "Parents", "Attendance", "Fees", "Library", "Transport"],
      moduleGroups: [
        { label: "Learner Lifecycle", items: ["Admissions", "Student Profiles", "Parents", "Promotion"] },
        { label: "Daily Operations", items: ["Attendance", "Timetable", "Assignments", "Exams"] },
        { label: "School Services", items: ["Fees", "Library", "Transport", "Hostel"] },
      ],
      assurance: ["Guardian visibility", "Daily registers", "Fee collection"],
      metrics: [
        { value: "K-12", label: "Academic model" },
        { value: "7", label: "Portal roles" },
        { value: "18+", label: "School modules" },
      ],
      roles: [
        { key: "student", name: "Student", icon: AuthIcons.student, email: "secondary.student@campus.local", description: "Access learning records, assignments, attendance, results, fees, and services." },
        { key: "teacher", name: "Teacher", icon: AuthIcons.teacher, email: "secondary.teacher@campus.local", description: "Manage classes, attendance, assignments, examinations, and student progress." },
        { key: "parent", name: "Parent", icon: AuthIcons.parent, email: "secondary.parent@campus.local", description: "Monitor learner attendance, performance, invoices, communication, and services." },
        { key: "administrator", name: "School Administrator", icon: AuthIcons.admin, email: "secondary.admin@campus.local", description: "Control K-12 operations, guardians, teachers, classes, fees, services, users, and reports." },
        { key: "accountant", name: "Accountant", icon: AuthIcons.finance, email: "secondary.accountant@campus.local", description: "Manage invoices, payments, payroll, fee reports, and finance controls." },
        { key: "librarian", name: "Librarian", icon: AuthIcons.library, email: "secondary.librarian@campus.local", description: "Manage catalogues, inventory, loans, returns, and library reports." },
        { key: "hr", name: "HR Officer", icon: AuthIcons.people, email: "secondary.hr@campus.local", description: "Manage employees, staff records, payroll inputs, and HR reports." },
      ],
    },
    university: {
      key: "university",
      name: "University",
      icon: AuthIcons.university,
      badge: "Higher Education",
      headline: "Coordinate faculties, departments, registrar workflows, and campus services.",
      scope: "Best for universities, colleges, institutes, and multi-faculty campuses that need registrar workflows, departmental control, lecturer portals, courses, examinations, and student services.",
      description:
        "Manage faculties, departments, lecturers, students, registrar services, examinations, finance, hostel, library, and academic administration.",
      capabilities: ["Registrar", "Faculties", "Departments", "Courses", "Lecturers", "Hostel"],
      moduleGroups: [
        { label: "Academic Governance", items: ["Faculties", "Departments", "Courses", "Curriculum"] },
        { label: "Registrar Services", items: ["Admissions", "Student Records", "Registration", "Transcripts"] },
        { label: "Campus Services", items: ["Finance", "Hostel", "Library", "Transport"] },
      ],
      assurance: ["Faculty hierarchy", "Registrar control", "Department portals"],
      metrics: [
        { value: "HE", label: "Institution model" },
        { value: "9", label: "Portal roles" },
        { value: "20+", label: "University modules" },
      ],
      roles: [
        { key: "student", name: "Student", icon: AuthIcons.student, email: "university.student@campus.local", description: "Access courses, results, finance, library, hostel, and academic services." },
        { key: "lecturer", name: "Lecturer", icon: AuthIcons.teacher, email: "university.lecturer@campus.local", description: "Manage course delivery, attendance, assessments, results, and communication." },
        { key: "administrator", name: "University Administrator", icon: AuthIcons.admin, email: "university.admin@campus.local", description: "Manage registrar services, faculties, departments, lecturers, student records, finance, and campus governance." },
        { key: "registrar", name: "Registrar", icon: AuthIcons.registrar, email: "university.registrar@campus.local", description: "Manage admissions, student records, registration, examinations, and transcripts." },
        { key: "dean", name: "Dean", icon: AuthIcons.dean, email: "university.dean@campus.local", description: "Oversee faculties, departments, academic quality, staff, and institutional reports." },
        { key: "hod", name: "Head of Department", icon: AuthIcons.hod, email: "university.hod@campus.local", description: "Coordinate department staff, courses, curriculum, timetable, and results." },
        { key: "accountant", name: "Accountant", icon: AuthIcons.finance, email: "university.accountant@campus.local", description: "Manage student billing, payments, payroll, budgets, and financial reports." },
        { key: "librarian", name: "Librarian", icon: AuthIcons.library, email: "university.librarian@campus.local", description: "Manage library inventory, catalogues, lending, returns, and analytics." },
        { key: "hr", name: "HR Officer", icon: AuthIcons.people, email: "university.hr@campus.local", description: "Manage personnel records, employee lifecycle, payroll support, and HR reports." },
      ],
    },
  },

  state: {
    institution: readSessionValue("selectedInstitution"),
    role: readSessionValue("selectedRole"),
  },
  branding: {},

  async init() {
    const root = document.querySelector("#authRoot");
    if (!root) return;
    if (new URLSearchParams(location.search).get("logout") === "1") {
      Api.clearToken();
      sessionStorage.removeItem("portalContext");
      sessionStorage.removeItem("selectedInstitution");
      sessionStorage.removeItem("selectedRole");
      history.replaceState(null, "", location.pathname);
    }
    if (Api.token()) {
      location.href = "pages/dashboard/index.html";
      return;
    }
    this.root = root;
    this.loadCachedBranding();
    this.renderInstitutionSelection();
    this.refreshBranding();
  },

  loadCachedBranding() {
    const cached = readJsonStorage("campussphere.publicBranding");
    if (cached && typeof cached === "object") {
      this.branding = cached;
      this.applyBranding();
    }
  },

  async refreshBranding() {
    try {
      const query = this.state.institution ? `?institution=${encodeURIComponent(this.state.institution)}` : "";
      const result = await Api.get(`/public/settings${query}`, { timeoutMs: 8000 });
      this.branding = result.settings || {};
      writeJsonStorage("campussphere.publicBranding", this.branding);
      this.applyBranding();
      this.updateBrandNodes();
    } catch (_error) {
      this.applyBranding();
    }
  },

  applyBranding() {
    if (this.branding.brand_color) {
      document.documentElement.style.setProperty("--primary", this.branding.brand_color);
    }
    if (this.branding.favicon) {
      let favicon = document.querySelector("link[rel='icon']");
      if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        document.head.appendChild(favicon);
      }
      favicon.href = this.branding.favicon;
    }
  },

  updateBrandNodes() {
    if (!this.root) return;
    const logo = resolveAuthAsset(this.branding.school_logo, "assets/images/logo.svg");
    const name = this.branding.school_name || "CampusSphere Enterprise";
    this.root.querySelectorAll(".auth-brand img").forEach((image) => {
      image.src = logo;
    });
    this.root.querySelectorAll(".auth-brand strong").forEach((node) => {
      node.textContent = name;
    });
  },

  saveContext(institutionKey, roleKey = "") {
    this.state.institution = institutionKey;
    this.state.role = roleKey;
    try {
      sessionStorage.setItem("selectedInstitution", institutionKey);
      if (roleKey) {
        sessionStorage.setItem("selectedRole", roleKey);
      } else {
        sessionStorage.removeItem("selectedRole");
      }
    } catch (_error) {
      // The in-memory state is enough for the current flow if session storage is unavailable.
    }
  },

  renderInstitutionSelection() {
    const institutions = Object.values(this.institutions);
    this.root.innerHTML = `
      <section class="access-page ${this.hasBackgroundMedia() ? "with-media" : ""}">
        ${this.backgroundMarkup()}
        <div class="access-shell standard-access-shell">
          ${this.brandMarkup()}
          <div class="access-heading standard-access-heading">
            <span class="eyebrow">Institution Access</span>
            <h1>Welcome to CampusSphere Enterprise</h1>
            <p>Select the institution workspace that matches your academic structure.</p>
          </div>
          <div class="institution-grid standard-institution-grid">
            ${institutions.map((institution) => this.institutionCard(institution)).join("")}
          </div>
        </div>
      </section>
    `;

    this.root.querySelectorAll("[data-institution]").forEach((card) => {
      card.addEventListener("click", () => this.chooseInstitution(card.dataset.institution));
    });
    this.root.querySelectorAll("[data-continue-institution]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        this.continueInstitution(button.dataset.continueInstitution);
      });
    });
  },

  institutionCard(institution) {
    const selected = this.state.institution === institution.key ? "selected" : "";
    const focusAreas = institution.moduleGroups.slice(0, 3);
    return `
      <article class="selection-card institution-card standard-institution ${selected}" data-kind="${institution.key}" data-institution="${institution.key}" tabindex="0">
        <div class="standard-institution-top">
          <span class="selection-icon">${institution.icon}</span>
          <span class="institution-badge">${escapeHtml(institution.badge)}</span>
        </div>
        <div class="institution-body standard-institution-body">
          <div>
            <h2>${escapeHtml(institution.name)}</h2>
            <p class="institution-headline">${escapeHtml(institution.headline)}</p>
          </div>
          <div class="institution-focus-list">
            ${focusAreas.map((group) => `<span>${escapeHtml(group.label)}</span>`).join("")}
          </div>
          <button class="btn btn-primary institution-continue" data-continue-institution="${institution.key}" type="button">Continue</button>
        </div>
      </article>
    `;
  },

  chooseInstitution(institutionKey) {
    this.saveContext(institutionKey);
    this.renderInstitutionSelection();
    this.refreshBranding();
  },

  continueInstitution(institutionKey) {
    this.saveContext(institutionKey);
    this.renderPortalSelection();
    this.refreshBranding();
  },

  renderPortalSelection() {
    const institution = this.institutions[this.state.institution];
    if (!institution) {
      this.renderInstitutionSelection();
      return;
    }

    this.root.innerHTML = `
      <section class="access-page ${this.hasBackgroundMedia() ? "with-media" : ""}">
        ${this.backgroundMarkup()}
        <div class="access-shell wide">
          ${this.brandMarkup()}
          <button class="btn back-link" id="backToInstitutions" type="button">Back</button>
          <div class="access-heading">
            <span class="eyebrow">${escapeHtml(institution.name)}</span>
            <h1>Select Your Portal</h1>
            <p>Welcome to CampusSphere Enterprise. Choose your portal to continue.</p>
          </div>
          <div class="portal-grid">
            ${institution.roles.map((role) => this.portalCard(role)).join("")}
          </div>
        </div>
      </section>
    `;

    this.root.querySelector("#backToInstitutions").addEventListener("click", () => this.renderInstitutionSelection());
    this.root.querySelectorAll("[data-role]").forEach((card) => {
      card.addEventListener("click", () => this.selectRole(card.dataset.role));
    });
  },

  portalCard(role) {
    return `
      <article class="selection-card portal-card" data-role="${role.key}" tabindex="0">
        <div class="portal-icon">${role.icon}</div>
        <div>
          <h2>${escapeHtml(role.name)}</h2>
          <p>${escapeHtml(role.description)}</p>
        </div>
        <span class="arrow-icon">-&gt;</span>
      </article>
    `;
  },

  selectRole(roleKey) {
    this.saveContext(this.state.institution, roleKey);
    this.renderLogin();
  },

  renderLogin() {
    const institution = this.institutions[this.state.institution];
    const role = institution?.roles.find((item) => item.key === this.state.role);
    if (!institution || !role) {
      this.renderInstitutionSelection();
      return;
    }

    this.root.innerHTML = `
      <main class="auth-page contextual-login ${this.hasBackgroundMedia() ? "with-media" : ""}">
        ${this.backgroundMarkup()}
        <section class="auth-panel">
          ${this.brandMarkup()}
          <button class="btn back-link" id="backToPortals" type="button">Back to portals</button>
          <span class="eyebrow">${escapeHtml(institution.name)}</span>
          <h1>${escapeHtml(role.name)} Login</h1>
          <p class="muted">Sign in to continue to the ${escapeHtml(institution.name)} ${escapeHtml(role.name)} dashboard.</p>
          <form class="form-stack" id="loginForm">
            <label class="field">
              <span>Email</span>
              <input class="input" name="email" type="email" value="${escapeHtml(role.email || "")}" autocomplete="email" required>
            </label>
            <label class="field">
              <span>Password</span>
              <input class="input" name="password" type="password" value="Campus@2026" autocomplete="current-password" required>
            </label>
            <button class="btn btn-primary" type="submit">Sign in</button>
          </form>
        </section>
        <section class="auth-visual" aria-hidden="true">
          <div class="login-context-card">
            <span class="context-icon">${role.icon}</span>
            <h2>${escapeHtml(institution.name)}</h2>
            <strong>${escapeHtml(role.name)} Portal</strong>
            <p>${escapeHtml(role.description)}</p>
          </div>
        </section>
      </main>
    `;

    this.root.querySelector("#backToPortals").addEventListener("click", () => this.renderPortalSelection());
    this.root.querySelector("#loginForm").addEventListener("submit", (event) => this.login(event));
  },

  async login(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector("button[type='submit']");
    button.disabled = true;
    button.textContent = "Signing in...";
    try {
      const result = await Api.post("/auth/login", {
        email: form.email.value.trim(),
        password: form.password.value,
        institution: this.state.institution,
        portal_role: this.state.role,
      });
      Api.setToken(result.token);
      Api.setUser(result.user);
      try {
        sessionStorage.setItem("portalContext", JSON.stringify(this.getContext()));
      } catch (_error) {
        // The dashboard can still load using the authenticated user when session storage is unavailable.
      }
      location.href = this.dashboardPath();
    } catch (error) {
      toast(error.message);
    } finally {
      button.disabled = false;
      button.textContent = "Sign in";
    }
  },

  dashboardPath() {
    return "pages/dashboard/index.html";
  },

  getContext() {
    const institution = this.institutions[this.state.institution];
    const role = institution?.roles.find((item) => item.key === this.state.role);
    const dashboardTitle = role?.key === "administrator"
      ? (institution?.key === "university" ? "University Administrator Dashboard" : "Secondary School Administrator Dashboard")
      : (role ? `${role.name} Dashboard` : "Dashboard");
    return {
      institution: this.state.institution,
      institutionName: institution?.name || "",
      role: this.state.role,
      roleName: role?.name || "",
      dashboardTitle,
    };
  },

  brandMarkup() {
    const logo = resolveAuthAsset(this.branding.school_logo, "assets/images/logo.svg");
    const name = this.branding.school_name || "CampusSphere Enterprise";
    return `
      <div class="auth-brand">
        <img src="${escapeHtml(logo)}" alt="CampusSphere logo">
        <div>
          <strong>${escapeHtml(name)}</strong>
          <div class="muted">Institution management suite</div>
        </div>
      </div>
    `;
  },

  hasBackgroundMedia() {
    return Boolean(this.branding.login_background);
  },

  backgroundMarkup() {
    const source = resolveAuthAsset(this.branding.login_background, "");
    if (!source) return "";
    const isVideo = /\.(mp4|webm|mov)(\?.*)?$/i.test(source);
    const media = isVideo
      ? `<video src="${escapeHtml(source)}" autoplay muted loop playsinline></video>`
      : `<img src="${escapeHtml(source)}" alt="">`;
    return `
      <div class="auth-background-media" aria-hidden="true">${media}</div>
      <div class="auth-background-overlay" aria-hidden="true"></div>
    `;
  },
};

function resolveAuthAsset(value, fallback) {
  if (!value) return fallback;
  if (/^(https?:|data:|\/)/.test(value)) return value;
  if (value.includes("assets/images/logo.svg")) return fallback;
  return value;
}

function readSessionValue(key) {
  try {
    return sessionStorage.getItem(key) || "";
  } catch (_error) {
    return "";
  }
}

function readJsonStorage(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (_error) {
    return null;
  }
}

function writeJsonStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_error) {
    // Cache is optional; the app can run without persistent browser storage.
  }
}

document.addEventListener("DOMContentLoaded", () => AuthFlow.init());
