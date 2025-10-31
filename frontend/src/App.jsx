import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import { ToastProvider } from "./components/Toast";

const Home = lazy(() => import("./pages/Home"));
const JsonFormatter = lazy(() => import("./pages/JsonFormatter"));
const Base64Tool = lazy(() => import("./pages/Base64Tool"));
const CsvJson = lazy(() => import("./pages/CsvJson"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Privacy = lazy(() => import("./pages/Privacy"));

function Fallback() {
  return (
    <div className="container-site py-12">
      <div className="muted">Loading…</div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ToastProvider>
          <Suspense fallback={<Fallback />}>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="json-formatter" element={<JsonFormatter />} />
                <Route path="base64" element={<Base64Tool />} />
                <Route path="csv-json" element={<CsvJson />} />
                <Route path="about" element={<About />} />
                <Route path="privacy" element={<Privacy />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </ToastProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
