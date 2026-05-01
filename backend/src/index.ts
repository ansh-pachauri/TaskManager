import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { env } from './config/env'
import { errorMiddleware } from './middleware/error.middleware'
import authRoutes from './modules/auth/auth.routes'
import projectsRoutes from './modules/projects/projects.routes'
import tasksRoutes from './modules/tasks/tasks.routes'
import dashboardRoutes from './modules/dashboard/dashboard.routes'

const app = express()

app.use(cors({ origin: env.FRONTEND_URL, credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectsRoutes)
app.use('/api/tasks', tasksRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.use(errorMiddleware)

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`)
})
