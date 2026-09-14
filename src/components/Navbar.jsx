import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "./Navbar.css";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  // Piece of state: whether the mobile nav menu is open.
  const [menuOpen, setMenuOpen] = useState(false);

  // useEffect #: subscribes to window resize so the mobile menu auto-closes
  // if the visitor rotates their device or resizes past the tablet
  // breakpoint. Cleanup removes the listener on unmount to avoid leaks.
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <NavLink to="/" className="brand" aria-label="Sangram Reddy, home" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark" aria-hidden="true">SR</span>
          <span className="brand-name">Sangram&nbsp;Reddy</span>
        </NavLink>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>

        <nav className={`site-nav ${menuOpen ? "is-open" : ""}`} aria-label="Primary" id="primary-nav">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => (isActive ? "active" : "")}
                  end={link.to === "/"}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          className="btn btn-ghost theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </header>
  );
}
