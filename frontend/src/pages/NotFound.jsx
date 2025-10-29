import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function NotFound() {
  return (
    <>
      <SEO title="404" description="Page not found" path="/404" />
      <div className="grid place-items-center py-20 text-center">
        <div className="space-y-4 max-w-md">
          <h1 className="text-4xl font-bold text-[color:var(--brand)]">404</h1>
          <p className="muted">We couldn’t find that page.</p>
          <div className="flex items-center justify-center gap-2">
            <Link to="/" className="btn-primary">Go home</Link>
            <a href="https://github.com/jimdrix93/toolsy/issues" className="btn-outline">Report an issue</a>
          </div>
        </div>
      </div>
    </>
  );
}
