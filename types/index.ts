export interface CVStructuredData {
  name?: string
  email?: string
  phone?: string
  skills?: string[]
  experience?: {
    title: string
    company: string
    duration: string
    description: string
  }[]
  education?: {
    degree: string
    institution: string
    year: string
  }[]
}

export interface InterviewConfig {
  company: string
  designation: string
  interviewType: 'Technical' | 'Behavioral' | 'HR Screening' | 'System Design' | 'Mixed'
  difficulty: 'Junior' | 'Mid-Level' | 'Senior' | 'Lead/Principal'
  jobDescription?: string
  additionalContext?: string
}

export interface ISession {
  _id?: string
  candidateName?: string
  cvFileName: string
  cvFilePath: string
  cvParsedText: string
  cvStructuredData?: CVStructuredData
  interviewConfig: InterviewConfig
  status: 'setup' | 'in-progress' | 'completed' | 'evaluated'
  systemPrompt: string
  totalTurns: number
  startedAt?: Date
  completedAt?: Date
  createdAt?: Date
  updatedAt?: Date
}

export interface IMessage {
  _id?: string
  sessionId: string
  role: 'system' | 'interviewer' | 'candidate'
  content: string
  audioUrl?: string
  turnNumber: number
  timestamp?: Date
}

export interface IEvaluation {
  _id?: string
  sessionId: string
  scores: {
    technicalKnowledge: { score: number; maxScore: number; feedback: string }
    communication: { score: number; maxScore: number; feedback: string }
    problemSolving: { score: number; maxScore: number; feedback: string }
    culturalFit: { score: number; maxScore: number; feedback: string }
    relevantExperience: { score: number; maxScore: number; feedback: string }
    confidence: { score: number; maxScore: number; feedback: string }
  }
  overallScore: number
  overallGrade: string
  recommendation: 'Strong Hire' | 'Hire' | 'Lean Hire' | 'Lean No Hire' | 'No Hire'
  strengths: string[]
  improvements: string[]
  detailedFeedback: string
  suggestedTopics: string[]
  createdAt?: Date
}
