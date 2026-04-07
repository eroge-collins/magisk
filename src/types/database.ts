export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
          user_id?: string
        }
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
      }
      likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
      }
      notifications: {
        Row: {
          actor_id: string
          created_at: string
          id: string
          read: boolean | null
          reference_id: string | null
          type: Database['public']['Enums']['notification_type']
          user_id: string
        }
        Insert: {
          actor_id: string
          created_at?: string
          id?: string
          read?: boolean | null
          reference_id?: string | null
          type: Database['public']['Enums']['notification_type']
          user_id: string
        }
        Update: {
          actor_id?: string
          created_at?: string
          id?: string
          read?: boolean | null
          reference_id?: string | null
          type?: Database['public']['Enums']['notification_type']
          user_id?: string
        }
      }
      posts: {
        Row: {
          comment_count: number | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          like_count: number | null
          status: Database['public']['Enums']['post_status'] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          comment_count?: number | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          like_count?: number | null
          status?: Database['public']['Enums']['post_status'] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          comment_count?: number | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          like_count?: number | null
          status?: Database['public']['Enums']['post_status'] | null
          updated_at?: string
          user_id?: string
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          cover_url: string | null
          created_at: string
          display_name: string
          id: string
          interests: string[] | null
          is_private: boolean | null
          location: string | null
          updated_at: string
          username: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          cover_url?: string | null
          created_at?: string
          display_name: string
          id: string
          interests?: string[] | null
          is_private?: boolean | null
          location?: string | null
          updated_at?: string
          username: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          cover_url?: string | null
          created_at?: string
          display_name?: string
          id?: string
          interests?: string[] | null
          is_private?: boolean | null
          location?: string | null
          updated_at?: string
          username?: string
          website?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { '': string }; Returns: string[] }
    }
    Enums: {
      notification_type: 'like' | 'comment' | 'follow'
      post_status: 'active' | 'archived' | 'deleted'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export const Constants = {
  public: {
    Enums: {
      notification_type: ['like', 'comment', 'follow'] as const,
      post_status: ['active', 'archived', 'deleted'] as const,
    },
  },
} as const
