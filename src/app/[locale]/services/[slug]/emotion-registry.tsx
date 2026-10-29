"use client";

import { useState, type ReactNode } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider } from "@emotion/react";
import createCache, { type Options } from "@emotion/cache";

/**
 * Registry de Emotion para el App Router.
 *
 * Sin esto, Emotion inyecta el `<style>` global del SSR en el body en un orden
 * distinto al que espera el cliente y React reporta un hydration mismatch (error
 * 418) en cada carga del detalle de servicio. Con `useServerInsertedHTML` los
 * estilos viajan en el HTML del servidor, en la posición que el cliente espera.
 *
 * Los estilos los genera Emotion a partir de las clases del proyecto: no hay
 * entrada de usuario en esta cadena.
 */
export function EmotionRegistry({ options, children }: { options: Options; children: ReactNode }) {
  const [cache] = useState(() => {
    const instance = createCache(options);
    instance.compat = true;
    return instance;
  });

  useServerInsertedHTML(() => {
    const inserted = cache.inserted;
    const names = Object.keys(inserted).filter((name) => inserted[name] !== true);
    if (names.length === 0) return null;

    let css = "";
    for (const name of names) css += inserted[name];

    // `children` en un <style> evita `dangerouslySetInnerHTML`: React escribe el
    // texto tal cual y el resultado es idéntico.
    return (
      <style data-emotion={`${cache.key} ${names.join(" ")}`} suppressHydrationWarning>
        {css}
      </style>
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
