'use client'

import { useEffect, useState } from 'react'
import { ClipboardList, CircleDot, CheckCircle2, AlertTriangle } from 'lucide-react'
import { dashboardApi, tasksApi } from '@/lib/api'
import type { DashboardStats, Task } from '@/types'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { OverdueList } from '@/components/dashboard/OverdueList'
import { UserTaskChart } from '@/components/dashboard/UserTaskChart'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      dashboardApi.stats() as Promise<DashboardStats>,
      tasksApi.list() as Promise<Task[]>,
    ])
      .then(([s, t]) => {
        setStats(s)
        setTasks(t)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Tasks" value={stats?.totalTasks ?? 0} icon={ClipboardList} />
        <StatsCard title="To Do" value={stats?.byStatus.todo ?? 0} icon={CircleDot} />
        <StatsCard title="In Progress" value={stats?.byStatus.inProgress ?? 0} icon={CircleDot} />
        <StatsCard
          title="Overdue"
          value={stats?.overdueTasks ?? 0}
          icon={AlertTriangle}
          variant={stats && stats.overdueTasks > 0 ? 'warning' : 'default'}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <OverdueList tasks={tasks} />
        <UserTaskChart data={stats?.tasksPerUser ?? []} />
      </div>
    </div>
  )
}
