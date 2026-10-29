import { getTranslations } from "next-intl/server";
import { Container } from "../layout/Container";
import HeroTopology from "./HeroTopology";
import styles from "./HeroSection.module.css";

/**
 * Hero de la landing: kicker, título en dos líneas con regla menta,
 * bajada, CTAs y fila meta. La topología vive en HeroTopology.
 */
export async function HeroSection() {
  const t = await getTranslations("hero");
  const tA11y = await getTranslations("a11y");

  return (
    <section className={styles.hero} id="s01" aria-labelledby="t01">
      <Container>
        <div className={styles.secHead}>
          <span className={styles.kicker}>
            <span className={styles.num}>{t("number")}</span>
            <span className={styles.label}>/ {t("label")}</span>
          </span>
          <span className={styles.kicker}>
            <span className={styles.label}>{t("sheet")}</span>
          </span>
        </div>

        <div className={styles.heroGrid}>
          <div className={styles.heroText}>
            <h1 id="t01" className={styles.title}>
              {t("titleLine1")}
              <br />
              <span className={styles.hl}>{t("titleLine2")}</span>
            </h1>

            <p className={styles.lede}>{t("lede")}</p>

            <div className={styles.ctaRow}>
              <a className={styles.btn} href="#s09">
                {t("ctaPrimary")}
              </a>
              <a className={styles.link} href="#s06">
                <span>{t("ctaSecondary")} →</span>
              </a>
            </div>

            <ul className={styles.meta} aria-label={tA11y("heroMeta")}>
              <li>{t("metaLocation")}</li>
              <li>{t("metaSenior")}</li>
              <li>{t("metaLocale")}</li>
            </ul>
          </div>

          <HeroTopology />
        </div>
      </Container>
    </section>
  );
}
