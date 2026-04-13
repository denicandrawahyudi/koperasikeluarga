import { NavLink } from "react-router-dom";
import { NAVIGATION_ITEMS } from "../../constants/appConfig";

export function BottomNav({ menuOpen, onToggleMenu, onCloseMenu }) {
  const primaryItems = NAVIGATION_ITEMS.slice(0, 4);

  return (
    <>
      {menuOpen ? (
        <div className="mobile-menu-backdrop" onClick={onCloseMenu} aria-hidden="true" />
      ) : null}
      <div
        id="mobile-menu-sheet"
        className={`mobile-menu-sheet ${menuOpen ? "mobile-menu-sheet--open" : ""}`}
      >
        <div className="mobile-menu-sheet__header">
          <strong>Semua menu</strong>
          <button type="button" className="button button-small" onClick={onCloseMenu}>
            Tutup
          </button>
        </div>
        <div className="mobile-menu-sheet__list">
          {NAVIGATION_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={onCloseMenu}
              className={({ isActive }) =>
                isActive
                  ? "mobile-menu-sheet__link mobile-menu-sheet__link--active"
                  : "mobile-menu-sheet__link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      <nav className="bottom-nav" aria-label="Menu bawah">
        {primaryItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              isActive ? "bottom-nav__link bottom-nav__link--active" : "bottom-nav__link"
            }
          >
            {item.label}
          </NavLink>
        ))}
        <button
          type="button"
          className={`bottom-nav__link bottom-nav__button ${menuOpen ? "bottom-nav__link--active" : ""}`}
          onClick={onToggleMenu}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu-sheet"
        >
          Menu
        </button>
      </nav>
    </>
  );
}
