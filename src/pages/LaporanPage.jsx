import { useEffect, useMemo, useState } from "react";
import { SimpleBarChart } from "../components/charts/SimpleBarChart";
import { DataTable } from "../components/common/DataTable";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { PageHeader } from "../components/common/PageHeader";
import { financeService } from "../services/financeService";
import {
  exportRowsToExcel,
  exportRowsToPdf,
  mapSummaryForExport,
} from "../utils/exporters";
import { formatRupiah, sumBy } from "../utils/formatters";
import {
  buildReportFilters,
  getCurrentMonthString,
  getCurrentYearString,
  getTodayString,
} from "../utils/reportFilters";

const initialFilterForm = {
  periode: "bulanan",
  tanggal: getTodayString(),
  bulan: getCurrentMonthString(),
  tahun: getCurrentYearString(),
  tanggal_mulai: getTodayString(),
  tanggal_selesai: getTodayString(),
};

export function LaporanPage() {
  const [filterForm, setFilterForm] = useState(initialFilterForm);
  const [activeFilters, setActiveFilters] = useState(buildReportFilters(initialFilterForm));
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReports(filters) {
    try {
      setLoading(true);
      setError("");
      const result = await financeService.getReports(filters);
      setReports(result.data);
    } catch (err) {
      setError(err.message || "Laporan belum bisa dimuat.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports(activeFilters);
  }, [activeFilters]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFilterForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setActiveFilters(buildReportFilters(filterForm));
  }

  const summaryRows = useMemo(() => {
    if (!reports) return [];
    const pemasukan = reports.transaksi.filter((item) => item.jenis_transaksi === "Pemasukan");
    const pengeluaran = reports.transaksi.filter((item) => item.jenis_transaksi === "Pengeluaran");

    return [
      { id: "1", label: "Total pemasukan", jumlah: sumBy(pemasukan, (item) => item.nominal) },
      { id: "2", label: "Total pengeluaran", jumlah: sumBy(pengeluaran, (item) => item.nominal) },
      { id: "3", label: "Sisa hutang", jumlah: sumBy(reports.hutang, (item) => item.sisa_hutang) },
      { id: "4", label: "Sisa piutang", jumlah: sumBy(reports.piutang, (item) => item.sisa_piutang) },
    ];
  }, [reports]);

  const chartItems = useMemo(
    () => summaryRows.map((item, index) => ({
      label: item.label,
      value: item.jumlah,
      color: ["#5c8a72", "#c7844e", "#6d7aa8", "#8c6b59"][index],
    })),
    [summaryRows],
  );

  async function handleExportExcel() {
    await exportRowsToExcel({
      fileName: "ringkasan-laporan.xlsx",
      sheetName: "Ringkasan",
      rows: mapSummaryForExport(summaryRows),
    });
  }

  async function handleExportPdf() {
    const exported = mapSummaryForExport(summaryRows);
    await exportRowsToPdf({
      fileName: "ringkasan-laporan.pdf",
      title: `Ringkasan Laporan Keuangan ${activeFilters.label_periode}`,
      headers: Object.keys(exported[0] || {}),
      rows: exported.map((item) => Object.values(item)),
    });
  }

  if (loading) return <LoadingState label="Sedang menyiapkan laporan..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="page-stack">
      <PageHeader
        title="Laporan"
        subtitle={`Ringkasan pemasukan, pengeluaran, hutang, dan piutang untuk periode ${activeFilters.label_periode}.`}
        action={
          <div className="inline-actions">
            <button type="button" className="button" onClick={handleExportExcel}>
              Export Excel
            </button>
            <button type="button" className="button" onClick={handleExportPdf}>
              Export PDF
            </button>
          </div>
        }
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
              Tampilkan laporan
            </button>
          </div>
        </form>
      </section>

      <SimpleBarChart items={chartItems} />

      <section className="panel">
        <DataTable
          columns={[
            { key: "label", label: "Jenis laporan" },
            { key: "jumlah", label: "Nilai", render: (row) => formatRupiah(row.jumlah) },
          ]}
          rows={summaryRows}
        />
      </section>
    </div>
  );
}
