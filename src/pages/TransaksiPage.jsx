import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DataTable } from "../components/common/DataTable";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { PageHeader } from "../components/common/PageHeader";
import { TransactionForm } from "../components/forms/TransactionForm";
import { financeService } from "../services/financeService";
import {
  exportRowsToExcel,
  exportRowsToPdf,
  mapTransactionsForExport,
} from "../utils/exporters";
import { formatRupiah, formatTanggal } from "../utils/formatters";

export function TransaksiPage() {
  const [keyword, setKeyword] = useState("");
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [transaksiResult, kategoriResult] = await Promise.all([
        financeService.getTransactions(),
        financeService.getCategories(),
      ]);
      setRows(transaksiResult.data || []);
      setCategories(kategoriResult.data || []);
    } catch (err) {
      setError(err.message || "Data transaksi gagal dimuat.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredRows = useMemo(() => {
    return rows.filter((item) => {
      const text = `${item.kategori} ${item.deskripsi} ${item.subkategori}`.toLowerCase();
      return text.includes(keyword.toLowerCase());
    });
  }, [rows, keyword]);

  async function handleDelete(item) {
    const isConfirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus transaksi ${item.kategori} sebesar ${formatRupiah(item.nominal)}?`,
    );
    if (!isConfirmed) return;

    const result = await financeService.deleteTransaction({
      id_transaksi: item.id_transaksi,
    });
    setMessage(result.message);
    await loadData();
  }

  async function handleUpdate(payload) {
    const result = await financeService.updateTransaction(payload);
    setMessage(result.message);
    setEditingItem(null);
    await loadData();
    return result;
  }

  async function handleExportExcel() {
    const exported = mapTransactionsForExport(filteredRows);
    await exportRowsToExcel({
      fileName: "laporan-transaksi.xlsx",
      sheetName: "Transaksi",
      rows: exported,
    });
  }

  async function handleExportPdf() {
    const exported = mapTransactionsForExport(filteredRows);
    await exportRowsToPdf({
      fileName: "laporan-transaksi.pdf",
      title: "Laporan Transaksi",
      headers: Object.keys(exported[0] || {}),
      rows: exported.map((item) => Object.values(item)),
    });
  }

  if (loading) return <LoadingState label="Sedang mengambil daftar transaksi..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="page-stack">
      <PageHeader
        title="Transaksi"
        subtitle="Cari dan lihat semua pemasukan serta pengeluaran."
        action={
          <div className="inline-actions">
            <button type="button" className="button" onClick={handleExportExcel}>
              Export Excel
            </button>
            <button type="button" className="button" onClick={handleExportPdf}>
              Export PDF
            </button>
            <Link to="/tambah-transaksi" className="button button-primary">
              Tambah transaksi
            </Link>
          </div>
        }
      />

      <section className="panel">
        <label className="form-field">
          <span>Pencarian cepat</span>
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Cari kategori, subkategori, atau keterangan"
          />
        </label>
        {message ? <p className="form-message">{message}</p> : null}
      </section>

      {editingItem ? (
        <section className="panel">
          <PageHeader
            title="Ubah transaksi"
            subtitle="Perbarui data transaksi yang dipilih."
          />
          <TransactionForm
            categories={categories}
            initialData={editingItem}
            submitLabel="Simpan perubahan"
            onSubmit={handleUpdate}
            onCancel={() => setEditingItem(null)}
          />
        </section>
      ) : null}

      {filteredRows.length ? (
        <section className="panel">
          <DataTable
            columns={[
              { key: "tanggal", label: "Tanggal", render: (row) => formatTanggal(row.tanggal) },
              { key: "jenis_transaksi", label: "Jenis" },
              { key: "kategori", label: "Kategori" },
              { key: "subkategori", label: "Subkategori" },
              { key: "nominal", label: "Nominal", render: (row) => formatRupiah(row.nominal) },
              { key: "metode_pembayaran", label: "Pembayaran" },
              {
                key: "aksi",
                label: "Aksi",
                render: (row) => (
                  <div className="table-actions">
                    <button type="button" className="button button-small" onClick={() => setEditingItem(row)}>
                      Ubah
                    </button>
                    <button type="button" className="button button-small button-danger" onClick={() => handleDelete(row)}>
                      Hapus
                    </button>
                  </div>
                ),
              },
            ]}
            rows={filteredRows}
          />
        </section>
      ) : (
        <EmptyState title="Belum ada transaksi yang cocok" description="Coba kata kunci lain atau tambahkan transaksi baru." />
      )}
    </div>
  );
}
