(function configureCampusSphere(window) {
  const localHosts = new Set(["localhost", "127.0.0.1", ""]);
  const host = window.location.hostname;
  const isLocal = localHosts.has(host);
  const overrides = window.CAMPUSSPHERE_CONFIG || {};
  const productionApiUrl = overrides.PRODUCTION_API_URL || "https://campussphere-i8c7.onrender.com/api";
  const apiUrl =
    localStorage.getItem("apiBase") ||
    overrides.API_URL ||
    (isLocal ? "http://127.0.0.1:5000/api" : productionApiUrl);

  window.CONFIG = Object.freeze({
    APP_NAME: overrides.APP_NAME || "CampusSphere",
    API_URL: apiUrl.replace(/\/$/, ""),
    APP_ENV: overrides.APP_ENV || (isLocal ? "local" : "production"),
  });
})(window);
