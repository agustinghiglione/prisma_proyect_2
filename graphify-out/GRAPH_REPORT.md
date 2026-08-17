# Graph Report - prisma_2  (2026-08-17)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 208 nodes · 272 edges · 13 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `03abc04b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `enviarInformeCompleto()` - 7 edges
3. `scripts` - 7 edges
4. `nivelDe()` - 5 edges
5. `calcularResultado()` - 4 edges
6. `calcularResultadoCompleto()` - 4 edges
7. `lib` - 4 edges
8. `ResultadoCompleto` - 3 edges
9. `calcularResultadoParte2()` - 3 edges
10. `separarPorValor()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `enviarInformeCompleto()` --calls--> `nivelDe()`  [EXTRACTED]
  server/email.ts → src/lib/diagnostico.ts
- `DiagnosticoFlow()` --calls--> `nivelDe()`  [EXTRACTED]
  src/components/DiagnosticoFlow.tsx → src/lib/diagnostico.ts

## Import Cycles
- None detected.

## Communities (13 total, 0 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (29): concurrently, devDependencies, concurrently, tailwindcss, @tailwindcss/vite, @types/better-sqlite3, @types/cors, @types/express (+21 more)

### Community 1 - "Community 1"
Cohesion: 0.13
Nodes (25): enviarInformeCompleto(), filaBarra(), listaChips(), seccionOpcional(), transportador(), DiagnosticoFlowProps, formatoARS, Paso (+17 more)

### Community 2 - "Community 2"
Cohesion: 0.10
Nodes (17): App(), AudienciaSection(), DiagnosticIntro(), DiagnosticIntroProps, FEATURES, DiagnosticoFlow(), Footer(), CHECKS (+9 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (25): better-sqlite3, cors, dotenv, express, framer-motion, lucide-react, mercadopago, nodemailer (+17 more)

### Community 4 - "Community 4"
Cohesion: 0.13
Nodes (17): actualizarContacto(), contarDiagnosticos(), crearDiagnostico(), DATA_DIR, db, DiagnosticoRow, guardarParte2(), guardarPreferencia() (+9 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (21): DOM, DOM.Iterable, ES2022, src, compilerOptions, allowImportingTsExtensions, isolatedModules, jsx (+13 more)

### Community 6 - "Community 6"
Cohesion: 0.17
Nodes (11): ContactoSection(), ContactoSectionProps, PASOS, FaqAccordion(), Navbar(), FAQ, FaqItem, GOOGLE_AGENDAR_FORM_URL (+3 more)

### Community 7 - "Community 7"
Cohesion: 0.17
Nodes (11): name, private, scripts, build, dev, dev:all, dev:server, preview (+3 more)

### Community 8 - "Community 8"
Cohesion: 0.31
Nodes (6): PorQueSection(), FacetPatternVisual(), EQUIPO, EquipoArea, Pilar, PILARES

### Community 9 - "Community 9"
Cohesion: 0.32
Nodes (5): MetodoSection(), ShineSweep(), ShineSweepProps, METODO_STEPS, MetodoStep

### Community 10 - "Community 10"
Cohesion: 0.38
Nodes (4): ProblemsSection(), MinimalDeskVisual(), Problem, PROBLEMS

## Knowledge Gaps
- **84 isolated node(s):** `DiagnosticoFlowProps`, `Paso`, `Dimension`, `Opcion`, `RespuestaDimension` (+79 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Community 0` to `Community 7`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 3` to `Community 7`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Why does `DIMENSIONES` connect `Community 1` to `Community 4`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `DiagnosticoFlowProps`, `Paso`, `Dimension` to the rest of the system?**
  _84 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.12698412698412698 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.09971509971509972 - nodes in this community are weakly interconnected._