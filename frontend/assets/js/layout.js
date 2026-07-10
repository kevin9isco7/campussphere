function svgIcon(paths) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths}</svg>`;
}

const icons = {
  dashboard: svgIcon('<rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect>'),
  admissions: svgIcon('<path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"></path><circle cx="9.5" cy="7" r="4"></circle><path d="M19 8v6"></path><path d="M22 11h-6"></path>'),
  students: svgIcon('<path d="M22 10 12 5 2 10l10 5 10-5Z"></path><path d="M6 12v5c3 2 9 2 12 0v-5"></path>'),
  parents: svgIcon('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.9"></path><path d="M16 3.1a4 4 0 0 1 0 7.8"></path>'),
  teachers: svgIcon('<rect x="3" y="4" width="18" height="13" rx="2"></rect><path d="M8 21h8"></path><path d="M12 17v4"></path><path d="M8 9h8"></path><path d="M8 13h5"></path>'),
  academic: svgIcon('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z"></path>'),
  classes: svgIcon('<path d="M3 21h18"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path><path d="M9 7h1"></path><path d="M14 7h1"></path><path d="M9 11h1"></path><path d="M14 11h1"></path>'),
  subjects: svgIcon('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"></path><path d="M14 2v6h6"></path><path d="M8 13h8"></path><path d="M8 17h5"></path>'),
  curriculum: svgIcon('<rect x="5" y="3" width="14" height="18" rx="2"></rect><path d="M9 7h6"></path><path d="M9 11h6"></path><path d="M9 15h4"></path>'),
  attendance: svgIcon('<rect x="3" y="3" width="18" height="18" rx="3"></rect><path d="m8 12 3 3 5-6"></path>'),
  timetable: svgIcon('<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>'),
  assignments: svgIcon('<path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"></path>'),
  examinations: svgIcon('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"></path><path d="M14 2v6h6"></path><path d="m9 15 2 2 4-5"></path>'),
  results: svgIcon('<path d="M4 19V5"></path><path d="M4 19h16"></path><path d="M8 16V9"></path><path d="M12 16V6"></path><path d="M16 16v-4"></path>'),
  finance: svgIcon('<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 10h18"></path><path d="M8 15h1"></path><path d="M12 15h4"></path>'),
  payroll: svgIcon('<path d="M20 7H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"></path><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path><circle cx="12" cy="13" r="2"></circle>'),
  hr: svgIcon('<path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"></path><circle cx="9.5" cy="7" r="4"></circle><path d="M19 8v4"></path><path d="M17 10h4"></path>'),
  library: svgIcon('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z"></path><path d="M8 6h8"></path>'),
  hostel: svgIcon('<path d="m3 10 9-7 9 7"></path><path d="M5 10v10h14V10"></path><path d="M9 20v-6h6v6"></path>'),
  transport: svgIcon('<rect x="4" y="5" width="16" height="11" rx="2"></rect><path d="M4 10h16"></path><circle cx="8" cy="18" r="2"></circle><circle cx="16" cy="18" r="2"></circle>'),
  communication: svgIcon('<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m3 7 9 7 9-7"></path>'),
  announcements: svgIcon('<path d="M3 11v2a2 2 0 0 0 2 2h3l6 4V5L8 9H5a2 2 0 0 0-2 2Z"></path><path d="M18 9a4 4 0 0 1 0 6"></path>'),
  "sms-reports": svgIcon('<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"></path><path d="M8 8h8"></path><path d="M8 12h5"></path>'),
  canteen: svgIcon('<path d="M6 3v8"></path><path d="M10 3v8"></path><path d="M6 7h4"></path><path d="M8 11v10"></path><path d="M16 3c2 2 3 4 3 7a5 5 0 0 1-3 5v6"></path>'),
  receipts: svgIcon('<path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2Z"></path><path d="M9 7h6"></path><path d="M9 11h6"></path><path d="M9 15h4"></path>'),
  expenses: svgIcon('<path d="M12 1v22"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"></path>'),
  scholarships: svgIcon('<path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6l-8-4Z"></path><path d="m9 12 2 2 4-5"></path>'),
  "school-profile": svgIcon('<path d="M3 21h18"></path><path d="M5 21V7l7-4 7 4v14"></path><path d="M9 21v-6h6v6"></path>'),
  "user-management": svgIcon('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M19 8v6"></path><path d="M22 11h-6"></path>'),
  permissions: svgIcon('<rect x="4" y="11" width="16" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path>'),
  "audit-logs": svgIcon('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"></path><path d="M14 2v6h6"></path><path d="M8 13h8"></path><path d="M8 17h6"></path>'),
  reports: svgIcon('<path d="M4 19V5"></path><path d="M4 19h16"></path><path d="M8 16v-4"></path><path d="M12 16V8"></path><path d="M16 16v-6"></path>'),
  settings: svgIcon('<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21h-4v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.6-1H3v-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1L7.1 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3V3h4v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v4H21a1.7 1.7 0 0 0-1.6 1Z"></path>'),
};

const uiIcons = {
  menu: svgIcon('<path d="M4 6h16"></path><path d="M4 12h16"></path><path d="M4 18h16"></path>'),
  notifications: svgIcon('<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M10 21h4"></path>'),
  messages: svgIcon('<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m3 7 9 7 9-7"></path>'),
  theme: svgIcon('<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"></path>'),
  settings: icons.settings,
  logout: svgIcon('<path d="M10 17l5-5-5-5"></path><path d="M15 12H3"></path><path d="M21 3v18"></path>'),
};

const PortalModules = {
  secondary: {
    student: ["dashboard", "academic", "subjects", "curriculum", "attendance", "timetable", "assignments", "examinations", "results", "finance", "receipts", "library", "hostel", "transport", "communication", "announcements", "reports"],
    teacher: ["dashboard", "students", "academic", "classes", "subjects", "curriculum", "attendance", "timetable", "assignments", "examinations", "results", "communication", "announcements", "reports"],
    parent: ["dashboard", "students", "attendance", "timetable", "assignments", "examinations", "results", "finance", "receipts", "communication", "announcements", "reports"],
    administrator: ["dashboard", "admissions", "students", "parents", "teachers", "academic", "classes", "subjects", "curriculum", "attendance", "timetable", "assignments", "examinations", "results", "finance", "receipts", "expenses", "scholarships", "canteen", "payroll", "hr", "library", "hostel", "transport", "communication", "announcements", "sms-reports", "reports", "user-management", "settings", "audit-logs"],
    accountant: ["dashboard", "students", "finance", "receipts", "expenses", "scholarships", "canteen", "payroll", "reports", "settings"],
    librarian: ["dashboard", "students", "library", "reports"],
    hr: ["dashboard", "teachers", "payroll", "hr", "reports", "settings"],
  },
  university: {
    student: ["dashboard", "academic", "subjects", "curriculum", "attendance", "timetable", "assignments", "examinations", "results", "finance", "receipts", "library", "hostel", "transport", "communication", "announcements", "reports"],
    lecturer: ["dashboard", "students", "academic", "classes", "subjects", "curriculum", "attendance", "timetable", "assignments", "examinations", "results", "communication", "announcements", "reports"],
    administrator: ["dashboard", "admissions", "students", "teachers", "academic", "classes", "subjects", "curriculum", "attendance", "timetable", "assignments", "examinations", "results", "finance", "receipts", "expenses", "scholarships", "payroll", "hr", "library", "hostel", "transport", "communication", "announcements", "sms-reports", "reports", "user-management", "settings", "audit-logs"],
    registrar: ["dashboard", "admissions", "students", "academic", "classes", "subjects", "examinations", "results", "communication", "announcements", "reports", "settings"],
    dean: ["dashboard", "students", "teachers", "academic", "classes", "subjects", "curriculum", "examinations", "results", "reports"],
    hod: ["dashboard", "teachers", "academic", "classes", "subjects", "curriculum", "timetable", "assignments", "examinations", "results", "reports"],
    accountant: ["dashboard", "students", "finance", "receipts", "expenses", "scholarships", "payroll", "reports", "settings"],
    librarian: ["dashboard", "students", "library", "reports"],
    hr: ["dashboard", "teachers", "payroll", "hr", "reports", "settings"],
  },
};

const UniversityLabels = {
  teachers: "Lecturers",
  classes: "Courses",
  admissions: "Registrar Services",
};

function getPortalContext() {
  try {
    return JSON.parse(sessionStorage.getItem("portalContext") || "{}");
  } catch (_error) {
    return {};
  }
}

function filterModulesForPortal(modules) {
  const context = getPortalContext();
  const allowed = PortalModules[context.institution]?.[context.role];
  if (!allowed) return modules;
  return modules
    .filter((module) => allowed.includes(module.key))
    .map((module) => ({
      ...module,
      label: context.institution === "university" ? UniversityLabels[module.key] || module.label : module.label,
    }));
}

function moduleHref(moduleKey) {
  return moduleKey === "dashboard" ? "../dashboard/index.html" : `../${moduleKey}/index.html`;
}

async function buildLayout(activeModule) {
  requireSession();

  const shell = document.querySelector("#appShell");
  if (!shell) return;

  shell.innerHTML = `
    <aside class="sidebar" id="sidebar">
      <div class="brand">
        <img src="../../assets/images/logo.svg" alt="School logo" id="brandLogo">
        <div class="brand-title"><span id="schoolName">Enterprise School</span><br><span class="muted">ERP Suite</span></div>
      </div>
      <nav class="nav-list" id="navList"></nav>
      <a class="nav-link" href="#" id="logoutLink"><span class="nav-icon">${uiIcons.logout}</span><span class="nav-text">Logout</span></a>
    </aside>
    <section class="content-area">
      <header class="topbar">
        <button class="btn icon-btn" id="sidebarToggle" title="Toggle sidebar">${uiIcons.menu}</button>
        <div class="search-box">
          <input class="input" id="globalSearch" placeholder="Search records, people, invoices..." autocomplete="off">
        </div>
        <div class="top-actions">
          <span class="year-pill context-pill" id="portalContext">CampusSphere</span>
          <span class="year-pill" id="academicYear">Academic Year</span>
          <button class="btn icon-btn topbar-action" id="notificationButton" title="Notifications" aria-expanded="false">
            ${uiIcons.notifications}
            <span class="action-count" id="notificationCount" hidden>0</span>
          </button>
          <button class="btn icon-btn topbar-action" id="messageButton" title="Messages" aria-expanded="false">
            ${uiIcons.messages}
            <span class="action-count" id="messageCount" hidden>0</span>
          </button>
          <button class="btn icon-btn" id="themeToggle" title="Theme toggle">${uiIcons.theme}</button>
          <a class="btn icon-btn" href="../settings/index.html" title="Settings">${uiIcons.settings}</a>
          <span class="badge" id="profileBadge">Profile</span>
        </div>
        <section class="topbar-popover" id="notificationPanel" hidden></section>
        <section class="topbar-popover" id="messagePanel" hidden></section>
      </header>
      <main class="page" id="pageContent"></main>
    </section>
  `;

  try {
    const [modulesResult, settingsResult] = await Promise.all([
      Api.get("/modules"),
      Api.get("/modules/settings?search=&per_page=20").catch(() => ({ records: [] })),
    ]);

    const settings = Object.fromEntries(settingsResult.records.map((row) => [row.setting_key, row.setting_value]));
    document.querySelector("#schoolName").textContent = settings.school_name || "Enterprise School";
    document.querySelector("#academicYear").textContent = settings.current_academic_year || "Academic Year";
    if (settings.school_logo) {
      document.querySelector("#brandLogo").src = resolveShellAsset(settings.school_logo, "../../assets/images/logo.svg");
    }
    if (settings.favicon) {
      let favicon = document.querySelector("link[rel='icon']");
      if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        document.head.appendChild(favicon);
      }
      favicon.href = settings.favicon;
    }

    const nav = document.querySelector("#navList");
    const portalModules = filterModulesForPortal(modulesResult.modules);
    nav.innerHTML = portalModules
      .map((module) => {
        const href = moduleHref(module.key);
        const active = module.key === activeModule ? "active" : "";
        return `<a class="nav-link ${active}" href="${href}" title="${escapeHtml(module.label)}">
          <span class="nav-icon">${icons[module.key] || icons.dashboard}</span>
          <span class="nav-text">${escapeHtml(module.label)}</span>
        </a>`;
      })
      .join("");
  } catch (error) {
    toast(error.message);
  }

  const user = Api.user();
  const context = getPortalContext();
  document.querySelector("#profileBadge").textContent = user.name || "Profile";
  document.querySelector("#portalContext").textContent = context.institutionName && context.roleName ? `${context.institutionName} / ${context.roleName}` : "CampusSphere";
  setupTopbarPanels();

  document.querySelector("#logoutLink").addEventListener("click", (event) => {
    event.preventDefault();
    Api.clearToken();
    sessionStorage.removeItem("portalContext");
    sessionStorage.removeItem("selectedInstitution");
    sessionStorage.removeItem("selectedRole");
    location.href = "../../index.html";
  });

  document.querySelector("#sidebarToggle").addEventListener("click", () => {
    const sidebar = document.querySelector("#sidebar");
    if (matchMedia("(max-width: 820px)").matches) {
      sidebar.classList.toggle("open");
    } else {
      sidebar.classList.toggle("is-collapsed");
      document.querySelector(".app-shell").style.gridTemplateColumns = sidebar.classList.contains("is-collapsed") ? "84px 1fr" : "280px 1fr";
    }
  });

  const theme = localStorage.getItem("theme") || "light";
  document.documentElement.dataset.theme = theme;
  document.querySelector("#themeToggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  });
}

function resolveShellAsset(value, fallback) {
  if (!value) return fallback;
  if (/^(https?:|data:|\/)/.test(value)) return value;
  if (value.includes("assets/images/logo.svg")) return fallback;
  return value;
}

function setupTopbarPanels() {
  const notificationButton = document.querySelector("#notificationButton");
  const messageButton = document.querySelector("#messageButton");
  const notificationPanel = document.querySelector("#notificationPanel");
  const messagePanel = document.querySelector("#messagePanel");
  if (!notificationButton || !messageButton || !notificationPanel || !messagePanel) return;

  renderPanelLoading(notificationPanel, "Notifications");
  renderPanelLoading(messagePanel, "Messages");

  notificationButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleTopbarPanel("notifications");
  });

  messageButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleTopbarPanel("messages");
  });

  [notificationPanel, messagePanel].forEach((panel) => {
    panel.addEventListener("click", (event) => event.stopPropagation());
  });

  document.addEventListener("click", closeTopbarPanels);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeTopbarPanels();
  });

  loadTopbarActivity();
}

async function loadTopbarActivity() {
  const [notifications, messages] = await Promise.all([
    Api.get("/modules/announcements?per_page=5&sort=created_at&direction=desc").catch(() => ({ records: [], pagination: { total: 0 } })),
    Api.get("/modules/communication?per_page=5&sort=created_at&direction=desc").catch(() => ({ records: [], pagination: { total: 0 } })),
  ]);

  updateTopbarCount("#notificationCount", notifications.pagination?.total || notifications.records.length);
  updateTopbarCount("#messageCount", messages.pagination?.total || messages.records.length);
  renderActivityPanel({
    panelId: "notificationPanel",
    title: "Notifications",
    records: notifications.records,
    empty: "No announcements yet.",
    href: moduleHref("announcements"),
    action: "View announcements",
    kind: "notification",
  });
  renderActivityPanel({
    panelId: "messagePanel",
    title: "Messages",
    records: messages.records,
    empty: "No messages yet.",
    href: moduleHref("communication"),
    action: "Open communication",
    kind: "message",
  });
}

function toggleTopbarPanel(type) {
  const notificationPanel = document.querySelector("#notificationPanel");
  const messagePanel = document.querySelector("#messagePanel");
  const notificationButton = document.querySelector("#notificationButton");
  const messageButton = document.querySelector("#messageButton");
  const openingNotifications = type === "notifications";
  const panel = openingNotifications ? notificationPanel : messagePanel;
  const otherPanel = openingNotifications ? messagePanel : notificationPanel;
  const button = openingNotifications ? notificationButton : messageButton;
  const otherButton = openingNotifications ? messageButton : notificationButton;
  const shouldOpen = panel.hidden;

  otherPanel.hidden = true;
  otherButton.setAttribute("aria-expanded", "false");
  panel.hidden = !shouldOpen;
  button.setAttribute("aria-expanded", String(shouldOpen));
}

function closeTopbarPanels() {
  ["notificationPanel", "messagePanel"].forEach((id) => {
    const panel = document.querySelector(`#${id}`);
    if (panel) panel.hidden = true;
  });
  ["notificationButton", "messageButton"].forEach((id) => {
    const button = document.querySelector(`#${id}`);
    if (button) button.setAttribute("aria-expanded", "false");
  });
}

