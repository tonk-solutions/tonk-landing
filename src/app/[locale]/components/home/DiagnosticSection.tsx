import { getTranslations } from "next-intl/server";
import { Container } from "../layout/Container";
import { Section } from "../layout/Section";
import { SectionHeader } from "../layout/SectionHeader";
import { SurfaceBlock } from "../layout/SurfaceBlock";
import { WHATSAPP_URL } from "@/app/constants";
import styles from "./DiagnosticSection.module.css";

interface DiagnosticRow {
  label: string;
  value: string;
}

export async function DiagnosticSection() {
  const t = await getTranslations("diagnostic");
  const rows = t.raw("rows") as DiagnosticRow[];

  return (
    <Section id="s05" titleId="t05">
      <Container>
        <SectionHeader
          number={t("number")}
          label={t("label")}
          meta={t("meta")}
          title={t("title")}
          titleId="t05"
          intro={t("intro")}
        />
        <SurfaceBlock>
          <dl className={styles.spec}>
            {rows.map((row) => (
              <div key={row.label} className={styles.row}>
                <dt className={styles.label}>{row.label}</dt>
                <dd className={styles.value}>{row.value}</dd>
              </div>
            ))}
          </dl>
          <div className={styles.ctaRow}>
            <a
              className={styles.btn}
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("cta")}
            </a>
            <span className={styles.note}>{t("note")}</span>
          </div>
        </SurfaceBlock>
      </Container>
    </Section>
  );
}
