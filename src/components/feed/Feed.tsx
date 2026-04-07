import { useEffect, useRef } from 'react'
import { useFeed } from '@/hooks/usePosts'
import { useAuth } from '@/hooks/useAuth'
import { CreatePost } from './CreatePost'
import { FeedPost } from './FeedPost'
import { PostSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/common/EmptyState'

export function Feed() {
  const { userId } = useAuth()
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useFeed(userId ?? undefined)
  const observerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = observerRef.current
    if (!el || !hasNextPage) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) fetchNextPage()
      },
      { threshold: 0.5, rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, fetchNextPage])

  const allPages = data?.pages ?? []
  const posts = allPages.flatMap((page) => (Array.isArray(page) ? page : []))

  return (
    <div className="max-w-[620px] mx-auto space-y-4 px-4 py-4">
      {userId && <CreatePost />}

      {isLoading && (
        <div className="space-y-4">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {isError && (
        <div className="text-center py-8 text-void-400">
          <p>Erro ao carregar o feed. Tente recarregar a pagina.</p>
        </div>
      )}

      {!isLoading && !isError && posts.length === 0 && (
        <EmptyState
          title="Nenhum post ainda"
          description="Seja o primeiro a compartilhar algo com a comunidade"
        />
      )}

      {posts.map((post) => (
        <FeedPost key={post.id} post={post} />
      ))}

      {isFetchingNextPage && <PostSkeleton />}

      <div ref={observerRef} className="h-4" />
    </div>
  )
}
