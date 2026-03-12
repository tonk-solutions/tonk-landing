---
name: chakra-ui
description: >
  Best practices and patterns for Chakra UI v3 with React.
  Use this skill when the user works with Chakra components,
  theming, design tokens, recipes, accessibility, or layout with
  Chakra UI. Also activate on mentions of ChakraProvider, compound
  components, style props, colorPalette, createSystem, or asChild.
---

# Chakra UI v3 — Best Practices & Patterns

> **Source**: All content extracted from a curated NotebookLM notebook with 38 sources
> including official Chakra UI v3 docs, migration guides, and community best practices.

---

## 1. Quick Start

### Install packages

```bash
npm install @chakra-ui/react @emotion/react
```

> `@emotion/styled` and `framer-motion` are **no longer required** in v3.

### Add CLI snippets

Snippets are pre-built component compositions that save time and give you full control:

```bash
npx @chakra-ui/cli snippet add
```

### Create theme file

```ts
// theme.ts
import { createSystem, defaultConfig } from "@chakra-ui/react"

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        // your custom tokens here
      },
    },
  },
})
```

### Setup Provider

```tsx
// App.tsx
import { ChakraProvider } from "@chakra-ui/react"
import { system } from "./theme"

export default function App() {
  return (
    <ChakraProvider value={system}>
      <YourApp />
    </ChakraProvider>
  )
}
```

> **v3 change**: The `theme` prop is now `value`. The snippets CLI also generates
> a `Provider` component in `components/ui/provider` that composes `ChakraProvider`
> + `ThemeProvider` from `next-themes` for color mode support.

---

## 2. Core Concepts

### Compound Components (Dot Notation)

v3 adopts a **compound component** pattern inspired by Radix UI. Related sub-components
are grouped under a single namespace using dot notation:

```tsx
// v3 — compound components
<Card.Root>
  <Card.Header><Card.Title>Title</Card.Title></Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Footer</Card.Footer>
</Card.Root>

// ❌ v2 style — DO NOT USE in v3
<Card><CardHeader>Title</CardHeader><CardBody>Content</CardBody></Card>
```

Other examples: `Dialog.Root`, `Accordion.Item`, `Avatar.Fallback`, `Tabs.Trigger`,
`Menu.Content`, `Popover.Positioner`, `Field.Root`, `Progress.Track`.

### The `as` Prop

Changes the underlying HTML element rendered by a component:

```tsx
<Heading as="h1">Page Title</Heading>   // renders <h1> instead of default <h2>
<Flex as="nav" bg="gray.100" p={4}>...</Flex>  // renders <nav>
<Box as="section">...</Box>              // renders <section>
```

### The `asChild` Prop

Transfers Chakra styles and behavior to the child component without wrapper elements
(inspired by Radix Primitives):

```tsx
<Link asChild color="teal.500">
  <NextLink href="/about">About</NextLink>
</Link>
```

### Common Style Props

| Style Prop | CSS Property       | Example              |
|------------|--------------------|----------------------|
| `m`        | `margin`           | `m={4}`              |
| `p`        | `padding`          | `p={8}`              |
| `bg`       | `background-color` | `bg="gray.50"`       |
| `color`    | `color`            | `color="blue.600"`   |
| `w`        | `width`            | `w="100%"`           |
| `h`        | `height`           | `h="100vh"`          |
| `fontSize` | `font-size`        | `fontSize="2xl"`     |
| `gap`      | `gap`              | `gap={4}`            |

Style props consume **theme tokens**, e.g. `m={2}` maps to `theme.space[2]` (8px).

### Boolean Props (v3 naming)

| v2              | v3            |
|-----------------|---------------|
| `isOpen`        | `open`        |
| `isDisabled`    | `disabled`    |
| `isInvalid`     | `invalid`     |
| `isRequired`    | `required`    |
| `isLoading`     | `loading`     |
| `colorScheme`   | `colorPalette`|

---

## 3. Components

### Button

```tsx
import { Button } from "@chakra-ui/react"
import { LuArrowRight } from "react-icons/lu"

<Button colorPalette="blue" variant="solid" disabled={false} loading={false}>
  Click Me
  <LuArrowRight />
</Button>
```

> `leftIcon`/`rightIcon` removed — render icons as children directly.
> `variant="link"` → `variant="plain"`. Use `react-icons` instead of `@chakra-ui/icons`.

### Dialog (formerly Modal)

