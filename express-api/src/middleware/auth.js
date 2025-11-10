// auth.js
// Express middleware to validate Bearer JWT and attach req.user
import { verifyAccessToken } from '../jwt.js'

export function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || ''
    const [, token] = auth.split(' ')
    if (!token) return res.status(401).json({ message: 'Missing token' })
    const payload = verifyAccessToken(token)
    req.user = { userId: payload.sub, email: payload.email }
    next()
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
