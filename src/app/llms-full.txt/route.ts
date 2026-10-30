import es from "../../../messages/es.json";
import en from "../../../messages/en.json";
import { locales } from "@/i18n/locales";
import {
  buildLlmsFullTxt,
  buildLlmsLocaleContent,
  type LlmsMessages,
} from "../seo/llmsTxt";

/**
 * `/llms-full.txt` — la landing completa en Markdown, un bloque por idioma
 * (spec S2). Mismo origen de contenido que `/llms.txt`.
 */
export const dynamic = "force-static";

const MESSAGES_BY_LOCALE: Record<string, LlmsMessages> = { es, en };

export function GET() {
  const contents = locales.map((locale) =>
    buildLlmsLocaleContent(locale, MESSAGES_BY_LOCALE[locale])
  );

  return new Response(buildLlmsFullTxt(contents), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
