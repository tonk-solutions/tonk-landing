import { getTranslations } from "next-intl/server";
import { Container } from "../layout/Container";
import { BrandLockup } from "../brand/BrandLockup";
import styles from "./Footer.module.css";

/**
 * Footer: lockup apilado, bajada, mapa del sitio y ubicación.
 */
export async function Footer() {
  const tFooter = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tCriterio = await getTranslations("criterio");
  const currentYear = new Date().getFullYear();

  const sitemap = [
    { href: "#s03", label: tNav("services") },
    { href: "#s06", label: tNav("process") },
    { href: "#s07", label: tCriterio("label") },
    { href: "#s08", label: tNav("team") },
    { href: "#s09", label: tNav("contact") },
  ];

  return (
    <footer className={styles.footer} id="site-footer">
      <Container>
        <div className={styles.foot}>
          <div className={styles.brand}>
            <a
              className={styles.lockupLink}
              href="#s01"
              aria-label="Tonk Solutions, volver al inicio"
            >
              <BrandLockup variant="stacked" size="md" markSize={32} />
            </a>
            <p>{tFooter("tagline")}</p>
          </div>

          <nav className={styles.sitemap} aria-label={tFooter("navLabel")}>
            <ul>
              {sitemap.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.location}>
            <span className={styles.label}>{tFooter("location")}</span>
            <p>{tFooter("copyright", { year: currentYear })}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
