// db.js
// Initialize and export a connected Mongoose instance
import mongoose from 'mongoose'
import { config } from './config.js'

export async function connectDb() {
  mongoose.set('strictQuery', true)
  await mongoose.connect(config.mongoUri, {
    serverSelectionTimeoutMS: 10000,
  })
  return mongoose
}
