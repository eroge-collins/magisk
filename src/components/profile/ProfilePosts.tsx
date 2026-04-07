import { useEffect, useRef } from 'react'
import { useUserPosts } from '@/hooks/usePosts'
import { FeedPost } from '@/components/feed/FeedPost'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'

interface ProfilePostsProps {
  userId: string
}

export function ProfilePosts({ userId }: ProfilePostsProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useUserPosts(userId)
  const observerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = observerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage) fetchNextPage()
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, fetchNextPage])

  const posts = data?.pages.flat() ?? []

  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner className="h-8 w-8" />
        </div>
      )}

      {!isLoading && posts.length === 0 && (
        <EmptyState title="Nenhum post" description="Nenhum post publicado ainda" />
      )}

      {posts.map((post) => (
        <FeedPost key={post.id} post={post} />
      ))}

      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <LoadingSpinner className="h-6 w-6" />
        </div>
      )}
      <div ref={observerRef} className="h-4" />
    </div>
  )
}
