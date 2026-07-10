const settingsSectionIcons = {
  profile: '<path d="M3 21h18"></path><path d="M5 21V7l7-4 7 4v14"></path><path d="M9 21v-6h6v6"></path>',
  palette: '<circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><path d="M12 2a10 10 0 0 0 0 20h1.5a2.5 2.5 0 0 0 0-5H12a1.5 1.5 0 0 1 0-3h1a9 9 0 0 0 9-9 3 3 0 0 0-3-3Z"></path>',
  academic: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z"></path>',
  structure: '<rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect>',
  attendance: '<rect x="3" y="3" width="18" height="18" rx="3"></rect><path d="m8 12 3 3 5-6"></path>',
  grading: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"></path><path d="M14 2v6h6"></path><path d="m9 15 2 2 4-5"></path>',
  finance: '<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 10h18"></path><path d="M8 15h1"></path><path d="M12 15h4"></path>',
  communication: '<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m3 7 9 7 9-7"></path>',
  security: '<rect x="4" y="11" width="16" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path>',
  integration: '<path d="M8 12h8"></path><path d="M12 8v8"></path><circle cx="6" cy="6" r="3"></circle><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="18" r="3"></circle>',
  transport: '<rect x="4" y="5" width="16" height="11" rx="2"></rect><path d="M4 10h16"></path><circle cx="8" cy="18" r="2"></circle><circle cx="16" cy="18" r="2"></circle>',
  hostel: '<path d="m3 10 9-7 9 7"></path><path d="M5 10v10h14V10"></path><path d="M9 20v-6h6v6"></path>',
  document: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"></path><path d="M14 2v6h6"></path><path d="M8 13h8"></path><path d="M8 17h5"></path>',
  automation: '<path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z"></path>',
  backup: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="m7 10 5 5 5-5"></path><path d="M12 15V3"></path>',
  billing: '<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 10h18"></path><path d="M7 15h4"></path>',
  flags: '<path d="M4 22V4"></path><path d="M4 4h12l-1 5 1 5H4"></path>',
};

