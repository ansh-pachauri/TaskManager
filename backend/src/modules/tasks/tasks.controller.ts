import type { Response } from 'express'
import type { AuthenticatedRequest } from '../../middleware/auth.middleware'
import { sendSuccess, sendError } from '../../utils/response'
import { createTaskSchema, updateTaskSchema, taskFiltersSchema } from './tasks.schema'
import {
  listTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} from './tasks.service'
import { prisma } from '../../lib/prisma'

async function isProjectAdmin(userId: string, projectId: string): Promise<boolean> {
  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  })
  return member?.role === 'ADMIN'
}

export async function listTasksController(req: AuthenticatedRequest, res: Response) {
  const parsed = taskFiltersSchema.safeParse(req.query)
  if (!parsed.success) {
    sendError(res, 'Invalid filters', 400)
    return
  }
  const tasks = await listTasks(req.user!.userId, parsed.data)
  sendSuccess(res, tasks)
}

export async function createTaskController(req: AuthenticatedRequest, res: Response) {
  const parsed = createTaskSchema.safeParse(req.body)
  if (!parsed.success) {
    sendError(res, parsed.error.errors[0]?.message ?? 'Validation error', 400)
    return
  }
  const admin = await isProjectAdmin(req.user!.userId, parsed.data.projectId)
  if (!admin) {
    sendError(res, 'Admin access required', 403)
    return
  }
  try {
    const task = await createTask(req.user!.userId, parsed.data)
    sendSuccess(res, task, 201)
  } catch (e) {
    sendError(res, (e as Error).message, 400)
  }
}

export async function getTaskController(req: AuthenticatedRequest, res: Response) {
  try {
    const task = await getTask(req.params['id'] as string)
    sendSuccess(res, task)
  } catch (e) {
    sendError(res, (e as Error).message, 404)
  }
}

export async function updateTaskController(req: AuthenticatedRequest, res: Response) {
  const parsed = updateTaskSchema.safeParse(req.body)
  if (!parsed.success) {
    sendError(res, parsed.error.errors[0]?.message ?? 'Validation error', 400)
    return
  }
  try {
    const taskId = req.params['id'] as string
    const task = await getTask(taskId)
    const admin = await isProjectAdmin(req.user!.userId, task.project.id)
    const updated = await updateTask(taskId, req.user!.userId, parsed.data, admin)
    sendSuccess(res, updated)
  } catch (e) {
    sendError(res, (e as Error).message, 400)
  }
}

export async function deleteTaskController(req: AuthenticatedRequest, res: Response) {
  try {
    const taskId = req.params['id'] as string
    const task = await getTask(taskId)
    const admin = await isProjectAdmin(req.user!.userId, task.project.id)
    if (!admin) {
      sendError(res, 'Admin access required', 403)
      return
    }
    await deleteTask(taskId)
    sendSuccess(res, null)
  } catch (e) {
    sendError(res, (e as Error).message, 400)
  }
}
