import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useProfile, useToggleFollow } from '@/hooks/useProfile'
import { useAuth } from '@/hooks/useAuth'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfilePosts } from '@/components/profile/ProfilePosts'
import { EditProfile } from '@/components/profile/EditProfile'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { showToast } from '@/lib/toast'

export function ProfilePage() {
  const { username } = useParams<{ username: string }>()
  const { userId } = useAuth()
  const { data: profile, isLoading } = useProfile(username ?? '', userId ?? undefined)
  const toggleFollow = useToggleFollow()
  const [editing, setEditing] = useState(false)

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-20 text-void-400">
        <p className="text-lg">Perfil nao encontrado</p>
      </div>
    )
  }

  const isOwner = userId === profile.id

  const handleFollowToggle = async () => {
    try {
      await toggleFollow.mutateAsync({ targetUserId: profile.id, isFollowing: profile.is_following })
    } catch {
      showToast('Erro ao seguir/deixar de seguir', 'error')
    }
  }

  return (
    <div className="max-w-feed mx-auto px-4 py-4 space-y-4">
      <ProfileHeader
        profile={profile}
        isOwner={isOwner}
        onFollowToggle={handleFollowToggle}
        onEdit={() => setEditing(true)}
      />
      <ProfilePosts userId={profile.id} />
      <EditProfile open={editing} onClose={() => setEditing(false)} />
    </div>
  )
}
