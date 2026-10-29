import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  SITE_NAME,
  SITE_URL,
  WHATSAPP_URL,
} from "../constants";
import { buildLlmsTxt } from "../seo/llms";
import messages from "../../../messages/es.json";

export const dynamic = "force-static";

export function GET() {
  const text = buildLlmsTxt({
    siteName: SITE_NAME,
    siteUrl: SITE_URL,
    contactEmail: CONTACT_EMAIL,
    contactPhone: CONTACT_PHONE,
    whatsappUrl: WHATSAPP_URL,
    seoDescription: messages.seo.description,
    location: messages.footer.location,
    copy: messages.llms,
    founders: messages.team.members,
    services: [
      ...messages.services.craft.services,
      ...messages.services.talent.services,
    ],
    projects: messages.projects.items,
    integrations: messages.integrations.platforms,
  });

  return new Response(text, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
