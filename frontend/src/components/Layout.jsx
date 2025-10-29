import { Link, NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-2 py-1 text-lg transition ${
        isActive
          ? "text-brand-auto font-semibold underline underline-offset-4"
          : "text-neutral-700 hover:text-brand-auto dark:text-neutral-300 dark:hover:text-brand-auto"
      }`
    }
  >
    {children}
  </NavLink>
);

export default function Layout() {
  const [dark, setDark] = useState(false);

  const applyTheme = (isDark) => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setDark(isDark);
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const initial =
      saved === "dark"
        ? true
        : saved === "light"
        ? false
        : window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(!!initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur
                   dark:bg-[#111615]/90 dark:border-neutral-700">
        <div className="container-site flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Toolsy logo"
              className="h-10 w-10 block dark:hidden"
            />
            <img
              src="/src/assets/logo-dark.png"
              alt="Toolsy logo dark"
              className="h-10 w-10 hidden dark:block"
            />
            <span className="text-2xl font-bold text-brand-auto">Toolsy</span>
          </Link>
          <nav className="flex items-center gap-3">
            <NavItem to="/json-formatter">JSON</NavItem>
            <NavItem to="/base64">Base64</NavItem>
            <NavItem to="/csv-json">CSV↔JSON</NavItem>
            <NavItem to="/about">About</NavItem>

            <button
              onClick={() => applyTheme(!dark)}
              aria-pressed={dark}
              className="ml-2 rounded-lg px-3 py-2 text-sm border border-neutral-300 bg-white hover:bg-neutral-50
                        dark:border-neutral-600 dark:bg-[#141c17] dark:hover:bg-[#172019]"
              aria-label="Toggle dark mode"
              title={dark ? "Switch to light mode" : "Switch to dark mode"}
            >
              <span aria-hidden>{dark ? "🌙" : "☀️"}</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 container-site py-8">
        <Outlet />
      </main>

      <footer className="border-t bg-white dark:bg-[#0f1712] dark:border-neutral-700">
        <div className="container-site flex items-center justify-between py-4 text-sm text-neutral-600 dark:text-neutral-400">
          <p className="text-brand-auto">© {new Date().getFullYear()} Toolsy</p>
          <a
            href="https://github.com/jimdrix93/toolsy"
            className="hover:text-neutral-800 dark:hover:text-neutral-200 text-[#084003] dark:text-[#54d171]"
            target="_blank"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
