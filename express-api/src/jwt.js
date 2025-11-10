// jwt.js
// Helpers to sign and verify JWT access tokens
import jwt from 'jsonwebtoken'
import { config } from './config.js'

export function signAccessToken(payload) {
  return jwt.sign(payload, config.jwtAccessSecret, { expiresIn: config.accessTokenTtl })
}

export function verifyAccessToken(token) {
  return jwt.verify(token, config.jwtAccessSecret)
}
