import React from "react";
import { ArrowDown } from "lucide-react";
import { getFrontmatterOnly } from "@/lib/mdx-content";
import { Button } from "@/components/ui/button";
import type { HeroContent } from "@/types/content";

function parseMarkdownBold(text: string): React.ReactNode[] {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part,
  );
}

const HeroSection = async () => {
  const raw = await getFrontmatterOnly("hero");
  const content = (raw || {}) as unknown as HeroContent;

  const {
    subtitle = "",
    title = "",
    titleHighlight = "",
    description = "",
    cta = "Ver servicios",
  } = content;

  return (
    <section
      id="inicio"
      aria-labelledby="hero-heading"
      className="relative min-h-dvh overflow-hidden bg-brand-navy text-white flex items-center"
    >
      {/* Decorative blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[5%] top-[10%] size-72 rounded-full bg-brand-blue opacity-10 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[20%] right-[10%] size-64 rounded-full bg-brand-cyan opacity-10 blur-[100px]"
      />

      <div className="container-content relative z-10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
          {/* Subtitle / badge */}
          <p
            className="animate-fade-in font-medium tracking-widest text-brand-cyan"
            style={{ fontSize: "var(--text-lg)" }}
          >
            {subtitle}
          </p>

          {/* H1 — LCP element */}
          <h1
            id="hero-heading"
            className="animate-fade-up font-bold leading-tight"
            style={{
              fontSize: "var(--text-hero)",
              animationDelay: "0.1s",
            }}
          >
            {title}{" "}
            <span className="text-gradient-brand">{titleHighlight}</span>
          </h1>

          {/* Description */}
          <p
            className="animate-fade-up max-w-3xl text-gray-300 leading-relaxed"
            style={{
              fontSize: "var(--text-lg)",
              animationDelay: "0.2s",
            }}
          >
            {parseMarkdownBold(description)}
          </p>

          {/* CTAs */}
          <div
            className="animate-fade-up flex flex-wrap items-center justify-center gap-4 pt-4"
            role="group"
            aria-label="Acciones principales"
            style={{ animationDelay: "0.3s" }}
          >
            <Button variant="accent" size="lg" asChild>
              <a href="#servicios">{cta}</a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <a href="#contacto">Contactanos</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/70"
        aria-hidden="true"
      >
        <ArrowDown size={24} strokeWidth={1.5} />
      </div>
    </section>
  );
};

export default HeroSection;
