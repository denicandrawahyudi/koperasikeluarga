import { DataTable } from "../components/common/DataTable";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { PageHeader } from "../components/common/PageHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { useAsyncData } from "../hooks/useAsyncData";
import { financeService } from "../services/financeService";
import { formatRupiah, formatTanggal } from "../utils/formatters";

export function PiutangPage() {
  const piutang = useAsyncData(() => financeService.getReceivables(), []);

  if (piutang.loading) return <LoadingState label="Sedang mengambil data piutang..." />;
  if (piutang.error) return <ErrorState message={piutang.error} />;

  return (
    <div className="page-stack">
      <PageHeader title="Piutang" subtitle="Lihat pinjaman keluar dan tagihan yang belum dibayar." />
      <section className="panel">
        <DataTable
          columns={[
            { key: "nama_peminjam", label: "Nama peminjam" },
            { key: "tanggal", label: "Tanggal", render: (row) => formatTanggal(row.tanggal) },
            { key: "tanggal_jatuh_tempo", label: "Jatuh tempo", render: (row) => formatTanggal(row.tanggal_jatuh_tempo) },
            { key: "nominal", label: "Total", render: (row) => formatRupiah(row.nominal) },
            { key: "sisa_piutang", label: "Sisa", render: (row) => formatRupiah(row.sisa_piutang) },
            { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
          ]}
          rows={piutang.data}
        />
      </section>
    </div>
  );
}
