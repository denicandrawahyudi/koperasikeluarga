import { useEffect, useState } from "react";
import { BudgetForm } from "../components/forms/BudgetForm";
import { DataTable } from "../components/common/DataTable";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { PageHeader } from "../components/common/PageHeader";
import { financeService } from "../services/financeService";
import { formatPersen, formatRupiah } from "../utils/formatters";

export function AnggaranPage() {
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [budgetResult, categoryResult] = await Promise.all([
        financeService.getBudgets(),
        financeService.getCategories(),
      ]);
      setRows(budgetResult.data || []);
      setCategories(categoryResult.data || []);
    } catch (err) {
      setError(err.message || "Data anggaran belum bisa dimuat.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreate(payload) {
    const result = await financeService.createBudget(payload);
    setMessage(result.message);
    setShowForm(false);
    await loadData();
    return result;
  }

  async function handleUpdate(payload) {
    const result = await financeService.updateBudget(payload);
    setMessage(result.message);
    setEditingItem(null);
    await loadData();
    return result;
  }

  async function handleDelete(item) {
    const isConfirmed = window.confirm(`Hapus anggaran ${item.kategori} periode ${item.periode}?`);
    if (!isConfirmed) return;
    const result = await financeService.deleteBudget({ id_anggaran: item.id_anggaran });
    setMessage(result.message);
    await loadData();
  }

  if (loading) return <LoadingState label="Sedang mengambil data anggaran..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="page-stack">
      <PageHeader
        title="Anggaran"
        subtitle="Batas anggaran bulanan agar pengeluaran lebih terkontrol."
        action={
          <button type="button" className="button button-primary" onClick={() => setShowForm((prev) => !prev)}>
            {showForm ? "Tutup form" : "Tambah anggaran"}
          </button>
        }
      />

      {showForm ? (
        <BudgetForm categories={categories} onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      ) : null}
      {editingItem ? (
        <BudgetForm
          categories={categories}
          initialData={editingItem}
          onSubmit={handleUpdate}
          onCancel={() => setEditingItem(null)}
        />
      ) : null}

      <section className="panel">
        {message ? <p className="form-message">{message}</p> : null}
        <DataTable
          columns={[
            { key: "periode", label: "Periode" },
            { key: "kategori", label: "Kategori" },
            { key: "batas_anggaran", label: "Batas", render: (row) => formatRupiah(row.batas_anggaran) },
            { key: "terpakai", label: "Terpakai", render: (row) => formatRupiah(row.terpakai) },
            { key: "sisa", label: "Sisa", render: (row) => formatRupiah(row.sisa) },
            { key: "progress", label: "Progres", render: (row) => formatPersen((row.terpakai / row.batas_anggaran) * 100) },
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
          rows={rows}
        />
      </section>
    </div>
  );
}
