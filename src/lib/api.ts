import type { DimensionId } from '../data/diagnostic';
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

  try {
    await fetch(`${API_URL}/api/diagnostics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: lead.name,
        company: lead.company,
        email: lead.email,
        priority,
        answers,
        report,
      }),
    });
  } catch (err) {
    console.error('No se pudo registrar el diagnóstico:', err);
  }
}
