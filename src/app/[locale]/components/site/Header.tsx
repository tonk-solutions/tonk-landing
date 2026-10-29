import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
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
  const tA11y = await getTranslations("a11y");

  const navLinks = [
    { href: "/#s03", label: t("services") },
    { href: "/#s06", label: t("process") },
    { href: "/#s08", label: t("team") },
    { href: "/#s09", label: t("contact") },
  ];

  return (
    <>
      <a className="skip-link" href="#main">
        {t("skip")}
      </a>
      <header className={styles.header} id="site-header">
        <Container className={styles.inner}>
          <Link
            className={styles.lockupLink}
            href="/#s01"
            aria-label={tA11y("homeLink")}
          >
            <BrandLockup variant="horizontal" size="md" markSize={28} />
          </Link>

          <MobileMenu items={navLinks} />

          <nav className={styles.nav} aria-label={tA11y("primaryNav")}>
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <LanguageSwitcher />

          <Link className={styles.cta} href="/#s09">
            {t("cta")}
          </Link>
        </Container>
      </header>
    </>
  );
}
