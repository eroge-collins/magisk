export const APP_NAME = 'Magisk'

export const MAX_POST_LENGTH = 2000
export const MAX_COMMENT_LENGTH = 1000
export const MAX_BIO_LENGTH = 500
export const MAX_USERNAME_LENGTH = 30
export const MIN_USERNAME_LENGTH = 3

export const AVATAR_MAX_SIZE = 2 * 1024 * 1024
export const COVER_MAX_SIZE = 4 * 1024 * 1024
export const POST_IMAGE_MAX_SIZE = 5 * 1024 * 1024

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export const STORAGE_BUCKETS = {
  avatars: 'avatars',
  covers: 'covers',
  posts: 'posts',
} as const

export const PAGINATION = {
  FEED_PAGE_SIZE: 20,
  COMMENTS_PAGE_SIZE: 15,
  PROFILES_PAGE_SIZE: 20,
  NOTIFICATIONS_PAGE_SIZE: 20,
} as const
