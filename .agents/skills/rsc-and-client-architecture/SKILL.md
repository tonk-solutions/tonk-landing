---
name: rsc-and-client-architecture
description: Designs React component trees to maximize React Server Components (RSC), push "use client" to leaf nodes, prevent environment poisoning with the server-only package, and interleave server/client components via the children slot pattern. Use when architecting new features, resolving hydration errors, or preventing accidental client-side exposure of secrets in React 19 + Next.js 15 projects.
allowed-tools: "Read, Write"
version: 1.0.0
---

# RSC and Client Architecture

## Cuándo usar este skill

- Scaffoldear una nueva feature con múltiples componentes
- Resolver un error de hidratación o bundle size inesperadamente grande
- Necesitar lógica de servidor (DB, secrets) y UI interactiva en la misma vista
- Configurar un Context provider global sin bloquear la optimización de Server Components
- Auditar qué componentes están en el bundle del cliente

## Instrucciones

1. Por defecto, todos los componentes son Server Components — agregar `"use client"` solo a los leaf nodes interactivos (onClick, onChange, useEffect, APIs del browser)
2. Para mezclar server y client: el Server Component **pasa** el server child como `children` prop al Client Component — nunca importarlo directamente dentro de un Client Component
3. Para archivos con API keys o lógica de DB: agregar `import 'server-only'` al inicio — genera error de build si se importa desde un Client Component
4. Para Context providers: crearlos como Client Components que aceptan `children`, importarlos en un Server Component (layout), y renderizarlos tan abajo en el árbol como sea posible
5. Props pasadas de Server a Client Components deben ser serializables por React

## Ejemplos

### "use client" solo en leaf nodes

```tsx
// app/layout.tsx (Server Component)
import SearchBar from './ui/search-bar' // "use client" dentro
import Logo from './ui/logo'            // Server Component

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav><Logo /><SearchBar /></nav>
      <main>{children}</main>
    </>
  )
}
```

### Server Component como children de Client Component

```tsx
// app/ui/modal.tsx
"use client"
import { useState } from 'react'

export default function Modal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(!open)}>Carrito</button>
      {open && <div>{children}</div>}
    </>
  )
}

// app/page.tsx (Server Component — orquesta la composición)
import Modal from './ui/modal'
import Cart from './ui/cart' // Server Component con fetch

export default function Page() {
  return (
    <Modal>
      <Cart /> {/* Se renderiza en el servidor, se pasa como children */}
    </Modal>
  )
}
```

### Prevenir environment poisoning con server-only

```typescript
// lib/db.ts
import 'server-only' // Build error si se importa desde "use client"

export async function getUserData(id: string) {
  return await fetch(`https://api.internal.com/users/${id}`, {
    headers: { Authorization: `Bearer ${process.env.API_KEY}` }
  })
}
```

### Context provider profundo en el árbol

```tsx
// app/providers/theme-provider.tsx
"use client"
import { createContext } from 'react'
export const ThemeContext = createContext('light')

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Renderizar <ThemeContext> directamente (React 19 — sin .Provider)
  return <ThemeContext value="dark">{children}</ThemeContext>
}

// app/layout.tsx (Server Component)
import ThemeProvider from './providers/theme-provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {/* Provider wrappea solo {children}, no el <html> completo */}
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

## Restricciones

- NO importar un Server Component directamente dentro de un archivo `"use client"` — pasarlo como `children`
- NO poner `"use client"` en un layout o page entero solo porque un sub-componente necesita estado
- NO asumir que omitir `"use client"` hace un archivo seguro — usar `server-only` para archivos con secrets
- NO wrappear el `<html>` completo con un Client Component Context provider — wrappear solo `{children}`
- NO pasar props no serializables (funciones, clases, Map, Set) de Server a Client Components
