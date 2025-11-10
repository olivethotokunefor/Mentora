// config.js
// Centralized configuration using environment variables
import dotenv from 'dotenv'
dotenv.config()

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/micromentors',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'dev_access_secret',
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL || '15m',
  refreshTokenTtlDays: parseInt(process.env.REFRESH_TOKEN_TTL_DAYS || '7', 10),
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173').split(','),
  cookieName: process.env.REFRESH_COOKIE_NAME || 'refresh_token',
}
