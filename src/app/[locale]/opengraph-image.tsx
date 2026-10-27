import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { brandTokens } from "@/app/brandTokens";

export const alt = "Tonk Solutions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "schema" });
  const tagline = t("slogan");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: brandTokens.bg,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            marginBottom: 44,
          }}
        >
          {/* Official isotipo: same geometry as src/app/icon.svg. */}
          <svg width="96" height="96" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" fill={brandTokens.bg} />
            <path
              d="M5 9.5H27M16 9.5V20"
              fill="none"
              stroke={brandTokens.fg}
              strokeWidth="5"
            />
            <circle cx="16" cy="25.5" r="3.5" fill={brandTokens.accent} />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 68,
                fontWeight: 600,
                color: brandTokens.fg,
                letterSpacing: -1,
                lineHeight: 1,
              }}
            >
              TONK
            </span>
            <span
              style={{
                fontSize: 20,
                fontWeight: 500,
                color: brandTokens.muted,
                letterSpacing: 8,
                marginTop: 10,
              }}
            >
              SOLUTIONS
            </span>
          </div>
        </div>
        <span
          style={{
            fontSize: 38,
            color: brandTokens.fg,
            maxWidth: 900,
            lineHeight: 1.3,
          }}
        >
          {tagline}
        </span>
      </div>
    ),
    { ...size }
  );
}
