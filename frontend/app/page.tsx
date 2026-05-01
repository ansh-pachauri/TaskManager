import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Users, LayoutDashboard } from 'lucide-react'

const FEATURES = [
  { icon: LayoutDashboard, title: 'Dashboard overview', desc: 'See all tasks, progress, and overdue items at a glance.' },
  { icon: Users, title: 'Team collaboration', desc: 'Invite members to projects and assign tasks by role.' },
  { icon: CheckCircle2, title: 'Kanban workflow', desc: 'Move tasks from To Do → In Progress → Done with one click.' },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* nav */}
      <header className="border-b">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-semibold text-base tracking-tight">TaskManager</span>
          <Link href="/login">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
        </div>
      </header>

      {/* hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 gap-6">
        <h1 className="text-4xl font-bold tracking-tight max-w-xl">
          Manage projects and tasks with your team
        </h1>
        <p className="text-muted-foreground max-w-md text-lg">
          Create projects, assign tasks, track progress — all in one place.
        </p>
        <div className="flex items-center gap-3 mt-2">
          <Link href="/signup">
            <Button size="lg">Get started free</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">Sign in</Button>
          </Link>
        </div>
      </main>

      {/* features */}
      <section className="border-t bg-muted/30">
        <div className="max-w-4xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <p className="font-medium text-sm">{title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t">
        <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} TaskManager
        </div>
      </footer>
    </div>
  )
}
