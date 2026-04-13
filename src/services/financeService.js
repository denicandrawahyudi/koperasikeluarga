import {
  dummyAnggaran,
  dummyDashboard,
  dummyHutang,
  dummyKategori,
  dummyPengaturan,
  dummyPiutang,
  dummyTransactions,
  dummyUser,
} from "./dummyData";
import { apiGet, apiPost } from "./apiClient";

const useDummy = import.meta.env.VITE_USE_DUMMY_DATA !== "false";
let dummyTransactionsStore = [...dummyTransactions];
let dummyDebtsStore = [...dummyHutang];
let dummyReceivablesStore = [...dummyPiutang];
let dummyBudgetsStore = [...dummyAnggaran];
let dummyCategoriesStore = [...dummyKategori];
let dummySettingsStore = { ...dummyPengaturan };

function delay(data) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 250);
  });
}

function buildDummyDashboard() {
  const activeTransactions = dummyTransactionsStore.filter(
    (item) => item.status_data !== "Dihapus",
  );

  const totals = activeTransactions.reduce(
    (acc, item) => {
      if (item.jenis_transaksi === "Pemasukan") acc.pemasukan += Number(item.nominal || 0);
      if (item.jenis_transaksi === "Pengeluaran") acc.pengeluaran += Number(item.nominal || 0);
      return acc;
    },
    { pemasukan: 0, pengeluaran: 0 },
  );

  return {
    ...dummyDashboard,
    totalHutang: dummyDebtsStore.reduce((sum, item) => sum + Number(item.sisa_hutang || 0), 0),
    totalPiutang: dummyReceivablesStore.reduce((sum, item) => sum + Number(item.sisa_piutang || 0), 0),
    saldoAkhir: totals.pemasukan - totals.pengeluaran,
    bulanIni: {
      pemasukan: totals.pemasukan,
      pengeluaran: totals.pengeluaran,
      saldo: totals.pemasukan - totals.pengeluaran,
    },
  };
}

function filterDummyTransactions(filters = {}) {
  return dummyTransactionsStore.filter((item) => {
    if (item.status_data === "Dihapus") return false;
    if (filters.jenis && item.jenis_transaksi !== filters.jenis) return false;
    if (filters.tanggal_mulai && String(item.tanggal) < String(filters.tanggal_mulai)) return false;
    if (filters.tanggal_selesai && String(item.tanggal) > String(filters.tanggal_selesai)) return false;
    if (filters.bulan && !String(item.tanggal).startsWith(String(filters.bulan))) return false;
    if (filters.tahun && !String(item.tanggal).startsWith(String(filters.tahun))) return false;
    if (filters.keyword) {
      const haystack =
        `${item.kategori} ${item.subkategori} ${item.deskripsi} ${item.catatan}`.toLowerCase();
      if (!haystack.includes(String(filters.keyword).toLowerCase())) return false;
    }
    return true;
  });
}

