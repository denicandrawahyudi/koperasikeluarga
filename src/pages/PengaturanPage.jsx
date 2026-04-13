import { DataTable } from "../components/common/DataTable";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { PageHeader } from "../components/common/PageHeader";
import { useAsyncData } from "../hooks/useAsyncData";
import { financeService } from "../services/financeService";

export function PengaturanPage() {
  const pengaturan = useAsyncData(() => financeService.getSettings(), []);

  if (pengaturan.loading) return <LoadingState label="Sedang mengambil pengaturan aplikasi..." />;
  if (pengaturan.error) return <ErrorState message={pengaturan.error} />;

  return (
    <div className="page-stack">
      <PageHeader title="Pengaturan" subtitle="Pengaturan dasar aplikasi dan tampilan." />
      <section className="panel">
        <DataTable
          columns={[
            { key: "label", label: "Pengaturan" },
            { key: "value", label: "Nilai" },
          ]}
          rows={Object.entries(pengaturan.data).map(([key, value]) => ({
            id: key,
            label: key.replaceAll("_", " "),
            value: String(value),
          }))}
        />
      </section>
    </div>
  );
}
