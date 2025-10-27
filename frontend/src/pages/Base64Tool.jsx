import { useState } from "react";
import SEO from "../components/SEO";

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("encode");
  const [error, setError] = useState("");

  const handleConvert = () => {
    try {
      let result = "";
      if (mode === "encode") {
        result = btoa(unescape(encodeURIComponent(input)));
      } else {
        result = decodeURIComponent(escape(atob(input)));
      }
      setOutput(result);
      setError("");
    } catch (e) {
      setError("Entrada inválida o formato no compatible con Base64.");
      setOutput("");
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <>
      <SEO
        title="Base64 Encode / Decode"
        description="Convierte texto a Base64 y viceversa. UTF-8 friendly. Todo en tu navegador."
        path="/base64"
      />
      <div className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-brand">Base64 Encode / Decode</h1>
          <p className="text-sm text-neutral-600">
            Convierte texto a Base64 y viceversa directamente en tu navegador.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="mode"
              value="encode"
              checked={mode === "encode"}
              onChange={() => setMode("encode")}
            />
            Codificar (→ Base64)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="mode"
              value="decode"
              checked={mode === "decode"}
              onChange={() => setMode("decode")}
            />
            Decodificar (Base64 →)
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleConvert}
              className="btn-primary"
            >
              Convertir
            </button>
            <button onClick={clearAll} className="btn-outline">
              Limpiar
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="input" className="text-sm font-medium">
            Entrada
          </label>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Texto plano..." : "Cadena Base64..."}
            className="h-40 w-full rounded-lg border p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-neutral-300"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="output" className="text-sm font-medium">
            Resultado
          </label>
          <textarea
            id="output"
            value={output}
            readOnly
            placeholder="Aquí verás el resultado..."
            className="h-40 w-full rounded-lg border bg-neutral-50 p-3 font-mono text-sm"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={copyOutput}
              disabled={!output}
              className="btn-outline"
            >
              Copiar resultado
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <aside className="rounded-lg border bg-white p-3 text-sm text-neutral-700">
          <p className="mb-1 font-medium">Consejos:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Ideal para enviar datos binarios como texto.</li>
            <li>Compatible con UTF-8 y emojis.</li>
            <li>Todo se procesa localmente, sin servidores.</li>
          </ul>
        </aside>
      </div>
    </>
  );
}
