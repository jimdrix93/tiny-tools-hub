import { Link, NavLink, Outlet } from "react-router-dom";
import logo from "../assets/logo.png";

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-2 py-1 text-sm transition ${
        isActive ? "text-brand font-semibold" : "text-neutral-700 hover:text-brand"
      }`
    }
  >
    {children}
  </NavLink>
);

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
        <div className="container-site flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Toolsy logo" className="h-6 w-6" />
            <span className="text-lg font-bold text-neutral-900">Toolsy</span>
          </Link>
          <nav className="flex items-center gap-3">
            <NavItem to="/json-formatter">JSON</NavItem>
            <NavItem to="/base64">Base64</NavItem>
            <NavItem to="/about">About</NavItem>
          </nav>
        </div>
      </header>

      <main className="flex-1 container-site py-8">
        <Outlet />
      </main>

      <footer className="border-t bg-white">
        <div className="container-site flex items-center justify-between py-4 text-sm text-neutral-600">
          <p>© {new Date().getFullYear()} Toolsy</p>
          <a href="https://github.com/tu-usuario/toolsy" className="hover:text-neutral-800" target="_blank">GitHub</a>
        </div>
      </footer>
    </div>
  );
}
