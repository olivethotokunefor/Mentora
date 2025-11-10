// server.js
// Minimal Express server wiring security, CORS, cookies, JSON, routes, and DB.
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import { config } from './config.js'
import { connectDb } from './db.js'
import { authRouter } from './routes/auth.routes.js'
import { usersRouter } from './routes/users.routes.js'

async function bootstrap() {
  await connectDb()

  const app = express()

  // Security headers
  app.use(helmet())

  // CORS for frontend
  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin) return cb(null, true)
        if (config.corsOrigins.includes(origin)) return cb(null, true)
        return cb(null, false)
      },
      credentials: true,
    }),
  )

  // Body parsing and cookies
  app.use(express.json({ limit: '1mb' }))
  app.use(cookieParser())

  // Basic rate limiting for auth endpoints
  const authLimiter = rateLimit({ windowMs: 60 * 1000, max: 60 })
  app.use('/api/auth', authLimiter)

  // Routes
  app.use('/api/auth', authRouter)
  app.use('/api/users', usersRouter)

  // Healthcheck
  app.get('/api/health', (_req, res) => res.json({ ok: true }))

  app.listen(config.port, () => {
    console.log(`API listening on http://localhost:${config.port}`)
  })
}

bootstrap().catch((err) => {
  console.error('Fatal error starting server:', err)
  process.exit(1)
})