function updateTopbarCount(selector, total) {
  const node = document.querySelector(selector);
  if (!node) return;
  node.hidden = total <= 0;
  node.textContent = total > 99 ? "99+" : String(total);
}

function renderPanelLoading(panel, title) {
  panel.innerHTML = `
    <div class="popover-header">
      <strong>${escapeHtml(title)}</strong>
      <span class="muted">Loading</span>
    </div>
    <div class="popover-empty">Loading latest records...</div>
  `;
}

function renderActivityPanel({ panelId, title, records, empty, href, action, kind }) {
  const panel = document.querySelector(`#${panelId}`);
  if (!panel) return;
  const items = records.length
    ? records.map((record) => renderActivityItem(record, kind)).join("")
    : `<div class="popover-empty">${escapeHtml(empty)}</div>`;

  panel.innerHTML = `
    <div class="popover-header">
      <strong>${escapeHtml(title)}</strong>
      <span class="muted">${records.length} recent</span>
    </div>
    <div class="popover-list">${items}</div>
    <a class="popover-link" href="${href}">${escapeHtml(action)}</a>
  `;
}

function renderActivityItem(record, kind) {
  const title = kind === "notification" ? record.title : record.subject;
  const body = kind === "notification" ? record.body : record.body;
  const meta = kind === "notification"
    ? `${record.category || "General"} / ${record.status || "Draft"}`
    : `${record.channel || "Portal"} / ${record.status || "Draft"}`;
  return `
    <article class="popover-item">
      <span class="popover-item-icon">${kind === "notification" ? uiIcons.notifications : uiIcons.messages}</span>
      <div>
        <strong>${escapeHtml(title || "Untitled")}</strong>
        <p>${escapeHtml(body || "No details supplied.")}</p>
        <span class="muted">${escapeHtml(meta)}</span>
      </div>
    </article>
  `;
}
