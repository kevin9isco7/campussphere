const API_BASE = (window.CONFIG?.API_URL || "/api").replace(/\/$/, "");

const Api = {
  token() {
    return localStorage.getItem("schoolToken");
  },

  setToken(token) {
    localStorage.setItem("schoolToken", token);
  },

  clearToken() {
    localStorage.removeItem("schoolToken");
    localStorage.removeItem("schoolUser");
  },

  user() {
    try {
      return JSON.parse(localStorage.getItem("schoolUser") || "{}");
    } catch (_error) {
      return {};
    }
  },

  setUser(user) {
    localStorage.setItem("schoolUser", JSON.stringify(user));
  },

  async request(path, options = {}) {
    const { timeoutMs = 30000, ...fetchOptions } = options;
    const headers = new Headers(options.headers || {});
    const isFormData = typeof FormData !== "undefined" && fetchOptions.body instanceof FormData;
    if (!headers.has("Content-Type") && fetchOptions.body && !isFormData) {
      headers.set("Content-Type", "application/json");
    }
    if (this.token()) {
      headers.set("Authorization", `Bearer ${this.token()}`);
    }

    let timeoutId = null;
    if (timeoutMs && typeof AbortController !== "undefined" && !fetchOptions.signal) {
      const controller = new AbortController();
      fetchOptions.signal = controller.signal;
      timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
    }

    let response;
    try {
      response = await fetch(`${API_BASE}${path}`, { ...fetchOptions, headers });
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Request timed out. Please try again.");
      }
      throw error;
    } finally {
      if (timeoutId) window.clearTimeout(timeoutId);
    }

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = payload.error?.message || "Request failed.";
      const error = new Error(message);
      error.details = payload.error?.details || {};
      error.status = response.status;
      if (response.status === 401) {
        this.clearToken();
        if (!location.pathname.endsWith("/index.html") && !location.pathname.endsWith("/frontend/")) {
          location.href = "../../index.html";
        }
      }
      throw error;
    }
    return payload;
  },

  get(path, options = {}) {
    return this.request(path, options);
  },

  post(path, data, options = {}) {
    return this.request(path, { ...options, method: "POST", body: JSON.stringify(data) });
  },

  put(path, data, options = {}) {
    return this.request(path, { ...options, method: "PUT", body: JSON.stringify(data) });
  },

  upload(path, formData, options = {}) {
    return this.request(path, { ...options, method: "POST", body: formData });
  },

  delete(path, options = {}) {
    return this.request(path, { ...options, method: "DELETE" });
  },
};

function requireSession() {
  if (!Api.token()) {
    location.href = "../../index.html";
  }
}

function toast(message) {
  let node = document.querySelector(".toast");
  if (!node) {
    node = document.createElement("div");
    node.className = "toast";
    document.body.appendChild(node);
  }
  node.textContent = message;
  node.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => node.classList.remove("show"), 3200);
}

function formatLabel(value) {
  return String(value)
    .replace(/_id$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
