import { useLocation } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import { LoadingState } from "../components/common/LoadingState";
import { TransactionForm } from "../components/forms/TransactionForm";
import { useAsyncData } from "../hooks/useAsyncData";
import { financeService } from "../services/financeService";

export function TambahTransaksiPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const defaultType = params.get("jenis") || "";
  const kategori = useAsyncData(() => financeService.getCategories(), []);

  if (kategori.loading) return <LoadingState label="Sedang menyiapkan form transaksi..." />;

  return (
    <div className="page-stack">
      <PageHeader title="Tambah Transaksi" subtitle="Isi form singkat berikut untuk menyimpan catatan keuangan." />
      <TransactionForm categories={kategori.data || []} defaultType={defaultType} onSubmit={financeService.createTransaction} />
    </div>
  );
}
