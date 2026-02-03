import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Tonk Solutions | Ingeniería de alta precisión para desafíos de escala",
  description: "Resolvemos desafíos críticos de arquitectura y deuda técnica que frenan el crecimiento del negocio, mediante equipos de ingeniería expertos.",
  authors: [
    { name: "Tonk Solutions" },
  ],
  keywords: ["ingeniería", "software", "arquitectura", "deuda técnica", "consultoría", "enterprise", "cloud", "fintech"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${poppins.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
