'use client'

import { useState } from 'react'
import { Trash2, UserPlus } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { projectsApi } from '@/lib/api'
import { getInitials, cn } from '@/lib/utils'
import type { ProjectMember, Role } from '@/types'

const ROLE_COLORS: Record<Role, string> = {
  ADMIN: 'bg-blue-100 text-blue-700 border-blue-200',
  MEMBER: 'bg-slate-100 text-slate-600 border-slate-200',
}

interface MemberListProps {
  projectId: string
  members: ProjectMember[]
  isAdmin: boolean
  currentUserId: string
  onRefresh: () => void
}

export function MemberList({ projectId, members, isAdmin, currentUserId, onRefresh }: MemberListProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>('MEMBER')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAdd = async () => {
    if (!email.trim()) return
    setAdding(true)
    setError(null)
    try {
      await projectsApi.addMember(projectId, { email: email.trim(), role })
      setEmail('')
      onRefresh()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setAdding(false)
    }
  }

  const handleRemove = async (uid: string) => {
    try {
      await projectsApi.removeMember(projectId, uid)
      onRefresh()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Members ({members.length})</h3>
      <div className="space-y-2">
        {members.map((m) => (
          <div key={m.id} className="flex items-center gap-3 rounded-lg border px-3 py-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{getInitials(m.user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{m.user.name}</p>
              <p className="text-xs text-muted-foreground">{m.user.email}</p>
            </div>
            <Badge className={cn('shrink-0', ROLE_COLORS[m.role])}>{m.role}</Badge>
            {isAdmin && m.user.id !== currentUserId && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => handleRemove(m.user.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {isAdmin && (
        <>
          <Separator />
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Add Member
            </Label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="member@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                className="flex-1"
              />
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MEMBER">Member</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" onClick={handleAdd} disabled={adding}>
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </>
      )}
    </div>
  )
}
