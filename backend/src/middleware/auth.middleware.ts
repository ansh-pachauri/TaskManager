import type { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'
import { sendError } from '../utils/response'

export interface AuthenticatedRequest extends Request {
  user?: { userId: string; email: string }
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = (req.cookies as Record<string, string | undefined>)['auth_token']
  if (!token) {
    sendError(res, 'Unauthorized', 401)
    return
  }
  try {
    req.user = verifyToken(token)
    next()
  } catch {
    sendError(res, 'Invalid or expired token', 401)
  }
}
