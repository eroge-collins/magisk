import { Link } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { formatRelativeTime } from '@/lib/utils'
import type { ProfileWithCounts } from '@/types'

interface ProfileHeaderProps {
  profile: ProfileWithCounts
  isOwner: boolean
  onFollowToggle: () => void
  onEdit: () => void
}

export function ProfileHeader({ profile, isOwner, onFollowToggle, onEdit }: ProfileHeaderProps) {
  return (
    <div className="bg-surface rounded-card border border-void-700/30 overflow-hidden">
      {profile.cover_url ? (
        <div className="h-40 md:h-52 overflow-hidden">
          <img src={profile.cover_url} alt="" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="h-24 md:h-32 bg-gradient-to-br from-void-700 via-surface-raised to-void-800" />
      )}

      <div className="px-4 md:px-6 pb-4">
        <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12 md:-mt-16">
          <Avatar src={profile.avatar_url} alt={profile.display_name} size="xl" className="ring-4 ring-surface" />

          <div className="flex-1 pt-2 md:pt-0">
            <h1 className="text-xl font-bold text-void-50">{profile.display_name}</h1>
            <p className="text-sm text-void-400">@{profile.username}</p>
          </div>

          <div className="flex gap-2">
            {isOwner ? (
              <Button variant="secondary" size="sm" onClick={onEdit}>
                Editar perfil
              </Button>
            ) : (
              <Button
                variant={profile.is_following ? 'secondary' : 'primary'}
                size="sm"
                onClick={onFollowToggle}
              >
                {profile.is_following ? 'Deixar de seguir' : 'Seguir'}
              </Button>
            )}
          </div>
        </div>

        {profile.bio && (
          <p className="mt-3 text-sm text-void-200 leading-relaxed">{profile.bio}</p>
        )}

        <div className="flex items-center gap-4 mt-3 text-sm">
          {(profile.location) && (
            <span className="text-void-400">{profile.location}</span>
          )}
          {profile.website && (
            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              {profile.website.replace(/^https?:\/\//, '')}
            </a>
          )}
        </div>

        <div className="flex items-center gap-5 mt-4 text-sm">
          <Link to="" className="hover:text-void-100 transition-colors">
            <span className="font-bold text-void-50">{profile.post_count}</span>{' '}
            <span className="text-void-400">posts</span>
          </Link>
          <span>
            <span className="font-bold text-void-50">{profile.follower_count}</span>{' '}
            <span className="text-void-400">seguidores</span>
          </span>
          <span>
            <span className="font-bold text-void-50">{profile.following_count}</span>{' '}
            <span className="text-void-400">seguindo</span>
          </span>
          <span className="text-void-400 ml-auto">
            Entrou {formatRelativeTime(profile.created_at)}
          </span>
        </div>
      </div>
    </div>
  )
}
