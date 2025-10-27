// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import JsonFormatter from "./pages/JsonFormatter";
import Base64Tool from "./pages/Base64Tool";
import About from "./pages/About";
import CsvJson from "./pages/CsvJson";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="json-formatter" element={<JsonFormatter />} />
          <Route path="base64" element={<Base64Tool />} />
          <Route path="csv-json" element={<CsvJson />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<div className="p-6">Not found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
