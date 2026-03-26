---
name: nextjs15-data-fetching
description: Fetches data in Next.js 15 Server Components using async/await, parallel requests with Promise.all, async request APIs (params, cookies, headers), and Suspense boundaries for granular streaming. Use when building data-driven pages or layouts in the App Router with React 19 + Next.js 15.
allowed-tools: "Read, Write"
version: 1.0.0
---

# Next.js 15 Data Fetching

## Cuándo usar este skill

- Crear un Server Component que fetch datos de una API o base de datos
- Acceder a `params`, `searchParams`, `cookies()` o `headers()` en un page/layout
- Paralelizar múltiples fetches independientes
- Mostrar partes de la página antes de que todos los datos estén disponibles (streaming)
- Migrar código que accede a APIs de request de forma síncrona

## Instrucciones

1. Declarar el componente como `async` y hacer `await` del fetch directamente — no hay necesidad de `useEffect`
2. `await` todas las APIs de request **antes** de acceder a sus propiedades: `await params`, `await cookies()`, `await headers()`
3. Para múltiples fetches independientes, iniciar todos sin `await` y luego resolverlos con `Promise.all`
4. Envolver componentes de fetch lento en `<Suspense fallback={...}>` para no bloquear el resto de la página
5. Para compartir datos entre `generateMetadata` y la página, usar `React.cache()` para deduplicar
6. Ver `references/async-apis-migration.md` para casos de migración complejos

## Ejemplos

### Awaiting APIs de request (Next.js 15 breaking change)

```tsx
// app/blog/[slug]/page.tsx
import { cookies } from 'next/headers'

export default async function Page({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  // OBLIGATORIO en Next.js 15: await antes de acceder
  const { slug } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')

  const post = await db.getPost(slug)
  return <article>{post.title}</article>
}
```

### Fetches paralelos con Promise.all

```tsx
// app/artist/[username]/page.tsx
export default async function ArtistPage({
  params
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  // Iniciar ambos fetches simultáneamente
  const artistPromise = getArtist(username)
  const albumsPromise = getAlbums(username)

  // Resolver en paralelo
  const [artist, albums] = await Promise.all([artistPromise, albumsPromise])

  return <><h1>{artist.name}</h1><AlbumList albums={albums} /></>
}
```

### Streaming granular con Suspense

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react'

export default function Dashboard() {
  return (
    <section>
      <h1>Dashboard</h1>
      {/* Cada boundary streama independientemente */}
      <Suspense fallback={<p>Cargando posts...</p>}>
        <PostFeed />
      </Suspense>
      <Suspense fallback={<p>Cargando clima...</p>}>
        <WeatherWidget />
      </Suspense>
    </section>
  )
}
```

### PageProps / LayoutProps — tipado global de Next.js

```tsx
// No requiere import — PageProps es un helper global
export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params
  const { q } = await searchParams
  return <div>ID: {id}, Query: {q}</div>
}
```

## Restricciones

- NO acceder a `params.slug` o `cookies().get()` de forma síncrona — es una breaking change en Next.js 15
- NO usar `"use client"` + `useEffect` para fetching — los Server Components son más eficientes y seguros
- NO hacer `await fetch1; await fetch2` secuencialmente cuando los fetches son independientes — usar `Promise.all`
- NO bloquear toda la página con un fetch lento sin un `<Suspense>` boundary
- NO tipar `params` manualmente como `{ params: { slug: string } }` — usar `PageProps` / `LayoutProps` globales
