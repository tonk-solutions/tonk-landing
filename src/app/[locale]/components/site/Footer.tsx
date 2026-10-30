import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
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
  const tA11y = await getTranslations("a11y");
  const currentYear = new Date().getFullYear();

  const sitemap = [
    { href: "/#s03", label: tNav("services") },
    { href: "/#s06", label: tNav("process") },
    { href: "/#s07", label: tCriterio("label") },
    { href: "/#s08", label: tNav("team") },
    { href: "/#s09", label: tNav("contact") },
  ];

  return (
    <footer className={styles.footer} id="site-footer">
      <Container>
        <div className={styles.foot}>
          <div className={styles.brand}>
            <Link
              className={styles.lockupLink}
              href="/#s01"
              aria-label={tA11y("homeLinkFooter")}
            >
              <BrandLockup variant="stacked" markSize={56} />
            </Link>
            <p>{tFooter("tagline")}</p>
          </div>

          <nav className={styles.sitemap} aria-label={tFooter("navLabel")}>
            <ul>
              {sitemap.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
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
