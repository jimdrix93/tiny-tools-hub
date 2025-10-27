import { Link } from "react-router-dom";

export default function Home() {
  const tools = [
    { path: "/json-formatter", title: "JSON Formatter", desc: "Formatea y valida JSON al instante." },
    { path: "/base64", title: "Base64 Encode/Decode", desc: "Codifica y decodifica texto en Base64." },
  ];

  return (
    <>
      <title>Toolsy — Online Utilities</title>
      <meta name="description" content="Small, fast, privacy-friendly online utilities for developers and everyone." />
      <link rel="canonical" href="https://toolsykit.vercel.app/" />

      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-brand">Toolsy</h1>
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
