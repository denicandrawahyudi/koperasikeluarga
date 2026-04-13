import { Outlet, useNavigate } from "react-router-dom";
import { BottomNav } from "../components/layout/BottomNav";
import { Sidebar } from "../components/layout/Sidebar";
import { useAppContext } from "../services/AppContext";

export function AppShell() {
  const { user, logout, modeSederhana, toggleModeSederhana } = useAppContext();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className={`app-shell ${modeSederhana ? "app-shell--simple" : ""}`}>
      <Sidebar />
      <div className="app-shell__content">
        <header className="topbar">
          <div>
            <p className="topbar__hello">Selamat datang</p>
            <strong>{user?.nama || "Pengguna"}</strong>
          </div>
          <div className="topbar__actions">
            <button className="button" onClick={toggleModeSederhana}>
              {modeSederhana ? "Mode sederhana aktif" : "Aktifkan mode sederhana"}
            </button>
            <button className="button" onClick={handleLogout}>
              Keluar
            </button>
          </div>
        </header>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
