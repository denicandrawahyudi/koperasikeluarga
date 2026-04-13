import { API_CONFIG } from "./apiConfig";

const memoryCache = new Map();

function getCacheKey(path, params = {}) {
  return `${path}:${JSON.stringify(params)}`;
}

function getCachedResponse(cacheKey) {
  const saved = memoryCache.get(cacheKey);
  if (!saved) return null;
  if (Date.now() > saved.expiredAt) {
    memoryCache.delete(cacheKey);
    return null;
  }
  return saved.value;
}

function setCachedResponse(cacheKey, value) {
  memoryCache.set(cacheKey, {
    value,
    expiredAt: Date.now() + API_CONFIG.cacheTTL,
  });
}

export async function apiGet(path, params = {}) {
  const cacheKey = getCacheKey(path, params);
  const cached = getCachedResponse(cacheKey);
  if (cached) return cached;

  const url = new URL(API_CONFIG.baseUrl);
  url.searchParams.set("path", path);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url.toString(), { method: "GET" });
  if (!response.ok) throw new Error("Gagal mengambil data dari server.");

  const data = await response.json();
  setCachedResponse(cacheKey, data);
  return data;
}

export async function apiPost(path, payload) {
  const response = await fetch(API_CONFIG.baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({ path, ...payload }),
  });

  if (!response.ok) throw new Error("Gagal menyimpan data ke server.");
  return response.json();
}
