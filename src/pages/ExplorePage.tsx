import { useSearchParams, Link } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/common/EmptyState'
import { useSearchProfiles } from '@/hooks/useProfile'

export function ExplorePage() {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') ?? ''
  const { data: results = [], isLoading: loading } = useSearchProfiles(searchQuery)

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      <h1 className="text-xl font-bold text-void-50 mb-4">Explorar</h1>

      {!searchQuery && (
        <div className="text-center py-16 text-void-400">
          <p>Busque por usuarios para comecar</p>
        </div>
      )}

      {!loading && searchQuery && results.length === 0 && (
        <EmptyState title="Nenhum resultado" description={`Nenhum usuario encontrado para "${searchQuery}"`} />
      )}

      <div className="space-y-2">
        {results.map((profile) => (
          <Link
            key={profile.id}
            to={`/${profile.username}`}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-raised transition-colors"
          >
            <Avatar src={profile.avatar_url} alt={profile.display_name} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-void-50 truncate">{profile.display_name}</p>
              <p className="text-xs text-void-400">@{profile.username}</p>
            </div>
            {profile.bio && (
              <p className="text-xs text-void-400 truncate max-w-[200px] hidden sm:block">{profile.bio}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
