export type DimensionId = 'organizacion' | 'decisiones' | 'cumplimiento' | 'crecimiento' | 'digital';

export interface Dimension {
  id: DimensionId;
  label: string;
  solutionLabel: string;
}

export const DIMENSIONS: Dimension[] = [
  { id: 'organizacion', label: 'Organización', solutionLabel: 'Quiero ordenar mi negocio' },
  { id: 'decisiones', label: 'Información y decisiones', solutionLabel: 'Quiero tomar mejores decisiones' },
  { id: 'cumplimiento', label: 'Cumplimiento', solutionLabel: 'Quiero cumplir con tranquilidad' },
  { id: 'crecimiento', label: 'Crecimiento', solutionLabel: 'Quiero hacer crecer mi negocio' },
  { id: 'digital', label: 'Presencia digital', solutionLabel: 'Quiero potenciar mi presencia digital' },
];

export interface ScoredOption {
  label: string;
  value: 1 | 2 | 3 | 4;
}

export interface ScoredQuestion {
  kind: 'scored';
  id: string;
  dimension: DimensionId;
  prompt: string;
  options: ScoredOption[];
}

export interface OpenOption {
  label: string;
}

export interface ContextQuestion {
  kind: 'context';
  id: string;
  prompt: string;
  options: OpenOption[];
}

export type DiagnosticQuestion = ScoredQuestion | ContextQuestion;

export const QUESTIONS: DiagnosticQuestion[] = [
  {
    kind: 'scored',
    id: 'q-organizacion',
    dimension: 'organizacion',
    prompt: '¿Cómo describirías la organización interna de tu negocio hoy?',
    options: [
      { label: 'Cada cosa se resuelve como surge, sin procesos definidos', value: 1 },
      { label: 'Hay algo de orden, pero depende de mí estar encima de todo', value: 2 },
      { label: 'Existen procesos, aunque no siempre se cumplen', value: 3 },
      { label: 'Los procesos están definidos y el equipo los sigue', value: 4 },
    ],
  },
  {
    kind: 'scored',
    id: 'q-decisiones',
    dimension: 'decisiones',
    prompt: '¿Con qué información contás a la hora de tomar decisiones importantes?',
    options: [
      { label: 'Principalmente con intuición y experiencia', value: 1 },
      { label: 'Con datos sueltos, pero difíciles de cruzar', value: 2 },
      { label: 'Con reportes básicos que reviso de vez en cuando', value: 3 },
      { label: 'Con información clara y actualizada, lista para decidir', value: 4 },
    ],
  },
  {
    kind: 'scored',
    id: 'q-cumplimiento',
    dimension: 'cumplimiento',
    prompt: '¿Cómo te sentís hoy respecto a tus obligaciones contables e impositivas?',
    options: [
      { label: 'Con incertidumbre, nunca sé si está todo en orden', value: 1 },
      { label: 'Voy resolviendo, pero siempre corriendo de atrás', value: 2 },
      { label: 'Está bastante controlado, con algunas dudas puntuales', value: 3 },
      { label: 'Tranquilo, siento que está todo bajo control', value: 4 },
    ],
  },
  {
    kind: 'scored',
    id: 'q-crecimiento',
    dimension: 'crecimiento',
    prompt: '¿Tu negocio tiene hoy una estrategia clara para crecer?',
    options: [
      { label: 'No, vamos resolviendo el día a día', value: 1 },
      { label: 'Tenemos ideas, pero no un plan concreto', value: 2 },
      { label: 'Hay objetivos, aunque no siempre los seguimos de cerca', value: 3 },
      { label: 'Sí, con objetivos claros y seguimiento constante', value: 4 },
    ],
  },
  {
    kind: 'scored',
    id: 'q-digital',
    dimension: 'digital',
    prompt: '¿Qué lugar ocupa la tecnología y lo digital en tu negocio hoy?',
    options: [
      { label: 'Prácticamente ninguno', value: 1 },
      { label: 'Usamos algunas herramientas, sin mucha integración', value: 2 },
      { label: 'Tenemos presencia digital, pero podríamos aprovecharla mejor', value: 3 },
      { label: 'Es una parte activa de cómo gestionamos y vendemos', value: 4 },
    ],
  },
  {
    kind: 'context',
    id: 'q-prioridad',
    prompt: 'Si pudieras resolver una sola cosa primero, ¿cuál sería?',
    options: [
      { label: 'Ordenar la gestión interna' },
      { label: 'Entender mejor los números del negocio' },
      { label: 'Tener más tranquilidad con lo impositivo' },
      { label: 'Definir un rumbo claro de crecimiento' },
      { label: 'Mejorar mi presencia digital' },
    ],
  },
];

export const TOTAL_STEPS = QUESTIONS.length + 1; // + lead capture step

export function getScoredOptionLabel(dimension: DimensionId, value: number): string {
  const question = QUESTIONS.find((q): q is ScoredQuestion => q.kind === 'scored' && q.dimension === dimension);
  const option = question?.options.find((o) => o.value === value);
  return option?.label ?? '';
}

interface RecommendationTier {
  low: string;
  mid: string;
  high: string;
}

export const RECOMMENDATIONS: Record<DimensionId, RecommendationTier> = {
  organizacion: {
    low: 'Ordenar procesos básicos de gestión te va a devolver horas cada semana.',
    mid: 'Formalizar los procesos que ya funcionan evitará que dependan de una sola persona.',
    high: 'Tu organización es una fortaleza: es una buena base para escalar sin perder el control.',
  },
  decisiones: {
    low: 'Centralizar la información del negocio es el primer paso para decidir con más seguridad.',
    mid: 'Con reportes más claros y frecuentes vas a anticipar decisiones en lugar de reaccionar.',
    high: 'Tomás decisiones con buena información: el próximo paso es afinar los indicadores clave.',
  },
  cumplimiento: {
    low: 'Poner en orden lo impositivo y contable te va a dar tranquilidad inmediata.',
    mid: 'Con un seguimiento más cercano podés anticiparte en vez de resolver sobre la hora.',
    high: 'Tu cumplimiento está bien encaminado: es momento de que trabaje a tu favor, no solo en regla.',
  },
  crecimiento: {
    low: 'Definir objetivos concretos de crecimiento le da dirección a las decisiones del día a día.',
    mid: 'Tenés dirección; falta un seguimiento más cercano para sostener el ritmo.',
    high: 'Tenés una estrategia de crecimiento sólida: el foco ahora es acelerarla con más recursos.',
  },
  digital: {
    low: 'Dar los primeros pasos en lo digital puede abrir una fuente de crecimiento importante.',
    mid: 'Integrar mejor las herramientas que ya usás puede multiplicar su impacto.',
    high: 'Lo digital ya es parte de tu negocio: el próximo paso es que trabaje de forma más inteligente.',
  },
};
