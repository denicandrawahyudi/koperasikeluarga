export const API_CONFIG = {
  baseUrl:
    import.meta.env.VITE_GAS_WEB_APP_URL ||
    "https://script.google.com/macros/s/ISI_URL_WEB_APP_ANDA/exec",
  timeoutMs: 15000,
  cacheTTL: 60000,
};
