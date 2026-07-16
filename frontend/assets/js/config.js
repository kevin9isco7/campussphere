(function configureCampusSphere(window) {
  const localHosts = new Set(["localhost", "127.0.0.1", ""]);
  const host = window.location.hostname;
  const isLocal = localHosts.has(host);
  const overrides = window.CAMPUSSPHERE_CONFIG || {};
  const productionApiUrl = overrides.PRODUCTION_API_URL || "https://campussphere-i8c7.onrender.com/api";
  let storedApiUrl = "";
  try {
    storedApiUrl = window.localStorage?.getItem("apiBase") || "";
  } catch (_error) {
    storedApiUrl = "";
  }
  const apiUrl =
    (isLocal ? "" : storedApiUrl) ||
    overrides.API_URL ||
    (isLocal ? "http://127.0.0.1:5000/api" : productionApiUrl);

  function normalizeApiUrl(url) {
    const cleaned = String(url || "").trim().replace(/\/$/, "");
    if (!cleaned) return cleaned;
    try {
      const parsed = new URL(cleaned);
      const path = parsed.pathname.replace(/\/$/, "");
      if (!path || path === "/") {
        parsed.pathname = "/api";
      } else if (!path.endsWith("/api")) {
        parsed.pathname = `${path}/api`;
      }
      return parsed.toString().replace(/\/$/, "");
    } catch (_error) {
      return cleaned;
    }
  }

  window.CONFIG = Object.freeze({
    APP_NAME: overrides.APP_NAME || "CampusSphere",
    API_URL: normalizeApiUrl(apiUrl),
    APP_ENV: overrides.APP_ENV || (isLocal ? "local" : "production"),
  });
})(window);
