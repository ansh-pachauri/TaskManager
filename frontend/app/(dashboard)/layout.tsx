'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, FolderKanban, ListTodo, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { authApi } from '@/lib/api'
import { getStoredUser, clearUser, storeUser } from '@/lib/auth'
import { cn, getInitials } from '@/lib/utils'
import type { User } from '@/types'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/tasks', label: 'Tasks', icon: ListTodo },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const stored = getStoredUser()
    if (stored) {
      setUser(stored)
      return
    }
    authApi
      .me()
      .then((u) => {
        const usr = u as User
        setUser(usr)
        storeUser(usr)
      })
      .catch(() => router.push('/login'))
  }, [router])

  const handleLogout = async () => {
    await authApi.logout()
    clearUser()
    router.push('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-60 flex-shrink-0 border-r bg-card flex flex-col">
        <div className="p-6">
          <h1 className="font-semibold text-lg tracking-tight">TaskManager</h1>
        </div>
        <Separator />
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                pathname === href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <Separator />
        <div className="p-4 flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {user ? getInitials(user.name) : '??'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name ?? '…'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email ?? ''}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-muted/20">
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
