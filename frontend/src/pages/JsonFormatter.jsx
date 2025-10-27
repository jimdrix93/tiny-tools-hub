import { useEffect, useRef, useState } from "react";
import SEO from "../components/SEO";

function sortObjectKeysDeep(value) {
  if (Array.isArray(value)) return value.map(sortObjectKeysDeep);
  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort((a, b) => a.localeCompare(b))
      .reduce((acc, k) => {
        acc[k] = sortObjectKeysDeep(value[k]);
        return acc;
      }, {});
  }
  return value;
}

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);
  const [sortKeys, setSortKeys] = useState(false);

  const inputRef = useRef(null);
  const outputRef = useRef(null);

  const formatJson = () => {
    setError("");
    try {
      const obj = JSON.parse(input);
      const processed = sortKeys ? sortObjectKeysDeep(obj) : obj;
      const pretty = JSON.stringify(processed, null, indent);
      setOutput(pretty);
    } catch (e) {
      setOutput("");
      setError(e instanceof Error ? e.message : "JSON inválido.");
    }
  };

  const minifyJson = () => {
    setError("");
    try {
      const obj = JSON.parse(input);
      const processed = sortKeys ? sortObjectKeysDeep(obj) : obj;
      const minified = JSON.stringify(processed);
      setOutput(minified);
    } catch (e) {
      setOutput("");
      setError(e instanceof Error ? e.message : "JSON inválido.");
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  const pasteToInput = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setInput(text);
    } catch {
      // Ignorar errores de permisos
    }
  };

  const downloadOutput = () => {
    if (!output) return;
    const blob = new Blob([output + "\n"], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  // Atajos de teclado
  useEffect(() => {
    const onKeyDown = (e) => {
      const isMeta = e.metaKey || e.ctrlKey;
      if (isMeta && e.key === "Enter") {
        e.preventDefault();
        formatJson();
      }
      if (isMeta && e.key.toLowerCase() === "b") {
        e.preventDefault();
        minifyJson();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, indent, sortKeys]);

  return (
    <>
      <SEO
        title="JSON Formatter"
        description="Formatea, valida y minifica JSON al instante. Ordena claves, copia y descarga el resultado."
        path="/json-formatter"
      />
      <div className="relative z-0 space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-brand">JSON Formatter</h1>
          <p className="muted">
            Pega tu JSON y formatealo o minifícalo. Atajos:{" "}
            <kbd>Ctrl/⌘ + Enter</kbd> (Formatear), <kbd>Ctrl/⌘ + B</kbd> (Minificar).
          </p>
        </div>

        {/* Controles */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="indent" className="label">
              Indentación
            </label>
            <select
              id="indent"
              className="input h-9 w-auto px-2 py-1"
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
            >
              <option value={2}>2 espacios</option>
              <option value={4}>4 espacios</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={sortKeys}
              onChange={(e) => setSortKeys(e.target.checked)}
            />
            Ordenar claves
          </label>

          <div className="flex flex-wrap gap-2">
            <button onClick={formatJson} className="btn-primary">
              Formatear
            </button>
            <button onClick={minifyJson} className="btn-outline">
              Minificar
            </button>
            <button onClick={clearAll} className="btn-ghost">
              Limpiar
            </button>
          </div>
        </div>

        {/* Entrada */}
        <div className="space-y-2">
          <label htmlFor="input" className="label">
            Entrada (JSON)
          </label>
          <textarea
            id="input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"name":"Ada","age":27,"skills":["math","code"]}'
            className="textarea focus:ring-brand/30"
            aria-invalid={!!error}
            aria-describedby={error ? "json-error" : undefined}
          />
          <div className="flex gap-2">
            <button onClick={pasteToInput} className="btn-outline">
              Pegar del portapapeles
            </button>
          </div>
          {error && (
            <div
              id="json-error"
              role="alert"
              className="rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700"
            >
              Error: {error}
            </div>
          )}
        </div>

        {/* Resultado */}
        <div className="space-y-2">
          <label htmlFor="output" className="label">
            Resultado
          </label>
          <textarea
            id="output"
            ref={outputRef}
            value={output}
            readOnly
            placeholder="Aquí verás el resultado…"
            className="textarea bg-neutral-50"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={copyOutput}
              className={`btn-outline ${!output ? "btn-disabled" : ""}`}
              disabled={!output}
            >
              Copiar resultado
            </button>
            <button
              onClick={downloadOutput}
              className={`btn-outline ${!output ? "btn-disabled" : ""}`}
              disabled={!output}
            >
              Descargar .json
            </button>
          </div>
        </div>

        <aside className="card p-3 text-sm text-neutral-700">
          <p className="mb-1 font-medium">Consejos:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Usa <kbd>Ctrl/⌘ + Enter</kbd> para formatear rápido.
            </li>
            <li>
              Activa <strong>Ordenar claves</strong> para tener objetos con orden
              consistente.
            </li>
            <li>
              Para archivos muy grandes, pega por partes o usa la futura herramienta
              CSV↔JSON.
            </li>
          </ul>
        </aside>
      </div>
    </>
  );
}