export const financeService = {
  login: async (payload) =>
    useDummy
      ? delay({
          success: true,
          message: "Login berhasil.",
          data: { user: dummyUser, token: "dummy-session-token", pin: payload.pin },
        })
      : apiPost("auth/login", payload),
  getDashboardSummary: async () =>
    useDummy ? delay({ success: true, data: buildDummyDashboard() }) : apiGet("dashboard/summary"),
  getTransactions: async (filters = {}) =>
    useDummy ? delay({ success: true, data: filterDummyTransactions(filters), filters }) : apiGet("transactions", filters),
  createTransaction: async (payload) => {
    if (useDummy) {
      const created = {
        ...payload,
        id_transaksi: `TRX-${Date.now()}`,
        dibuat_oleh: payload.dibuat_oleh || dummyUser.nama,
        waktu_input: new Date().toISOString(),
        status_data: "Aktif",
      };
      dummyTransactionsStore = [created, ...dummyTransactionsStore];
      return delay({ success: true, message: "Transaksi berhasil disimpan.", data: created });
    }
    return apiPost("transactions/create", payload);
  },
  updateTransaction: async (payload) => {
    if (useDummy) {
      dummyTransactionsStore = dummyTransactionsStore.map((item) =>
        item.id_transaksi === payload.id_transaksi ? { ...item, ...payload } : item,
      );
      return delay({ success: true, message: "Transaksi berhasil diperbarui.", data: payload });
    }
    return apiPost("transactions/update", payload);
  },
  deleteTransaction: async (payload) => {
    if (useDummy) {
      dummyTransactionsStore = dummyTransactionsStore.map((item) =>
        item.id_transaksi === payload.id_transaksi
          ? { ...item, status_data: "Dihapus" }
          : item,
      );
      return delay({ success: true, message: "Transaksi berhasil dihapus.", data: payload });
    }
    return apiPost("transactions/delete", payload);
  },
  getDebts: async () =>
    useDummy ? delay({ success: true, data: dummyDebtsStore }) : apiGet("debts"),
  createDebt: async (payload) => {
    if (useDummy) {
      const created = {
        ...payload,
        id_hutang: `HTG-${Date.now()}`,
        dibuat_oleh: payload.dibuat_oleh || dummyUser.id_pengguna,
      };
      dummyDebtsStore = [created, ...dummyDebtsStore];
      return delay({ success: true, message: "Data hutang berhasil disimpan.", data: created });
    }
    return apiPost("debts/create", payload);
  },
  getReceivables: async () =>
    useDummy ? delay({ success: true, data: dummyReceivablesStore }) : apiGet("receivables"),
  createReceivable: async (payload) => {
    if (useDummy) {
      const created = {
        ...payload,
        id_piutang: `PTG-${Date.now()}`,
        dibuat_oleh: payload.dibuat_oleh || dummyUser.id_pengguna,
      };
      dummyReceivablesStore = [created, ...dummyReceivablesStore];
      return delay({ success: true, message: "Data piutang berhasil disimpan.", data: created });
    }
    return apiPost("receivables/create", payload);
  },
  updateDebtStatus: async (payload) =>
    useDummy
      ? (() => {
          dummyDebtsStore = dummyDebtsStore.map((item) =>
            item.id_hutang === payload.id_hutang ? { ...item, ...payload } : item,
          );
          return delay({ success: true, message: "Status hutang diperbarui.", data: payload });
        })()
      : apiPost("debts/update-status", payload),
  updateReceivableStatus: async (payload) =>
    useDummy
      ? (() => {
          dummyReceivablesStore = dummyReceivablesStore.map((item) =>
            item.id_piutang === payload.id_piutang ? { ...item, ...payload } : item,
          );
          return delay({ success: true, message: "Status piutang diperbarui.", data: payload });
        })()
      : apiPost("receivables/update-status", payload),
  getCategories: async () =>
    useDummy ? delay({ success: true, data: dummyCategoriesStore }) : apiGet("categories"),
  createCategory: async (payload) => {
    if (useDummy) {
      const created = {
        ...payload,
        id_kategori: `KAT-${Date.now()}`,
      };
      dummyCategoriesStore = [created, ...dummyCategoriesStore];
      return delay({ success: true, message: "Kategori berhasil disimpan.", data: created });
    }
    return apiPost("categories/create", payload);
  },
  updateCategory: async (payload) => {
    if (useDummy) {
      dummyCategoriesStore = dummyCategoriesStore.map((item) =>
        item.id_kategori === payload.id_kategori ? { ...item, ...payload } : item,
      );
      return delay({ success: true, message: "Kategori berhasil diperbarui.", data: payload });
    }
    return apiPost("categories/update", payload);
  },
  deleteCategory: async (payload) => {
    if (useDummy) {
      dummyCategoriesStore = dummyCategoriesStore.map((item) =>
        item.id_kategori === payload.id_kategori ? { ...item, status: "Nonaktif" } : item,
      );
      return delay({ success: true, message: "Kategori dinonaktifkan.", data: payload });
    }
    return apiPost("categories/delete", payload);
  },
  getBudgets: async () =>
    useDummy ? delay({ success: true, data: dummyBudgetsStore }) : apiGet("budgets"),
  createBudget: async (payload) => {
    if (useDummy) {
      const created = {
        ...payload,
        id_anggaran: `ANG-${Date.now()}`,
      };
      dummyBudgetsStore = [created, ...dummyBudgetsStore];
      return delay({ success: true, message: "Anggaran berhasil disimpan.", data: created });
    }
    return apiPost("budgets/create", payload);
  },
  updateBudget: async (payload) => {
    if (useDummy) {
      dummyBudgetsStore = dummyBudgetsStore.map((item) =>
        item.id_anggaran === payload.id_anggaran ? { ...item, ...payload } : item,
      );
      return delay({ success: true, message: "Anggaran berhasil diperbarui.", data: payload });
    }
    return apiPost("budgets/update", payload);
  },
  deleteBudget: async (payload) => {
    if (useDummy) {
      dummyBudgetsStore = dummyBudgetsStore.filter(
        (item) => item.id_anggaran !== payload.id_anggaran,
      );
      return delay({ success: true, message: "Anggaran berhasil dihapus.", data: payload });
    }
    return apiPost("budgets/delete", payload);
  },
  getReports: async (filters = {}) =>
    useDummy ? delay({ success: true, data: { transaksi: filterDummyTransactions(filters), hutang: dummyDebtsStore, piutang: dummyReceivablesStore }, filters }) : apiGet("reports", filters),
  getSettings: async () =>
    useDummy ? delay({ success: true, data: dummySettingsStore }) : apiGet("settings"),
};
