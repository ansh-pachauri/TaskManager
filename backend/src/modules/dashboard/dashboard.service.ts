import { prisma } from '../../lib/prisma'

export async function getDashboardStats(userId: string) {
  const memberProjects = await prisma.projectMember.findMany({
    where: { userId },
    select: { projectId: true },
  })
  const projectIds = memberProjects.map((m) => m.projectId)

  const [tasks, overdueTasks] = await Promise.all([
    prisma.task.findMany({
      where: { projectId: { in: projectIds } },
      select: {
        status: true,
        assignedToId: true,
        assignedTo: { select: { id: true, name: true } },
      },
    }),
    prisma.task.count({
      where: {
        projectId: { in: projectIds },
        dueDate: { lt: new Date() },
        status: { not: 'DONE' },
      },
    }),
  ])

  const byStatus = { todo: 0, inProgress: 0, done: 0 }
  const userMap = new Map<string, { name: string; count: number }>()

  for (const t of tasks) {
    if (t.status === 'TODO') byStatus.todo++
    else if (t.status === 'IN_PROGRESS') byStatus.inProgress++
    else byStatus.done++

    if (t.assignedToId && t.assignedTo) {
      const entry = userMap.get(t.assignedToId) ?? { name: t.assignedTo.name, count: 0 }
      entry.count++
      userMap.set(t.assignedToId, entry)
    }
  }

  const tasksPerUser = Array.from(userMap.entries()).map(([uid, v]) => ({
    userId: uid,
    name: v.name,
    count: v.count,
  }))

  return { totalTasks: tasks.length, byStatus, overdueTasks, tasksPerUser }
}
