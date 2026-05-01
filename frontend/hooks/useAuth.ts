'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'
import { getStoredUser, storeUser, clearUser } from '@/lib/auth'
import type { User } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const stored = getStoredUser()
    if (stored) {
      setUser(stored)
      setLoading(false)
      return
    }
    authApi
      .me()
      .then((u) => {
        const usr = u as User
        setUser(usr)
        storeUser(usr)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout()
    clearUser()
    setUser(null)
    router.push('/login')
  }, [router])

  return { user, loading, logout, setUser }
}
