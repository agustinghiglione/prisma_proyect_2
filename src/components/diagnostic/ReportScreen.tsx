import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, Target } from 'lucide-react';
import type { DiagnosticReport } from '../../lib/scoring';
import type { LeadInfo } from '../../hooks/useDiagnostic';
import { GOOGLE_FORM_URL } from '../../data/nav';

interface ReportScreenProps {
  report: DiagnosticReport;
  lead: LeadInfo;
  onClose: () => void;
}

const today = new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });

export default function ReportScreen({ report, lead, onClose }: ReportScreenProps) {
  const handleSchedule = () => {
    window.open(GOOGLE_FORM_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-3xl pb-6"
    >
      <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-xl shadow-primary/5">
        <div className="bg-primary px-8 py-9 text-white sm:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Informe Ejecutivo Prisma®
          </p>
          <h2 className="mt-3 font-heading text-2xl font-bold sm:text-3xl">
            {lead.company || 'Tu empresa'}
          </h2>
          <p className="mt-1 text-sm text-white/70">
            Preparado para {lead.name || 'vos'} · {today}
          </p>
        </div>

        <div className="px-8 py-9 sm:px-12">
          <section>
            <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-primary">
              <Sparkles size={18} /> Resumen
            </h3>
            <p className="mt-3 leading-relaxed text-ink-soft">
              Con un nivel general de claridad del <strong className="text-ink">{report.overallPercent}%</strong>,{' '}
              {lead.company || 'tu empresa'} ya tiene bases sobre las cuales construir. Encontramos
              dimensiones sólidas y otras con espacio claro de mejora: esa combinación es exactamente
              el punto de partida del Método Prisma®.
            </p>
          </section>

          <section className="mt-9">
            <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-primary">
              <Target size={18} /> Mapa de prioridades
            </h3>
            <div className="mt-4 flex flex-col gap-4">
              {report.dimensionScores.map((dim, i) => (
                <div key={dim.id}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-ink">{dim.label}</span>
                    <span className="text-ink-soft">{dim.percent}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dim.percent}%` }}
                      transition={{ duration: 0.8, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full bg-secondary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-9 grid gap-8 sm:grid-cols-2">
            <section>
              <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-primary">
                <TrendingUp size={18} /> Fortalezas
              </h3>
              <ul className="mt-3 flex flex-col gap-2">
                {report.strengths.map((dim) => (
                  <li key={dim.id} className="rounded-xl bg-surface px-4 py-3 text-sm text-ink">
                    {dim.label}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-primary">
                Oportunidades
              </h3>
              <ul className="mt-3 flex flex-col gap-2">
                {report.opportunities.map((dim) => (
                  <li key={dim.id} className="rounded-xl bg-surface px-4 py-3 text-sm text-ink">
                    {dim.label}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="mt-9">
            <h3 className="font-heading text-lg font-bold text-primary">Primeras recomendaciones</h3>
            <ul className="mt-3 flex flex-col gap-3">
              {report.recommendations.map((rec) => (
                <li key={rec.dimension.id} className="flex gap-3 text-ink-soft">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                  <span>{rec.text}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-9 rounded-2xl bg-surface p-6">
            <h3 className="font-heading text-lg font-bold text-primary">Cómo puede ayudarte Prisma</h3>
            <p className="mt-2 text-ink-soft">
              Este informe es una primera mirada. En una conversación breve podemos profundizar en
              tus prioridades y, si detectamos una oportunidad concreta, elaborar una propuesta
              hecha a medida de {lead.company || 'tu empresa'}.
            </p>
          </section>

          <div className="mt-9 flex flex-col items-center gap-4 text-center">
            <button
              onClick={handleSchedule}
              className="flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5"
            >
              Agendar una primera conversación <ArrowRight size={16} />
            </button>
            <button onClick={onClose} className="text-sm text-ink-soft underline-offset-4 hover:underline">
              Volver al sitio
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
