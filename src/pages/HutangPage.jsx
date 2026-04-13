import { useEffect, useState } from "react";
import { DataTable } from "../components/common/DataTable";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { PageHeader } from "../components/common/PageHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { RecordForm } from "../components/forms/RecordForm";
import { STATUS_OPTIONS } from "../constants/appConfig";
import { financeService } from "../services/financeService";
import { formatRupiah, formatTanggal } from "../utils/formatters";

export function HutangPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const result = await financeService.getDebts();
      setRows(result.data || []);
    } catch (err) {
      setError(err.message || "Data hutang belum bisa dimuat.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreate(payload) {
    const result = await financeService.createDebt(payload);
    setMessage(result.message);
    await loadData();
    setShowForm(false);
    return result;
  }

  async function handleStatusChange(id_hutang, status, sisa_hutang) {
    const result = await financeService.updateDebtStatus({ id_hutang, status, sisa_hutang });
    setMessage(result.message);
    await loadData();
  }

  if (loading) return <LoadingState label="Sedang mengambil data hutang..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="page-stack">
      <PageHeader
        title="Hutang"
        subtitle="Pantau sisa hutang dan tanggal jatuh tempo."
        action={
          <button type="button" className="button button-primary" onClick={() => setShowForm((prev) => !prev)}>
            {showForm ? "Tutup form" : "Tambah hutang"}
          </button>
        }
      />

      {showForm ? (
        <RecordForm
          type="hutang"
          submitLabel="Simpan data hutang"
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      ) : null}

      <section className="panel">
        {message ? <p className="form-message">{message}</p> : null}
        <DataTable
          columns={[
            { key: "nama_pemberi_hutang", label: "Pemberi hutang" },
            { key: "tanggal", label: "Tanggal", render: (row) => formatTanggal(row.tanggal) },
            { key: "tanggal_jatuh_tempo", label: "Jatuh tempo", render: (row) => formatTanggal(row.tanggal_jatuh_tempo) },
            { key: "nominal", label: "Total", render: (row) => formatRupiah(row.nominal) },
            { key: "sisa_hutang", label: "Sisa", render: (row) => formatRupiah(row.sisa_hutang) },
            { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
            {
              key: "aksi",
              label: "Perbarui status",
              render: (row) => (
                <select
                  className="table-select"
                  value={row.status}
                  onChange={(event) =>
                    handleStatusChange(row.id_hutang, event.target.value, row.sisa_hutang)
                  }
                >
                  {STATUS_OPTIONS.hutang.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              ),
            },
          ]}
          rows={rows}
        />
      </section>
    </div>
  );
}