const settingsSections = [
  {
    key: "school-profile",
    title: "School Profile",
    icon: "profile",
    description: "Core institutional identity and contact records.",
    groups: [
      {
        title: "Basic Information",
        description: "Core identity fields for your institution.",
        fields: [
          { key: "school_name", label: "School Name", type: "text", value: "Enterprise School", serverKey: "school_name" },
          { key: "school_email", label: "School Email", type: "email", value: "admin@campussphere.local", serverKey: "school_email" },
          { key: "phone_number", label: "Phone Number", type: "tel", value: "+233 30 388 3838", serverKey: "phone_number" },
          { key: "institution_type", label: "Institution Type", type: "select", value: "Secondary School", options: ["Secondary School", "University"], serverKey: "institution_type" },
        ],
      },
      {
        title: "Contact & Location",
        description: "Official address used on reports, invoices, and letters.",
        fields: [
          { key: "full_address", label: "Full Address", type: "textarea", value: "P.O.Box 5566, Kipondo Street", serverKey: "full_address", wide: true },
          { key: "city_town", label: "City / Town", type: "text", value: "Accra", serverKey: "city_town" },
          { key: "country", label: "Country", type: "text", value: "Ghana", serverKey: "country" },
        ],
      },
    ],
  },
  {
    key: "branding-appearance",
    title: "Branding & Appearance",
    icon: "palette",
    description: "Visual identity, logo placement, and portal theme.",
    groups: [
      {
        title: "Brand Identity",
        description: "Controls the look used across dashboards and generated documents.",
        fields: [
          { key: "brand_color", label: "Brand Color", type: "color", value: "#f97316", serverKey: "brand_color" },
          { key: "portal_accent", label: "Portal Accent", type: "select", value: "Warm Orange", options: ["Warm Orange", "Deep Blue", "Emerald", "Slate"], serverKey: "portal_accent" },
          { key: "login_theme", label: "Login Theme", type: "select", value: "Enterprise Split", options: ["Enterprise Split", "Centered Card", "Minimal Access"], serverKey: "login_theme" },
          { key: "school_logo", label: "School Logo", type: "file", value: "../../assets/images/logo.svg", serverKey: "school_logo", assetType: "school-logo", accept: ".png,.jpg,.jpeg,.webp,.svg" },
          { key: "favicon", label: "Browser Favicon", type: "file", value: "", serverKey: "favicon", assetType: "favicon", accept: ".png,.ico,.svg" },
          { key: "login_background", label: "Login Background Image / Video", type: "file", value: "", serverKey: "login_background", assetType: "login-background", accept: ".png,.jpg,.jpeg,.webp,.mp4,.webm,.mov" },
        ],
      },
      {
        title: "Receipt & Document Branding",
        description: "Brand rules for printable receipts and official exports.",
        fields: [
          { key: "document_header", label: "Document Header", type: "select", value: "Logo and Institution Name", options: ["Logo and Institution Name", "Institution Name Only", "Letterhead"], serverKey: "document_header" },
          { key: "receipt_footer", label: "Receipt Footer", type: "text", value: "Thank you for your payment.", serverKey: "receipt_footer", wide: true },
          { key: "letterhead", label: "Letterhead / Report Header", type: "file", value: "", serverKey: "letterhead", assetType: "letterhead", accept: ".png,.jpg,.jpeg,.webp,.pdf" },
          { key: "official_stamp", label: "Official Stamp / Seal", type: "file", value: "", serverKey: "official_stamp", assetType: "official-stamp", accept: ".png,.jpg,.jpeg,.webp,.svg" },
          { key: "principal_signature", label: "Principal / Registrar Signature", type: "file", value: "", serverKey: "principal_signature", assetType: "signature", accept: ".png,.jpg,.jpeg,.webp,.svg" },
        ],
      },
    ],
  },
  {
    key: "academic-settings",
    title: "Academic Settings",
    icon: "academic",
    description: "Academic year, terms, grading scale, and promotion rules.",
    groups: [
      {
        title: "Academic Calendar",
        description: "Default calendar values used by admissions, attendance, and reports.",
        fields: [
          { key: "current_academic_year", label: "Academic Year", type: "text", value: "2026/2027", serverKey: "current_academic_year" },
          { key: "current_term", label: "Current Term / Semester", type: "select", value: "Term 1", options: ["Term 1", "Term 2", "Term 3", "Semester 1", "Semester 2"], serverKey: "current_term" },
          { key: "timezone", label: "Timezone", type: "text", value: "Africa/Nairobi", serverKey: "timezone" },
          { key: "promotion_rule", label: "Promotion Rule", type: "select", value: "Final average and attendance", options: ["Final average and attendance", "Exam average only", "Manual approval"], serverKey: "promotion_rule" },
        ],
      },
    ],
  },
  {
    key: "academic-structure",
    title: "Academic Structure",
    icon: "structure",
    description: "Classes, courses, departments, faculties, and subject organization.",
    groups: [
      {
        title: "Structure Defaults",
        description: "Naming and grouping rules for academic records.",
        fields: [
          { key: "class_label", label: "Class / Course Label", type: "select", value: "Class", options: ["Class", "Course", "Cohort", "Program"], serverKey: "structure_class_label" },
          { key: "department_label", label: "Department Label", type: "select", value: "Department", options: ["Department", "Faculty", "School", "College"], serverKey: "structure_department_label" },
          { key: "capacity_warning", label: "Capacity Warning", type: "number", value: "90", serverKey: "structure_capacity_warning" },
          { key: "subject_code_format", label: "Subject Code Format", type: "text", value: "DEPT-LEVEL-###", serverKey: "structure_subject_code_format" },
        ],
      },
    ],
  },
  {
    key: "attendance",
    title: "Attendance",
    icon: "attendance",
    description: "Attendance methods, late thresholds, and family alerts.",
    groups: [
      {
        title: "Attendance Rules",
        description: "Institution-wide attendance behavior.",
        fields: [
          { key: "attendance_mode", label: "Attendance Mode", type: "select", value: "Daily and Period", options: ["Daily", "Period", "Daily and Period"], serverKey: "attendance_mode" },
          { key: "late_threshold", label: "Late Threshold (minutes)", type: "number", value: "15", serverKey: "attendance_late_threshold" },
          { key: "absence_alerts", label: "Absence Alerts", type: "toggle", value: "Enabled", serverKey: "attendance_absence_alerts" },
          { key: "parent_notifications", label: "Parent Notifications", type: "toggle", value: "Enabled", serverKey: "attendance_parent_notifications" },
        ],
      },
    ],
  },
  {
    key: "examination-grading",
    title: "Examination & Grading",
    icon: "grading",
    description: "Exam workflow, grade boundaries, transcripts, and result release.",
    groups: [
      {
        title: "Grading Policy",
        description: "Rules used when publishing results and transcripts.",
        fields: [
          { key: "grading_scale", label: "Grading Scale", type: "select", value: "A-F", options: ["A-F", "Percentage", "GPA 4.0", "GPA 5.0"], serverKey: "grading_scale" },
          { key: "pass_mark", label: "Pass Mark (%)", type: "number", value: "50", serverKey: "grading_pass_mark" },
          { key: "publish_results", label: "Result Publishing", type: "select", value: "After approval", options: ["Immediately", "After approval", "Manual release"], serverKey: "grading_publish_results" },
          { key: "transcript_template", label: "Transcript Template", type: "select", value: "Official transcript", options: ["Official transcript", "Compact report", "Detailed grade sheet"], serverKey: "grading_transcript_template" },
        ],
      },
    ],
  },
  {
    key: "finance",
    title: "Finance",
    icon: "finance",
    description: "Currency, fee items, online payments, and receipts.",
    groups: [
      {
        title: "Finance Controls",
        description: "Defaults used by invoices, payments, receipts, and canteen operations.",
        fields: [
          { key: "currency", label: "Currency", type: "select", value: "GHS", options: ["GHS", "KES", "USD", "NGN", "ZAR"], serverKey: "currency" },
          { key: "online_payments", label: "Online Payments", type: "toggle", value: "Enabled", serverKey: "finance_online_payments" },
          { key: "receipt_numbering", label: "Receipt Numbering", type: "text", value: "RCT-{YYYY}-{####}", serverKey: "finance_receipt_numbering" },
          { key: "default_fee_item", label: "Default Fee Item", type: "text", value: "Tuition", serverKey: "finance_default_fee_item" },
        ],
      },
    ],
  },
  {
    key: "communication",
    title: "Communication",
    icon: "communication",
    description: "SMS, email, announcements, and broadcast governance.",
    groups: [
      {
        title: "Messaging & Broadcasts",
        description: "Provider and approval settings for school-wide communication.",
        fields: [
          { key: "sms_provider", label: "SMS Provider", type: "select", value: "Default Gateway", options: ["Default Gateway", "Hubtel", "Twilio", "Africa's Talking"], serverKey: "communication_sms_provider" },
          { key: "email_sender", label: "Email Sender", type: "email", value: "noreply@campussphere.local", serverKey: "communication_email_sender" },
          { key: "broadcast_approval", label: "Broadcast Approval", type: "toggle", value: "Enabled", serverKey: "communication_broadcast_approval" },
          { key: "gateway_status", label: "Gateway Status", type: "select", value: "Online", options: ["Online", "Maintenance", "Disabled"], serverKey: "communication_gateway_status" },
        ],
      },
    ],
  },
  {
    key: "security-privacy",
    title: "Security & Privacy",
    icon: "security",
    description: "Password policy, sessions, permissions, and audit logging.",
    groups: [
      {
        title: "Access Control",
        description: "Security rules for all portals and institution roles.",
        fields: [
          { key: "password_policy", label: "Password Policy", type: "select", value: "Strong", options: ["Standard", "Strong", "Strict"], serverKey: "security_password_policy" },
          { key: "session_timeout", label: "Session Timeout (minutes)", type: "number", value: "45", serverKey: "security_session_timeout" },
          { key: "audit_logging", label: "Audit Logging", type: "toggle", value: "Enabled", serverKey: "security_audit_logging" },
          { key: "two_factor", label: "Two-Factor Authentication", type: "toggle", value: "Disabled", serverKey: "security_two_factor" },
        ],
      },
    ],
  },
  {
    key: "integrations",
    title: "Integrations",
    icon: "integration",
    badge: "Soon",
    description: "Connected providers for payments, SMS, email, analytics, and AI assistance.",
    groups: [
      {
        title: "Provider Connections",
        description: "External services prepared for enterprise rollout.",
        fields: [
          { key: "payment_gateway", label: "Payment Gateway", type: "select", value: "Not connected", options: ["Not connected", "Stripe", "Paystack", "Flutterwave"], serverKey: "integrations_payment_gateway" },
          { key: "sms_gateway", label: "SMS Gateway", type: "select", value: "Not connected", options: ["Not connected", "Hubtel", "Twilio", "Africa's Talking"], serverKey: "integrations_sms_gateway" },
          { key: "email_provider", label: "Email Provider", type: "select", value: "SMTP", options: ["SMTP", "SendGrid", "Mailgun", "Amazon SES"], serverKey: "integrations_email_provider" },
          { key: "ai_assistant", label: "AI Assistant", type: "toggle", value: "Disabled", serverKey: "integrations_ai_assistant" },
        ],
      },
    ],
  },
  {
    key: "transport",
    title: "Transport",
    icon: "transport",
    badge: "Soon",
    description: "Routes, fleets, driver assignment, and student transport billing.",
    groups: [
      {
        title: "Transport Defaults",
        description: "Routing controls for buses and student pickup points.",
        fields: [
          { key: "route_prefix", label: "Route Prefix", type: "text", value: "RT", serverKey: "transport_route_prefix" },
          { key: "driver_assignment", label: "Driver Assignment", type: "select", value: "Manual", options: ["Manual", "Auto by route", "Auto by capacity"], serverKey: "transport_driver_assignment" },
          { key: "route_alerts", label: "Route Alerts", type: "toggle", value: "Enabled", serverKey: "transport_route_alerts" },
          { key: "transport_billing", label: "Transport Billing", type: "toggle", value: "Enabled", serverKey: "transport_billing" },
        ],
      },
    ],
  },
  {
    key: "hostel",
    title: "Hostel",
    icon: "hostel",
    badge: "Soon",
    description: "Dormitories, rooms, allocations, inspections, and hostel billing.",
    groups: [
      {
        title: "Accommodation Rules",
        description: "Hostel controls for room allocation and residence management.",
        fields: [
          { key: "room_numbering", label: "Room Numbering", type: "text", value: "BLK-FLR-ROOM", serverKey: "hostel_room_numbering" },
          { key: "allocation_mode", label: "Allocation Mode", type: "select", value: "Manual approval", options: ["Manual approval", "Auto by gender", "Auto by programme"], serverKey: "hostel_allocation_mode" },
          { key: "inspection_cycle", label: "Inspection Cycle", type: "select", value: "Weekly", options: ["Weekly", "Biweekly", "Monthly"], serverKey: "hostel_inspection_cycle" },
          { key: "hostel_billing", label: "Hostel Billing", type: "toggle", value: "Enabled", serverKey: "hostel_billing" },
        ],
      },
    ],
  },
  {
    key: "document-compliance",
    title: "Document & Compliance",
    icon: "document",
    description: "Document templates, compliance checks, and record retention.",
    groups: [
      {
        title: "Compliance Records",
        description: "Rules for official documents and institutional compliance files.",
        fields: [
          { key: "admission_letter", label: "Admission Letter Template", type: "select", value: "Standard", options: ["Standard", "Formal", "Compact"], serverKey: "document_admission_letter" },
          { key: "retention_years", label: "Record Retention (years)", type: "number", value: "7", serverKey: "document_retention_years" },
          { key: "approval_stamp", label: "Approval Stamp", type: "toggle", value: "Enabled", serverKey: "document_approval_stamp" },
          { key: "compliance_review", label: "Compliance Review Cycle", type: "select", value: "Quarterly", options: ["Monthly", "Quarterly", "Annually"], serverKey: "document_compliance_review" },
        ],
      },
    ],
  },
  {
    key: "system-automation",
    title: "System Automation",
    icon: "automation",
    description: "Automated reminders, approvals, promotions, and background jobs.",
    groups: [
      {
        title: "Automation Rules",
        description: "Controls recurring system actions across the ERP.",
        fields: [
          { key: "fee_reminders", label: "Fee Reminders", type: "toggle", value: "Enabled", serverKey: "automation_fee_reminders" },
          { key: "attendance_digest", label: "Attendance Digest", type: "select", value: "Daily", options: ["Disabled", "Daily", "Weekly"], serverKey: "automation_attendance_digest" },
          { key: "promotion_queue", label: "Promotion Queue", type: "select", value: "Manual approval", options: ["Manual approval", "Auto draft", "Auto approve"], serverKey: "automation_promotion_queue" },
          { key: "backup_schedule", label: "Backup Schedule", type: "select", value: "Nightly", options: ["Manual", "Nightly", "Weekly"], serverKey: "automation_backup_schedule" },
        ],
      },
    ],
  },
  {
    key: "backup-data",
    title: "Backup & Data",
    icon: "backup",
    badge: "Soon",
    description: "Database backup cadence, exports, data retention, and recovery settings.",
    groups: [
      {
        title: "Data Protection",
        description: "Recovery defaults for operational data.",
        fields: [
          { key: "backup_frequency", label: "Backup Frequency", type: "select", value: "Daily", options: ["Manual", "Daily", "Weekly"], serverKey: "backup_frequency" },
          { key: "backup_retention", label: "Backup Retention (days)", type: "number", value: "30", serverKey: "backup_retention" },
          { key: "export_format", label: "Default Export Format", type: "select", value: "CSV", options: ["CSV", "XLSX", "PDF"], serverKey: "backup_export_format" },
          { key: "data_archive", label: "Data Archive", type: "toggle", value: "Enabled", serverKey: "backup_data_archive" },
        ],
      },
    ],
  },
  {
    key: "subscription-billing",
    title: "Subscription & Billing",
    icon: "billing",
    description: "Subscription plan, billing contacts, module entitlements, and invoices.",
    groups: [
      {
        title: "Subscription Controls",
        description: "Institution subscription and platform billing metadata.",
        fields: [
          { key: "plan", label: "Plan", type: "select", value: "Enterprise", options: ["Starter", "Professional", "Enterprise"], serverKey: "subscription_plan" },
          { key: "billing_contact", label: "Billing Contact", type: "email", value: "billing@campussphere.local", serverKey: "subscription_billing_contact" },
          { key: "renewal_cycle", label: "Renewal Cycle", type: "select", value: "Annual", options: ["Monthly", "Termly", "Annual"], serverKey: "subscription_renewal_cycle" },
          { key: "module_entitlements", label: "Module Entitlements", type: "text", value: "All core modules", serverKey: "subscription_module_entitlements" },
        ],
      },
    ],
  },
  {
    key: "feature-flags",
    title: "Feature Flags",
    icon: "flags",
    description: "Controlled rollout switches for new enterprise modules.",
    groups: [
      {
        title: "Rollout Flags",
        description: "Feature switches used to stage new functionality.",
        fields: [
          { key: "new_admissions_pipeline", label: "Admissions Pipeline", type: "toggle", value: "Enabled", serverKey: "flag_admissions_pipeline" },
          { key: "canteen_pos", label: "Canteen POS", type: "toggle", value: "Enabled", serverKey: "flag_canteen_pos" },
          { key: "ai_drafts", label: "AI Drafts", type: "toggle", value: "Disabled", serverKey: "flag_ai_drafts" },
          { key: "parent_payments", label: "Parent Payments", type: "toggle", value: "Enabled", serverKey: "flag_parent_payments" },
        ],
      },
    ],
  },
];

