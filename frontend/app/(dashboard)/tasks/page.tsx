'use client'

import { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { TaskFilters } from '@/components/tasks/TaskFilters'
import { useTasks } from '@/hooks/useTasks'
import { useProjects } from '@/hooks/useProjects'
import { useAuth } from '@/hooks/useAuth'
import { formatDate, getInitials, isOverdue, cn } from '@/lib/utils'
import type { Task } from '@/types'

const STATUS_LABELS: Record<string, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
}

const STATUS_COLORS: Record<string, string> = {
  TODO: 'bg-slate-100 text-slate-600 border-slate-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-700 border-blue-200',
  DONE: 'bg-green-100 text-green-700 border-green-200',
}

const PRIORITY_COLORS: Record<string, string> = {
  HIGH: 'bg-red-100 text-red-700 border-red-200',
  MEDIUM: 'bg-amber-100 text-amber-700 border-amber-200',
  LOW: 'bg-slate-100 text-slate-600 border-slate-200',
}

interface Filters {
  projectId?: string
  status?: string
  priority?: string
  assignedToMe: boolean
}

export default function TasksPage() {
  const { user } = useAuth()
  const [filters, setFilters] = useState<Filters>({ assignedToMe: false })
  const { tasks, loading } = useTasks()
  const { projects } = useProjects()

  const filtered = useMemo(() => {
    let result: Task[] = tasks
    if (filters.projectId) result = result.filter((t) => t.projectId === filters.projectId)
    if (filters.status) result = result.filter((t) => t.status === filters.status)
    if (filters.priority) result = result.filter((t) => t.priority === filters.priority)
    if (filters.assignedToMe) result = result.filter((t) => t.assignedTo?.id === user?.id)
    return result
  }, [tasks, filters, user])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">All Tasks</h1>

      <TaskFilters projects={projects} filters={filters} onChange={setFilters} />

      {loading ? (
        <Skeleton className="h-64 rounded-xl" />
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                    No tasks found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((task) => {
                  const overdue = isOverdue(task.dueDate) && task.status !== 'DONE'
                  return (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{task.project.name}</TableCell>
                      <TableCell>
                        <Badge className={STATUS_COLORS[task.status]}>
                          {STATUS_LABELS[task.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={PRIORITY_COLORS[task.priority]}>{task.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        {task.assignedTo ? (
                          <div className="flex items-center gap-1.5">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-[10px]">
                                {getInitials(task.assignedTo.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{task.assignedTo.name}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell
                        className={cn(
                          'text-sm',
                          overdue ? 'text-red-600 font-medium' : 'text-muted-foreground'
                        )}
                      >
                        {task.dueDate ? formatDate(task.dueDate) : '—'}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
