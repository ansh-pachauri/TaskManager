'use client'

import { useState, useEffect } from 'react'
import { projectsApi } from '@/lib/api'
import type { Project } from '@/types'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = () => {
    setLoading(true)
    projectsApi
      .list()
      .then((data) => setProjects(data as Project[]))
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    refresh()
  }, [])

  return { projects, loading, error, refresh }
}

export function useProject(id: string) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = () => {
    setLoading(true)
    projectsApi
      .get(id)
      .then((data) => setProject(data as Project))
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (id) refresh()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return { project, loading, error, refresh }
}
