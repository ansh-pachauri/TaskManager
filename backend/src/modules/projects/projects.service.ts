import { prisma } from '../../lib/prisma'
import type { CreateProjectInput, AddMemberInput } from './projects.schema'

const memberSelect = {
  id: true,
  role: true,
  joinedAt: true,
  user: { select: { id: true, name: true, email: true } },
}

const projectSelect = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
  createdById: true,
  members: { select: memberSelect },
  _count: { select: { tasks: true, members: true } },
}

export async function listProjects(userId: string) {
  return prisma.project.findMany({
    where: { members: { some: { userId } } },
    select: projectSelect,
    orderBy: { createdAt: 'desc' },
  })
}

export async function createProject(userId: string, input: CreateProjectInput) {
  return prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: { ...input, createdById: userId },
      select: projectSelect,
    })
    await tx.projectMember.create({
      data: { projectId: project.id, userId, role: 'ADMIN' },
    })
    return project
  })
}

export async function getProject(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: projectSelect,
  })
  if (!project) throw new Error('Project not found')
  const isMember = project.members.some((m) => m.user.id === userId)
  if (!isMember) throw new Error('Forbidden')
  return project
}

export async function deleteProject(projectId: string) {
  return prisma.project.delete({ where: { id: projectId } })
}

export async function addMember(projectId: string, input: AddMemberInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } })
  if (!user) throw new Error('No user found with that email')

  const existing = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: user.id } },
  })
  if (existing) throw new Error('User is already a member of this project')

  return prisma.projectMember.create({
    data: { projectId, userId: user.id, role: input.role },
    select: memberSelect,
  })
}

export async function removeMember(projectId: string, userId: string) {
  return prisma.projectMember.delete({
    where: { projectId_userId: { projectId, userId } },
  })
}
