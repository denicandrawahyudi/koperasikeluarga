import { APP_INFO } from "../constants/appConfig";

export function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function formatTanggal(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat(APP_INFO.formatTanggal, {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function formatPersen(value) {
  return `${Math.round(Number(value || 0))}%`;
}

export function sumBy(items, selector) {
  return items.reduce((total, item) => total + Number(selector(item) || 0), 0);
}
