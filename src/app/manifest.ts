import type { MetadataRoute } from "next";
import { brandTokens } from "./brandTokens";
import { SITE_NAME } from "./constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Tonk",
    description: "Senior engineering for critical systems and integrations.",
    start_url: "/",
    display: "standalone",
    background_color: brandTokens.bg,
    theme_color: brandTokens.bg,
    // App icons come from the file conventions in `src/app/` (icon.svg,
    // apple-icon.png); the manifest only needs the square 512 render.
    icons: [
      {
        src: "/brand/icono-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
