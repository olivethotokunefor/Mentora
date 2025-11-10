// user.model.js
// Mongoose schema for application users (credentials and role)
import mongoose from 'mongoose' // ODM for MongoDB

const UserSchema = new mongoose.Schema( // Define a schema
  {
    email: { type: String, required: true, unique: true }, // unique login email
    passwordHash: { type: String, required: true }, // bcrypt hash
    role: { type: String, default: 'user' }, // authorization role
  },
  { timestamps: true }, // adds createdAt/updatedAt
)

export const User = mongoose.model('User', UserSchema) // Export model
