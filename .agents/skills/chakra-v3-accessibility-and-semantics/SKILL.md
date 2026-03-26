---
name: chakra-v3-accessibility-and-semantics
description: Implementa interfaces WAI-ARIA compliant en Chakra UI v3 usando asChild para integración con Next.js Link, el prop as para semántica HTML correcta, aria-label en IconButton, y evitando el patrón clickable-div. Usar al crear o auditar componentes interactivos, formularios y navegación en React/Next.js.
allowed-tools: "Read, Write"
version: 1.0.0
---

# Chakra v3 — Accesibilidad y Semántica

## Cuándo usar este skill

- Crear componentes interactivos (botones, links, menús, formularios)
- Auditar componentes existentes por violaciones de accesibilidad
- Integrar componentes Chakra con Next.js `<Link>`
- Definir landmarks semánticos (nav, main, section)
- Agregar ARIA labels a componentes icon-only

## Instrucciones

### 1. `asChild` para integración con Next.js Link

Usar `asChild` para transferir estilos y comportamiento ARIA de Chakra a Next.js `<Link>` sin crear tags anidados inválidos:

```tsx
// ❌ Genera <a> anidado inválido
import Link from "next/link"
import { Link as ChakraLink } from "@chakra-ui/react"

<ChakraLink>
  <Link href="/about">Sobre nosotros</Link>
</ChakraLink>

// ✅ Transfiere props y ARIA correctamente
import Link from "next/link"
import { Link as ChakraLink } from "@chakra-ui/react"

<ChakraLink asChild>
  <Link href="/about">Sobre nosotros</Link>
</ChakraLink>
```

### 2. Prop `as` para semántica HTML correcta

Usar el prop `as` para que los primitivos de layout usen el elemento HTML correcto:

```tsx
// ❌ Crea <div> genérico sin semántica
<Flex bg="gray.100" p="4">
  <Heading>Mi App</Heading>
</Flex>

// ✅ Semántica correcta
<Flex as="nav" bg="gray.100" p="4" aria-label="Navegación principal">
  <Heading as="h1" size="lg">Mi App</Heading>
</Flex>

// Otros ejemplos
<Box as="main">...</Box>
<Box as="section" aria-labelledby="section-title">...</Box>
<Box as="article">...</Box>
<Box as="aside" aria-label="Información adicional">...</Box>
```

### 3. `aria-label` obligatorio en elementos icon-only

Todo `IconButton` o elemento interactivo sin texto visible **debe** tener `aria-label`:

```tsx
// ❌ Inaccesible — screen readers no anuncian función
<IconButton>
  <BellIcon />
</IconButton>

// ✅ Accesible
<IconButton aria-label="Ver notificaciones">
  <BellIcon />
</IconButton>

// Para texto visualmente oculto, usar VisuallyHidden
<Button>
  <SearchIcon />
  <VisuallyHidden>Buscar</VisuallyHidden>
</Button>
```

### 4. Evitar el patrón "clickable div"

Nunca attachar `onClick` a `<Box>` o `<div>` — son invisibles para tecnologías asistivas:

```tsx
// ❌ Anti-patrón — no navegable con teclado, no anunciado por screen readers
<Box onClick={handleClick} cursor="pointer">
  Acción
</Box>

// ✅ Usar button nativo
<Box as="button" onClick={handleClick} _focus={{ outline: "2px solid" }}>
  Acción
</Box>

// ✅ O usar Button de Chakra
<Button variant="ghost" onClick={handleClick}>
  Acción
</Button>
```

### 5. Formularios con Field.Root (reemplaza FormControl)

```tsx
// ❌ v2 — pierde linkage automático aria-describedby
<FormControl isInvalid={!!error}>
  <FormLabel>Email</FormLabel>
  <Input type="email" />
  <FormErrorMessage>{error?.message}</FormErrorMessage>
</FormControl>

// ✅ v3 — mantiene ARIA linkages correctos
<Field.Root invalid={!!error} required>
  <Field.Label>Email</Field.Label>
  <Input type="email" />
  <Field.ErrorText>{error?.message}</Field.ErrorText>
</Field.Root>
// Field.ErrorText solo renderiza cuando invalid={true} — no requiere condicional manual
```

### 6. Link activo con `aria-current`

```tsx
// Marcar el link de página activa para screen readers
<ChakraLink
  asChild
  aria-current={isActive ? "page" : undefined}
  _currentPage={{ color: "brand.solid", fontWeight: "bold" }}
>
  <Link href="/dashboard">Dashboard</Link>
</ChakraLink>
```

## Restricciones

- Nunca omitir `aria-label` en `IconButton` o cualquier elemento interactivo sin texto visible
- Nunca usar `<Box onClick={...}>` sin `as="button"` o `role="button"` + `tabIndex={0}`
- Nunca anidar `<Link>` de Next.js dentro de `<ChakraLink>` sin `asChild`
- Nunca deshabilitar `focusRing` visualmente — es requerimiento WCAG 2.4.7
- Nunca usar `<label>` nativo en lugar de `<Field.Label>` — rompe el `aria-describedby`
- Nunca usar `<Flex>` como nav sin `as="nav"` — no aporta landmark semántico
