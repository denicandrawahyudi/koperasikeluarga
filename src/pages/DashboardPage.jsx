import { Link } from "react-router-dom";
import { SimpleBarChart } from "../components/charts/SimpleBarChart";
import { DataTable } from "../components/common/DataTable";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { PageHeader } from "../components/common/PageHeader";
import { StatCard } from "../components/common/StatCard";
import { StatusBadge } from "../components/common/StatusBadge";
import { QUICK_ACTIONS } from "../constants/appConfig";
import { useAsyncData } from "../hooks/useAsyncData";
import { financeService } from "../services/financeService";
import { formatRupiah, formatTanggal } from "../utils/formatters";

export function DashboardPage() {
  const summary = useAsyncData(() => financeService.getDashboardSummary(), []);
  const transaksi = useAsyncData(() => financeService.getTransactions(), []);
  const hutang = useAsyncData(() => financeService.getDebts(), []);
  const piutang = useAsyncData(() => financeService.getReceivables(), []);

  if (summary.loading || transaksi.loading || hutang.loading || piutang.loading) {
    return <LoadingState label="Sedang menyiapkan dashboard..." />;
  }

  if (summary.error) return <ErrorState message={summary.error} />;

  const cards = [
    { title: "Pemasukan bulan ini", value: summary.data.bulanIni.pemasukan, tone: "success" },
    { title: "Pengeluaran bulan ini", value: summary.data.bulanIni.pengeluaran, tone: "warning" },
    { title: "Total hutang", value: summary.data.totalHutang },
    { title: "Total piutang", value: summary.data.totalPiutang },
    { title: "Saldo akhir", value: summary.data.saldoAkhir, tone: "info" },
  ];

  return (
    <div className="page-stack">
      <PageHeader
        title="Dashboard"
        subtitle="Lihat kondisi keuangan hari ini dengan cepat."
        action={<Link className="button button-primary" to="/tambah-transaksi">Tambah transaksi</Link>}
      />

      <section className="quick-actions">
        {QUICK_ACTIONS.map((item) => (
          <Link key={item.id} className="quick-action-card" to={`/tambah-transaksi?jenis=${item.type}`}>
            {item.label}
          </Link>
        ))}
      </section>

      <section className="stats-grid">
        {cards.map((card) => (
          <StatCard key={card.title} title={card.title} value={card.value} tone={card.tone} />
        ))}
      </section>

      <section className="content-grid">
        <div className="content-grid__main">
          <PageHeader title="Ringkasan waktu" subtitle="Bandingkan hari ini, bulan ini, dan tahun ini." />
          <SimpleBarChart
            items={[
              { label: "Hari ini", value: summary.data.hariIni.saldo, color: "#5c8a72" },
              { label: "Bulan ini", value: summary.data.bulanIni.saldo, color: "#c7844e" },
              { label: "Tahun ini", value: summary.data.tahunIni.saldo, color: "#5f7da0" },
            ]}
          />
        </div>
        <div className="content-grid__side panel">
          <h3>Pengingat jatuh tempo</h3>
          <div className="reminder-list">
            {hutang.data.map((item) => (
              <div key={item.id_hutang} className="reminder-item">
                <strong>Hutang ke {item.nama_pemberi_hutang}</strong>
                <p>Jatuh tempo {formatTanggal(item.tanggal_jatuh_tempo)}</p>
                <p>Sisa {formatRupiah(item.sisa_hutang)}</p>
                <StatusBadge status={item.status} />
              </div>
            ))}
            {piutang.data.map((item) => (
              <div key={item.id_piutang} className="reminder-item">
                <strong>Piutang ke {item.nama_peminjam}</strong>
                <p>Jatuh tempo {formatTanggal(item.tanggal_jatuh_tempo)}</p>
                <p>Sisa {formatRupiah(item.sisa_piutang)}</p>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <PageHeader title="Transaksi terbaru" subtitle="Lihat catatan paling baru." />
        <DataTable
          columns={[
            { key: "tanggal", label: "Tanggal", render: (row) => formatTanggal(row.tanggal) },
            { key: "kategori", label: "Kategori" },
            { key: "jenis_transaksi", label: "Jenis" },
            { key: "nominal", label: "Nominal", render: (row) => formatRupiah(row.nominal) },
            { key: "deskripsi", label: "Keterangan" },
          ]}
          rows={transaksi.data.slice(0, 5)}
        />
      </section>
    </div>
  );
}
