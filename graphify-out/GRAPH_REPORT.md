# Graph Report - prisma_2  (2026-08-18)

## Corpus Check
- 41 files · ~276,527 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 230 nodes · 291 edges · 17 communities (16 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `eccfefa8`
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

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `scripts` - 7 edges
3. `enviarInformeCompleto()` - 7 edges
4. `Prisma Consultora` - 7 edges
5. `nivelDe()` - 5 edges
6. `calcularResultado()` - 4 edges
7. `calcularResultadoCompleto()` - 4 edges
8. `lib` - 4 edges
9. `Scripts para crear los formularios de Google` - 4 edges
10. `DiagnosticoFlow()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `enviarInformeCompleto()` --calls--> `nivelDe()`  [EXTRACTED]
  server/email.ts → src/lib/diagnostico.ts
- `DiagnosticoFlow()` --calls--> `nivelDe()`  [EXTRACTED]
  src/components/DiagnosticoFlow.tsx → src/lib/diagnostico.ts

## Import Cycles
- None detected.

## Communities (17 total, 1 thin omitted)

### Community 0 - "devDependencies"
Cohesion: 0.07
Nodes (29): concurrently, devDependencies, concurrently, tailwindcss, @tailwindcss/vite, @types/better-sqlite3, @types/cors, @types/express (+21 more)

### Community 1 - "diagnostico.ts"
Cohesion: 0.13
Nodes (25): enviarInformeCompleto(), filaBarra(), listaChips(), seccionOpcional(), transportador(), DiagnosticoFlowProps, formatoARS, Paso (+17 more)

### Community 2 - "App.tsx"
Cohesion: 0.09
Nodes (19): App(), AudienciaSection(), DiagnosticIntro(), DiagnosticIntroProps, FEATURES, DiagnosticoFlow(), Footer(), CHECKS (+11 more)

### Community 3 - "dependencies"
Cohesion: 0.08
Nodes (25): better-sqlite3, cors, dotenv, express, framer-motion, lucide-react, mercadopago, nodemailer (+17 more)

### Community 4 - "routes.ts"
Cohesion: 0.13
Nodes (17): actualizarContacto(), contarDiagnosticos(), crearDiagnostico(), DATA_DIR, db, DiagnosticoRow, guardarParte2(), guardarPreferencia() (+9 more)

### Community 5 - "compilerOptions"
Cohesion: 0.09
Nodes (21): DOM, DOM.Iterable, ES2022, src, compilerOptions, allowImportingTsExtensions, isolatedModules, jsx (+13 more)

### Community 6 - "ContactoSection.tsx"
Cohesion: 0.17
Nodes (11): ContactoSection(), ContactoSectionProps, PASOS, FaqAccordion(), Navbar(), FAQ, FaqItem, GOOGLE_AGENDAR_FORM_URL (+3 more)

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

## Knowledge Gaps
- **97 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+92 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `DIMENSIONES` connect `diagnostico.ts` to `routes.ts`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _97 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `diagnostico.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12698412698412698 - nodes in this community are weakly interconnected._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0896551724137931 - nodes in this community are weakly interconnected._