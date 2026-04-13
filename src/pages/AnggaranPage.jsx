import { DataTable } from "../components/common/DataTable";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { PageHeader } from "../components/common/PageHeader";
import { useAsyncData } from "../hooks/useAsyncData";
import { financeService } from "../services/financeService";
import { formatPersen, formatRupiah } from "../utils/formatters";

export function AnggaranPage() {
  const anggaran = useAsyncData(() => financeService.getBudgets(), []);

  if (anggaran.loading) return <LoadingState label="Sedang mengambil data anggaran..." />;
  if (anggaran.error) return <ErrorState message={anggaran.error} />;

  return (
    <div className="page-stack">
      <PageHeader title="Anggaran" subtitle="Batas anggaran bulanan agar pengeluaran lebih terkontrol." />
      <section className="panel">
        <DataTable
          columns={[
            { key: "periode", label: "Periode" },
            { key: "kategori", label: "Kategori" },
            { key: "batas_anggaran", label: "Batas", render: (row) => formatRupiah(row.batas_anggaran) },
            { key: "terpakai", label: "Terpakai", render: (row) => formatRupiah(row.terpakai) },
            { key: "sisa", label: "Sisa", render: (row) => formatRupiah(row.sisa) },
            { key: "progress", label: "Progres", render: (row) => formatPersen((row.terpakai / row.batas_anggaran) * 100) },
          ]}
          rows={anggaran.data}
        />
      </section>
    </div>
  );
}
