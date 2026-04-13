const SPREADSHEET_ID = "ISI_SPREADSHEET_ID_ANDA";

const SHEETS = {
  pengguna: "Pengguna",
  transaksi: "Transaksi",
  hutang: "Hutang",
  piutang: "Piutang",
  kategori: "Kategori",
  anggaran: "Anggaran",
  pengaturan: "Pengaturan",
};

function doGet(e) {
  const params = e && e.parameter ? e.parameter : {};
  const path = params.path || "";

  try {
    let data;
    switch (path) {
      case "dashboard/summary":
        data = getDashboardSummary_();
        break;
      case "transactions":
        data = getTransactions_(params);
        break;
      case "debts":
        data = getSheetObjects_(SHEETS.hutang);
        break;
      case "receivables":
        data = getSheetObjects_(SHEETS.piutang);
        break;
      case "categories":
        data = getSheetObjects_(SHEETS.kategori);
        break;
      case "budgets":
        data = getSheetObjects_(SHEETS.anggaran);
        break;
      case "reports":
        data = {
          transaksi: getTransactions_(params),
          hutang: getSheetObjects_(SHEETS.hutang),
          piutang: getSheetObjects_(SHEETS.piutang),
        };
        break;
      case "settings":
        data = getFirstObject_(SHEETS.pengaturan);
        break;
      default:
        return jsonResponse_({ success: false, message: "Endpoint tidak dikenali.", data: null });
    }

    return jsonResponse_({ success: true, message: "Data berhasil diambil.", data: data });
  } catch (error) {
    return jsonResponse_({ success: false, message: error.message, data: null });
  }
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || "{}");
    const path = payload.path || "";
    let result;

    switch (path) {
      case "auth/login":
        result = login_(payload);
        break;
      case "transactions/create":
        result = createTransaction_(payload);
        break;
      case "transactions/update":
        result = updateTransaction_(payload);
        break;
      case "transactions/delete":
        result = deleteTransaction_(payload);
        break;
      case "debts/create":
        result = createDebt_(payload);
        break;
      case "debts/update-status":
        result = updateRowField_(SHEETS.hutang, "id_hutang", payload.id_hutang, { status: payload.status });
        break;
      case "receivables/create":
        result = createReceivable_(payload);
        break;
      case "receivables/update-status":
        result = updateRowField_(SHEETS.piutang, "id_piutang", payload.id_piutang, { status: payload.status });
        break;
      case "categories/create":
        result = createCategory_(payload);
        break;
      case "categories/update":
        result = updateCategory_(payload);
        break;
      case "categories/delete":
        result = updateRowField_(SHEETS.kategori, "id_kategori", payload.id_kategori, { status: "Nonaktif" });
        break;
      case "budgets/create":
        result = createBudget_(payload);
        break;
      case "budgets/update":
        result = updateBudget_(payload);
        break;
      case "budgets/delete":
        result = deleteBudget_(payload);
        break;
      default:
        return jsonResponse_({ success: false, message: "Permintaan tidak dikenali.", data: null });
    }

    return jsonResponse_({ success: true, message: "Permintaan berhasil diproses.", data: result });
  } catch (error) {
    return jsonResponse_({ success: false, message: error.message, data: null });
  }
}

function login_(payload) {
  const users = getSheetObjects_(SHEETS.pengguna);
  const user = users.find((item) => item.nomor_hp === payload.identitas || item.email === payload.identitas);

  if (!user) throw new Error("Pengguna tidak ditemukan.");
  if (String(user.pin) !== String(payload.pin)) throw new Error("PIN tidak sesuai.");

  return { user: user, token: Utilities.getUuid() };
}

function createTransaction_(payload) {
  validateTransactionPayload_(payload);
  const row = {
    id_transaksi: "TRX-" + new Date().getTime(),
    tanggal: payload.tanggal || "",
    jenis_transaksi: payload.jenis_transaksi || "",
    kategori: payload.kategori || "",
    subkategori: payload.subkategori || "",
    nominal: payload.nominal || 0,
    metode_pembayaran: payload.metode_pembayaran || "",
    deskripsi: payload.deskripsi || "",
    catatan: payload.catatan || "",
    lampiran_bukti: payload.lampiran_bukti || "",
    tag: payload.tag || "",
    dibuat_oleh: payload.dibuat_oleh || "Sistem",
    waktu_input: new Date().toISOString(),
    status_data: "Aktif",
  };

  appendObject_(SHEETS.transaksi, row);
  return row;
}

function updateTransaction_(payload) {
  validateTransactionPayload_(payload);
  return updateRowField_(SHEETS.transaksi, "id_transaksi", payload.id_transaksi, payload);
}

