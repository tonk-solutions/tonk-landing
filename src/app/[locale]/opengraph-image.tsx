import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export const alt = "Tonk Solutions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const PRIMARY = "#06b6d4";
const SECONDARY = "#2563eb";
const DARK = "#0f172a";

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
          background: DARK,
          backgroundImage:
            "radial-gradient(circle at 85% 20%, rgba(6,182,212,0.25), transparent 55%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 40,
          }}
        >
          <div style={{ display: "flex", width: 90, height: 90, position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 36,
                height: 90,
                background: SECONDARY,
                opacity: 0.9,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 44,
                top: 0,
                width: 36,
                height: 66,
                background: PRIMARY,
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 64, fontWeight: 700, color: "white", letterSpacing: -1 }}>
              TONK
            </span>
            <span
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: PRIMARY,
                letterSpacing: 6,
                textTransform: "uppercase",
              }}
            >
              Solutions
            </span>
          </div>
        </div>
        <span style={{ fontSize: 38, color: "#cbd5e1", maxWidth: 900, lineHeight: 1.3 }}>
          {tagline}
        </span>
      </div>
    ),
    { ...size }
  );
}
