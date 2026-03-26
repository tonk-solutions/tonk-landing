# chakra-v3-accessibility-and-semantics — Cómo usarlo

## Cómo activar este skill

- **Claude Code / Antigravity:** `/chakra-v3-accessibility-and-semantics` o triggers como "agregar aria-label", "fix accesibilidad", "integrar Next.js Link con Chakra", "navbar semántica"
- **Cursor / VS Code:** se activa al crear componentes interactivos, navbars, formularios, o cuando hay `onClick` en `Box`/`Flex`

## Ejemplos de uso

### Ejemplo 1 — Navbar semántica con Next.js Link

**Input:**
> "Creame una navbar con links a Home, Dashboard y Perfil usando Next.js Link y Chakra"

**Output esperado:**
- `<Flex as="nav" aria-label="Navegación principal">`
- Cada link usando `<ChakraLink asChild><Link href="...">...</Link></ChakraLink>`
- Link activo con `aria-current="page"`
- Sin `<a>` anidados inválidos

### Ejemplo 2 — Auditar componente con problemas de accesibilidad

**Input:**
> "Revisar este componente" (código con `<Box onClick>`, `<IconButton>` sin aria-label, `<FormControl>` v2)

**Output esperado:**
- Identificar cada violación con explicación
- Fix: `<Box as="button">` con `_focus`
- Fix: `aria-label` en todos los `IconButton`
- Fix: `FormControl` → `Field.Root`, `FormLabel` → `Field.Label`, `FormErrorMessage` → `Field.ErrorText`

### Ejemplo 3 — Formulario accesible con validación

**Input:**
> "Formulario de login accesible con email y password, con mensajes de error"

**Output esperado:**
- `<Field.Root invalid={!!errors.email}>` con `Field.Label`, `Input`, `Field.ErrorText`
- `Field.ErrorText` condicional automático via `invalid`
- Todos los campos con `required` prop
- Sin `<label>` nativo

## Paths de entrega

```
skills/chakra-v3-accessibility-and-semantics/SKILL.md
skills/chakra-v3-accessibility-and-semantics/USAGE.md
```
