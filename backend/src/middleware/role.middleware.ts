import type { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from './auth.middleware'
import { prisma } from '../lib/prisma'
import { sendError } from '../utils/response'

export function requireProjectRole(requiredRole: 'ADMIN' | 'MEMBER') {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const projectId = (req.params['id'] as string | undefined) ?? (req.body as { projectId?: string }).projectId
    if (!projectId || !req.user) {
      sendError(res, 'Forbidden', 403)
      return
    }
    const member = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: req.user.userId } },
    })
    if (!member) {
      sendError(res, 'Not a project member', 403)
      return
    }
    if (requiredRole === 'ADMIN' && member.role !== 'ADMIN') {
      sendError(res, 'Admin access required', 403)
      return
    }
    next()
  }
}
