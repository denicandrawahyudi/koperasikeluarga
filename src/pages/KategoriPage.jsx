import { useEffect, useState } from "react";
import { CategoryForm } from "../components/forms/CategoryForm";
import { DataTable } from "../components/common/DataTable";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { PageHeader } from "../components/common/PageHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { financeService } from "../services/financeService";

export function KategoriPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const result = await financeService.getCategories();
      setRows(result.data || []);
    } catch (err) {
      setError(err.message || "Data kategori belum bisa dimuat.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreate(payload) {
    const result = await financeService.createCategory(payload);
    setMessage(result.message);
    setShowForm(false);
    await loadData();
    return result;
  }

  async function handleUpdate(payload) {
    const result = await financeService.updateCategory(payload);
    setMessage(result.message);
    setEditingItem(null);
    await loadData();
    return result;
  }

  async function handleDelete(item) {
    const isConfirmed = window.confirm(`Nonaktifkan kategori ${item.nama_kategori}?`);
    if (!isConfirmed) return;
    const result = await financeService.deleteCategory({ id_kategori: item.id_kategori });
    setMessage(result.message);
    await loadData();
  }

  if (loading) return <LoadingState label="Sedang mengambil data kategori..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="page-stack">
      <PageHeader
        title="Kategori"
        subtitle="Daftar kategori pemasukan dan pengeluaran."
        action={
          <button type="button" className="button button-primary" onClick={() => setShowForm((prev) => !prev)}>
            {showForm ? "Tutup form" : "Tambah kategori"}
          </button>
        }
      />

      {showForm ? <CategoryForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} /> : null}
      {editingItem ? (
        <CategoryForm
          initialData={editingItem}
          onSubmit={handleUpdate}
          onCancel={() => setEditingItem(null)}
        />
      ) : null}

      <section className="panel">
        {message ? <p className="form-message">{message}</p> : null}
        <DataTable
          columns={[
            { key: "nama_kategori", label: "Nama kategori" },
            { key: "jenis", label: "Jenis" },
            { key: "ikon", label: "Ikon" },
            {
              key: "warna",
              label: "Warna",
              render: (row) => (
                <span className="color-chip" style={{ backgroundColor: row.warna }}>
                  {row.warna}
                </span>
              ),
            },
            { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
            {
              key: "aksi",
              label: "Aksi",
              render: (row) => (
                <div className="table-actions">
                  <button type="button" className="button button-small" onClick={() => setEditingItem(row)}>
                    Ubah
                  </button>
                  <button type="button" className="button button-small button-danger" onClick={() => handleDelete(row)}>
                    Nonaktifkan
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
