import { Router } from 'express'
import { authMiddleware } from '../../middleware/auth.middleware'
import { requireProjectRole } from '../../middleware/role.middleware'
import {
  listProjectsController,
  createProjectController,
  getProjectController,
  deleteProjectController,
  addMemberController,
  removeMemberController,
} from './projects.controller'

const router = Router()
const auth = authMiddleware as any
const adminGuard = requireProjectRole('ADMIN')

router.get('/', auth, listProjectsController)
router.post('/', auth, createProjectController)
router.get('/:id', auth, getProjectController)
router.delete('/:id', auth, adminGuard, deleteProjectController)
router.post('/:id/members', auth, adminGuard, addMemberController)
router.delete('/:id/members/:userId', auth, adminGuard, removeMemberController)

export default router
