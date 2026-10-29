import messages from "../../../messages/es.json";
import { buildLlmsInput, buildLlmsTxt } from "../seo/llms";

export const dynamic = "force-static";

/**
 * Archivo canónico para crawlers y LLMs. El cableado messages → builder vive en
 * `buildLlmsInput`, que también usan los tests.
 */
export function GET() {
  return new Response(buildLlmsTxt(buildLlmsInput(messages)), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
