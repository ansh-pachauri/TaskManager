import type { Response } from 'express'
import type { AuthenticatedRequest } from '../../middleware/auth.middleware'
import { sendSuccess, sendError } from '../../utils/response'
import { createProjectSchema, addMemberSchema } from './projects.schema'
import {
  listProjects,
  createProject,
  getProject,
  deleteProject,
  addMember,
  removeMember,
} from './projects.service'

export async function listProjectsController(req: AuthenticatedRequest, res: Response) {
  const projects = await listProjects(req.user!.userId)
  sendSuccess(res, projects)
}

export async function createProjectController(req: AuthenticatedRequest, res: Response) {
  const parsed = createProjectSchema.safeParse(req.body)
  if (!parsed.success) {
    sendError(res, parsed.error.errors[0]?.message ?? 'Validation error', 400)
    return
  }
  try {
    const project = await createProject(req.user!.userId, parsed.data)
    sendSuccess(res, project, 201)
  } catch (e) {
    sendError(res, (e as Error).message, 400)
  }
}

export async function getProjectController(req: AuthenticatedRequest, res: Response) {
  try {
    const project = await getProject(req.params['id'] as string, req.user!.userId)
    sendSuccess(res, project)
  } catch (e) {
    sendError(res, (e as Error).message, 404)
  }
}

export async function deleteProjectController(req: AuthenticatedRequest, res: Response) {
  try {
    await deleteProject(req.params['id'] as string)
    sendSuccess(res, null)
  } catch (e) {
    sendError(res, (e as Error).message, 400)
  }
}

export async function addMemberController(req: AuthenticatedRequest, res: Response) {
  const parsed = addMemberSchema.safeParse(req.body)
  if (!parsed.success) {
    sendError(res, parsed.error.errors[0]?.message ?? 'Validation error', 400)
    return
  }
  try {
    const member = await addMember(req.params['id'] as string, parsed.data)
    sendSuccess(res, member, 201)
  } catch (e) {
    sendError(res, (e as Error).message, 400)
  }
}

export async function removeMemberController(req: AuthenticatedRequest, res: Response) {
  try {
    await removeMember(req.params['id'] as string, req.params['userId'] as string)
    sendSuccess(res, null)
  } catch (e) {
    sendError(res, (e as Error).message, 400)
  }
}
