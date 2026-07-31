import { DIMENSIONS, RECOMMENDATIONS, type DimensionId } from '../data/diagnostic';

export interface DimensionScore {
  id: DimensionId;
  label: string;
  solutionLabel: string;
  score: number; // 1-4
  percent: number; // 0-100
}

export interface DiagnosticReport {
  dimensionScores: DimensionScore[];
  overallPercent: number;
  strengths: DimensionScore[];
  opportunities: DimensionScore[];
  recommendations: { dimension: DimensionScore; text: string }[];
}

function tierFor(score: number): 'low' | 'mid' | 'high' {
  if (score <= 2) return 'low';
  if (score === 3) return 'mid';
  return 'high';
}

export function computeReport(scoredAnswers: Record<DimensionId, number>): DiagnosticReport {
  const dimensionScores: DimensionScore[] = DIMENSIONS.map((dim) => {
    const score = scoredAnswers[dim.id] ?? 2;
    return {
      id: dim.id,
      label: dim.label,
      solutionLabel: dim.solutionLabel,
      score,
      percent: Math.round((score / 4) * 100),
    };
  });

  const sorted = [...dimensionScores].sort((a, b) => b.score - a.score);
  const overallPercent = Math.round(
    dimensionScores.reduce((sum, d) => sum + d.percent, 0) / dimensionScores.length,
  );

  const strengths = sorted.slice(0, 2);
  const opportunities = [...sorted].reverse().slice(0, 2);

  const recommendations = opportunities.map((dim) => ({
    dimension: dim,
    text: RECOMMENDATIONS[dim.id][tierFor(dim.score)],
  }));

  return { dimensionScores, overallPercent, strengths, opportunities, recommendations };
}
