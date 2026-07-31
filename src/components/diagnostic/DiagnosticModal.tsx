import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useDiagnostic } from '../../hooks/useDiagnostic';
import { TOTAL_STEPS } from '../../data/diagnostic';
import QuestionScreen from './QuestionScreen';
import LeadFormScreen from './LeadFormScreen';
import ProcessingScreen from './ProcessingScreen';
import ReportScreen from './ReportScreen';

interface DiagnosticModalProps {
  open: boolean;
  onClose: () => void;
}

export default function DiagnosticModal({ open, onClose }: DiagnosticModalProps) {
  const diag = useDiagnostic();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleClose = () => {
    onClose();
    window.setTimeout(() => diag.reset(), 400);
  };

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[70] flex flex-col bg-background"
    >
      <div className="flex items-center gap-4 border-b border-border px-6 py-5 lg:px-10">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface">
          {(diag.phase === 'question' || diag.phase === 'lead') && (
            <motion.div
              className="h-full rounded-full bg-secondary"
              animate={{ width: `${diag.progressPercent}%` }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          )}
          {diag.phase === 'processing' && <div className="h-full w-full bg-secondary" />}
          {diag.phase === 'report' && <div className="h-full w-full bg-secondary" />}
        </div>
        {(diag.phase === 'question' || diag.phase === 'lead') && (
          <span className="whitespace-nowrap text-xs font-medium text-ink-soft">
            Paso {diag.stepNumber} de {TOTAL_STEPS}
          </span>
        )}
        <button
          onClick={handleClose}
          aria-label="Cerrar diagnóstico"
          className="ml-1 rounded-full p-2 text-ink-soft transition-colors hover:bg-surface hover:text-ink"
        >
          <X size={20} />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-y-auto px-6 py-10 lg:px-10">
        {diag.phase === 'question' && diag.currentQuestion && (
          <QuestionScreen
            key={diag.currentQuestion.id}
            question={diag.currentQuestion}
            onAnswer={diag.answerQuestion}
            onBack={diag.questionIndex > 0 ? diag.goBack : undefined}
          />
        )}
        {diag.phase === 'lead' && (
          <LeadFormScreen key="lead" onSubmit={diag.submitLead} onBack={diag.goBack} />
        )}
        {diag.phase === 'processing' && <ProcessingScreen key="processing" />}
        {diag.phase === 'report' && diag.report && (
          <ReportScreen key="report" report={diag.report} lead={diag.lead} onClose={handleClose} />
        )}
      </div>
    </motion.div>
  );
}
