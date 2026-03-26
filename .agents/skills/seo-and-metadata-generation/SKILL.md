---
name: seo-and-metadata-generation
description: Generates SEO metadata in Next.js 15 using static Metadata objects or async generateMetadata functions, memoizes shared data fetches with React.cache() to prevent duplicates, leverages streaming metadata for dynamic pages, and creates programmatic Open Graph images via ImageResponse in opengraph-image.tsx files. Use when adding SEO tags, OG images, or managing document metadata in Next.js 15 App Router projects.
allowed-tools: "Read, Write"
version: 1.0.0
---

# SEO and Metadata Generation

## Cuándo usar este skill

- Agregar `<title>`, `<description>` y Open Graph tags a una página
- Generar metadata dinámica basada en datos de la DB (blog post, producto, perfil)
- Evitar doble fetch cuando metadata y página necesitan el mismo dato
- Crear imágenes OG programáticas por ruta dinámica
- Controlar cómo crawlers de redes sociales (Twitter, Slack) ven la página

## Instrucciones

1. Para metadata estática: exportar un objeto `Metadata` desde `layout.tsx` o `page.tsx`
2. Para metadata dinámica: exportar una función `async generateMetadata()` del mismo archivo
3. Si `generateMetadata` y el componente de página necesitan el mismo dato: extraer el fetch a un helper con `React.cache()` — evita doble query
4. Para imágenes OG dinámicas: crear `opengraph-image.tsx` en la carpeta del route — exportar un componente que retorna `ImageResponse`
5. En `ImageResponse` usar solo `flexbox` y el subset de CSS soportado — `display: grid` no funciona
6. `generateMetadata` y `metadata` solo se pueden usar en Server Components

## Ejemplos

### Metadata estática

```typescript
// app/blog/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Mi Blog',
    default: 'Mi Blog',
  },
  description: 'Artículos sobre desarrollo web',
  openGraph: {
    siteName: 'Mi Blog',
    type: 'website',
  },
}
```

### Metadata dinámica con deduplicación via React.cache()

```typescript
// app/lib/data.ts
import { cache } from 'react'

// Una sola query aunque se llame desde generateMetadata Y desde la página
export const getPost = cache(async (slug: string) => {
  return await db.posts.findUnique({ where: { slug } })
})
```

```typescript
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'
import { getPost } from '@/app/lib/data'
import { notFound } from 'next/navigation'

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug) // Cacheado — no genera segunda query

  if (!post) return { title: 'Post no encontrado' }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
    },
  }
}

export default async function Page({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug) // Retorna el resultado cacheado

  if (!post) notFound()
  return <article><h1>{post.title}</h1></article>
}
```

### OG image dinámica con ImageResponse

```tsx
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import { getPost } from '@/app/lib/data'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  return new ImageResponse(
    (
      // Solo flexbox — no grid
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'white',
        width: '100%',
        height: '100%',
        padding: '60px',
        justifyContent: 'flex-end',
      }}>
        <h1 style={{ fontSize: 64, margin: 0 }}>{post?.title}</h1>
        <p style={{ fontSize: 28, color: '#666' }}>Mi Blog</p>
      </div>
    ),
    { ...size }
  )
}
```

## Restricciones

- NO exportar `metadata` o `generateMetadata` desde Client Components — solo Server Components
- NO hacer el mismo fetch en `generateMetadata` y en el componente de página sin `React.cache()` — genera doble query
- NO usar `display: grid` ni propiedades CSS avanzadas en `ImageResponse` — solo flexbox y subset básico
- NO esperar que streaming metadata llegue a crawlers como Twitterbot o Slackbot — Next.js envía metadata bloqueante para bots
- NO usar `react-helmet` para metadata básica cuando `generateMetadata` cubre el caso de uso
