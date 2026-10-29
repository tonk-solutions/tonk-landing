import { getTranslations } from "next-intl/server";
import { WHATSAPP_URL } from "@/app/constants";
import { Container } from "../layout/Container";
import { Section } from "../layout/Section";
import { SectionHeader } from "../layout/SectionHeader";
import styles from "./ContactSection.module.css";

interface ContactRow {
  label: string;
  value: string;
}

export async function ContactSection() {
  const t = await getTranslations("contact");
  const rows = t.raw("rows") as ContactRow[];

  return (
    <Section id="s09" titleId="t09">
      <Container>
        <SectionHeader
          number={t("number")}
          label={t("label")}
          meta={t("meta")}
          title={t("title")}
          titleId="t09"
        />
        <Container grid className={styles.contact}>
          <div className={styles.left}>
            <p className={styles.description}>{t("description")}</p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btn}
            >
              {t("cta")}
            </a>
          </div>
          <dl className={styles.dataRows}>
            {rows.map((row) => (
              <div key={row.label} className={styles.row}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Container>
    </Section>
  );
}
