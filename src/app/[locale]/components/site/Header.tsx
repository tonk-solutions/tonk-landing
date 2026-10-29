import { getTranslations } from "next-intl/server";
import { Container } from "../layout/Container";
import { BrandLockup } from "../brand/BrandLockup";
import MobileMenu from "./MobileMenu";
import LanguageSwitcher from "./LanguageSwitcher";
import styles from "./Header.module.css";

/**
 * Header fijo del sitio: lockup, navegación desktop, selector de idioma y CTA.
 * El menú mobile vive en un componente cliente aparte.
 */
export async function Header() {
  const t = await getTranslations("nav");

  const navLinks = [
    { href: "#s03", label: t("services") },
    { href: "#s06", label: t("process") },
    { href: "#s08", label: t("team") },
    { href: "#s09", label: t("contact") },
  ];

  return (
    <>
      <a className="skip-link" href="#main">
        {t("skip")}
      </a>
      <header className={styles.header} id="site-header">
        <Container className={styles.inner}>
          <a
            className={styles.lockupLink}
            href="#s01"
            aria-label="Tonk Solutions, inicio"
          >
            <BrandLockup variant="horizontal" size="md" markSize={28} />
          </a>

          <MobileMenu items={navLinks} />

          <nav className={styles.nav} aria-label="Principal">
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <LanguageSwitcher />

          <a className={styles.cta} href="#s09">
            {t("cta")}
          </a>
        </Container>
      </header>
    </>
  );
}
