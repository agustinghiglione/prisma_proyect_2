import { DIMENSIONS, getScoredOptionLabel, type DimensionId } from '../data/diagnostic';
import type { DiagnosticReport } from './scoring';
import type { LeadInfo } from '../hooks/useDiagnostic';

const API_URL = import.meta.env.VITE_API_URL as string | undefined;

interface SubmitDiagnosticPayload {
  lead: LeadInfo;
  priority: string | null;
  answers: Partial<Record<DimensionId, number>>;
  report: DiagnosticReport;
}

export async function submitDiagnostic({ lead, priority, answers, report }: SubmitDiagnosticPayload) {
  if (!API_URL) return;

  const dimensionAnswers = DIMENSIONS.map((dim) => {
    const value = answers[dim.id];
    return typeof value === 'number' ? getScoredOptionLabel(dim.id, value) : '';
  });

  const prioridades = [...report.dimensionScores]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((dim) => dim.label);

  try {
    await fetch(`${API_URL}/api/diagnostics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: lead.name,
        company: lead.company,
        email: lead.email,
        answers: [...dimensionAnswers, priority ?? ''],
        resultado: `${report.overallPercent}%`,
        prioridades,
      }),
    });
  } catch (err) {
    console.error('No se pudo registrar el diagnóstico:', err);
  }
}
