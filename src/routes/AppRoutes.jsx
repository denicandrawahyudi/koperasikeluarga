import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../layouts/AppShell";
import { AnggaranPage } from "../pages/AnggaranPage";
import { BantuanPage } from "../pages/BantuanPage";
import { DashboardPage } from "../pages/DashboardPage";
import { HutangPage } from "../pages/HutangPage";
import { KategoriPage } from "../pages/KategoriPage";
import { LaporanPage } from "../pages/LaporanPage";
import { LoginPage } from "../pages/LoginPage";
import { PengaturanPage } from "../pages/PengaturanPage";
import { PiutangPage } from "../pages/PiutangPage";
import { RekapPage } from "../pages/RekapPage";
import { TambahTransaksiPage } from "../pages/TambahTransaksiPage";
import { TransaksiPage } from "../pages/TransaksiPage";
import { useAppContext } from "../services/AppContext";

function ProtectedRoute({ children }) {
  const { user, sessionReady } = useAppContext();

  if (!sessionReady) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="transaksi" element={<TransaksiPage />} />
          <Route path="tambah-transaksi" element={<TambahTransaksiPage />} />
          <Route path="hutang" element={<HutangPage />} />
          <Route path="piutang" element={<PiutangPage />} />
          <Route path="anggaran" element={<AnggaranPage />} />
          <Route path="laporan" element={<LaporanPage />} />
          <Route path="rekap" element={<RekapPage />} />
          <Route path="kategori" element={<KategoriPage />} />
          <Route path="pengaturan" element={<PengaturanPage />} />
          <Route path="bantuan" element={<BantuanPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
