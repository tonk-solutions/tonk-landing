import messages from "../../../messages/es.json";
import { buildLlmsFullTxt, buildLlmsInput } from "../seo/llms";

export const dynamic = "force-static";

/**
 * `/llms-full.txt` — la landing completa en Markdown para que un modelo no tenga
 * que rastrear el sitio. Mismo cableado que `/llms.txt`: `buildLlmsInput` es el
 * único punto de traducción messages → builder, así los dos archivos no pueden
 * desincronizarse.
 */
export function GET() {
  return new Response(buildLlmsFullTxt(buildLlmsInput(messages)), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
