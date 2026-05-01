'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { tasksApi } from '@/lib/api'
import type { Task, ProjectMember } from '@/types'

const schema = z.object({
  title: z.string().min(1, 'Title required'),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  assignedToId: z.string().optional(),
})
type FormData = z.infer<typeof schema>

interface TaskFormProps {
  projectId: string
  members: ProjectMember[]
  onSuccess: (task: Task) => void
  onCancel: () => void
}

export function TaskForm({ projectId, members, onSuccess, onCancel }: TaskFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { priority: 'MEDIUM' },
  })

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    try {
      const task = (await tasksApi.create({
        ...data,
        projectId,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
        assignedToId: data.assignedToId || undefined,
      })) as Task
      onSuccess(task)
    } catch (e) {
      setServerError((e as Error).message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="task-title">Title</Label>
        <Input id="task-title" placeholder="Task title" {...register('title')} />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="task-desc">Description</Label>
        <Input id="task-desc" placeholder="Optional description" {...register('description')} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="task-due">Due Date</Label>
          <Input id="task-due" type="date" {...register('dueDate')} />
        </div>
        <div className="space-y-1">
          <Label>Priority</Label>
          <Select defaultValue="MEDIUM" onValueChange={(v) => setValue('priority', v as 'LOW' | 'MEDIUM' | 'HIGH')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1">
        <Label>Assign To</Label>
        <Select onValueChange={(v) => setValue('assignedToId', typeof v === 'string' ? v : undefined)}>
          <SelectTrigger>
            <SelectValue placeholder="Unassigned" />
          </SelectTrigger>
          <SelectContent>
            {members.map((m) => (
              <SelectItem key={m.user.id} value={m.user.id}>
                {m.user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {serverError && <p className="text-sm text-destructive">{serverError}</p>}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : 'Create Task'}
        </Button>
      </div>
    </form>
  )
}
