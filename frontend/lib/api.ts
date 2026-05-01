const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000/api'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  const json: ApiResponse<T> = await res.json()
  if (!json.success) throw new Error(json.error ?? 'Request failed')
  return json.data as T
}

export const authApi = {
  signup: (data: { name: string; email: string; password: string }) =>
    apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => apiFetch('/auth/logout', { method: 'POST' }),
  me: () => apiFetch('/auth/me'),
}

export const projectsApi = {
  list: () => apiFetch('/projects'),
  create: (data: { name: string; description?: string }) =>
    apiFetch('/projects', { method: 'POST', body: JSON.stringify(data) }),
  get: (id: string) => apiFetch(`/projects/${id}`),
  delete: (id: string) => apiFetch(`/projects/${id}`, { method: 'DELETE' }),
  addMember: (id: string, data: { email: string; role: string }) =>
    apiFetch(`/projects/${id}/members`, { method: 'POST', body: JSON.stringify(data) }),
  removeMember: (id: string, userId: string) =>
    apiFetch(`/projects/${id}/members/${userId}`, { method: 'DELETE' }),
}

export const tasksApi = {
  list: (params?: Record<string, string>) => {
    const query = params && Object.keys(params).length > 0
      ? '?' + new URLSearchParams(params).toString()
      : ''
    return apiFetch(`/tasks${query}`)
  },
  create: (data: {
    title: string
    description?: string
    dueDate?: string
    priority: string
    projectId: string
    assignedToId?: string
  }) => apiFetch('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  get: (id: string) => apiFetch(`/tasks/${id}`),
  update: (id: string, data: Record<string, unknown>) =>
    apiFetch(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`/tasks/${id}`, { method: 'DELETE' }),
}

export const dashboardApi = {
  stats: () => apiFetch('/dashboard/stats'),
}
