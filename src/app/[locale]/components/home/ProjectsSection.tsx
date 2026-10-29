import { getTranslations } from "next-intl/server";
import { Container } from "../layout/Container";
import { Section } from "../layout/Section";
import { SectionHeader } from "../layout/SectionHeader";
import styles from "./ProjectsSection.module.css";

interface ProjectItem {
  name: string;
  type: string;
  description: string;
  stack: string;
}

export async function ProjectsSection() {
  const t = await getTranslations("projects");
  const items = t.raw("items") as ProjectItem[];

  return (
    <Section id="s04" titleId="t04">
      <Container>
        <SectionHeader
          number={t("number")}
          label={t("label")}
          meta={t("meta")}
          title={t("title")}
          titleId="t04"
          intro={t("intro")}
        />
        <ul className={styles.list}>
          {items.map((item, index) => (
            <li key={item.name} className={styles.project}>
              <span className={styles.number}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className={styles.who}>
                <h3>{item.name}</h3>
                <p className={styles.role}>{item.type}</p>
              </div>
              <div className={styles.bio}>
                <p>{item.description}</p>
                <p className={styles.stack}>{item.stack}</p>
              </div>
              <span className={styles.scope}>{t("scope")}</span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
