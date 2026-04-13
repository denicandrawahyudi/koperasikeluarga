import { DataTable } from "../components/common/DataTable";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { PageHeader } from "../components/common/PageHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { useAsyncData } from "../hooks/useAsyncData";
import { financeService } from "../services/financeService";
import { formatRupiah, formatTanggal } from "../utils/formatters";

export function HutangPage() {
  const hutang = useAsyncData(() => financeService.getDebts(), []);

  if (hutang.loading) return <LoadingState label="Sedang mengambil data hutang..." />;
  if (hutang.error) return <ErrorState message={hutang.error} />;

  return (
    <div className="page-stack">
      <PageHeader title="Hutang" subtitle="Pantau sisa hutang dan tanggal jatuh tempo." />
      <section className="panel">
        <DataTable
          columns={[
            { key: "nama_pemberi_hutang", label: "Pemberi hutang" },
            { key: "tanggal", label: "Tanggal", render: (row) => formatTanggal(row.tanggal) },
            { key: "tanggal_jatuh_tempo", label: "Jatuh tempo", render: (row) => formatTanggal(row.tanggal_jatuh_tempo) },
            { key: "nominal", label: "Total", render: (row) => formatRupiah(row.nominal) },
            { key: "sisa_hutang", label: "Sisa", render: (row) => formatRupiah(row.sisa_hutang) },
            { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
          ]}
          rows={hutang.data}
        />
      </section>
    </div>
  );
}
