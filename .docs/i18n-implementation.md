# i18n Implementation with next-intl

## Overview

This project uses `next-intl` for internationalization with Spanish (default) and English support.

## Structure

### Configuration Files

- `src/i18n/routing.ts` - Routing configuration with locale definitions
- `src/i18n/request.ts` - Request configuration for loading messages
- `src/proxy.ts` - Proxy (middleware) for locale detection and routing

### Translation Files

- `messages/es.json` - Spanish translations
- `messages/en.json` - English translations

### Routes

- `/` → redirects to `/es` (default locale)
- `/es/*` → Spanish version
- `/en/*` → English version

## How Locale Detection Works

### Automatic Detection Flow

1. **User visits the site** (e.g., `https://tonksolutions.com/`)

2. **Proxy checks Accept-Language header**
   - Browser sends preferred languages in request headers
   - Example from US browser: `Accept-Language: en-US,en;q=0.9`
   - Example from Argentina browser: `Accept-Language: es-AR,es;q=0.9`

3. **Locale matching**
   - Proxy tries to match browser language with available locales (`es`, `en`)
   - If match found → redirect to that locale
   - If no match → redirect to default locale (`es`)

4. **User is redirected**
   - US visitor → `/en` (English version)
   - Argentina visitor → `/es` (Spanish version)
   - Any unmatched region → `/es` (Spanish default)

### Manual Override

Users can manually switch languages using the language switcher in the header:

- Click the flag button (🇦🇷 or 🇺🇸)
- Select desired language from dropdown
- Page reloads with selected locale
- Selected language is preserved across navigation

### Important Notes

- **Default locale:** Spanish (`es`) - used when no locale can be detected
- **Browser preference:** Initial visit respects browser language
- **User choice:** Manual selection overrides browser preference
- **URL-based:** Locale is always in the URL path (`/es/` or `/en/`)
- **No cookies required:** Locale state is purely URL-based

## Best Practices Applied

### 1. **Type Safety**

- Proper TypeScript types for locale and messages
- No `any` types used
- Type casting with `Record<string, unknown>` for messages

### 2. **Component Structure**

- All client components use `useTranslations()` hook
- Translations organized by section (nav, hero, about, services, team, contact, footer)
- Nested translations for complex data structures

### 3. **Routing**

- Dynamic `[locale]` folder for automatic route localization
- Middleware handles locale detection
- Static params generation for both locales

### 4. **Language Switcher**

- Accessible UI component in header (desktop & mobile)
- Uses Chakra UI v3 Menu components
- Preserves current route when switching languages

### 5. **SEO Considerations**

- Locale-specific metadata in layout
- Hreflang tags via `alternates.languages`
- Structured data (JSON-LD) localized per language

## Usage in Components

```tsx
import { useTranslations } from "next-intl";

export default function MyComponent() {
  const t = useTranslations("sectionName");

  return <h1>{t("title")}</h1>;
}
```

## Future Improvements

1. Add more locales if needed (e.g., Portuguese)
2. Implement translation management system for content updates
