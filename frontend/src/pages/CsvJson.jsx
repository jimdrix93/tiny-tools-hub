import { useMemo, useState } from "react";
import SEO from "../components/SEO";
import { useToast } from "../components/Toast";

/* ---------------- Utils ---------------- */

// Detecta separador por frecuencia en las primeras líneas
function detectDelimiter(text) {
  const sample = text.split(/\r?\n/).slice(0, 5).join("\n");
  const counts = {
    ",": (sample.match(/,/g) || []).length,
    ";": (sample.match(/;/g) || []).length,
    "\t": (sample.match(/\t/g) || []).length,
  };
  const [[best]] = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return counts[best] > 0 ? best : ",";
}

// Parser CSV robusto con comillas y CRLF
function parseCSV(text, delimiter = ",") {
  const rows = [];
  let i = 0, cur = "", inQuotes = false, row = [];

  const pushCell = () => { row.push(cur); cur = ""; };
  const pushRow = () => { rows.push(row); row = []; };

  while (i < text.length) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        const next = text[i + 1];
        if (next === '"') { cur += '"'; i += 2; continue; } // "" -> "
        inQuotes = false; i++; continue;
      } else { cur += ch; i++; continue; }
    } else {
      if (ch === '"') { inQuotes = true; i++; continue; }
      if (ch === delimiter) { pushCell(); i++; continue; }
      if (ch === "\n") { pushCell(); pushRow(); i++; continue; }
      if (ch === "\r") { if (text[i + 1] === "\n") i++; pushCell(); pushRow(); i++; continue; }
      cur += ch; i++; continue;
    }
  }
  // Última celda/última fila
  pushCell();
  if (row.length > 1 || rows.length === 0 || (row.length === 1 && row[0] !== "")) {
    pushRow();
  }
  return rows;
}

function toCSV(rows, delimiter = ",") {
  const escapeCell = (val) => {
    const s = String(val ?? "");
    const needs = s.includes('"') || s.includes("\n") || s.includes("\r") || s.includes(delimiter);
    return needs ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return rows.map(r => r.map(escapeCell).join(delimiter)).join("\n");
}

function objectsToCSV(objects, delimiter = ",") {
  // headers = unión de claves preservando orden de aparición
  const headers = Array.from(
    objects.reduce((set, obj) => {
      Object.keys(obj || {}).forEach(k => set.add(k));
      return set;
    }, new Set())
  );
  const data = [headers, ...objects.map(o => headers.map(h => o?.[h] ?? ""))];
  return toCSV(data, delimiter);
}

function csvToObjects(rows, hasHeader) {
  if (!rows.length) return [];
  if (!hasHeader) return rows; // array de arrays
  const headers = rows[0];
  return rows.slice(1).map(r => {
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = r[idx] ?? ""; });
    return obj;
  });
}

/* --------------- Component --------------- */

