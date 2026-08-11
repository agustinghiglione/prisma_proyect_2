# Prisma Consultora

Sitio web oficial de Prisma Consultora. Single Page Application construida como embudo comercial: desde el primer impacto en el Hero hasta el Método y el agendamiento de la primera conversación.

## Stack

- [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) para animaciones
- [Lucide React](https://lucide.dev/) para íconos

Sitio 100% estático: no requiere backend ni base de datos. Tanto el
Diagnóstico Prisma® como el agendamiento de la primera conversación viven en
Google Forms externos (ver `google-apps-script/` para cómo se crearon y
cómo mantenerlos).

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

Abrir `http://localhost:5173`.

Para generar el build de producción:

```bash
npm run build
npm run preview
```

## Deploy

Sitio puramente estático — en DigitalOcean App Platform (o cualquier
hosting similar) alcanza con un componente **Static Site**:

- Build command: `npm install && npm run build`
- Output directory: `dist`

No hace falta ningún componente de backend ni base de datos.

## Estructura

```
src/
  components/        Secciones de la landing (Hero, Soluciones, Método, etc.)
  components/visuals/    Ilustraciones e ilustraciones SVG propias (ShineSweep, etc.)
  data/              Contenido editable (soluciones, FAQ, nav, links a los Forms)
public/img/          Imágenes estáticas del sitio
google-apps-script/  Scripts para crear y mantener los Google Forms (Diagnóstico y Agendar)
```

## Imágenes

Las imágenes definitivas van en `public/img/`. Las secciones sin foto real todavía usan ilustraciones vectoriales propias (`src/components/visuals/`) que se pueden reemplazar por un `<img>` en cualquier momento, sin tocar el resto del componente.

## Configuración pendiente

- Datos de contacto y redes sociales reales en el footer.
- Los links a los Google Forms (Diagnóstico y Agendar) viven en `src/data/nav.ts`.
