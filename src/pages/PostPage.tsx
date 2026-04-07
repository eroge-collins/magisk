import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, MessageCircle, ArrowLeft, Send } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { useAuth } from '@/hooks/useAuth'
import { usePost, useToggleLike } from '@/hooks/usePosts'
import { useComments, useCreateComment } from '@/hooks/useInteractions'
import { formatRelativeTime, formatNumber } from '@/lib/utils'
import { showToast } from '@/lib/toast'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'

export function PostPage() {
  return (
    <ProtectedRoute>
      <PostPageContent />
    </ProtectedRoute>
  )
}

function PostPageContent() {
  const { postId } = useParams<{ postId: string }>()
  const { userId } = useAuth()
  const { data: post, isLoading } = usePost(postId ?? '', userId ?? undefined)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [commentText, setCommentText] = useState('')

  const toggleLike = useToggleLike()
  const createComment = useCreateComment()
  const { data: commentsData, isLoading: commentsLoading } = useComments(postId ?? '')

  useEffect(() => {
    if (post) {
      setLiked(post.is_liked ?? false)
      setLikeCount(post.like_count)
    }
  }, [post])

  const comments = commentsData?.pages.flat() ?? []

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    )
  }

  if (!post) {
    return <EmptyState title="Post nao encontrado" />
  }

  const profile = post.profiles
  if (!profile) return null

  const handleLike = async () => {
    try {
      const newLiked = !liked
      setLiked(newLiked)
      setLikeCount((c) => (newLiked ? c + 1 : c - 1))
      await toggleLike.mutateAsync({ postId: post.id, isLiked: liked })
    } catch {
      showToast('Erro ao curtir', 'error')
    }
  }

  const handleComment = async () => {
    if (!commentText.trim() || !postId) return
    try {
      await createComment.mutateAsync({ postId, content: commentText.trim() })
      setCommentText('')
      showToast('Comentario adicionado', 'success')
    } catch {
      showToast('Erro ao comentar', 'error')
    }
  }

  return (
    <div className="max-w-feed mx-auto px-4 py-4 space-y-4">
      <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 text-sm text-void-400 hover:text-void-200 transition-colors">
        <ArrowLeft size={16} />
        Voltar
      </button>

      <article className="bg-surface rounded-card border border-void-700/30 p-4">
        <div className="flex items-center gap-3 mb-3">
          <Link to={`/${profile.username}`}>
            <Avatar src={profile.avatar_url} alt={profile.display_name} />
          </Link>
          <div>
            <Link to={`/${profile.username}`} className="font-semibold text-sm text-void-50 hover:text-accent">{profile.display_name}</Link>
            <p className="text-xs text-void-400">@{profile.username} - {formatRelativeTime(post.created_at)}</p>
          </div>
        </div>

        <p className="text-sm text-void-100 whitespace-pre-wrap break-words leading-relaxed">{post.content}</p>

        {post.image_url && (
          <img src={post.image_url} alt="" className="w-full rounded-xl mt-3 object-cover max-h-[500px]" loading="lazy" />
        )}

        <div className="flex items-center gap-6 mt-4 pt-3 border-t border-void-700/20">
          <button onClick={handleLike} className="flex items-center gap-1.5 text-sm">
            <Heart size={18} className={liked ? 'fill-red-500 text-red-500' : 'text-void-400'} />
            <span className={liked ? 'text-red-400' : 'text-void-400'}>{formatNumber(likeCount)}</span>
          </button>
          <div className="flex items-center gap-1.5 text-sm text-void-400">
            <MessageCircle size={18} />
            <span>{formatNumber(post.comment_count)}</span>
          </div>
        </div>
      </article>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-void-50">Comentarios</h2>

        <div className="flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleComment()}
            placeholder="Escreva um comentario..."
            className="flex-1 h-10 px-3 bg-surface rounded-lg border border-void-700/50 text-sm text-void-50 placeholder:text-void-400 outline-none focus:border-accent"
          />
          <Button size="sm" onClick={handleComment} disabled={!commentText.trim()}>
            <Send size={16} />
          </Button>
        </div>

        {commentsLoading && <LoadingSpinner className="h-5 w-5 mx-auto" />}

        {!commentsLoading && comments.length === 0 && (
          <p className="text-sm text-void-400 text-center py-4">Nenhum comentario ainda</p>
        )}

        {comments.map((comment: any) => (
          <div key={comment.id} className="flex gap-3 p-3 bg-surface rounded-xl border border-void-700/20">
            <Link to={`/${comment.profiles?.username}`}>
              <Avatar src={comment.profiles?.avatar_url} alt={comment.profiles?.display_name} size="sm" />
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <Link to={`/${comment.profiles?.username}`} className="font-semibold text-sm text-void-50 hover:text-accent">
                  {comment.profiles?.display_name}
                </Link>
                <span className="text-xs text-void-400">{formatRelativeTime(comment.created_at)}</span>
              </div>
              <p className="text-sm text-void-200 mt-0.5">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
