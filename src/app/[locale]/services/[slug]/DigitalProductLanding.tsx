import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { WHATSAPP_URL } from "@/app/constants";
import { Container } from "../../components/layout/Container";
import styles from "./DigitalProductLanding.module.css";

interface NamedText {
  title: string;
  text: string;
}

interface DigitalProductLandingProps {
  locale: string;
}

/**
 * Landing de desarrollo de producto digital (TL-32).
 * El copy vive en `landing.digitalProductDevelopment`. Es un Server Component:
 * el texto y los CTA salen en el HTML inicial, sin depender de JavaScript.
 */
export default async function DigitalProductLanding({ locale }: DigitalProductLandingProps) {
  const t = await getTranslations({
    locale,
    namespace: "landing.digitalProductDevelopment",
  });
  const tDetail = await getTranslations({ locale, namespace: "services.detail" });

  const heroParagraphs = t.raw("hero.paragraphs") as string[];
  const audienceParagraphs = t.raw("audience.paragraphs") as string[];
  const audienceItems = t.raw("audience.items") as NamedText[];
  const minimumParagraphs = t.raw("minimum.paragraphs") as string[];
  const minimumItems = t.raw("minimum.items") as NamedText[];
  const scopeParagraphs = t.raw("scope.paragraphs") as string[];
  const validationParagraphs = t.raw("validation.paragraphs") as string[];
  const stageSteps = t.raw("stages.steps") as NamedText[];
  const limitParagraphs = t.raw("limits.paragraphs") as string[];
  const ctaParagraphs = t.raw("cta.paragraphs") as string[];

  return (
    <article className={styles.page}>
      <Container>
        <header className={styles.hero}>
          <Link className={styles.back} href="/#s03">
            {tDetail("backToServices")}
          </Link>
          <p className={styles.kicker}>{t("hero.kicker")}</p>
          <h1 id="digital-product-heading">{t("hero.title")}</h1>
          {heroParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <ContactLink
            href={whatsappHref(t("hero.whatsappText"))}
            label={t("hero.cta")}
            hint={t("newTabHint")}
          />
        </header>

        <section className={styles.section} aria-labelledby="digital-product-audience">
          <h2 id="digital-product-audience">{t("audience.title")}</h2>
          {audienceParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <ul className={styles.items}>
            {audienceItems.map((item) => (
              <li key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="digital-product-minimum">
          <h2 id="digital-product-minimum">{t("minimum.title")}</h2>
          {minimumParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <ul className={styles.items}>
            {minimumItems.map((item) => (
              <li key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="digital-product-scope">
          <h2 id="digital-product-scope">{t("scope.title")}</h2>
          {scopeParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>

        <section className={styles.section} aria-labelledby="digital-product-validation">
          <h2 id="digital-product-validation">{t("validation.title")}</h2>
          {validationParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>

        <section className={styles.section} aria-labelledby="digital-product-stages">
          <h2 id="digital-product-stages">{t("stages.title")}</h2>
          <p>{t("stages.intro")}</p>
          <ol className={styles.steps}>
            {stageSteps.map((step, index) => (
              <li key={step.title}>
                <span className={styles.stepIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.section} aria-labelledby="digital-product-limits">
          <h2 id="digital-product-limits">{t("limits.title")}</h2>
          {limitParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>

        <section className={styles.closing} aria-labelledby="digital-product-cta">
          <h2 id="digital-product-cta">{t("cta.title")}</h2>
          {ctaParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <ContactLink
            href={whatsappHref(t("cta.whatsappText"))}
            label={t("cta.button")}
            hint={t("newTabHint")}
          />
        </section>
      </Container>
    </article>
  );
}

function whatsappHref(text: string): string {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;
}

function ContactLink({ href, label, hint }: { href: string; label: string; hint: string }) {
  return (
    <a className={styles.cta} href={href} target="_blank" rel="noopener noreferrer">
      {label}
      <span className="sr-only"> {hint}</span>
    </a>
  );
}
