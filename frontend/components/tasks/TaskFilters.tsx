'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import type { Project } from '@/types'

interface Filters {
  projectId?: string
  status?: string
  priority?: string
  assignedToMe: boolean
}

interface TaskFiltersProps {
  projects: Project[]
  filters: Filters
  onChange: (filters: Filters) => void
}

export function TaskFilters({ projects, filters, onChange }: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Label className="text-sm">Projects:</Label>
      <Select
        value={filters.projectId ?? 'all'}
        onValueChange={(v) => onChange({ ...filters, projectId: v && v !== 'all' ? v : undefined })}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="All Projects" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          {projects.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Label className='text-sm'>Status:</Label>
      <Select
        value={filters.status ?? 'all'}
        onValueChange={(v) => onChange({ ...filters, status: v && v !== 'all' ? v : undefined })}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="TODO">To Do</SelectItem>
          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
          <SelectItem value="DONE">Done</SelectItem>
        </SelectContent>
      </Select>

      <Label className='text-sm'>Priority:</Label>
      <Select
        value={filters.priority ?? 'all'}
        onValueChange={(v) => onChange({ ...filters, priority: v && v !== 'all' ? v : undefined })}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="All Priorities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="HIGH">High</SelectItem>
          <SelectItem value="MEDIUM">Medium</SelectItem>
          <SelectItem value="LOW">Low</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Switch
          id="assigned-to-me"
          checked={filters.assignedToMe}
          onCheckedChange={(v) => onChange({ ...filters, assignedToMe: v })}
        />
        <Label htmlFor="assigned-to-me" className="text-sm cursor-pointer">
          Assigned to me
        </Label>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange({ assignedToMe: false })}
        className="text-muted-foreground"
      >
        Clear
      </Button>
    </div>
  )
}
