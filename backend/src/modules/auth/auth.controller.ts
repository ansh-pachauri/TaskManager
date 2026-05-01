import type { Request, Response } from 'express'
import { signupSchema, loginSchema } from './auth.schema'
import { signup, login, getMe } from './auth.service'
import { sendSuccess, sendError } from '../../utils/response'
import type { AuthenticatedRequest } from '../../middleware/auth.middleware'

const isProd = process.env['NODE_ENV'] === 'production'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

export async function signupController(req: Request, res: Response) {
  const parsed = signupSchema.safeParse(req.body)
  if (!parsed.success) {
    sendError(res, parsed.error.errors[0]?.message ?? 'Validation error', 400)
    return
  }
  try {
    const { user, token } = await signup(parsed.data)
    res.cookie('auth_token', token, COOKIE_OPTIONS)
    sendSuccess(res, user, 201)
  } catch (e) {
    sendError(res, (e as Error).message, 400)
  }
}

export async function loginController(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    sendError(res, parsed.error.errors[0]?.message ?? 'Validation error', 400)
    return
  }
  try {
    const { user, token } = await login(parsed.data)
    res.cookie('auth_token', token, COOKIE_OPTIONS)
    sendSuccess(res, user)
  } catch (e) {
    sendError(res, (e as Error).message, 401)
  }
}

export async function logoutController(_req: Request, res: Response) {
  res.clearCookie('auth_token')
  sendSuccess(res, null)
}

export async function meController(req: AuthenticatedRequest, res: Response) {
  try {
    const user = await getMe(req.user!.userId)
    sendSuccess(res, user)
  } catch (e) {
    sendError(res, (e as Error).message, 404)
  }
}
