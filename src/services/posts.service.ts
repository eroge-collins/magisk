import { supabase } from '@/lib/supabase'
import { PAGINATION } from '@/lib/constants'
import type { Post } from '@/types'

export async function getFeedPosts(page = 0, userId?: string) {
  const from = page * PAGINATION.FEED_PAGE_SIZE
  const to = from + PAGINATION.FEED_PAGE_SIZE - 1

  const query = supabase
    .from('posts')
    .select('*, profiles(*)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .range(from, to)

  const { data, error } = await query
  if (error) throw new Error(error.message)

  if (!userId || !data?.length) return data as Post[]

  const postIds = data.map((p) => p.id)
  const { data: likes } = await supabase
    .from('likes')
    .select('post_id')
    .eq('user_id', userId)
    .in('post_id', postIds)

  const likedIds = new Set(likes?.map((l) => l.post_id))
  return data.map((post) => ({
    ...post,
    is_liked: likedIds.has(post.id),
  })) as Post[]
}

export async function getPostById(postId: string, userId?: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(*)')
    .eq('id', postId)
    .single()

  if (error) throw new Error(error.message)
  if (!data) return null

  let is_liked = false
  if (userId) {
    const { data: like } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle()
    is_liked = !!like
  }

  return { ...data, is_liked } as Post
}

export async function getUserPosts(userId: string, page = 0) {
  const from = page * PAGINATION.FEED_PAGE_SIZE
  const to = from + PAGINATION.FEED_PAGE_SIZE - 1

  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(*)')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw new Error(error.message)
  return data as Post[]
}

export async function createPost(content: string, imageUrl?: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Nao autenticado')

  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      content,
      image_url: imageUrl ?? null,
    })
    .select('*, profiles(*)')
    .single()

  if (error) throw new Error(error.message)
  return data as Post
}

export async function deletePost(postId: string) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)

  if (error) throw new Error(error.message)
}

export async function toggleLike(postId: string, isLiked: boolean) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Nao autenticado')

  if (isLiked) {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user.id)
    if (error) throw new Error(error.message)
    return false
  }

  const { error } = await supabase
    .from('likes')
    .insert({ post_id: postId, user_id: user.id })
  if (error) throw new Error(error.message)
  return true
}
