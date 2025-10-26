import { Link } from "react-router-dom";

export default function Home() {
  const tools = [
    { path: "/json-formatter", title: "JSON Formatter", desc: "Formatea y valida JSON al instante." },
    { path: "/base64", title: "Base64 Encode/Decode", desc: "Codifica y decodifica texto en Base64." },
  ];

  return (
    <>
      <title>Toolsy — Utilidades Online</title>
      <meta name="description" content="Colección de pequeñas utilidades online para developers y público general." />
      <link rel="canonical" href="https://toolsykit.vercel.app/" />

      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Toolsy</h1>
        <p className="text-neutral-700">Herramientas online rápidas y sencillas para el día a día.</p>

        <div className="grid gap-4 sm:grid-cols-2">
          {tools.map((t) => (
            <Link key={t.path} to={t.path} className="block rounded-xl border bg-white p-4 hover:shadow-sm">
              <h2 className="font-medium">{t.title}</h2>
              <p className="text-sm text-neutral-600">{t.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
