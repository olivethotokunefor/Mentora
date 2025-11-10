// refresh-token.model.js
// Stores opaque refresh tokens for rotating sessions
import mongoose from 'mongoose'

const RefreshTokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    revoked: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export const RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema)
