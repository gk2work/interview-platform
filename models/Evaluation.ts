import mongoose, { Document, Schema } from 'mongoose'

export interface EvaluationDocument extends Document {
  sessionId: mongoose.Types.ObjectId
  scores: any
  overallScore: number
  overallGrade: string
  recommendation: string
  strengths: string[]
  improvements: string[]
  detailedFeedback: string
  suggestedTopics: string[]
}

const scoreSchema = new Schema({
  score: Number,
  maxScore: Number,
  feedback: String,
})

const evaluationSchema = new Schema<EvaluationDocument>(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true, unique: true },
    scores: {
      technicalKnowledge: scoreSchema,
      communication: scoreSchema,
      problemSolving: scoreSchema,
      culturalFit: scoreSchema,
      relevantExperience: scoreSchema,
      confidence: scoreSchema,
    },
    overallScore: { type: Number, required: true },
    overallGrade: { type: String, required: true },
    recommendation: {
      type: String,
      enum: ['Strong Hire', 'Hire', 'Lean Hire', 'Lean No Hire', 'No Hire'],
      required: true,
    },
    strengths: [String],
    improvements: [String],
    detailedFeedback: { type: String, required: true },
    suggestedTopics: [String],
  },
  { timestamps: true }
)

export const Evaluation = mongoose.models.Evaluation || mongoose.model<EvaluationDocument>('Evaluation', evaluationSchema)
