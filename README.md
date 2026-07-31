# Prisma Consultora

Sitio web oficial de Prisma Consultora — Sprint 01. Single Page Application construida como embudo comercial: desde el primer impacto en el Hero hasta el Diagnóstico Prisma® interactivo y el agendamiento de la primera conversación.

## Stack

- [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) para animaciones
- [Lucide React](https://lucide.dev/) para íconos

Sitio 100% frontend: no requiere backend ni base de datos. El Diagnóstico Prisma® calcula el informe en el cliente, y el agendamiento redirige a un Google Form externo.

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

## Estructura

```
src/
  components/        Secciones de la landing (Hero, Soluciones, Método, etc.)
  components/diagnostic/  Motor del Diagnóstico Prisma® (preguntas, informe)
  components/visuals/     Ilustraciones SVG propias (placeholders de fotografía)
  data/              Contenido editable (preguntas, soluciones, FAQ, nav)
  hooks/             Estado del diagnóstico (useDiagnostic)
  lib/               Lógica de scoring del diagnóstico
public/img/          Imágenes estáticas del sitio
```

## Imágenes

Las imágenes definitivas van en `public/img/`. Las secciones sin foto real todavía usan ilustraciones vectoriales propias (`src/components/visuals/`) que se pueden reemplazar por un `<img>` en cualquier momento, sin tocar el resto del componente.

## Configuración pendiente

- Reemplazar imágenes placeholder restantes por fotografía definitiva.
- Datos de contacto y redes sociales reales en el footer.
- El link de agendamiento (Google Form) vive en `src/data/nav.ts` (`GOOGLE_FORM_URL`).
