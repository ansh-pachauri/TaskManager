import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Project, Role } from '@/types'

const ROLE_COLORS: Record<Role, string> = {
  ADMIN: 'bg-blue-100 text-blue-700 border-blue-200',
  MEMBER: 'bg-slate-100 text-slate-600 border-slate-200',
}

export function ProjectCard({ project, userRole }: { project: Project; userRole: Role }) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-semibold leading-tight">{project.name}</CardTitle>
            <Badge className={cn('shrink-0', ROLE_COLORS[userRole])}>{userRole}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {project.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
          )}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {project._count.members} members
            </span>
            <span className="flex items-center gap-1">
              <ClipboardList className="h-3.5 w-3.5" />
              {project._count.tasks} tasks
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
