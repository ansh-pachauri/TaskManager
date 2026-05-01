import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { Task } from '@/types'

const PRIORITY_COLORS: Record<string, string> = {
  HIGH: 'bg-red-100 text-red-700 border-red-200',
  MEDIUM: 'bg-amber-100 text-amber-700 border-amber-200',
  LOW: 'bg-slate-100 text-slate-600 border-slate-200',
}

export function OverdueList({ tasks }: { tasks: Task[] }) {
  const overdue = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE'
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className={`text-sm font-medium ${overdue.length > 0 ? 'text-amber-600' : ''}`}>
          Overdue Tasks {overdue.length > 0 ? `(${overdue.length})` : ''}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {overdue.length === 0 ? (
          <p className="text-sm text-muted-foreground">No overdue tasks</p>
        ) : (
          <div className="space-y-2">
            {overdue.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-md border border-amber-200 bg-amber-50 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {task.project.name} · Due {formatDate(task.dueDate!)}
                  </p>
                </div>
                <Badge className={PRIORITY_COLORS[task.priority]}>{task.priority}</Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