```tsx
import { Dialog, Button } from "@chakra-ui/react"

<Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
  <Dialog.Backdrop />
  <Dialog.Positioner>
    <Dialog.Content>
      <Dialog.Header>Dialog Title</Dialog.Header>
      <Dialog.Body>Content here.</Dialog.Body>
      <Dialog.Footer>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
      </Dialog.Footer>
      <Dialog.CloseTrigger />
    </Dialog.Content>
  </Dialog.Positioner>
</Dialog.Root>
```

> Key renames: `isOpen` → `open`, `onClose` → `onOpenChange`, `isCentered` → `placement="center"`.

### Accordion

```tsx
import { Accordion } from "@chakra-ui/react"

<Accordion.Root collapsible defaultValue={["section-1"]}>
  <Accordion.Item value="section-1">
    <Accordion.ItemTrigger>
      Section 1 Title
      <Accordion.ItemIndicator />
    </Accordion.ItemTrigger>
    <Accordion.ItemContent>
      <Accordion.ItemBody>Content for section 1.</Accordion.ItemBody>
    </Accordion.ItemContent>
  </Accordion.Item>
</Accordion.Root>
```

> `allowMultiple` → `multiple`, `allowToggle` → `collapsible`, `defaultIndex` → `defaultValue`.

### Tabs

```tsx
import { Tabs } from "@chakra-ui/react"

<Tabs.Root defaultValue="tab-1">
  <Tabs.List>
    <Tabs.Trigger value="tab-1">Account</Tabs.Trigger>
    <Tabs.Trigger value="tab-2">Settings</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab-1">Account settings.</Tabs.Content>
  <Tabs.Content value="tab-2">Preferences.</Tabs.Content>
</Tabs.Root>
```

### Menu

```tsx
import { Menu, Button } from "@chakra-ui/react"

<Menu.Root>
  <Menu.Trigger asChild>
    <Button>Open Menu</Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Item value="new">New File</Menu.Item>
    <Menu.Item value="open">Open File</Menu.Item>
  </Menu.Content>
</Menu.Root>
```

### Field (formerly FormControl)

```tsx
import { Field, Input } from "@chakra-ui/react"

<Field.Root invalid={true} required={true}>
  <Field.Label>Email Address</Field.Label>
  <Input placeholder="name@example.com" type="email" />
  <Field.HelperText>We will never share your email.</Field.HelperText>
  <Field.ErrorText>Valid email is required.</Field.ErrorText>
</Field.Root>
```

> `Field.ErrorText` only renders when `invalid` is `true` — no conditional logic needed.

---

## 4. Theming

### Custom Theme with `createSystem`

```ts
// theme.ts
import { createSystem, defaultConfig } from "@chakra-ui/react"

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          50:  { value: "#e6f2ff" },
          100: { value: "#cce5ff" },
          500: { value: "#0070f3" },
          700: { value: "#005bb5" },
          900: { value: "#003d7a" },
        },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid:      { value: "{colors.brand.500}" },
          contrast:   { value: "white" },
          fg:         { value: "{colors.brand.700}" },
          muted:      { value: "{colors.brand.100}" },
          subtle:     { value: "{colors.brand.50}" },
          emphasized: { value: "{colors.brand.500}" },
          focusRing:  { value: "{colors.brand.500}" },
        },
      },
    },
  },
})
```

> **Critical**: All token values must be wrapped in `{ value: "..." }`.
> Use the token reference syntax `{colors.brand.500}` — always with full path.

### Semantic Tokens for `colorPalette`

For `colorPalette` to work on any component, you must define both:
1. **`tokens`** — base color scales (50–950)
2. **`semanticTokens`** — `solid`, `contrast`, `fg`, `muted`, `subtle`, `emphasized`, `focusRing`

```tsx
<Button colorPalette="brand" variant="solid">Click Me</Button>
```

### Dark Mode with `next-themes`

v3 removed built-in `ColorModeProvider` and `useColorMode` in favor of `next-themes`:

```tsx
// Provider.tsx
import { ChakraProvider } from "@chakra-ui/react"
import { ThemeProvider } from "next-themes"
import { system } from "./theme"

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </ChakraProvider>
  )
}
```

> Force theme mode: use `className="light"` or `className="dark"`.

---

## 5. Recipes

v3 replaces `styleConfig` / `multiStyleConfig` with **recipes** and **slot recipes**
(inspired by Panda CSS).

