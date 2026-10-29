import styles from "./Section.module.css";

type SectionProps = {
  /** id de anclaje: s01 a s09. */
  id: string;
  /** id del h2 de la sección, para aria-labelledby. */
  titleId: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * Sección de la landing. Aporta el anclaje del índice lateral, el padding vertical
 * y la asociación accesible con su título.
 */
export function Section({ id, titleId, children, className }: SectionProps) {
  const classes = [styles.sec, className].filter(Boolean).join(" ");

  return (
    <section id={id} aria-labelledby={titleId} className={classes}>
      {children}
    </section>
  );
}
