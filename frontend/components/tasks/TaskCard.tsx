'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, getInitials, isOverdue, cn } from '@/lib/utils'
import type { Task, Status } from '@/types'
import { PlayCircle, CheckCircle2, RotateCcw } from 'lucide-react'

const PRIORITY_COLORS: Record<string, string> = {
  HIGH: 'bg-red-100 text-red-700 border-red-200',
  MEDIUM: 'bg-amber-100 text-amber-700 border-amber-200',
  LOW: 'bg-slate-100 text-slate-600 border-slate-200',
}

const NEXT_STATUS: Partial<Record<Status, { status: Status; label: string; icon: typeof PlayCircle; className: string }>> = {
  TODO: {
    status: 'IN_PROGRESS',
    label: 'Start',
    icon: PlayCircle,
    className: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50',
  },
  IN_PROGRESS: {
    status: 'DONE',
    label: 'Mark Done',
    icon: CheckCircle2,
    className: 'text-green-600 hover:text-green-700 hover:bg-green-50',
  },
}

interface TaskCardProps {
  task: Task
  onStatusChange?: (taskId: string, newStatus: Status) => Promise<void>
}

export function TaskCard({ task, onStatusChange }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate) && task.status !== 'DONE'
  const [loading, setLoading] = useState(false)

  const next = NEXT_STATUS[task.status]

  const handleStatusClick = async (newStatus: Status) => {
    if (!onStatusChange) return
    setLoading(true)
    try {
      await onStatusChange(task.id, newStatus)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border bg-card p-3 shadow-sm space-y-2 hover:shadow-md transition-shadow">
      <p className="text-sm font-medium leading-snug">{task.title}</p>

      <div className="flex items-center justify-between gap-2">
        <Badge className={cn('text-xs', PRIORITY_COLORS[task.priority])}>{task.priority}</Badge>
        {task.dueDate && (
          <span className={cn('text-xs', overdue ? 'text-red-600 font-medium' : 'text-muted-foreground')}>
            {overdue && '⚠ '}
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>

      {task.assignedTo && (
        <div className="flex items-center gap-1.5">
          <Avatar className="h-5 w-5">
            <AvatarFallback className="text-[10px]">{getInitials(task.assignedTo.name)}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{task.assignedTo.name}</span>
        </div>
      )}

      {onStatusChange && (
        <div className="flex items-center gap-1 pt-1 border-t border-border/50">
          {next && (
            <Button
              variant="ghost"
              size="sm"
              className={cn('h-6 px-2 text-xs font-medium gap-1', next.className)}
              disabled={loading}
              onClick={() => handleStatusClick(next.status)}
            >
              <next.icon className="h-3.5 w-3.5" />
              {next.label}
            </Button>
          )}
          {task.status === 'DONE' && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs font-medium gap-1 text-muted-foreground hover:text-foreground"
              disabled={loading}
              onClick={() => handleStatusClick('TODO')}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reopen
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
