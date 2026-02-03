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

### Install Dependencies
```bash
npm install
```

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
- Email: tonksolutions@gmail.com
- LinkedIn: linkedin.com/company/tonk-solutions
- Instagram: @tonksolutions
- WhatsApp: Available via contact form
