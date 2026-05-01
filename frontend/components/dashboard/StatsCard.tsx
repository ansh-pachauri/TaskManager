import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number
  icon: LucideIcon
  description?: string
  variant?: 'default' | 'warning'
}

export function StatsCard({ title, value, icon: Icon, description, variant = 'default' }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={cn('h-4 w-4', variant === 'warning' ? 'text-amber-500' : 'text-muted-foreground')} />
      </CardHeader>
      <CardContent>
        <div className={cn('text-3xl font-bold', variant === 'warning' && 'text-amber-600')}>
          {value}
        </div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}
