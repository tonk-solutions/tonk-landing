// The client provider must not ship server-only namespaces (seo, schema, landing) inside the browser bundle.
export const CLIENT_NAMESPACES = [
  "ui",
  "nav",
  "about",
  "services",
  "team",
  "contact",
  "footer",
  "a11y",
] as const;

export type ClientNamespace = (typeof CLIENT_NAMESPACES)[number];

/** Narrows an arbitrary dictionary key to a namespace a client component may request. */
export function isClientNamespace(value: string): value is ClientNamespace {
  return (CLIENT_NAMESPACES as readonly string[]).includes(value);
}

/**
 * Keeps only the namespaces client components actually consume; unknown or
 * still-missing namespaces (`a11y` today) are skipped instead of injected empty.
 */
export function pickClientMessages<T extends object>(messages: T): Partial<T> {
  const picked: Partial<T> = {};

  for (const namespace of CLIENT_NAMESPACES) {
    if (Object.prototype.hasOwnProperty.call(messages, namespace)) {
      picked[namespace as keyof T] = (messages as Record<string, unknown>)[
        namespace
      ] as T[keyof T];
    }
  }

  return picked;
}
