import React from "react";
import { CheckCircle2, Quote } from "lucide-react";
import { getFrontmatterOnly } from "@/lib/mdx-content";
import { Badge } from "@/components/ui/badge";
import type { AboutContent } from "@/types/content";

function parseMarkdownBold(text: string): React.ReactNode[] {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part,
  );
}

const AboutSection = async () => {
  const raw = await getFrontmatterOnly("about");
  const content = (raw || {}) as unknown as AboutContent;

  const {
    label = "",
    title = "",
    description = "",
    valueProposition = "",
    valuePoints = [],
    mission = "",
    imageTitle = "Continuidad Sistémica",
    imageSubtitle = "Armonizando Core Banking y ERPs con Cloud, Microservicios e IA",
  } = content;

  return (
    <section
      id="nosotros"
      aria-labelledby="about-heading"
      className="section-padding bg-white overflow-hidden scroll-mt-20"
    >
      <div className="container-content px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-[var(--space-xl)] lg:grid-cols-2 lg:items-center">
          {/* Left: Visual */}
          <figure className="order-2 lg:order-1" aria-hidden="true">
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <div className="relative h-72 w-full bg-brand-navy-700 md:h-96 lg:h-[500px]">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(58% 0.19 200) 0%, oklch(56% 0.20 248) 100%)",
                    opacity: 0.85,
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-white text-center">
                  <h3 className="text-xl font-bold sm:text-2xl">{imageTitle}</h3>
                  <p className="text-sm opacity-90 sm:text-base">{imageSubtitle}</p>
                </div>
              </div>
            </div>
          </figure>

          {/* Right: Content */}
          <div className="order-1 flex flex-col gap-5 lg:order-2">
            {label && (
              <Badge variant="accent" className="self-start">
                {label}
              </Badge>
            )}

            <h2
              id="about-heading"
              className="font-bold leading-tight text-foreground"
              style={{ fontSize: "var(--text-3xl)" }}
            >
              {title}
            </h2>

            <p
              className="text-muted-foreground leading-relaxed"
              style={{ fontSize: "var(--text-lg)" }}
            >
              {description}
            </p>

            {valueProposition && (
              <p
                className="text-muted-foreground leading-relaxed"
                style={{ fontSize: "var(--text-lg)" }}
              >
                {parseMarkdownBold(valueProposition)}
              </p>
            )}

            {/* Value points — container query for 2-col layout */}
            {valuePoints.length > 0 && (
              <div className="@container">
                <ul
                  role="list"
                  aria-label="Nuestros valores"
                  className="grid grid-cols-1 gap-3 @sm:grid-cols-2"
                >
                  {valuePoints.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <CheckCircle2
                        className="mt-0.5 shrink-0 text-brand-cyan"
                        size={20}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <span className="text-sm font-medium">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mission blockquote */}
            {mission && (
              <blockquote className="mt-2 rounded-lg border-l-4 border-brand-cyan bg-secondary/50 p-5">
                <div className="mb-2 flex items-center gap-2">
                  <Quote
                    className="text-brand-cyan"
                    size={16}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-cyan">
                    Nuestra Misión
                  </h3>
                </div>
                <p className="italic text-muted-foreground leading-relaxed">
                  {mission}
                </p>
              </blockquote>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
