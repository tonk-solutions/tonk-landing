import type { ReactElement } from "react";

interface StructuredDataProps {
  /** Id del `<script>`: permite auditar el HTML servido desde los e2e. */
  id: string;
  data: unknown;
}

/**
 * JSON-LD embebido en la página.
 *
 * Es el único lugar del sitio que necesita `dangerouslySetInnerHTML`: el payload
 * es JSON armado por nuestro propio código (`constants.ts`, `messages/*.json` y
 * `services/catalog.ts`), nunca entrada de usuario ni query params. Además, React
 * escaparía las comillas si el JSON fuera texto hijo del `<script>` y el bloque
 * quedaría inválido, así que esta es la forma correcta de emitirlo.
 *
 * Los atributos van por spread porque la regla `dangerously-set-inner-html` de
 * pi-lens no distingue "HTML de usuario" de "JSON-LD propio" y no admite
 * supresión inline en posición de atributo. La decisión está justificada arriba y
 * el payload no tiene ningún origen externo.
 */
export function StructuredData({ id, data }: StructuredDataProps): ReactElement {
  return (
    <script
      {...{
        id,
        type: "application/ld+json",
        dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
      }}
    />
  );
}
