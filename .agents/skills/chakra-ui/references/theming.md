# Chakra UI v3 — Theming Reference

> Source: NotebookLM notebook `chakra-ui` (Tokens docs, Migration guide, Recipes docs, Color Mode docs)

## Index

1. [Token System in Depth](#1-token-system-in-depth)
2. [Extending the Theme](#2-extending-the-theme)
3. [Semantic Tokens & colorPalette](#3-semantic-tokens--colorpalette)
4. [Slot Recipes for Custom Components](#4-slot-recipes-for-custom-components)
5. [Dark Mode](#5-dark-mode)

---

## 1. Token System in Depth

Design tokens in Chakra UI v3 are platform-agnostic key-value pairs influenced by
the W3C Token Format. Each token has a `value` (any valid CSS value) and an
optional `description`.

### The `value` Key (CRITICAL)

All token values **must** be wrapped in `{ value: "..." }`:

```ts
// ✅ Correct
colors: { brand: { 500: { value: "#0070f3" } } }

// ❌ Wrong — will break
colors: { brand: { 500: "#0070f3" } }
```

### The `DEFAULT` Key

Use `DEFAULT` to define a fallback value for nested token groups:

```ts
colors: {
  brand: {
    DEFAULT: { value: "#0070f3" },  // referenced as just "brand"
    light:  { value: "#e6f2ff" },
    dark:   { value: "#003d7a" },
  }
}
```

### Token Reference Syntax

Reference tokens in composite values using `{path.to.token}`.
**Always include the category** in the path:

```ts
// ✅ Correct — border: { value: "1px solid {colors.brand.500}" }
// ❌ Wrong  — border: { value: "1px solid {brand.500}" }  (won't resolve)
```

### CLI Typegen

Run after defining tokens for TypeScript autocompletion:

```bash
npx @chakra-ui/cli typegen
# Or in package.json: "postinstall": "chakra typegen"
```

### All Token Types

| Token Type      | CSS Properties                              | Value Type          |
|-----------------|---------------------------------------------|---------------------|
| Colors          | `color`, `background`, `border-color`       | string / reference  |
| Gradients       | `background-image`                          | string / composite  |
| Sizes           | `width`, `height`, `min-*`, `max-*`         | string              |
| Spacing         | `margin`, `padding`, `gap`, `top/right/...` | string              |
| Fonts           | `font-family`                               | string / array      |
| Font Sizes      | `font-size`                                 | string              |
| Font Weights    | `font-weight`                               | string              |
| Letter Spacings | `letter-spacing`                            | string              |
| Line Heights    | `line-height`                               | string              |
| Radii           | `border-radius`                             | string              |
| Borders         | `border`, `outline`                         | string / composite  |
| Border Widths   | `border-width`                              | string              |
| Shadows         | `box-shadow`                                | string / composite  |
| Easings         | `transition-timing-function`                | string / cubic-bezier|
| Opacity         | `opacity`                                   | string              |
| Z-Index         | `z-index`                                   | string              |
| Assets          | `background-image`                          | url / svg string    |
| Durations       | `transition-duration`, `animation-duration` | string (ms)         |
| Animations      | `animation`                                 | keyframe string     |
| Aspect Ratios   | `aspect-ratio`                              | string              |

---

## 2. Extending the Theme

### Merging with `defaultConfig`

To extend the theme **without breaking defaults**, pass `defaultConfig` as the first
argument to `createSystem`. Your customizations merge on top:

```ts
import { createSystem, defaultConfig } from "@chakra-ui/react"

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          500: { value: "tomato" },
        },
      },
    },
  },
})
```

### Using `defaultBaseConfig` for Minimal Themes

For bundle optimization, use `defaultBaseConfig` (no recipes) + only the recipes
you need:

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

### Provider Setup

```tsx
<ChakraProvider value={system}>
  {children}
</ChakraProvider>
```

> The `theme` prop from v2 is now `value`. Replace `defaultSystem` with your
> custom `system` when using a custom theme.

---

## 3. Semantic Tokens & colorPalette

### The 7 Required Semantic Token Keys

For `colorPalette` to work on any component, you must define these 7 semantic
tokens for each custom color:

| Key          | Purpose                               | Typical Usage                |
|--------------|---------------------------------------|------------------------------|
| `solid`      | Primary solid background              | Button backgrounds           |
| `contrast`   | Text color on solid backgrounds       | Button text on solid variant  |
| `fg`         | Foreground / primary text             | Links, headings              |
| `muted`      | Muted / subtle backgrounds            | Hover states, badges         |
| `subtle`     | Very light tints                      | Alert backgrounds            |
| `emphasized` | Slightly stronger than muted          | Active states                |
| `focusRing`  | Focus ring / outline color            | Focus indicators             |

### Full Example

```ts
export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          50:  { value: "#e6f2ff" },
          100: { value: "#cce5ff" },
          200: { value: "#b3d7ff" },
          300: { value: "#80bcff" },
          500: { value: "#007bff" },
          700: { value: "#0056b3" },
          900: { value: "#003370" },
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
          emphasized: { value: "{colors.brand.300}" },
          focusRing:  { value: "{colors.brand.500}" },
        },
      },
    },
  },
})
```

### Using `colorPalette`

In v3, `colorPalette` replaces `colorScheme` and can be used **anywhere**:

```tsx
<Button colorPalette="brand" variant="solid">Click Me</Button>
<Badge colorPalette="brand">New</Badge>
<Progress.Root colorPalette="brand">...</Progress.Root>
```

---

## 4. Slot Recipes for Custom Components

### `defineRecipe` — Single-Part Components

```ts
import { defineRecipe } from "@chakra-ui/react"

export const buttonRecipe = defineRecipe({
  className: "button",
  base: { fontWeight: "bold", borderRadius: "md" },
  variants: {
    size: {
      sm: { padding: "4", fontSize: "sm" },
      md: { padding: "6", fontSize: "md" },
    },
    variant: {
      solid:   { bg: "colorPalette.solid", color: "colorPalette.contrast" },
      outline: { border: "1px solid", borderColor: "colorPalette.fg" },
    },
  },
  compoundVariants: [
    {
      size: "sm",
      variant: "outline",
      css: { borderWidth: "2px" },
    },
  ],
  defaultVariants: { size: "md", variant: "solid" },
})
```

> **Caveat**: `compoundVariants` do NOT support responsive values. Render
> multiple component versions at different breakpoints instead.

### `defineSlotRecipe` — Multi-Part Components

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
      lg: { root: { maxW: "lg" }, body: { fontSize: "lg" } },
    },
  },
  defaultVariants: { size: "sm" },
})
```

### Using the `chakra` Factory

Bind a recipe to an HTML element to create a typed component:

```ts
import { chakra } from "@chakra-ui/react"
import { buttonRecipe } from "./button.recipe"

const Button = chakra("button", buttonRecipe)

// Usage — variant props are auto-typed:
<Button variant="solid" size="md">Click</Button>
```

### `useRecipe` Hook & Theme Registration

Access a theme-bound recipe: `const recipe = useRecipe({ key: "button" })`

Register in theme:
```ts
const system = createSystem(defaultConfig, {
  theme: {
    recipes: { button: buttonRecipe },
    slotRecipes: { card: cardRecipe },
  },
})
```

Recipes access semantic tokens directly: `bg: "colorPalette.solid"`, `color: "colorPalette.contrast"`. Common tokens: `bg`, `fg`, `border`, `colorPalette.*`.

---

## 5. Dark Mode

### Architecture: `next-themes`

v3 delegates all color mode logic to `next-themes`. The following were **removed**:
- `ColorModeProvider`, `useColorMode`, `useColorModeValue`
- `LightMode`, `DarkMode`, `ColorModeScript` components

### Provider Setup

```tsx
import { ChakraProvider } from "@chakra-ui/react"
import { ThemeProvider } from "next-themes"
import { system } from "./theme"

export function Provider({ children }) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </ChakraProvider>
  )
}
```

### `_dark` Pseudo-Prop

Use `_dark` in style props to conditionally apply styles in dark mode:

```tsx
<Box bg="brand.100" _dark={{ bg: "brand.700" }} color="brand.fg">
  Adapts to color mode
</Box>
```

### Force Color Mode

Apply a specific mode to a subtree using className:

```tsx
<div className="dark">
  {/* All Chakra components here render in dark mode */}
</div>
```

### Semantic Tokens with Conditions

For automatic dark mode support, define semantic tokens with `_dark` conditions:

```ts
semanticTokens: {
  colors: {
    "bg.page": {
      value: { base: "{colors.white}", _dark: "{colors.gray.900}" },
    },
    "text.primary": {
      value: { base: "{colors.gray.900}", _dark: "{colors.gray.100}" },
    },
  },
}
```

### When to Use What

| Approach                  | Use When                                         |
|---------------------------|--------------------------------------------------|
| `_dark` pseudo in props   | One-off overrides on individual components        |
| Semantic tokens w/ `_dark`| Systematic color palette that auto-adapts         |
| `className="dark"`        | Forcing a section to a specific mode              |
| `next-themes` `useTheme`  | Programmatic toggle (replaces `useColorMode`)     |

> **Key principle**: Prefer semantic tokens with `_dark` conditions for systematic
> theming. Fall back to `_dark` pseudo-props for component-level exceptions.
