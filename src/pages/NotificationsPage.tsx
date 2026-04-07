import { Heart, MessageCircle, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/common/EmptyState'
import { useNotifications, useMarkNotificationsRead } from '@/hooks/useInteractions'
import { formatRelativeTime } from '@/lib/utils'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { useEffect } from 'react'

export function NotificationsPage() {
  return (
    <ProtectedRoute>
      <NotificationsContent />
    </ProtectedRoute>
  )
}

function NotificationsContent() {
  const { data, isLoading } = useNotifications()
  const markRead = useMarkNotificationsRead()

  useEffect(() => {
    markRead.mutate()
  }, [markRead])

  const notifications = data?.pages.flat() ?? []

  const iconMap = {
    like: <Heart size={16} className="text-red-400" />,
    comment: <MessageCircle size={16} className="text-accent" />,
    follow: <UserPlus size={16} className="text-green-400" />,
  }

  const getText = (type: string, username: string) => {
    switch (type) {
      case 'like': return `${username} curtiu seu post`
      case 'comment': return `${username} comentou no seu post`
      case 'follow': return `${username} comecou a te seguir`
      default: return username
    }
  }

  return (
    <div className="max-w-feed mx-auto px-4 py-4">
      <h1 className="text-xl font-bold text-void-50 mb-4">Notificacoes</h1>

      {isLoading && null}

      {!isLoading && notifications.length === 0 && (
        <EmptyState title="Sem notificacoes" description="Nenhuma notificacao ainda" />
      )}

      <div className="space-y-2">
        {notifications.map((n) => (
          <Link
            key={n.id}
            to={n.type === 'follow' ? `/${n.actor?.username}` : `/post/${n.reference_id}`}
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${n.read ? 'bg-surface' : 'bg-surface-raised border border-void-700/30'}`}
          >
            <div className="flex-shrink-0">
              <Avatar src={n.actor?.avatar_url} alt={n.actor?.display_name} size="sm" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {iconMap[n.type as keyof typeof iconMap]}
                <p className="text-sm text-void-100 truncate">{getText(n.type, n.actor?.username ?? 'Alguem')}</p>
              </div>
              <p className="text-xs text-void-400 mt-0.5">{formatRelativeTime(n.created_at)}</p>
            </div>
            {!n.read && <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />}
          </Link>
        ))}
      </div>
    </div>
  )
}
