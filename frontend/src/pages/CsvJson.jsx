import { useState } from "react";
import Papa from "papaparse";

export default function CsvJson() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [header, setHeader] = useState(true);
  const [pretty, setPretty] = useState(true);

  const clearAll = () => { setInput(""); setOutput(""); setError(""); };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  const downloadOutput = (filename, mime) => {
    if (!output) return;
    const blob = new Blob([output + "\n"], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const csvToJson = () => {
    setError("");
    try {
      const res = Papa.parse(input, {
        header,
        dynamicTyping: true,
        skipEmptyLines: true,
        delimiter: delimiter || ",",
      });
      if (res.errors?.length) {
        setError(res.errors[0].message || "CSV inválido");
        setOutput("");
        return;
      }
      const json = header ? res.data : res.data.map((row) => row);
      setOutput(pretty ? JSON.stringify(json, null, 2) : JSON.stringify(json));
    } catch (e) {
      setError("CSV inválido");
      setOutput("");
    }
  };

  const jsonToCsv = () => {
    setError("");
    try {
      const data = JSON.parse(input);
      const csv = Papa.unparse(data, {
        delimiter: delimiter || ",",
        quotes: false,
      });
      setOutput(csv);
    } catch {
      setError("JSON inválido");
      setOutput("");
    }
  };

  return (
    <>
      <title>CSV ↔ JSON — Toolsy</title>
      <meta name="description" content="Convierte CSV a JSON y JSON a CSV. Controla el separador, cabeceras y formato." />
      <link rel="canonical" href="https://toolsykit.vercel.app/csv-json" />

      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-brand">CSV ↔ JSON</h1>
          <p className="muted">Convierte entre CSV y JSON directamente en tu navegador.</p>
        </div>

        {/* Controles */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="delimiter" className="label">Separador</label>
            <select
              id="delimiter"
              className="input h-9 w-auto px-2 py-1"
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
            >
              <option value=",">, (coma)</option>
              <option value=";">; (punto y coma)</option>
              <option value="\t">Tab</option>
              <option value="|">| (barra)</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={header}
              onChange={(e) => setHeader(e.target.checked)}
            />
            CSV con cabeceras
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={pretty}
              onChange={(e) => setPretty(e.target.checked)}
            />
            JSON con sangría
          </label>

          <div className="flex flex-wrap gap-2">
            <button onClick={csvToJson} className="btn-primary">CSV → JSON</button>
            <button onClick={jsonToCsv} className="btn-outline">JSON → CSV</button>
            <button onClick={clearAll} className="btn-ghost">Limpiar</button>
          </div>
        </div>

        {/* Entrada */}
        <div className="space-y-2">
          <label htmlFor="input" className="label">Entrada</label>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={'name,age\nAda,27\nTuring,41'}
            className="textarea"
          />
          {error && (
            <div className="rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">
              Error: {error}
            </div>
          )}
        </div>

        {/* Resultado */}
        <div className="space-y-2">
          <label htmlFor="output" className="label">Resultado</label>
          <textarea
            id="output"
            value={output}
            readOnly
            placeholder="Aquí verás el resultado…"
            className="textarea bg-neutral-50"
          />
          <div className="flex flex-wrap gap-2">
            <button onClick={copyOutput} className={`btn-outline ${!output ? "btn-disabled" : ""}`} disabled={!output}>
              Copiar resultado
            </button>
            <button onClick={() => downloadOutput(pretty ? "result.json" : "result.min.json", "application/json")}
              className={`btn-outline ${!output ? "btn-disabled" : ""}`} disabled={!output}>
              Descargar JSON
            </button>
            <button onClick={() => downloadOutput("result.csv", "text/csv")}
              className={`btn-outline ${!output ? "btn-disabled" : ""}`} disabled={!output}>
              Descargar CSV
            </button>
          </div>
        </div>

        <aside className="card p-3 text-sm text-neutral-700">
          <p className="mb-1 font-medium">Consejos:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Si tu CSV no tiene cabeceras, desmarca “CSV con cabeceras”.</li>
            <li>Usa el separador correcto (coma, punto y coma, tab, barra).</li>
            <li>Todo se procesa localmente, sin servidores.</li>
          </ul>
        </aside>
      </div>
    </>
  );
}
