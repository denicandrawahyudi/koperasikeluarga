import { formatRupiah, formatTanggal } from "./formatters";

export async function exportRowsToExcel({ fileName, sheetName = "Data", rows }) {
  const XLSX = await import("xlsx");
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, fileName);
}

export async function exportRowsToPdf({ fileName, title, headers, rows }) {
  const { jsPDF } = await import("jspdf");
  const autoTableModule = await import("jspdf-autotable");
  const autoTable = autoTableModule.default;
  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(16);
  doc.text(title, 14, 16);

  autoTable(doc, {
    startY: 24,
    head: [headers],
    body: rows,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [95, 127, 108],
    },
  });

  doc.save(fileName);
}

export function mapTransactionsForExport(items) {
  return items.map((item) => ({
    ID: item.id_transaksi,
    Tanggal: formatTanggal(item.tanggal),
    Jenis: item.jenis_transaksi,
    Kategori: item.kategori,
    Subkategori: item.subkategori,
    Nominal: formatRupiah(item.nominal),
    Pembayaran: item.metode_pembayaran,
    Deskripsi: item.deskripsi,
    Catatan: item.catatan,
  }));
}

export function mapSummaryForExport(items) {
  return items.map((item) => ({
    Ringkasan: item.label,
    Nilai: formatRupiah(item.jumlah),
  }));
}
