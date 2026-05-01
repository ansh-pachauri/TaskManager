import type { User } from '@/types'

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem('user')
    return stored ? (JSON.parse(stored) as User) : null
  } catch {
    return null
  }
}

export function storeUser(user: User): void {
  localStorage.setItem('user', JSON.stringify(user))
}

export function clearUser(): void {
  localStorage.removeItem('user')
}
