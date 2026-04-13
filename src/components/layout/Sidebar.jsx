import { NavLink } from "react-router-dom";
import { NAVIGATION_ITEMS } from "../../constants/appConfig";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <h2>Catatan Uang</h2>
        <p>Sederhana dan mudah dipakai</p>
      </div>
      <nav aria-label="Menu utama">
        {NAVIGATION_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? "nav-link nav-link--active" : "nav-link")}
            end={item.path === "/"}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
