import { Helmet } from "@dr.pogodin/react-helmet";
import { useMemo } from "react";

const SITE_NAME = "Toolsy";
const ORIGIN = "https://toolsykit.vercel.app";
const DEFAULT_IMAGE = "/og-image.png"; // pon este archivo en /public (1200x630)

export default function SEO({
  title,
  description = "Small, fast, privacy-friendly online utilities.",
  path = "/",
  image = DEFAULT_IMAGE,
}) {
  const url = useMemo(() => {
    // Garantiza barra inicial en path
    const clean = path.startsWith("/") ? path : `/${path}`;
    return `${ORIGIN}${clean}`;
  }, [path]);

  const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;

  return (
    <Helmet>
      {/* HTML */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta name="theme-color" content="#084003" />

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
