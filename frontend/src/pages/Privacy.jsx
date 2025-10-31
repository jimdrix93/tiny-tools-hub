import SEO from "../components/SEO";

export default function Privacy() {
  return (
    <>
      <SEO
        title="Privacy"
        description="Toolsy processes everything locally in your browser. No servers, no tracking cookies."
        path="/privacy"
      />
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-[color:var(--brand)]">Privacy</h1>
        <p className="muted">
          Toolsy is privacy-friendly by design. Your data never leaves your device.
        </p>
        <div className="card p-4 space-y-2">
          <h2 className="font-semibold">Data processing</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>All tools run fully in your browser (client-side).</li>
            <li>No files or text are uploaded to any server.</li>
            <li>Clipboard actions happen locally with your permission.</li>
          </ul>
        </div>
        <div className="card p-4 space-y-2">
          <h2 className="font-semibold">Analytics</h2>
          <p className="text-sm">
            We use privacy-first analytics (e.g. Plausible) to measure page usage in aggregate.
            No cookies, no personal data.
          </p>
        </div>
        <div className="card p-4 space-y-2">
          <h2 className="font-semibold">Contact</h2>
          <p className="text-sm">
            Found a bug or have a request? Open an issue on{" "}
            <a className="underline" href="https://github.com/jimdrix93/toolsy" target="_blank" rel="noreferrer">
              GitHub
            </a>.
          </p>
        </div>
      </div>
    </>
  );
}
