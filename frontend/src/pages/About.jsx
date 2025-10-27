import SEO from "../components/SEO";

export default function About() {
  return (
    <>
      <SEO title="About Toolsy" description="Utilidades online rápidas y sencillas." path="/about" />
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Sobre</h1>
        <p>Proyecto en construcción. Envíame ideas o bugs en GitHub.</p>
      </div>
    </>
  );
}
