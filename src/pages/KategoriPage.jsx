import { DataTable } from "../components/common/DataTable";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { PageHeader } from "../components/common/PageHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { useAsyncData } from "../hooks/useAsyncData";
import { financeService } from "../services/financeService";

export function KategoriPage() {
  const kategori = useAsyncData(() => financeService.getCategories(), []);

  if (kategori.loading) return <LoadingState label="Sedang mengambil data kategori..." />;
  if (kategori.error) return <ErrorState message={kategori.error} />;

  return (
    <div className="page-stack">
      <PageHeader title="Kategori" subtitle="Daftar kategori pemasukan dan pengeluaran." />
      <section className="panel">
        <DataTable
          columns={[
            { key: "nama_kategori", label: "Nama kategori" },
            { key: "jenis", label: "Jenis" },
            { key: "ikon", label: "Ikon" },
            { key: "warna", label: "Warna" },
            { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
          ]}
          rows={kategori.data}
        />
      </section>
    </div>
  );
}