### `defineRecipe` — single-part components

```ts
import { defineRecipe } from "@chakra-ui/react"

export const buttonRecipe = defineRecipe({
  className: "button",
  base: {
    fontWeight: "bold",
    borderRadius: "md",
  },
  variants: {
    size: {
      sm: { padding: "4", fontSize: "sm" },
      md: { padding: "6", fontSize: "md" },
    },
    variant: {
      solid: { bg: "blue.500", color: "white" },
      outline: { border: "1px solid", borderColor: "blue.500" },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "solid",
  },
})
```

Recipe properties: `className`, `base`, `variants`, `compoundVariants`, `defaultVariants`.

### `defineSlotRecipe` — multi-part components

```ts
import { defineSlotRecipe } from "@chakra-ui/react"

export const cardRecipe = defineSlotRecipe({
  className: "card",
  slots: ["root", "header", "body", "footer"],
  base: {
    root:   { borderRadius: "xl", boxShadow: "md" },
    header: { padding: "4", borderBottom: "1px solid" },
    body:   { padding: "4" },
    footer: { padding: "4", borderTop: "1px solid" },
  },
  variants: {
    size: {
      sm: { root: { maxW: "sm" }, body: { fontSize: "sm" } },
      md: { root: { maxW: "md" }, body: { fontSize: "md" } },
    },
  },
  defaultVariants: { size: "md" },
})
```

### Modular Recipe Imports (Bundle Optimization)

Instead of importing the full `defaultSystem` with all recipes, import only what you need:

```ts
import { createSystem, defaultBaseConfig } from "@chakra-ui/react"
import { buttonRecipe, inputRecipe } from "@chakra-ui/react/theme"

const system = createSystem(defaultBaseConfig, {
  theme: {
    recipes: {
      Button: buttonRecipe,
      Input: inputRecipe,
    },
  },
})
```

---

## 6. Responsive Styles

### Default Breakpoints (mobile-first)

| Key   | Min Width |
|-------|-----------|
| `sm`  | 480px     |
| `md`  | 768px     |
| `lg`  | 1024px    |
| `xl`  | 1280px    |
| `2xl` | 1536px    |

### Object Syntax (preferred)

```tsx
<Box width={{ base: "100%", md: "50%" }} p={{ base: 4, lg: 8 }}>
  Responsive Content
</Box>
```

### Array Syntax

Values map to breakpoints in order: `[base, sm, md, lg, xl, 2xl]`:

```tsx
<Box m={[2, 4, 6]}>Responsive Margin</Box>
// base=2, sm=4, md+=6
```

### `useBreakpointValue` Hook

```tsx
import { useBreakpointValue } from "@chakra-ui/react"

const variant = useBreakpointValue({ base: "outline", md: "solid" })
return <Button variant={variant}>Click Me</Button>
```

### `useMediaQuery` Hook

```tsx
import { useMediaQuery } from "@chakra-ui/react"

const [isLargerThan768] = useMediaQuery("(min-width: 768px)")
return isLargerThan768 ? <DesktopView /> : <MobileView />
```

### Custom Breakpoints

```ts
const system = createSystem(defaultConfig, {
  theme: {
    breakpoints: {
      sm: "320px",
      md: "768px",
      lg: "960px",
      xl: "1200px",
    },
  },
})
```

> v3 only ships these hooks: `useBreakpointValue`, `useMediaQuery`, `useDisclosure`,
> `useCallbackRef`, `useControllableState`.

---

## 7. Layout Components

### Box

The most abstract component — the foundation for all others:

```tsx
<Box as="section" bg={{ base: "red.500", lg: "blue.500" }} p={[2, 4, 6]}>
  Content
</Box>
```

### Flex

Simplifies CSS Flexbox with responsive props:

```tsx
<Flex
  as="nav"
  bg="gray.100"
  p={4}
  direction={{ base: "column", md: "row" }}
  justify="space-between"
>
  <Heading as="h1" size="lg">Site Title</Heading>
</Flex>
```

### Grid & SimpleGrid

`SimpleGrid` for basic responsive grids, `Grid` for advanced `gridTemplateAreas`:

```tsx
<SimpleGrid columns={[1, null, 3]} gap={4}>
  <Box bg="tomato" height="80px">1</Box>
  <Box bg="cyan.300" height="80px">2</Box>
  <Box bg="green.300" height="80px">3</Box>
</SimpleGrid>
```

