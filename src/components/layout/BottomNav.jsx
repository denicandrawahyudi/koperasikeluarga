import { NavLink } from "react-router-dom";
import { NAVIGATION_ITEMS } from "../../constants/appConfig";

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Menu bawah">
      {NAVIGATION_ITEMS.slice(0, 5).map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === "/"}
          className={({ isActive }) => (isActive ? "bottom-nav__link bottom-nav__link--active" : "bottom-nav__link")}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
