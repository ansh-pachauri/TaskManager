import { prisma } from '../../lib/prisma'
import type { CreateTaskInput, UpdateTaskInput, TaskFilters } from './tasks.schema'

const taskSelect = {
  id: true,
  title: true,
  description: true,
  dueDate: true,
  priority: true,
  status: true,
  projectId: true,
  createdAt: true,
  updatedAt: true,
  assignedTo: { select: { id: true, name: true, email: true } },
  createdBy: { select: { id: true, name: true, email: true } },
  project: { select: { id: true, name: true } },
}

export async function listTasks(userId: string, filters: TaskFilters) {
  const memberProjects = await prisma.projectMember.findMany({
    where: { userId },
    select: { projectId: true },
  })
  const projectIds = memberProjects.map((m) => m.projectId)

  return prisma.task.findMany({
    where: {
      projectId: filters.projectId ? filters.projectId : { in: projectIds },
      ...(filters.status && { status: filters.status }),
      ...(filters.priority && { priority: filters.priority }),
      ...(filters.assignedToMe === 'true' && { assignedToId: userId }),
    },
    select: taskSelect,
    orderBy: { createdAt: 'desc' },
  })
}

export async function createTask(userId: string, input: CreateTaskInput) {
  return prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      priority: input.priority,
      projectId: input.projectId,
      assignedToId: input.assignedToId,
      createdById: userId,
    },
    select: taskSelect,
  })
}

export async function getTask(taskId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: taskSelect,
  })
  if (!task) throw new Error('Task not found')
  return task
}

export async function updateTask(
  taskId: string,
  userId: string,
  input: UpdateTaskInput,
  isAdmin: boolean
) {
  const task = await prisma.task.findUnique({ where: { id: taskId } })
  if (!task) throw new Error('Task not found')

  if (!isAdmin) {
    if (task.assignedToId !== userId) throw new Error('Forbidden')
    const keys = Object.keys(input)
    if (keys.some((k) => k !== 'status')) {
      throw new Error('Members can only update status')
    }
  }

  return prisma.task.update({
    where: { id: taskId },
    data: {
      ...input,
      dueDate:
        input.dueDate !== undefined
          ? input.dueDate === null
            ? null
            : new Date(input.dueDate)
          : undefined,
    },
    select: taskSelect,
  })
}

export async function deleteTask(taskId: string) {
  return prisma.task.delete({ where: { id: taskId } })
}
