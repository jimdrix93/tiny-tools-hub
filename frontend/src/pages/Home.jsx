import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function Home() {
  const tools = [
    { path: "/json-formatter", title: "JSON Formatter", desc: "Formatea y valida JSON al instante." },
    { path: "/base64", title: "Base64 Encode/Decode", desc: "Codifica y decodifica texto en Base64." },
    { path: "/csv-json", title: "CSV ↔ JSON", desc: "Convierte CSV a JSON y JSON a CSV con un clic." },
  ];

  return (
    <>
      <SEO
        title="Online Utilities"
        description="Small, fast, privacy-friendly online utilities for developers and everyone."
        path="/"
      />
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-brand-auto">Toolsy</h1>
        <p className="muted">Herramientas online rápidas y sencillas para el día a día.</p>

        <div className="grid gap-4 md:grid-cols-2">
          {tools.map((t) => (
            <Link key={t.path} to={t.path} className="card card-hover block p-4">
              <h2 className="font-semibold"> {t.title} </h2>
              <p className="muted mt-1">{t.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
