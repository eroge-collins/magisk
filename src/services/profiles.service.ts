import { supabase } from '@/lib/supabase'
import { PAGINATION } from '@/lib/constants'
import type { Profile, ProfileWithCounts } from '@/types'

export async function getProfileByUsername(username: string, currentUserId?: string): Promise<ProfileWithCounts | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (error) throw new Error(error.message)
  if (!data) return null

  const profile = data as Profile
  return enrichProfile(profile, currentUserId)
}

export async function getProfileById(userId: string, currentUserId?: string): Promise<ProfileWithCounts | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw new Error(error.message)
  if (!data) return null

  return enrichProfile(data as Profile, currentUserId)
}

async function enrichProfile(profile: Profile, currentUserId?: string): Promise<ProfileWithCounts> {
  const [followerRes, followingRes, postRes] = await Promise.all([
    supabase.from('follows').select('id', { count: 'exact', head: true }).eq('following_id', profile.id),
    supabase.from('follows').select('id', { count: 'exact', head: true }).eq('follower_id', profile.id),
    supabase.from('posts').select('id', { count: 'exact', head: true }).eq('user_id', profile.id).eq('status', 'active'),
  ])

  let is_following = false
  if (currentUserId && currentUserId !== profile.id) {
    const { data: followData } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', currentUserId)
      .eq('following_id', profile.id)
      .maybeSingle()
    is_following = !!followData
  }

  return {
    ...profile,
    follower_count: followerRes.count ?? 0,
    following_count: followingRes.count ?? 0,
    post_count: postRes.count ?? 0,
    is_following,
  }
}

export async function updateProfile(updates: Partial<Profile>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Nao autenticado')

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Profile
}

export async function toggleFollow(targetUserId: string, isFollowing: boolean) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Nao autenticado')

  if (isFollowing) {
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId)
    if (error) throw new Error(error.message)
    return false
  }

  const { error } = await supabase
    .from('follows')
    .insert({ follower_id: user.id, following_id: targetUserId })
  if (error) throw new Error(error.message)
  return true
}

export async function searchProfiles(query: string, page = 0) {
  const from = page * PAGINATION.PROFILES_PAGE_SIZE
  const to = from + PAGINATION.PROFILES_PAGE_SIZE - 1

  const sanitized = query.replace(/[%_,.]/g, '')
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`username.ilike.%${sanitized}%,display_name.ilike.%${sanitized}%`)
    .range(from, to)

  if (error) throw new Error(error.message)
  return data as Profile[]
}
