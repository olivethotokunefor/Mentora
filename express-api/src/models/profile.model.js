// profile.model.js
// Mongoose schema for user profiles (public info for UI)
import mongoose from 'mongoose'

const ProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    email: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    avatar_url: { type: String, default: '' },
    points: { type: Number, default: 10 },
    bio: { type: String, default: '' },
    skills_can_help: { type: [String], default: [] },
    skills_need_help: { type: [String], default: [] },
  },
  { timestamps: true },
)

export const Profile = mongoose.model('Profile', ProfileSchema)