> For complex layouts with row-span, use native CSS Grid instead of Chakra Grid.

### Stack

Applies equal spacing between children. In v3: `spacing` → `gap`, `divider` → `separator`:

```tsx
<Stack direction={{ base: "column", md: "row" }} gap={4}>
  <Box p={5} shadow="md" borderWidth="1px">Item 1</Box>
  <Box p={5} shadow="md" borderWidth="1px">Item 2</Box>
</Stack>
```

### Container

Constrains content width to the current breakpoint:

```tsx
<Container maxW={{ base: "100%", md: "container.md", lg: "container.xl" }} centerContent>
  <Text>Constrained and centered content.</Text>
</Container>
```

---

## 8. Best Practices

1. **Use modular imports** — Import from `@chakra-ui/react/button` instead of barrel
   `@chakra-ui/react` to enable tree shaking and reduce bundle size by up to 3×.

2. **Use compound components (dot notation)** — Always use `Card.Root`, `Dialog.Root`,
   `Accordion.Item` etc. Never use v2 flat component names.

3. **Use `as` and `asChild` for semantics** — Set `as="nav"` on `Flex`, `as="h1"` on
   `Heading`. Use `asChild` when wrapping third-party components (Next.js Link, etc.).

4. **Use responsive object/array syntax** — Always start with `base` for mobile.
   Use theme tokens (`m={4}`) instead of fixed values (`margin: "16px"`).

5. **Enforce accessibility** — Always provide `aria-label` on `IconButton`, use
   `Field.Root` + `Field.Label` instead of raw `<label>`, use `VisuallyHidden` for
   screen-reader-only text.

---

## 9. Anti-Patterns

1. **❌ Do NOT mix v2 and v3 APIs** — v3 is a breaking change. Never use v2 flat
   component names (`Modal`, `CardBody`, `FormControl`) alongside v3 compound
   components (`Dialog.Root`, `Card.Body`, `Field.Root`). Always migrate fully.

2. **❌ Hardcoded CSS values / inline styles** — Never use `style={{ margin: "16px" }}`
   or `bg="#ff0000"`. Use Chakra style props with theme tokens: `m={4}`, `bg="red.500"`.
   Hardcoded values break dark mode and design consistency.

3. **❌ `sx` prop → Use `css` prop with `&` prefix** — The `sx` and `__css` props
   existed in Chakra v2 but were **removed in v3** for better performance and typings.
   Use the `css` prop instead, with mandatory `&` prefix on all nested selectors:
   `css={{ "&:hover": { bg: "blue.500" } }}`.

4. **❌ Inline styles when a recipe exists** — If a component has a recipe or slot
   recipe defined, use variant props (`variant="solid"`, `size="md"`) instead of
   overriding with inline style props. Recipes centralize styles and enable tree shaking.

5. **❌ `colorScheme` → Use `colorPalette`** — `colorScheme` was removed in v3
   because it clashed with native HTML `colorScheme`. Use `colorPalette` anywhere.

6. **❌ `spacing` and `Divider`** — Use `gap` instead of `spacing` on Stack. Use
   `Separator` instead of `Divider`.

7. **❌ `@chakra-ui/icons`** — This package was removed. Use `react-icons` (Lucide
   recommended) or `lucide-react`. Common mappings: `AddIcon` → `LuPlus`,
   `CloseIcon` → `LuX`, `SearchIcon` → `LuSearch`, `CheckIcon` → `LuCheck`.

---

## 10. Reference Files

| Resource | URL |
|----------|-----|
| Official Docs (Getting Started) | https://chakra-ui.com/getting-started |
| Installation Guide | https://chakra-ui.com/docs/get-started/installation |
| Migration v2 → v3 | https://chakra-ui.com/docs/get-started/migration |
| Tokens Reference | https://chakra-ui.com/docs/theming/tokens |
| Components Overview | https://chakra-ui.com/docs/components/concepts/overview |
| Composition (`as` / `asChild`) | https://chakra-ui.com/docs/components/concepts/composition |
| Color Mode | https://chakra-ui.com/docs/components/concepts/color-mode |
| Bundle Optimization | https://chakra-ui.com/guides/component-bundle-optimization |
| Responsive Patterns (daily.dev) | https://daily.dev/blog/top-5-chakra-ui-patterns-for-responsive-design |
| Design Patterns Basics (daily.dev) | https://daily.dev/blog/chakra-ui-design-patterns-basics |
