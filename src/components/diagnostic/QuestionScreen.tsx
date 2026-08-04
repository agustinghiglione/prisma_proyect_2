import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import type { DiagnosticQuestion } from '../../data/diagnostic';

interface QuestionScreenProps {
  question: DiagnosticQuestion;
  onAnswer: (question: DiagnosticQuestion, optionLabel: string, value?: number) => void;
  onBack?: () => void;
}

export default function QuestionScreen({ question, onAnswer, onBack }: QuestionScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-2xl"
    >
      {onBack && (
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-1 text-sm font-medium text-ink-soft transition-colors hover:text-primary"
        >
          <ChevronLeft size={16} /> Volver
        </button>
      )}

      <h2 className="font-heading text-2xl font-bold text-ink sm:text-3xl">{question.prompt}</h2>

      <div className="mt-9 flex flex-col gap-3.5">
        {question.options.map((option, i) => (
          <motion.button
            key={option.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            onClick={() =>
              onAnswer(question, option.label, 'value' in option ? option.value : undefined)
            }
            className="group flex items-center justify-between rounded-2xl border border-border bg-background px-6 py-4 text-left transition-all hover:border-primary hover:bg-primary/5"
          >
            <span className="text-ink">{option.label}</span>
            <span className="ml-4 h-5 w-5 shrink-0 rounded-full border-2 border-border transition-colors group-hover:border-primary" />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
