import { getTranslations } from "next-intl/server";
import { Container } from "../layout/Container";
import { Section } from "../layout/Section";
import { SectionHeader } from "../layout/SectionHeader";
import styles from "./ProcessSection.module.css";

interface ProcessStep {
  title: string;
  description: string;
}

export async function ProcessSection() {
  const t = await getTranslations("process");
  const steps = t.raw("steps") as ProcessStep[];

  return (
    <Section id="s06" titleId="t06">
      <Container>
        <SectionHeader
          number={t("number")}
          label={t("label")}
          meta={t("meta")}
          title={t("title")}
          titleId="t06"
        />
        <ol className={styles.steps}>
          {steps.map((step, index) => (
            <li key={step.title} className={styles.step}>
              <span className={styles.num}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
