# Tonk Solutions - Landing Page

## Descripción

Este es el sitio web oficial de Tonk Solutions, una empresa especializada en ingeniería de alta precisión para desafíos de escala. El sitio está construido con Next.js y utiliza Chakra UI para los componentes de interfaz de usuario.

## Características

- Diseño responsivo para todos los dispositivos
- Animaciones fluidas con Framer Motion
- Integración con redes sociales
- Formulario de contacto
- Secciones informativas sobre servicios y equipo

## Tecnologías utilizadas

- Next.js 14
- Chakra UI
- Framer Motion
- React Icons
- TypeScript

## Inicio rápido

Para ejecutar el proyecto localmente:

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador para ver el resultado.

## Estructura del proyecto

```
/
├── docs/                  # Documentación de la empresa
├── public/                # Archivos estáticos
├── src/
│   └── app/               # Aplicación Next.js
│       ├── components/     # Componentes reutilizables
│       ├── theme.ts       # Configuración de tema para Chakra UI
│       ├── globals.css    # Estilos globales
│       ├── layout.tsx     # Layout principal de la aplicación
│       ├── page.tsx       # Página principal (landing page)
│       └── providers.tsx  # Providers de Chakra UI
└── package.json          # Dependencias y scripts
```

## Rendimiento e imágenes

El build usa el optimizador de `next/image` (Sharp) para avatares y assets locales. Si despliegas en un entorno sin runtime de Node para optimización (p. ej. export estático puro), puede ser necesario volver a `images: { unoptimized: true }` en `next.config.js` o servir tamaños fijos vía CDN.

## Contacto

Para más información, contactar a Tonk Solutions en:

- Email: contact@tonksolutions.com.ar
- LinkedIn: [linkedin.com/company/tonk-solutions](https://linkedin.com/company/tonk-solutions)
- Instagram: [@tonksolutions](https://instagram.com/tonksolutions)
