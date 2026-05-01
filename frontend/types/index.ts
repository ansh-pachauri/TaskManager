export type Role = 'ADMIN' | 'MEMBER'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'
export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE'

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface ProjectMember {
  id: string
  role: Role
  joinedAt: string
  user: Pick<User, 'id' | 'name' | 'email'>
}

export interface Project {
  id: string
  name: string
  description?: string
  createdAt: string
  createdById: string
  members: ProjectMember[]
  _count: { tasks: number; members: number }
}

export interface Task {
  id: string
  title: string
  description?: string
  dueDate?: string
  priority: Priority
  status: Status
  projectId: string
  createdAt: string
  updatedAt: string
  assignedTo?: Pick<User, 'id' | 'name' | 'email'>
  createdBy: Pick<User, 'id' | 'name' | 'email'>
  project: Pick<Project, 'id' | 'name'>
}

export interface DashboardStats {
  totalTasks: number
  byStatus: { todo: number; inProgress: number; done: number }
  overdueTasks: number
  tasksPerUser: { userId: string; name: string; count: number }[]
}
