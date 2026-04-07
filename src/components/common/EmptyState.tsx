import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

interface EmptyStateProps {
  title: string
  description?: string
  actionLabel?: string
  actionTo?: string
  onAction?: () => void
}

export function EmptyState({ title, description, actionLabel, actionTo, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-surface-raised flex items-center justify-center mb-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-void-400">
          <path d="M12 6v12M6 12h12" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-void-100 mb-1">{title}</h3>
      {description && <p className="text-sm text-void-400 max-w-sm">{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="mt-4">
          <Button size="sm">{actionLabel}</Button>
        </Link>
      )}
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
