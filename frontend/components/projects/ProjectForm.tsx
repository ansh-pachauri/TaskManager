'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { projectsApi } from '@/lib/api'
import type { Project } from '@/types'

const schema = z.object({
  name: z.string().min(1, 'Name required'),
  description: z.string().optional(),
})
type FormData = z.infer<typeof schema>

interface ProjectFormProps {
  onSuccess: (project: Project) => void
  onCancel: () => void
}

export function ProjectForm({ onSuccess, onCancel }: ProjectFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    try {
      const project = (await projectsApi.create(data)) as Project
      onSuccess(project)
    } catch (e) {
      setServerError((e as Error).message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="proj-name">Project Name</Label>
        <Input id="proj-name" placeholder="e.g. Marketing Campaign" {...register('name')} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="proj-desc">Description (optional)</Label>
        <Input id="proj-desc" placeholder="What is this project about?" {...register('description')} />
      </div>
      {serverError && <p className="text-sm text-destructive">{serverError}</p>}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : 'Create Project'}
        </Button>
      </div>
    </form>
  )
}
