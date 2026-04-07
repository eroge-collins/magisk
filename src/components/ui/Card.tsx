import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className, hover }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface rounded-card border border-void-700/30',
        hover && 'transition-all duration-200 hover:border-void-600/50 hover:shadow-lg hover:shadow-black/20',
        className,
      )}
    >
      {children}
    </div>
  )
}
