# Graph Report - prisma_2  (2026-08-18)

## Corpus Check
- 44 files · ~278,395 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 247 nodes · 326 edges · 18 communities (17 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `97b2af3f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- devDependencies
- diagnostico.ts
- App.tsx
- dependencies
- routes.ts
- compilerOptions
- ContactoSection.tsx
- package.json
- PorQueSection.tsx
- MetodoSection.tsx
- ProblemsSection.tsx
- CLAUDE.md
- Prisma Consultora
- Scripts para crear los formularios de Google
- Prompt para Gemini (con acceso a Google Workspace)
- AgendarModal.tsx

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `scripts` - 7 edges
3. `enviarInformeCompleto()` - 7 edges
4. `useBodyScrollLock()` - 7 edges
5. `Prisma Consultora` - 7 edges
6. `nivelDe()` - 5 edges
7. `DiagnosticoFlow()` - 4 edges
8. `calcularResultado()` - 4 edges
9. `calcularResultadoCompleto()` - 4 edges
10. `SCROLL_PANEL` - 4 edges

## Surprising Connections (you probably didn't know these)
- `enviarInformeCompleto()` --calls--> `nivelDe()`  [EXTRACTED]
  server/email.ts → src/lib/diagnostico.ts
- `DiagnosticoFlow()` --calls--> `useBodyScrollLock()`  [EXTRACTED]
  src/components/DiagnosticoFlow.tsx → src/hooks/useBodyScrollLock.ts
- `AgendarModal()` --calls--> `useBodyScrollLock()`  [EXTRACTED]
  src/components/AgendarModal.tsx → src/hooks/useBodyScrollLock.ts
- `DiagnosticoFlow()` --calls--> `nivelDe()`  [EXTRACTED]
  src/components/DiagnosticoFlow.tsx → src/lib/diagnostico.ts
- `LegalModal()` --calls--> `useBodyScrollLock()`  [EXTRACTED]
  src/components/LegalModal.tsx → src/hooks/useBodyScrollLock.ts

## Import Cycles
- None detected.

## Communities (18 total, 1 thin omitted)

### Community 0 - "devDependencies"
Cohesion: 0.07
Nodes (29): concurrently, devDependencies, concurrently, tailwindcss, @tailwindcss/vite, @types/better-sqlite3, @types/cors, @types/express (+21 more)

### Community 1 - "diagnostico.ts"
Cohesion: 0.09
Nodes (32): enviarInformeCompleto(), enviarNotificacionAgendamiento(), filaBarra(), HIZO_DIAGNOSTICO_TEXTO, HORARIO_TEXTO, listaChips(), seccionOpcional(), transportador() (+24 more)

### Community 2 - "App.tsx"
Cohesion: 0.09
Nodes (20): App(), AudienciaSection(), CHECKS, DiagnosticIntro(), DiagnosticIntroProps, FEATURES, CHECKS, Hero() (+12 more)

### Community 3 - "dependencies"
Cohesion: 0.08
Nodes (25): better-sqlite3, cors, dotenv, express, framer-motion, lucide-react, mercadopago, nodemailer (+17 more)

### Community 4 - "routes.ts"
Cohesion: 0.13
Nodes (18): actualizarContacto(), AgendamientoData, contarDiagnosticos(), crearAgendamiento(), crearDiagnostico(), DATA_DIR, db, DiagnosticoRow (+10 more)

### Community 5 - "compilerOptions"
Cohesion: 0.09
Nodes (21): DOM, DOM.Iterable, ES2022, src, compilerOptions, allowImportingTsExtensions, isolatedModules, jsx (+13 more)

### Community 6 - "ContactoSection.tsx"
Cohesion: 0.28
Nodes (6): ContactoSection(), ContactoSectionProps, PASOS, FaqAccordion(), FAQ, FaqItem

### Community 7 - "package.json"
Cohesion: 0.17
Nodes (11): name, private, scripts, build, dev, dev:all, dev:server, preview (+3 more)

### Community 8 - "PorQueSection.tsx"
Cohesion: 0.31
Nodes (6): PorQueSection(), FacetPatternVisual(), EQUIPO, EquipoArea, Pilar, PILARES

### Community 9 - "MetodoSection.tsx"
Cohesion: 0.32
Nodes (5): MetodoSection(), ShineSweep(), ShineSweepProps, METODO_STEPS, MetodoStep

### Community 10 - "ProblemsSection.tsx"
Cohesion: 0.38
Nodes (4): ProblemsSection(), MinimalDeskVisual(), Problem, PROBLEMS

### Community 14 - "Prisma Consultora"
Cohesion: 0.25
Nodes (7): Configuración pendiente, Cómo correr el proyecto, Deploy, Estructura, Imágenes, Prisma Consultora, Stack

### Community 15 - "Scripts para crear los formularios de Google"
Cohesion: 0.40
Nodes (4): Archivos, Cómo se conectan los dos formularios, Cómo usarlo (con Apps Script), Scripts para crear los formularios de Google

### Community 16 - "Prompt para Gemini (con acceso a Google Workspace)"
Cohesion: 0.50
Nodes (3): 1. Formulario "Agendar una conversación — Prisma Consultora", 2. Formulario "Diagnóstico Prisma®", Prompt para Gemini (con acceso a Google Workspace)

### Community 17 - "AgendarModal.tsx"
Cohesion: 0.23
Nodes (10): AgendarModal(), AgendarModalProps, HIZO_DIAGNOSTICO, HORARIOS, Footer(), LegalModal(), LegalModalProps, useBodyScrollLock() (+2 more)

## Knowledge Gaps
- **106 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+101 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `DIMENSIONES` connect `diagnostico.ts` to `routes.ts`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _106 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `diagnostico.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09365079365079365 - nodes in this community are weakly interconnected._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08817204301075268 - nodes in this community are weakly interconnected._