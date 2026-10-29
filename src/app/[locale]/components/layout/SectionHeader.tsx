import styles from "./SectionHeader.module.css";

type SectionHeaderProps = {
  /** Número de la sección: "01" a "09". */
  number: string;
  /** Etiqueta mono que acompaña al número, sin la barra. */
  label: string;
  /** Dato corto alineado a la derecha. Opcional. */
  meta?: string;
  title: string;
  /** id del h2, usado por el `aria-labelledby` de la sección. */
  titleId: string;
  intro?: string;
};

/**
 * Cabecera de sección del "documento de ingeniería": hairline superior, número en
 * menta, etiqueta mono, dato a la derecha y el título de la sección.
 */
export function SectionHeader({ number, label, meta, title, titleId, intro }: SectionHeaderProps) {
  return (
    <header>
      <div className={styles.head}>
        <span className={styles.left}>
          <span className={styles.num}>{number}</span>
          <span className={styles.label}>/ {label}</span>
        </span>
        {meta ? <span className={styles.meta}>{meta}</span> : null}
      </div>
      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
      {intro ? <p className={styles.intro}>{intro}</p> : null}
    </header>
  );
}
