import { useCallback, useState } from 'react';
import { QUESTIONS, TOTAL_STEPS, type DimensionId, type DiagnosticQuestion } from '../data/diagnostic';
import { computeReport, type DiagnosticReport } from '../lib/scoring';

export type DiagnosticPhase = 'question' | 'lead' | 'processing' | 'report';

export interface LeadInfo {
  name: string;
  company: string;
  email: string;
}

const INITIAL_LEAD: LeadInfo = { name: '', company: '', email: '' };

export function useDiagnostic() {
  const [phase, setPhase] = useState<DiagnosticPhase>('question');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scoredAnswers, setScoredAnswers] = useState<Partial<Record<DimensionId, number>>>({});
  const [priority, setPriority] = useState<string | null>(null);
  const [lead, setLead] = useState<LeadInfo>(INITIAL_LEAD);
  const [report, setReport] = useState<DiagnosticReport | null>(null);

  const currentQuestion: DiagnosticQuestion | undefined = QUESTIONS[questionIndex];
  const stepNumber = phase === 'lead' ? TOTAL_STEPS : questionIndex + 1;
  const progressPercent = Math.round((stepNumber / TOTAL_STEPS) * 100);


  const reset = useCallback(() => {
    setPhase('question');
    setQuestionIndex(0);
    setScoredAnswers({});
    setPriority(null);
    setLead(INITIAL_LEAD);
    setReport(null);
  }, []);

  const answerQuestion = useCallback(
    (question: DiagnosticQuestion, optionLabel: string, value?: number) => {
      if (question.kind === 'scored' && typeof value === 'number') {
        setScoredAnswers((prev) => ({ ...prev, [question.dimension]: value }));
      } else if (question.kind === 'context') {
        setPriority(optionLabel);
      }

      if (questionIndex + 1 < QUESTIONS.length) {
        setQuestionIndex((i) => i + 1);
      } else {
        setPhase('lead');
      }
    },
    [questionIndex],
  );

  const goBack = useCallback(() => {
    if (phase === 'lead') {
      setPhase('question');
      return;
    }
    setQuestionIndex((i) => Math.max(0, i - 1));
  }, [phase]);

  const submitLead = useCallback(
    (info: LeadInfo) => {
      setLead(info);
      setPhase('processing');
      window.setTimeout(() => {
        setReport(computeReport(scoredAnswers as Record<DimensionId, number>));
        setPhase('report');
      }, 2400);
    },
    [scoredAnswers],
  );

  return {
    phase,
    currentQuestion,
    questionIndex,
    stepNumber,
    progressPercent,
    priority,
    lead,
    report,
    answerQuestion,
    goBack,
    submitLead,
    reset,
  };
}
