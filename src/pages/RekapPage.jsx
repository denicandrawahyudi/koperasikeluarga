import { useEffect, useMemo, useState } from "react";
import { DataTable } from "../components/common/DataTable";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { PageHeader } from "../components/common/PageHeader";
import { financeService } from "../services/financeService";
import { formatRupiah } from "../utils/formatters";
import {
  buildReportFilters,
  getCurrentMonthString,
  getCurrentYearString,
  getTodayString,
  groupTransactionsByPeriod,
} from "../utils/reportFilters";

const initialFilterForm = {
  periode: "bulanan",
  tanggal: getTodayString(),
  bulan: getCurrentMonthString(),
  tahun: getCurrentYearString(),
  tanggal_mulai: getTodayString(),
  tanggal_selesai: getTodayString(),
};

export function RekapPage() {
  const [filterForm, setFilterForm] = useState(initialFilterForm);
  const [activeFilters, setActiveFilters] = useState(buildReportFilters(initialFilterForm));
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        setError("");
        const result = await financeService.getReports(activeFilters);
        setReports(result.data);
      } catch (err) {
        setError(err.message || "Rekap belum bisa dimuat.");
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, [activeFilters]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFilterForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setActiveFilters(buildReportFilters(filterForm));
  }

  const groupedRows = useMemo(() => {
    if (!reports) return [];
    return groupTransactionsByPeriod(reports.transaksi, activeFilters.periode);
  }, [reports, activeFilters.periode]);

  if (loading) return <LoadingState label="Sedang menyiapkan rekap..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="page-stack">
      <PageHeader
        title="Rekap"
        subtitle={`Rekap ${activeFilters.label_periode} untuk melihat pemasukan, pengeluaran, dan saldo.`}
      />

      <section className="panel">
        <form className="filter-grid" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Pilih periode</span>
            <select name="periode" value={filterForm.periode} onChange={handleChange}>
              <option value="harian">Harian</option>
              <option value="bulanan">Bulanan</option>
              <option value="tahunan">Tahunan</option>
              <option value="kustom">Kustom</option>
            </select>
          </label>

          {filterForm.periode === "harian" ? (
            <label className="form-field">
              <span>Tanggal</span>
              <input type="date" name="tanggal" value={filterForm.tanggal} onChange={handleChange} />
            </label>
          ) : null}

          {filterForm.periode === "bulanan" ? (
            <label className="form-field">
              <span>Bulan</span>
              <input type="month" name="bulan" value={filterForm.bulan} onChange={handleChange} />
            </label>
          ) : null}

          {filterForm.periode === "tahunan" ? (
            <label className="form-field">
              <span>Tahun</span>
              <input type="number" name="tahun" min="2000" max="2100" value={filterForm.tahun} onChange={handleChange} />
            </label>
          ) : null}

          {filterForm.periode === "kustom" ? (
            <>
              <label className="form-field">
                <span>Tanggal mulai</span>
                <input type="date" name="tanggal_mulai" value={filterForm.tanggal_mulai} onChange={handleChange} />
              </label>
              <label className="form-field">
                <span>Tanggal selesai</span>
                <input type="date" name="tanggal_selesai" value={filterForm.tanggal_selesai} onChange={handleChange} />
              </label>
            </>
          ) : null}

          <div className="filter-submit">
            <button type="submit" className="button button-primary">
              Tampilkan rekap
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <DataTable
          columns={[
            { key: "key", label: "Periode" },
            { key: "pemasukan", label: "Pemasukan", render: (row) => formatRupiah(row.pemasukan) },
            { key: "pengeluaran", label: "Pengeluaran", render: (row) => formatRupiah(row.pengeluaran) },
            { key: "saldo", label: "Saldo", render: (row) => formatRupiah(row.saldo) },
          ]}
          rows={groupedRows}
          emptyMessage="Belum ada transaksi pada periode ini."
        />
      </section>
    </div>
  );
}
