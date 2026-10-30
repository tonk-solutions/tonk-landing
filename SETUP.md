# Tonk Solutions Landing Page - Setup Guide

## Project Overview

Modern, responsive landing page for Tonk Solutions built with Next.js 14 and Chakra UI v3.

## Tech Stack

- **Framework**: Next.js 14.0.4
- **UI Library**: Chakra UI v3.1.0
- **Styling**: Chakra UI (no Tailwind in components)
- **Animations**: Framer Motion v10.16.16
- **Icons**: Lucide React + React Icons
- **Language**: TypeScript

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── Header.tsx          # Navigation with scroll detection
│   │   ├── HeroSection.tsx     # Main hero with CTA
│   │   ├── ServicesSection.tsx # Service cards
│   │   ├── AboutSection.tsx    # Company info
│   │   ├── TeamSection.tsx     # Team members
│   │   ├── ContactSection.tsx  # Contact form
│   │   ├── Footer.tsx          # Footer with social links
│   │   └── TonkLogo.tsx        # Reusable logo component
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Main page
│   ├── providers.tsx           # Chakra UI provider
│   ├── theme.ts                # Chakra UI theme config
│   └── globals.css             # Global styles
```

## Key Features

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth scroll animations with Framer Motion
- ✅ Intersection Observer for scroll-triggered animations
- ✅ Social media links (LinkedIn, Instagram, WhatsApp)
- ✅ Contact form with validation feedback
- ✅ Header with scroll detection
- ✅ Reusable components (TonkLogo, ServiceCard, TeamMember)

## Installation & Running

### Requisitos

- **Node.js** `^20.19.0 || >=22.12.0`. Es el `engines` de `package.json`: `next` 16 pide
  `>=20.9` y el Vite que trae `vitest` 4 pide `^20.19 || >=22.12`. `.nvmrc` fija la 22 y
  `netlify.toml` fija `NODE_VERSION = "22"`. Con una versión menor el build falla con un
  error de engine en vez de un mensaje claro.

### Install Dependencies

```bash
npm install
```

Con **npm 12** los scripts de instalación de dependencias están bloqueados por defecto:
`allowScripts` en `package.json` es la lista de los que pueden correr. Las entradas van
por nombre (`"@swc/core": true`), no por versión, para que sobrevivan a los bumps. Si
`npm install` avisa que salteó scripts, revisalos y aprobalos con
`npm install-scripts approve <pkg> --no-allow-scripts-pin`; `npm install-scripts ls`
lista los pendientes y `npm install-scripts prune` borra las entradas que ya no
corresponden a ningún paquete con scripts.

### Development Server

```bash
npm run dev
```

Server runs on `http://localhost:3000` (or next available port)

### Build for Production

```bash
npm run build
npm start
```

## Important Notes

### Chakra UI v3 Compatibility

- Uses `createSystem(defaultConfig)` for theme initialization
- Replaced deprecated props:
  - `spacing` → `gap`
  - `isExternal` → `target="_blank" rel="noopener noreferrer"`
  - `VStack` → `Flex direction="column"`
  - `SimpleGrid` → `Grid templateColumns`
  - `variant="primary"` → direct color props

### Component Reusability

- **TonkLogo**: Configurable size (sm/md/lg) and theme (dark/light)
- **ServiceCard**: Animated card with icon and description
- **TeamMember**: Profile card with avatar placeholder

### Styling Approach

All styling uses Chakra UI components and props. No custom CSS classes in components.

## Deployment

Ready to deploy to:

- Vercel (recommended for Next.js)
- Netlify
- Any Node.js hosting

## Contact Information

- Email: contact@tonksolutions.com.ar
- LinkedIn: linkedin.com/company/tonk-solutions
- Instagram: @tonksolutions
- WhatsApp: Available via contact form
