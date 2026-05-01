import { Router } from 'express'
import {
  signupController,
  loginController,
  logoutController,
  meController,
} from './auth.controller'
import { authMiddleware } from '../../middleware/auth.middleware'

const router = Router()

router.post('/signup', signupController)
router.post('/login', loginController)
router.post('/logout', logoutController)
router.get('/me', authMiddleware as any, meController as any)

export default router
