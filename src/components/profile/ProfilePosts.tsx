import { useEffect, useRef } from 'react'
import { useUserPosts } from '@/hooks/usePosts'
import { FeedPost } from '@/components/feed/FeedPost'
import { PostSkeleton } from '@/components/ui/Skeleton'
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
      {isLoading && <div className="space-y-4"><PostSkeleton /><PostSkeleton /></div>}

      {!isLoading && posts.length === 0 && (
        <EmptyState title="Nenhum post" description="Nenhum post publicado ainda" />
      )}

      {posts.map((post) => (
        <FeedPost key={post.id} post={post} />
      ))}

      {isFetchingNextPage && <PostSkeleton />}
      <div ref={observerRef} className="h-4" />
    </div>
  )
}
