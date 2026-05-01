'use client'

import { use, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { KanbanBoard } from '@/components/tasks/KanbanBoard'
import { TaskForm } from '@/components/tasks/TaskForm'
import { MemberList } from '@/components/projects/MemberList'
import { useProject } from '@/hooks/useProjects'
import { useTasks } from '@/hooks/useTasks'
import { useAuth } from '@/hooks/useAuth'

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { project, loading, refresh: refreshProject } = useProject(id)
  const { tasks, loading: tasksLoading, refresh: refreshTasks } = useTasks({ projectId: id })
  const { user } = useAuth()
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)

  const currentMember = project?.members.find((m) => m.user.id === user?.id)
  const isAdmin = currentMember?.role === 'ADMIN'

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    )
  }

  if (!project) {
    return <p className="text-muted-foreground">Project not found.</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{project.name}</h1>
        {project.description && (
          <p className="text-muted-foreground mt-1">{project.description}</p>
        )}
      </div>

      <Card>
        <CardContent className="pt-4">
          <MemberList
            projectId={id}
            members={project.members}
            isAdmin={isAdmin}
            currentUserId={user?.id ?? ''}
            onRefresh={refreshProject}
          />
        </CardContent>
      </Card>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Tasks</h2>
          {isAdmin && (
            <Button size="sm" onClick={() => setTaskDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </Button>
          )}
        </div>

        {tasksLoading ? (
          <Skeleton className="h-64 rounded-xl" />
        ) : (
          <KanbanBoard tasks={tasks} onRefresh={refreshTasks} />
        )}
      </div>

      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            projectId={id}
            members={project.members}
            onSuccess={() => {
              setTaskDialogOpen(false)
              refreshTasks()
            }}
            onCancel={() => setTaskDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
