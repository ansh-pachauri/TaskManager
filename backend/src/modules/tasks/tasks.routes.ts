import { Router } from 'express'
import { authMiddleware } from '../../middleware/auth.middleware'
import {
  listTasksController,
  createTaskController,
  getTaskController,
  updateTaskController,
  deleteTaskController,
} from './tasks.controller'

const router = Router()
const auth = authMiddleware as any

router.get('/', auth, listTasksController)
router.post('/', auth, createTaskController)
router.get('/:id', auth, getTaskController)
router.patch('/:id', auth, updateTaskController)
router.delete('/:id', auth, deleteTaskController)

export default router
