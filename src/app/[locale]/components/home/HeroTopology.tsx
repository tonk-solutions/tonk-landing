import { getTranslations } from "next-intl/server";
import styles from "./HeroTopology.module.css";

/**
 * Diagrama de topología del hero: nodo central TONK con seis sistemas
 * conectados por líneas ortogonales y un pulso animado E-COMMERCE → TONK → ARCA.
 */
export default async function HeroTopology() {
  const t = await getTranslations("hero");

  return (
    <figure className={styles.figure}>
      <svg
        viewBox="0 0 420 420"
        role="img"
        aria-labelledby="dg-title dg-desc"
      >
        <title id="dg-title">{t("diagramTitle")}</title>
        <desc id="dg-desc">{t("diagramDesc")}</desc>

        <g className={styles.cross}>
          <path d="M0 6 H12 M6 0 V12" />
          <path d="M408 6 H420 M414 0 V12" />
          <path d="M0 414 H12 M6 408 V420" />
          <path d="M408 414 H420 M414 408 V420" />
        </g>

        <path className={styles.line} d="M166 66 H190 V170" />
        <path className={styles.line} d="M280 66 H230 V170" />
        <path className={styles.line} d="M140 210 H170" />
        <path className={styles.line} d="M280 210 H250" />
        <path className={styles.line} d="M140 354 H190 V250" />
        <path className={styles.line} d="M280 354 H230 V250" />

        <path
          className={styles.pulse}
          pathLength="100"
          d="M166 66 H190 V354 H140"
        />

        <rect className={styles.node} x="0.5" y="48.5" width="165" height="35" />
        <text className={styles.text} x="83" y="70" textAnchor="middle">
          {t("nodeEcommerce")}
        </text>

        <rect className={styles.node} x="280.5" y="48.5" width="139" height="35" />
        <text className={styles.text} x="350" y="70" textAnchor="middle">
          {t("nodeErpLegacy")}
        </text>

        <rect className={styles.node} x="0.5" y="192.5" width="139" height="35" />
        <text className={styles.text} x="70" y="214" textAnchor="middle">
          {t("nodeCrm")}
        </text>

        <rect className={styles.node} x="280.5" y="192.5" width="139" height="35" />
        <text className={styles.text} x="350" y="214" textAnchor="middle">
          {t("nodeOwnApi")}
        </text>

        <rect className={styles.node} x="0.5" y="336.5" width="139" height="35" />
        <text className={styles.text} x="70" y="358" textAnchor="middle">
          {t("nodeArca")}
        </text>

        <rect className={styles.node} x="280.5" y="336.5" width="139" height="35" />
        <text className={styles.text} x="350" y="358" textAnchor="middle">
          {t("nodePayments")}
        </text>

        <g className={styles.port}>
          <rect x="164" y="64" width="4" height="4" />
          <rect x="278" y="64" width="4" height="4" />
          <rect x="138" y="208" width="4" height="4" />
          <rect x="278" y="208" width="4" height="4" />
          <rect x="138" y="352" width="4" height="4" />
          <rect x="278" y="352" width="4" height="4" />
        </g>

        <rect className={styles.core} x="170.5" y="170.5" width="79" height="79" />
        <text className={styles.coreText} x="211" y="214" textAnchor="middle">
          {t("nodeCenter")}
        </text>

        <text className={styles.small} x="83" y="40" textAnchor="middle">
          {t("diagramOrigin")}
        </text>
        <text className={styles.small} x="70" y="392" textAnchor="middle">
          {t("diagramDestination")}
        </text>
      </svg>

      <figcaption className={styles.figcaption}>
        <span className={styles.captionLabel}>{t("diagramCaption")}</span>
        <span className={styles.captionMeta}>{t("diagramCaption")}</span>
      </figcaption>
    </figure>
  );
}
