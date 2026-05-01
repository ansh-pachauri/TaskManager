'use client'

import { tasksApi } from '@/lib/api'
import { TaskCard } from './TaskCard'
import type { Task, Status } from '@/types'

const COLUMNS: { status: Status; label: string }[] = [
  { status: 'TODO', label: 'To Do' },
  { status: 'IN_PROGRESS', label: 'In Progress' },
  { status: 'DONE', label: 'Done' },
]

export function KanbanBoard({ tasks, onRefresh }: { tasks: Task[]; onRefresh: () => void }) {
  const grouped = COLUMNS.reduce<Record<Status, Task[]>>(
    (acc, col) => {
      acc[col.status] = tasks.filter((t) => t.status === col.status)
      return acc
    },
    { TODO: [], IN_PROGRESS: [], DONE: [] }
  )

  const handleStatusChange = async (taskId: string, newStatus: Status) => {
    await tasksApi.update(taskId, { status: newStatus })
    onRefresh()
  }

  const handleDrop = async (e: React.DragEvent, status: Status) => {
    const taskId = e.dataTransfer.getData('taskId')
    if (!taskId) return
    try {
      await handleStatusChange(taskId, status)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {COLUMNS.map(({ status, label }) => (
        <div
          key={status}
          className="rounded-xl border bg-muted/30 p-3 min-h-[300px]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, status)}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">{label}</h3>
            <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
              {grouped[status].length}
            </span>
          </div>
          <div className="space-y-2">
            {grouped[status].map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
              >
                <TaskCard task={task} onStatusChange={handleStatusChange} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
