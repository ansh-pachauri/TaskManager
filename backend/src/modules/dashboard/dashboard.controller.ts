import type { Response } from 'express'
import type { AuthenticatedRequest } from '../../middleware/auth.middleware'
import { sendSuccess, sendError } from '../../utils/response'
import { getDashboardStats } from './dashboard.service'

export async function dashboardStatsController(req: AuthenticatedRequest, res: Response) {
  try {
    const stats = await getDashboardStats(req.user!.userId)
    sendSuccess(res, stats)
  } catch (e) {
    sendError(res, (e as Error).message, 500)
  }
}
