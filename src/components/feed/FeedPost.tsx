import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle, MoreHorizontal, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Avatar } from '@/components/ui/Avatar'
import { formatRelativeTime, formatNumber } from '@/lib/utils'
import { useToggleLike, useDeletePost } from '@/hooks/usePosts'
import { useAuth } from '@/hooks/useAuth'
import { showToast } from '@/lib/toast'
import type { Post } from '@/types'

interface FeedPostProps {
  post: Post
}

export function FeedPost({ post }: FeedPostProps) {
  const { userId } = useAuth()
  const toggleLike = useToggleLike()
  const deletePost = useDeletePost()
  const [showMenu, setShowMenu] = useState(false)
  const [liked, setLiked] = useState(post.is_liked ?? false)
  const [likeCount, setLikeCount] = useState(post.like_count)

  const profile = post.profiles
  if (!profile || post.status !== 'active') return null

  const handleLike = async () => {
    try {
      const newLiked = !liked
      setLiked(newLiked)
      setLikeCount((c) => (newLiked ? c + 1 : c - 1))
      await toggleLike.mutateAsync({ postId: post.id, isLiked: liked })
    } catch {
      setLiked(liked)
      setLikeCount(post.like_count)
      showToast('Erro ao curtir', 'error')
    }
  }

  const handleDelete = async () => {
    try {
      await deletePost.mutateAsync(post.id)
      showToast('Post excluido', 'success')
    } catch {
      showToast('Erro ao excluir', 'error')
    }
    setShowMenu(false)
  }

  return (
    <article className="bg-surface rounded-card border border-void-700/30">
      <div className="flex items-center gap-3 p-4 pb-0">
        <Link to={`/${profile.username}`}>
          <Avatar src={profile.avatar_url} alt={profile.display_name} size="md" />
        </Link>
        <div className="flex-1 min-w-0">
          <Link to={`/${profile.username}`} className="font-semibold text-sm text-void-50 hover:text-accent transition-colors">
            {profile.display_name}
          </Link>
          <Link to={`/${profile.username}`} className="block text-xs text-void-400 hover:text-void-300">
            @{profile.username}
          </Link>
        </div>
        <div className="flex items-center gap-2 text-xs text-void-400">
          <span>{formatRelativeTime(post.created_at)}</span>
          {userId === post.user_id && (
            <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)} className="p-1 rounded-lg hover:bg-surface-raised transition-colors">
                <MoreHorizontal size={16} />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-8 bg-surface-raised border border-void-700/50 rounded-xl shadow-xl py-1 min-w-[140px] z-10">
                  <button onClick={handleDelete} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-surface-overlay transition-colors">
                    <Trash2 size={14} />
                    Excluir
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-3">
        <p className="text-sm text-void-100 whitespace-pre-wrap break-words leading-relaxed">
          {post.content}
        </p>
      </div>

      {post.image_url && (
        <div className="px-4 pb-3">
          <img src={post.image_url} alt="Post" className="w-full rounded-xl object-cover max-h-[500px]" loading="lazy" />
        </div>
      )}

      <div className="flex items-center gap-6 px-4 py-3 border-t border-void-700/20">
        <button onClick={handleLike} className="flex items-center gap-1.5 text-sm group">
          <motion.div whileTap={{ scale: 1.3 }} transition={{ type: 'spring', stiffness: 400 }}>
            <Heart size={18} className={liked ? 'fill-red-500 text-red-500' : 'text-void-400 group-hover:text-red-400'} />
          </motion.div>
          <span className={liked ? 'text-red-400' : 'text-void-400'}>{formatNumber(likeCount)}</span>
        </button>
        <Link to={`/post/${post.id}`} className="flex items-center gap-1.5 text-sm text-void-400 hover:text-void-200 transition-colors">
          <MessageCircle size={18} />
          <span>{formatNumber(post.comment_count)}</span>
        </Link>
      </div>
    </article>
  )
}
