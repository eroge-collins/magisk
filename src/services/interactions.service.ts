import { supabase } from '@/lib/supabase'
import { PAGINATION } from '@/lib/constants'
import type { Comment, Notification } from '@/types'

export async function getComments(postId: string, page = 0) {
  const from = page * PAGINATION.COMMENTS_PAGE_SIZE
  const to = from + PAGINATION.COMMENTS_PAGE_SIZE - 1

  const { data, error } = await supabase
    .from('comments')
    .select('*, profiles(*)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
    .range(from, to)

  if (error) throw new Error(error.message)
  return data as Comment[]
}

export async function createComment(postId: string, content: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Nao autenticado')

  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      user_id: user.id,
      content,
    })
    .select('*, profiles(*)')
    .single()

  if (error) throw new Error(error.message)
  return data as Comment
}

export async function deleteComment(commentId: string) {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)

  if (error) throw new Error(error.message)
}

export async function getNotifications(page = 0) {
  const from = page * PAGINATION.NOTIFICATIONS_PAGE_SIZE
  const to = from + PAGINATION.NOTIFICATIONS_PAGE_SIZE - 1

  const { data, error } = await supabase
    .from('notifications')
    .select('*, actor:profiles!notifications_actor_id_fkey(*)')
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw new Error(error.message)
  return data as Notification[]
}

export async function markNotificationsRead() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Nao autenticado')

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', user.id)
    .eq('read', false)

  if (error) throw new Error(error.message)
}