export default function CsvJson() {
  const { show } = useToast();

  const [mode, setMode] = useState("csv2json"); // "csv2json" | "json2csv"
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [auto, setAuto] = useState(true);
  const [hasHeader, setHasHeader] = useState(true);
  const [pretty, setPretty] = useState(true); // pretty print JSON

  const delimiterName = useMemo(() => {
    return delimiter === ","
      ? "coma (,)"
      : delimiter === ";"
      ? "punto y coma (;)"
      : "tabulación (TAB)";
  }, [delimiter]);

  const handleConvert = () => {
    try {
      setError("");

      if (mode === "csv2json") {
        const usedDelimiter = auto ? detectDelimiter(input) : delimiter;
        const rows = parseCSV(input, usedDelimiter);
        const data = csvToObjects(rows, hasHeader);
        const json = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
        setOutput(json);
        if (auto) setDelimiter(usedDelimiter); // refleja autodetección
        show("CSV → JSON convertido");
      } else {
        // json2csv
        const data = JSON.parse(input.trim() || "[]");
        let csv = "";
        if (Array.isArray(data)) {
          if (data.length && typeof data[0] === "object" && !Array.isArray(data[0])) {
            csv = objectsToCSV(data, delimiter);
          } else {
            // array de arrays
            csv = toCSV(data, delimiter);
          }
        } else if (typeof data === "object") {
          csv = objectsToCSV([data], delimiter);
        } else {
          throw new Error("JSON debe ser un objeto, array de objetos o array de arrays.");
        }
        setOutput(csv);
        show("JSON → CSV convertido");
      }
    } catch (e) {
      setOutput("");
      const msg = e instanceof Error ? e.message : "Error al convertir.";
      setError(msg);
      show("Error de conversión", { variant: "error" });
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    show("Copiado al portapapeles");
  };

  const clearAll = () => {
    setInput(""); setOutput(""); setError("");
    show("Limpio");
  };

  const downloadOutput = () => {
    if (!output) return;
    const type = mode === "csv2json" ? "application/json;charset=utf-8" : "text/csv;charset=utf-8";
    const fname = mode === "csv2json" ? "data.json" : "data.csv";
    const blob = new Blob([output + "\n"], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = fname; a.click();
    URL.revokeObjectURL(url);
    show("Descarga iniciada");
  };

  return (
    <>
      <SEO
        title="CSV ↔ JSON"
        description="Convierte CSV a JSON y JSON a CSV. Autodetección de separador, comillas, cabeceras y descarga."
        path="/csv-json"
      />

      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-[color:var(--brand)]">CSV ↔ JSON</h1>
          <p className="muted">Convierte tu data en un clic. Todo sucede en tu navegador.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="mode"
              value="csv2json"
              checked={mode === "csv2json"}
              onChange={() => setMode("csv2json")}
              aria-label="CSV a JSON"
            />
            CSV → JSON
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="mode"
              value="json2csv"
              checked={mode === "json2csv"}
              onChange={() => setMode("json2csv")}
              aria-label="JSON a CSV"
            />
            JSON → CSV
          </label>

          <div className="flex items-center gap-2">
            <label htmlFor="delimiter" className="label">Separador</label>
            <select
              id="delimiter"
              disabled={mode === "csv2json" && auto}
              className="input h-9 w-auto px-2 py-1"
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
            >
              <option value=",">, (coma)</option>
              <option value=";">; (punto y coma)</option>
              <option value="\t">TAB</option>
            </select>
          </div>

          {mode === "csv2json" && (
            <>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={auto}
                  onChange={(e) => setAuto(e.target.checked)}
                  aria-label="Autodetectar separador"
                />
                Autodetectar separador {auto && <span className="muted">({delimiterName})</span>}
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={hasHeader}
                  onChange={(e) => setHasHeader(e.target.checked)}
                  aria-label="Primera fila es cabecera"
                />
                Primera fila es cabecera
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={pretty}
                  onChange={(e) => setPretty(e.target.checked)}
                  aria-label="Formato legible JSON"
                />
                JSON legible
              </label>
            </>
          )}

          <div className="flex flex-wrap gap-2">
            <button onClick={handleConvert} className="btn-primary">Convertir</button>
            <button onClick={clearAll} className="btn-ghost">Limpiar</button>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="input" className="label">
            Entrada {mode === "csv2json" ? "(CSV)" : "(JSON)"}
          </label>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "csv2json"
                ? 'name,age\nAda,27\nGrace,30'
                : '[{"name":"Ada","age":27},{"name":"Grace","age":30}]'
            }
            className="textarea"
            aria-invalid={!!error}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="output" className="label">Resultado</label>
          <textarea
            id="output"
            readOnly
            value={output}
            placeholder="Aquí verás el resultado…"
            className="textarea bg-neutral-50 dark:bg-[#101712]"
          />
          <div className="flex flex-wrap gap-2">
            <button onClick={copyOutput} disabled={!output} className={`btn-outline ${!output ? "btn-disabled" : ""}`}>
              Copiar resultado
            </button>
            <button onClick={downloadOutput} disabled={!output} className={`btn-outline ${!output ? "btn-disabled" : ""}`}>
              Descargar {mode === "csv2json" ? ".json" : ".csv"}
            </button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-200"
          >
            Error: {error}
          </div>
        )}

        <aside className="card p-3 text-sm text-neutral-700 dark:text-neutral-300">
          <p className="mb-1 font-medium">Consejos:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>El separador se autodetecta si lo permites (coma, punto y coma o TAB).</li>
            <li>Las comillas dobles dentro de campos se escapan como <code>""</code>.</li>
            <li>Para JSON muy grande, desactiva “JSON legible” para mejor rendimiento.</li>
          </ul>
        </aside>
      </div>
    </>
  );
}
