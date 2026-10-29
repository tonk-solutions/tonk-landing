import { getTranslations } from "next-intl/server";
import { Container } from "../layout/Container";
import { Section } from "../layout/Section";
import { SectionHeader } from "../layout/SectionHeader";
import styles from "./TeamSection.module.css";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  initials: string;
  linkedin: string;
}

export async function TeamSection() {
  const t = await getTranslations("team");
  const members = t.raw("members") as TeamMember[];

  return (
    <Section id="s08" titleId="t08">
      <Container>
        <SectionHeader
          number={t("number")}
          label={t("label")}
          meta={t("meta")}
          title={t("title")}
          titleId="t08"
        />
        <ul className={styles.list}>
          {members.map((member, index) => (
            <li key={member.name} className={styles.member}>
              <span className={styles.num}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className={styles.who}>
                <h3>{member.name}</h3>
                <p className={styles.role}>{member.role}</p>
              </div>
              <div className={styles.bioCol}>
                <p>{member.bio}</p>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  <span>{t("linkedinLabel")}</span>
                  <span className="sr-only">{t("newTabHint")}</span>
                </a>
              </div>
              <span className={styles.monogram} aria-hidden="true">
                {member.initials}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
