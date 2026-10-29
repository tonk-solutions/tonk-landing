import { getTranslations } from "next-intl/server";
import { Container } from "../layout/Container";
import styles from "./IntegrationsBar.module.css";

/**
 * Barra full-bleed de integraciones: label, lista de plataformas y contador.
 */
export async function IntegrationsBar() {
  const t = await getTranslations("integrations");
  const platforms = (t.raw("platforms") as string[]) || [];

  return (
    <section className={styles.bar} id="s02" aria-labelledby="t02">
      <Container>
        <div className={styles.barIn}>
          <h2 id="t02" className={styles.heading}>
            <span className={styles.num}>{t("number")}</span>
            <span className={styles.label}>/ {t("label")}</span>
          </h2>

          <ul className={styles.list}>
            {platforms.map((platform) => (
              <li key={platform}>{platform}</li>
            ))}
          </ul>

          <span className={styles.count}>{t("meta")}</span>
        </div>
      </Container>
    </section>
  );
}
