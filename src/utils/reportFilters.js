export function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

export function getCurrentMonthString() {
  return new Date().toISOString().slice(0, 7);
}

export function getCurrentYearString() {
  return new Date().toISOString().slice(0, 4);
}

export function buildReportFilters(form) {
  const period = form.periode || "bulanan";

  if (period === "harian") {
    return {
      periode: "harian",
      tanggal_mulai: form.tanggal || getTodayString(),
      tanggal_selesai: form.tanggal || getTodayString(),
      label_periode: `Harian ${form.tanggal || getTodayString()}`,
    };
  }

  if (period === "bulanan") {
    const monthValue = form.bulan || getCurrentMonthString();
    return {
      periode: "bulanan",
      bulan: monthValue,
      tanggal_mulai: `${monthValue}-01`,
      tanggal_selesai: `${monthValue}-31`,
      label_periode: `Bulanan ${monthValue}`,
    };
  }

  if (period === "tahunan") {
    const yearValue = form.tahun || getCurrentYearString();
    return {
      periode: "tahunan",
      tahun: yearValue,
      tanggal_mulai: `${yearValue}-01-01`,
      tanggal_selesai: `${yearValue}-12-31`,
      label_periode: `Tahunan ${yearValue}`,
    };
  }

  return {
    periode: "kustom",
    tanggal_mulai: form.tanggal_mulai || getTodayString(),
    tanggal_selesai: form.tanggal_selesai || getTodayString(),
    label_periode: `Kustom ${form.tanggal_mulai || getTodayString()} s.d. ${form.tanggal_selesai || getTodayString()}`,
  };
}

export function groupTransactionsByPeriod(items, period) {
  const grouped = items.reduce((acc, item) => {
    const date = String(item.tanggal || "");
    const key =
      period === "tahunan"
        ? date.slice(0, 7)
        : period === "bulanan"
          ? date
          : date.slice(0, 4);

    if (!acc[key]) {
      acc[key] = { key, pemasukan: 0, pengeluaran: 0, saldo: 0 };
    }

    if (item.jenis_transaksi === "Pemasukan") {
      acc[key].pemasukan += Number(item.nominal || 0);
    } else {
      acc[key].pengeluaran += Number(item.nominal || 0);
    }

    acc[key].saldo = acc[key].pemasukan - acc[key].pengeluaran;
    return acc;
  }, {});

  return Object.values(grouped).sort((a, b) => a.key.localeCompare(b.key));
}
