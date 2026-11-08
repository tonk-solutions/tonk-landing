import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { buildAlternateLinkHeader } from "./app/seo/alternates";

const handleI18n = createMiddleware(routing);

/**
 * El middleware de next-intl publica `Link` con `hreflang`. Se conserva esa
 * cabecera y se reescribe solo cuando existe, para que `x-default` coincida
 * con el HTML (`buildAlternateLinkHeader`) y no apunte a una ruta sin idioma.
 */
export default function proxy(request: NextRequest): NextResponse {
  const response = handleI18n(request);
  const link = response.headers.get("link");

  if (link?.includes("hreflang")) {
    response.headers.set("link", buildAlternateLinkHeader(request.nextUrl.pathname));
  }

  return response;
}

export const config = {
  matcher: ["/", "/(es|en)/:path*"],
};
