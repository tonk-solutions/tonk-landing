/**
 * Orden, ancla y namespace de las nueve secciones de la home.
 *
 * Fuente única para el índice lateral, el menú mobile y la composición de la
 * página: el número sale de `messages.*.number`, el ancla de acá y el nombre
 * del índice de `messages.*.indexLabel`. Así no hay un número derivado de la
 * posición que pueda separarse del que muestra la cabecera de su sección.
 */
export const HOME_SECTIONS = [
  { namespace: "hero", id: "s01" },
  { namespace: "integrations", id: "s02" },
  { namespace: "services", id: "s03" },
  { namespace: "projects", id: "s04" },
  { namespace: "diagnostic", id: "s05" },
  { namespace: "process", id: "s06" },
  { namespace: "criterio", id: "s07" },
  { namespace: "team", id: "s08" },
  { namespace: "contact", id: "s09" },
] as const;

export type HomeSection = (typeof HOME_SECTIONS)[number];
