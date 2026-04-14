import mongoose, { Document, Schema } from 'mongoose'

export interface UserDocument extends Document {
  email: string
  name: string
  image?: string
  googleId: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<UserDocument>(
  {
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    name:     { type: String, required: true },
    image:    { type: String },
    googleId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
)

export const User =
  mongoose.models.User || mongoose.model<UserDocument>('User', userSchema)
