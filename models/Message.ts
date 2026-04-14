import mongoose, { Document, Schema } from 'mongoose'

export interface MessageDocument extends Document {
  sessionId: mongoose.Types.ObjectId
  role: 'system' | 'interviewer' | 'candidate'
  content: string
  audioUrl?: string
  turnNumber: number
}

const messageSchema = new Schema<MessageDocument>(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
    role: {
      type: String,
      enum: ['system', 'interviewer', 'candidate'],
      required: true,
    },
    content: { type: String, required: true },
    audioUrl: { type: String },
    turnNumber: { type: Number, required: true },
  },
  { timestamps: true }
)

export const Message = mongoose.models.Message || mongoose.model<MessageDocument>('Message', messageSchema)
