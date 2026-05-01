'use client'

import { useState, useEffect } from 'react'
import { tasksApi } from '@/lib/api'
import type { Task } from '@/types'

export function useTasks(params?: Record<string, string>) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const paramsKey = JSON.stringify(params)

  const refresh = () => {
    setLoading(true)
    tasksApi
      .list(params)
      .then((data) => setTasks(data as Task[]))
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { refresh() }, [paramsKey])

  return { tasks, loading, error, refresh, setTasks }
}
