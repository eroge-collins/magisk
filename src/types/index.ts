export interface Profile {
  id: string
  username: string
  display_name: string
  bio: string
  avatar_url: string | null
  cover_url: string | null
  website: string | null
  location: string | null
  interests: string[]
  is_private: boolean
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  user_id: string
  content: string
  image_url: string | null
  status: 'active' | 'archived' | 'deleted'
  like_count: number
  comment_count: number
  created_at: string
  updated_at: string
  profiles?: Profile
  is_liked?: boolean
}

export interface Comment {
  id: string
  user_id: string
  post_id: string
  content: string
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Like {
  id: string
  user_id: string
  post_id: string
  created_at: string
}

export interface Follow {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  actor_id: string
  type: 'like' | 'comment' | 'follow'
  reference_id: string | null
  read: boolean
  created_at: string
  actor?: Profile
}

export interface ProfileWithCounts extends Profile {
  follower_count: number
  following_count: number
  post_count: number
  is_following: boolean
}

export type NotificationType = Notification['type']
export type PostStatus = Post['status']
