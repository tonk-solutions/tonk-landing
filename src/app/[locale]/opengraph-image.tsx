import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export const alt = "Tonk";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Paleta del brand kit (tema oscuro).
const BG = "#17191C";
const FG = "#E8EAED";

/** Lockup horizontal oscuro oficial del brand kit (520×192, trae su propio fondo de marca: el de la imagen debe ser plano y del mismo color). */
const LOCKUP_FILE = "public/brand/tonk-lockup-horizontal-oscuro.svg";
const LOCKUP_SIZE = { width: 624, height: 230 };

async function readLockupDataUri(): Promise<string> {
  const svg = await readFile(join(process.cwd(), LOCKUP_FILE));
  return `data:image/svg+xml;base64,${svg.toString("base64")}`;
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "schema" });
  const tagline = t("slogan");
  const lockup = await readLockupDataUri();

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
          background: BG,
        }}
      >
        <img src={lockup} alt="Tonk" width={LOCKUP_SIZE.width} height={LOCKUP_SIZE.height} style={{ marginLeft: -40 }} />
        <span style={{ fontSize: 38, color: FG, maxWidth: 900, lineHeight: 1.3, marginTop: 24 }}>
          {tagline}
        </span>
      </div>
    ),
    { ...size }
  );
}
