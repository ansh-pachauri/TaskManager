import { Router } from 'express'
import { authMiddleware } from '../../middleware/auth.middleware'
import { dashboardStatsController } from './dashboard.controller'

const router = Router()

router.get('/stats', authMiddleware as any, dashboardStatsController as any)

export default router
