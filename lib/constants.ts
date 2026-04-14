export const INTERVIEW_TYPES = [
  'Technical',
  'Behavioral',
  'HR Screening',
  'System Design',
  'Mixed',
] as const

export const DIFFICULTY_LEVELS = ['Junior', 'Mid-Level', 'Senior', 'Lead/Principal'] as const

export const INTERVIEW_STATUSES = ['setup', 'in-progress', 'completed', 'evaluated'] as const

export const RECOMMENDATIONS = [
  'Strong Hire',
  'Hire',
  'Lean Hire',
  'Lean No Hire',
  'No Hire',
] as const

export const SCORE_CATEGORIES = [
  'technicalKnowledge',
  'communication',
  'problemSolving',
  'culturalFit',
  'relevantExperience',
  'confidence',
] as const

export const GRADE_SCALE: Record<number, string> = {
  10: 'A+',
  9: 'A',
  8: 'A-',
  7: 'B+',
  6: 'B',
  5: 'B-',
  4: 'C+',
  3: 'C',
  2: 'C-',
  1: 'D',
  0: 'F',
}

export function getGradeFromScore(score: number): string {
  const rounded = Math.round(score)
  return GRADE_SCALE[Math.min(10, Math.max(0, rounded))]
}

export function getRecommendationColor(recommendation: string): string {
  switch (recommendation) {
    case 'Strong Hire':
      return 'bg-emerald-900 text-emerald-100'
    case 'Hire':
      return 'bg-emerald-800 text-emerald-100'
    case 'Lean Hire':
      return 'bg-amber-800 text-amber-100'
    case 'Lean No Hire':
      return 'bg-rose-800 text-rose-100'
    case 'No Hire':
      return 'bg-rose-900 text-rose-100'
    default:
      return 'bg-slate-700 text-slate-100'
  }
}
