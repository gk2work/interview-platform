import mongoose, { Document, Schema } from 'mongoose'

export interface SessionDocument extends Document {
  userId?: mongoose.Types.ObjectId
  candidateName?: string
  cvFileName: string
  cvFilePath: string
  cvParsedText: string
  cvStructuredData?: any
  interviewConfig: any
  status: string
  systemPrompt: string
  totalTurns: number
  startedAt?: Date
  completedAt?: Date
}

const sessionSchema = new Schema<SessionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' }, // optional for backwards-compat
    candidateName: { type: String },
    cvFileName: { type: String, required: true },
    cvFilePath: { type: String, required: true },
    cvParsedText: { type: String, required: true },
    cvStructuredData: { type: Schema.Types.Mixed },
    interviewConfig: { type: Schema.Types.Mixed, required: true },
    status: {
      type: String,
      enum: ['setup', 'in-progress', 'completed', 'evaluated'],
      default: 'setup',
    },
    systemPrompt: { type: String, required: true },
    totalTurns: { type: Number, default: 0 },
    startedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
)

export const Session = mongoose.models.Session || mongoose.model<SessionDocument>('Session', sessionSchema)