function deleteTransaction_(payload) {
  return updateRowField_(SHEETS.transaksi, "id_transaksi", payload.id_transaksi, { status_data: "Dihapus" });
}

function createDebt_(payload) {
  validateDebtPayload_(payload);
  const row = {
    id_hutang: "HTG-" + new Date().getTime(),
    tanggal: payload.tanggal || "",
    nama_pemberi_hutang: payload.nama_pemberi_hutang || "",
    nominal: payload.nominal || 0,
    tanggal_jatuh_tempo: payload.tanggal_jatuh_tempo || "",
    status: payload.status || "Belum Lunas",
    keterangan: payload.keterangan || "",
    sisa_hutang: payload.sisa_hutang || payload.nominal || 0,
    dibuat_oleh: payload.dibuat_oleh || "Sistem",
  };
  appendObject_(SHEETS.hutang, row);
  return row;
}

function createReceivable_(payload) {
  validateReceivablePayload_(payload);
  const row = {
    id_piutang: "PTG-" + new Date().getTime(),
    tanggal: payload.tanggal || "",
    nama_peminjam: payload.nama_peminjam || "",
    nominal: payload.nominal || 0,
    tanggal_jatuh_tempo: payload.tanggal_jatuh_tempo || "",
    status: payload.status || "Belum Dibayar",
    keterangan: payload.keterangan || "",
    sisa_piutang: payload.sisa_piutang || payload.nominal || 0,
    dibuat_oleh: payload.dibuat_oleh || "Sistem",
  };
  appendObject_(SHEETS.piutang, row);
  return row;
}

function createCategory_(payload) {
  validateCategoryPayload_(payload);
  const row = {
    id_kategori: "KAT-" + new Date().getTime(),
    nama_kategori: payload.nama_kategori || "",
    jenis: payload.jenis || "",
    ikon: payload.ikon || "",
    warna: payload.warna || "#5c8a72",
    status: payload.status || "Aktif",
  };
  appendObject_(SHEETS.kategori, row);
  return row;
}

function updateCategory_(payload) {
  validateCategoryPayload_(payload);
  return updateRowField_(SHEETS.kategori, "id_kategori", payload.id_kategori, payload);
}

function createBudget_(payload) {
  validateBudgetPayload_(payload);
  const row = {
    id_anggaran: "ANG-" + new Date().getTime(),
    periode: payload.periode || "",
    kategori: payload.kategori || "",
    batas_anggaran: payload.batas_anggaran || 0,
    terpakai: payload.terpakai || 0,
    sisa: payload.sisa || payload.batas_anggaran || 0,
    dibuat_oleh: payload.dibuat_oleh || "Sistem",
  };
  appendObject_(SHEETS.anggaran, row);
  return row;
}

function updateBudget_(payload) {
  validateBudgetPayload_(payload);
  return updateRowField_(SHEETS.anggaran, "id_anggaran", payload.id_anggaran, payload);
}

function deleteBudget_(payload) {
  const sheet = getSheetByName_(SHEETS.anggaran);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf("id_anggaran");
  if (idIndex === -1) throw new Error("Kolom ID anggaran tidak ditemukan.");

  for (let i = 1; i < data.length; i += 1) {
    if (String(data[i][idIndex]) === String(payload.id_anggaran)) {
      sheet.deleteRow(i + 1);
      return { id: payload.id_anggaran, deleted: true };
    }
  }

  throw new Error("Data anggaran tidak ditemukan.");
}

function getDashboardSummary_() {
  const transaksi = getTransactions_({});
  const hutang = getSheetObjects_(SHEETS.hutang);
  const piutang = getSheetObjects_(SHEETS.piutang);
  const now = new Date();
  const zone = Session.getScriptTimeZone();
  const todayKey = Utilities.formatDate(now, zone, "yyyy-MM-dd");
  const monthKey = Utilities.formatDate(now, zone, "yyyy-MM");
  const yearKey = Utilities.formatDate(now, zone, "yyyy");

  function totalByPeriod(type, key) {
    return transaksi
      .filter((item) => String(item.tanggal).indexOf(key) === 0 && item.jenis_transaksi === type)
      .reduce((sum, item) => sum + Number(item.nominal || 0), 0);
  }

  function summaryFor(key) {
    const pemasukan = totalByPeriod("Pemasukan", key);
    const pengeluaran = totalByPeriod("Pengeluaran", key);
    return { pemasukan: pemasukan, pengeluaran: pengeluaran, saldo: pemasukan - pengeluaran };
  }

  return {
    hariIni: summaryFor(todayKey),
    bulanIni: summaryFor(monthKey),
    tahunIni: summaryFor(yearKey),
    totalHutang: hutang.reduce((sum, item) => sum + Number(item.sisa_hutang || 0), 0),
    totalPiutang: piutang.reduce((sum, item) => sum + Number(item.sisa_piutang || 0), 0),
    saldoAkhir: transaksi.reduce((sum, item) => sum + (item.jenis_transaksi === "Pemasukan" ? Number(item.nominal || 0) : -Number(item.nominal || 0)), 0),
  };
}

