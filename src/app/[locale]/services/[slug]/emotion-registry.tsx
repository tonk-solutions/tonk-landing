"use client";

import { useRef, useState, type ReactNode } from "react";
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

  const emitted = useRef(new Set<string>());

  useServerInsertedHTML(() => {
    // `cache.inserted` no se muta: lo administra Emotion y además es el valor de un
    // useState. En cambio se recuerda acá qué se emitió ya, para no repetir el
    // mismo bloque en cada flush (el HTML del detalle llegaba a 94% de hojas
    // duplicadas). Este estado vive solo en el servidor: el callback no corre en
    // el cliente.
    const inserted = cache.inserted;
    const names = Object.keys(inserted).filter(
      (name) => inserted[name] !== true && !emitted.current.has(name),
    );
    if (names.length === 0) return null;

    let css = "";
    for (const name of names) {
      css += inserted[name];
      emitted.current.add(name);
    }

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