let activeSettingsSection = settingsSections[0].key;
let serverSettings = new Map();

function settingsIcon(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${settingsSectionIcons[name] || settingsSectionIcons.profile}</svg>`;
}

function settingsStorageKey(key) {
  return `campussphere.setting.${key}`;
}

function getFieldServerKey(section, field) {
  return field.serverKey || `${section.key}.${field.key}`;
}

function getStoredValue(section, field) {
  const key = getFieldServerKey(section, field);
  const record = serverSettings.get(key);
  if (record && record.setting_value !== null && record.setting_value !== undefined) {
    return record.setting_value;
  }
  const local = localStorage.getItem(settingsStorageKey(key));
  return local !== null ? local : field.value || "";
}

function getInstitutionTitle() {
  const context = typeof getPortalContext === "function" ? getPortalContext() : {};
  return context.institution === "university" ? "University Settings" : "School Settings";
}

async function loadSettingsRecords() {
  try {
    const result = await Api.get("/modules/settings?per_page=100&sort=setting_key&direction=asc");
    serverSettings = new Map(result.records.map((record) => [record.setting_key, record]));
  } catch (error) {
    serverSettings = new Map();
    toast(error.message || "Settings will be saved locally until the database is available.");
  }
}

async function renderSettingsPage() {
  await buildLayout("settings");
  await loadSettingsRecords();

  const page = document.querySelector("#pageContent");
  page.innerHTML = `
    <section class="page-header settings-page-header">
      <div>
        <h1>${escapeHtml(getInstitutionTitle())}</h1>
        <p class="muted">Manage your institution profile, configuration, and system preferences.</p>
      </div>
      <div class="toolbar">
        <button class="btn" id="resetSettingsButton" type="button">Reset</button>
        <button class="btn btn-primary" id="saveSettingsButton" type="button">Save Changes</button>
      </div>
    </section>
    <section class="settings-workspace">
      <aside class="settings-menu" aria-label="Settings sections">
        ${settingsSections.map(renderSettingsMenuButton).join("")}
      </aside>
      <section class="settings-content" id="settingsContent"></section>
    </section>
  `;

  document.querySelectorAll("[data-settings-section]").forEach((button) => {
    button.addEventListener("click", () => {
      activeSettingsSection = button.dataset.settingsSection;
      renderActiveSettingsSection();
    });
  });

  document.querySelector("#saveSettingsButton").addEventListener("click", saveActiveSettingsSection);
  document.querySelector("#resetSettingsButton").addEventListener("click", resetActiveSettingsSection);
  renderActiveSettingsSection();
}

function renderSettingsMenuButton(section) {
  const badge = section.badge ? `<span class="soon-pill">${escapeHtml(section.badge)}</span>` : "";
  return `
    <button class="settings-section-button ${section.key === activeSettingsSection ? "active" : ""}" type="button" data-settings-section="${escapeHtml(section.key)}">
      <span class="settings-section-icon">${settingsIcon(section.icon)}</span>
      <span class="settings-section-copy">
        <strong>${escapeHtml(section.title)}</strong>
        <small>${escapeHtml(section.description)}</small>
      </span>
      ${badge}
    </button>
  `;
}

function renderActiveSettingsSection() {
  const section = settingsSections.find((item) => item.key === activeSettingsSection) || settingsSections[0];
  const content = document.querySelector("#settingsContent");
  if (!content) return;

  document.querySelectorAll("[data-settings-section]").forEach((button) => {
    button.classList.toggle("active", button.dataset.settingsSection === section.key);
  });

  content.innerHTML = `
    <div class="settings-panel-heading">
      <div>
        <span class="settings-panel-icon">${settingsIcon(section.icon)}</span>
        <h2>${escapeHtml(section.title)}</h2>
        <p class="muted">${escapeHtml(section.description)}</p>
      </div>
      ${section.badge ? `<span class="soon-pill large">${escapeHtml(section.badge)}</span>` : ""}
    </div>
    <div class="settings-card-grid">
      ${section.groups.map((group) => renderSettingsGroup(section, group)).join("")}
    </div>
  `;

  content.querySelectorAll('input[type="color"]').forEach((control) => {
    control.addEventListener("input", () => {
      const valueLabel = control.closest(".color-control")?.querySelector("strong");
      if (valueLabel) valueLabel.textContent = control.value;
    });
  });

  content.querySelectorAll('input[type="checkbox"]').forEach((control) => {
    control.addEventListener("change", () => {
      const status = control.closest(".settings-toggle-field")?.querySelector("small");
      if (status) status.textContent = control.checked ? "Enabled" : "Disabled";
    });
  });

  content.querySelectorAll("[data-upload-setting]").forEach((button) => {
    button.addEventListener("click", () => uploadSettingsAsset(button));
  });
}

function renderSettingsGroup(section, group) {
  return `
    <article class="settings-card">
      <div class="settings-card-heading">
        <h3>${escapeHtml(group.title)}</h3>
        <p class="muted">${escapeHtml(group.description)}</p>
      </div>
      <div class="settings-form-grid">
        ${group.fields.map((field) => renderSettingsField(section, field)).join("")}
      </div>
    </article>
  `;
}

function renderSettingsField(section, field) {
  const key = getFieldServerKey(section, field);
  const value = getStoredValue(section, field);
  const wide = field.wide ? "wide" : "";
  if (field.type === "toggle") {
    const checked = value === "Enabled" || value === "On" || value === "true" || value === true;
    return `
      <label class="settings-toggle-field ${wide}">
        <span>
          <strong>${escapeHtml(field.label)}</strong>
          <small>${checked ? "Enabled" : "Disabled"}</small>
        </span>
        <input type="checkbox" data-setting-key="${escapeHtml(key)}" ${checked ? "checked" : ""} data-on-value="Enabled" data-off-value="Disabled">
        <i aria-hidden="true"></i>
      </label>
    `;
  }

  if (field.type === "select") {
    return `
      <label class="field ${wide}">
        <span>${escapeHtml(field.label)}</span>
        <select class="select" data-setting-key="${escapeHtml(key)}">
          ${(field.options || []).map((option) => `<option value="${escapeHtml(option)}" ${String(option) === String(value) ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
        </select>
      </label>
    `;
  }

  if (field.type === "textarea") {
    return `
      <label class="field ${wide}">
        <span>${escapeHtml(field.label)}</span>
        <textarea class="textarea" data-setting-key="${escapeHtml(key)}">${escapeHtml(value)}</textarea>
      </label>
    `;
  }

  if (field.type === "color") {
    return `
      <label class="field color-field ${wide}">
        <span>${escapeHtml(field.label)}</span>
        <span class="color-control">
          <input type="color" value="${escapeHtml(value)}" data-setting-key="${escapeHtml(key)}">
          <strong>${escapeHtml(value)}</strong>
        </span>
      </label>
    `;
  }

  if (field.type === "file") {
    const isImage = /\.(png|jpe?g|webp|svg|ico)(\?.*)?$/i.test(String(value));
    const isVideo = /\.(mp4|webm|mov)(\?.*)?$/i.test(String(value));
    const preview = value
      ? isImage
        ? `<img src="${escapeHtml(value)}" alt="${escapeHtml(field.label)} preview">`
        : isVideo
          ? `<video src="${escapeHtml(value)}" muted loop playsinline controls></video>`
        : `<span class="muted">${escapeHtml(value)}</span>`
      : `<span class="muted">No file uploaded</span>`;
    return `
      <label class="field upload-field ${wide}">
        <span>${escapeHtml(field.label)}</span>
        <div class="upload-control" data-upload-card="${escapeHtml(key)}">
          <div class="upload-preview">${preview}</div>
          <div class="upload-actions">
            <input class="input" type="file" accept="${escapeHtml(field.accept || "")}" data-upload-input="${escapeHtml(key)}" data-asset-type="${escapeHtml(field.assetType || field.key)}">
            <button class="btn" type="button" data-upload-setting="${escapeHtml(key)}">Upload</button>
          </div>
          <input type="hidden" value="${escapeHtml(value)}" data-setting-key="${escapeHtml(key)}">
        </div>
      </label>
    `;
  }

  return `
    <label class="field ${wide}">
      <span>${escapeHtml(field.label)}</span>
      <input class="input" type="${escapeHtml(field.type || "text")}" value="${escapeHtml(value)}" data-setting-key="${escapeHtml(key)}">
    </label>
  `;
}

function collectActiveSettingsValues() {
  return [...document.querySelectorAll("#settingsContent [data-setting-key]")].map((control) => {
    const key = control.dataset.settingKey;
    const value = control.type === "checkbox"
      ? (control.checked ? control.dataset.onValue : control.dataset.offValue)
      : control.value;
    return { key, value: String(value ?? "") };
  });
}

async function upsertSetting(key, value) {
  const existing = serverSettings.get(key);
  if (existing) {
    await Api.put(`/modules/settings/${existing.id}`, { setting_value: value });
    return existing.id;
  }
  const created = await Api.post("/modules/settings", { setting_key: key, setting_value: value });
  return created.id;
}

async function uploadSettingsAsset(button) {
  const key = button.dataset.uploadSetting;
  const input = document.querySelector(`[data-upload-input="${CSS.escape(key)}"]`);
  if (!input?.files?.length) {
    toast("Choose a file first.");
    return;
  }

  const formData = new FormData();
  formData.append("file", input.files[0]);
  formData.append("asset_type", input.dataset.assetType || key);
  button.disabled = true;
  button.textContent = "Uploading...";

  try {
    const result = await Api.upload("/uploads/branding", formData);
    const url = result.file.url;
    await upsertSetting(key, url);
    localStorage.setItem(settingsStorageKey(key), url);
    await loadSettingsRecords();
    renderActiveSettingsSection();
    toast("Branding asset uploaded.");
  } catch (error) {
    toast(error.message);
  } finally {
    button.disabled = false;
    button.textContent = "Upload";
  }
}

async function saveActiveSettingsSection() {
  const values = collectActiveSettingsValues();
  values.forEach(({ key, value }) => localStorage.setItem(settingsStorageKey(key), value));

  const results = await Promise.allSettled(values.map(({ key, value }) => upsertSetting(key, value)));
  const failed = results.filter((result) => result.status === "rejected");
  if (failed.length) {
    toast("Saved locally. Some database settings could not be updated.");
    return;
  }

  await loadSettingsRecords();
  toast("Settings saved.");
}

function resetActiveSettingsSection() {
  const section = settingsSections.find((item) => item.key === activeSettingsSection) || settingsSections[0];
  section.groups.forEach((group) => {
    group.fields.forEach((field) => {
      localStorage.removeItem(settingsStorageKey(getFieldServerKey(section, field)));
    });
  });
  renderActiveSettingsSection();
  toast("Defaults restored. Save changes to apply them.");
}

document.addEventListener("DOMContentLoaded", renderSettingsPage);