function getTransactions_(params) {
  const items = getSheetObjects_(SHEETS.transaksi).filter((item) => item.status_data !== "Dihapus");
  return items.filter((item) => {
    if (params.jenis && item.jenis_transaksi !== params.jenis) return false;
    if (params.bulan && String(item.tanggal).indexOf(String(params.bulan)) !== 0) return false;
    if (params.tahun && String(item.tanggal).indexOf(String(params.tahun)) !== 0) return false;
    if (params.keyword) {
      const haystack = (
        item.kategori + " " + item.subkategori + " " + item.deskripsi + " " + item.catatan
      ).toLowerCase();
      if (haystack.indexOf(String(params.keyword).toLowerCase()) === -1) return false;
    }
    if (params.tanggal_mulai && String(item.tanggal) < String(params.tanggal_mulai)) return false;
    if (params.tanggal_selesai && String(item.tanggal) > String(params.tanggal_selesai)) return false;
    return true;
  });
}

function validateTransactionPayload_(payload) {
  if (!payload.tanggal) throw new Error("Tanggal wajib diisi.");
  if (!payload.jenis_transaksi) throw new Error("Jenis transaksi wajib diisi.");
  if (!payload.kategori) throw new Error("Kategori wajib diisi.");
  if (Number(payload.nominal || 0) <= 0) throw new Error("Nominal harus lebih besar dari 0.");
}

function validateDebtPayload_(payload) {
  if (!payload.tanggal) throw new Error("Tanggal wajib diisi.");
  if (!payload.nama_pemberi_hutang) throw new Error("Nama pemberi hutang wajib diisi.");
  if (Number(payload.nominal || 0) <= 0) throw new Error("Nominal hutang harus lebih besar dari 0.");
  if (!payload.tanggal_jatuh_tempo) throw new Error("Tanggal jatuh tempo wajib diisi.");
}

function validateReceivablePayload_(payload) {
  if (!payload.tanggal) throw new Error("Tanggal wajib diisi.");
  if (!payload.nama_peminjam) throw new Error("Nama peminjam wajib diisi.");
  if (Number(payload.nominal || 0) <= 0) throw new Error("Nominal piutang harus lebih besar dari 0.");
  if (!payload.tanggal_jatuh_tempo) throw new Error("Tanggal jatuh tempo wajib diisi.");
}

function validateCategoryPayload_(payload) {
  if (!payload.nama_kategori) throw new Error("Nama kategori wajib diisi.");
  if (!payload.jenis) throw new Error("Jenis kategori wajib diisi.");
}

function validateBudgetPayload_(payload) {
  if (!payload.periode) throw new Error("Periode wajib diisi.");
  if (!payload.kategori) throw new Error("Kategori anggaran wajib diisi.");
  if (Number(payload.batas_anggaran || 0) <= 0) throw new Error("Batas anggaran harus lebih besar dari 0.");
}

function getSpreadsheet_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getSheetByName_(sheetName) {
  const sheet = getSpreadsheet_().getSheetByName(sheetName);
  if (!sheet) throw new Error("Sheet " + sheetName + " tidak ditemukan.");
  return sheet;
}

function getSheetObjects_(sheetName) {
  const sheet = getSheetByName_(sheetName);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = values[0];
  return values.slice(1).map(function(row) {
    const obj = {};
    headers.forEach(function(header, index) {
      obj[header] = row[index];
    });
    return obj;
  });
}

function getFirstObject_(sheetName) {
  const rows = getSheetObjects_(sheetName);
  return rows[0] || {};
}

function appendObject_(sheetName, rowObj) {
  const sheet = getSheetByName_(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map(function(header) {
    return rowObj[header] !== undefined ? rowObj[header] : "";
  });
  sheet.appendRow(row);
}

function updateRowField_(sheetName, idKey, idValue, newValues) {
  const sheet = getSheetByName_(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf(idKey);

  if (idIndex === -1) throw new Error("Kolom ID tidak ditemukan.");

  for (let i = 1; i < data.length; i += 1) {
    if (String(data[i][idIndex]) === String(idValue)) {
      headers.forEach(function(header, columnIndex) {
        if (newValues[header] !== undefined) {
          sheet.getRange(i + 1, columnIndex + 1).setValue(newValues[header]);
        }
      });
      return { id: idValue, updated: true };
    }
  }

  throw new Error("Data tidak ditemukan.");
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
