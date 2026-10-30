import { getTranslations } from "next-intl/server";
import { Container } from "../layout/Container";
import { Section } from "../layout/Section";
import { SectionHeader } from "../layout/SectionHeader";
import styles from "./CriterioSection.module.css";

interface Pillar {
  title: string;
  description: string;
}

/**
 * "Criterio" reunía cuatro jerarquías en una sección (bajada, principios, misión y
 * pilares). Quedan dos: la misión como statement de la sección y los pilares como
 * dominios. Los principios bajan a lista compacta de una línea (spec S23).
 */
export async function CriterioSection() {
  const t = await getTranslations("criterio");
  const companies = t.raw("companies") as string[];
  const principles = t.raw("principles") as string[];
  const pillars = t.raw("pillars") as Pillar[];

  return (
    <Section id="s07" titleId="t07">
      <Container>
        <SectionHeader
          number={t("number")}
          label={t("label")}
          meta={t("meta")}
          title={t("title")}
          titleId="t07"
        />
        <div className={styles.evidenceStrip}>
          <span className={styles.evidenceLabel}>{t("evidenceLabel")}</span>
          <ul className={styles.companies}>
            {companies.map((company) => (
              <li key={company}>{company}</li>
            ))}
          </ul>
        </div>
        <Container grid padded={false} className={styles.crit}>
          <div className={styles.left}>
            <blockquote className={styles.mission}>
              <p>{t("mission")}</p>
              <footer>{t("missionLabel")}</footer>
            </blockquote>
            <ol className={styles.principles}>
              {principles.map((principle) => (
                <li key={principle}>{principle}</li>
              ))}
            </ol>
          </div>
          <dl className={styles.pillars}>
            {pillars.map((pillar) => (
              <div key={pillar.title}>
                <dt>{pillar.title}</dt>
                <dd>{pillar.description}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Container>
    </Section>
  );
}
