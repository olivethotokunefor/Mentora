// auth.routes.js
// Implements Auth endpoints: register, login, refresh, logout, me
import express from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { config } from '../config.js'
import { signAccessToken } from '../jwt.js'
import { User } from '../models/user.model.js'
import { Profile } from '../models/profile.model.js'
import { RefreshToken } from '../models/refresh-token.model.js'
import { requireAuth } from '../middleware/auth.js'

export const authRouter = express.Router()

// Helper to issue a refresh token document and return the raw token
async function issueRefreshToken(userId) {
  const token = crypto.randomBytes(48).toString('hex')
  const expiresAt = new Date(Date.now() + config.refreshTokenTtlDays * 24 * 60 * 60 * 1000)
  await RefreshToken.create({ userId, token, expiresAt, revoked: false })
  return token
}

// POST /api/auth/register
authRouter.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body || {}
    if (!email || !password || !username) return res.status(400).json({ message: 'Missing fields' })

    const exists = await User.findOne({ email }).lean()
    if (exists) return res.status(400).json({ message: 'Email already in use' })

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ email, passwordHash, role: 'user' })

    await Profile.create({
      userId: user._id,
      email: user.email,
      username,
      avatar_url: '',
      points: 10,
      bio: '',
      skills_can_help: [],
      skills_need_help: [],
    })

    return res.status(201).json({ user: { id: user._id.toString(), email: user.email } })
  } catch (e) {
    return res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/auth/login
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) return res.status(400).json({ message: 'Missing credentials' })

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

    const accessToken = signAccessToken({ sub: user._id.toString(), email: user.email })
    const refreshToken = await issueRefreshToken(user._id)

    res.cookie(config.cookieName, refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/api/auth',
      maxAge: config.refreshTokenTtlDays * 24 * 60 * 60 * 1000,
    })
    return res.json({ accessToken })
  } catch (e) {
    return res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/auth/refresh
authRouter.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies?.[config.cookieName]
    if (!token) return res.status(401).json({ message: 'Missing refresh token' })

    const doc = await RefreshToken.findOne({ token })
    if (!doc) return res.status(401).json({ message: 'Invalid refresh token' })
    if (doc.revoked || doc.expiresAt.getTime() < Date.now()) {
      return res.status(401).json({ message: 'Expired refresh token' })
    }

    const user = await User.findById(doc.userId)
    if (!user) return res.status(401).json({ message: 'User not found' })

    // rotate
    doc.revoked = true
    await doc.save()

    const newRefresh = await issueRefreshToken(user._id)
    const accessToken = signAccessToken({ sub: user._id.toString(), email: user.email })

    res.cookie(config.cookieName, newRefresh, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/api/auth',
      maxAge: config.refreshTokenTtlDays * 24 * 60 * 60 * 1000,
    })
    return res.json({ accessToken })
  } catch (e) {
    return res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/auth/logout
authRouter.post('/logout', async (req, res) => {
  try {
    const token = req.cookies?.[config.cookieName]
    if (token) await RefreshToken.updateOne({ token }, { $set: { revoked: true } })
    res.clearCookie(config.cookieName, { path: '/api/auth' })
    return res.json({ success: true })
  } catch (e) {
    return res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/auth/me
authRouter.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).lean()
    const profile = await Profile.findOne({ userId: user._id }).lean()
    if (!user || !profile) return res.status(404).json({ message: 'Not found' })
    return res.json({ user: { id: user._id.toString(), email: user.email }, profile })
  } catch (e) {
    return res.status(500).json({ message: 'Server error' })
  }
})
