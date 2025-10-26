import { Link, Outlet } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-neutral-900">
            <img
              src={logo}
              alt="Toolsy logo"
              className="w-6 h-6"
            />
            <span>Toolsy</span>
          </Link>
          <nav className="text-sm space-x-4 text-blue-600">
            <Link to="/json-formatter" className="hover:underline">JSON</Link>
            <Link to="/base64" className="hover:underline">Base64</Link>
            <Link to="/about" className="hover:underline">About</Link>
          </nav>
        </div>
      </header>

      <main className="relative z-0 mx-auto w-full max-w-5xl px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 text-sm flex justify-between text-neutral-600">
          <p>© {new Date().getFullYear()} Toolsy</p>
          <a href="https://github.com/jimdrix93/toolsy" target="_blank" className="underline hover:text-neutral-800">
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
