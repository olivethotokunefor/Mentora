// users.routes.js
// Profile endpoints for the current authenticated user
import express from 'express'
import { requireAuth } from '../middleware/auth.js'
import { Profile } from '../models/profile.model.js'

export const usersRouter = express.Router()

// GET /api/users/me - current profile
usersRouter.get('/me', requireAuth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.userId }).lean()
    if (!profile) return res.status(404).json({ message: 'Profile not found' })
    return res.json(profile)
  } catch (e) {
    return res.status(500).json({ message: 'Server error' })
  }
})

// PUT /api/users/me - update username/avatarUrl
usersRouter.put('/me', requireAuth, async (req, res) => {
  try {
    const updates = {}
    if (typeof req.body.username === 'string') updates.username = req.body.username
    if (typeof req.body.avatar_url === 'string') updates.avatar_url = req.body.avatar_url
    if (typeof req.body.bio === 'string') updates.bio = req.body.bio
    if (Array.isArray(req.body.skills_can_help)) updates.skills_can_help = req.body.skills_can_help
    if (Array.isArray(req.body.skills_need_help)) updates.skills_need_help = req.body.skills_need_help

    const updated = await Profile.findOneAndUpdate(
      { userId: req.user.userId },
      { $set: updates },
      { new: true },
    ).lean()
    if (!updated) return res.status(404).json({ message: 'Profile not found' })
    return res.json(updated)
  } catch (e) {
    if (e.code === 11000) return res.status(400).json({ message: 'Username already taken' })
    return res.status(500).json({ message: 'Server error' })
  }
})

