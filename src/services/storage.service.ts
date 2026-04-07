import { supabase } from '@/lib/supabase'
import { STORAGE_BUCKETS, ALLOWED_IMAGE_TYPES, AVATAR_MAX_SIZE, COVER_MAX_SIZE, POST_IMAGE_MAX_SIZE } from '@/lib/constants'
import { generateFilePath, extractFileExtension } from '@/lib/utils'

function validateImage(file: File, maxSize: number) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Formato invalido. Use JPEG, PNG, WEBP ou GIF.')
  }
  if (file.size > maxSize) {
    throw new Error(`Arquivo muito grande. Maximo ${Math.round(maxSize / 1024 / 1024)}MB.`)
  }
}

export async function uploadAvatar(file: File) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Nao autenticado')

  validateImage(file, AVATAR_MAX_SIZE)
  const ext = extractFileExtension(file.name)
  const path = generateFilePath(user.id, ext)

  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.avatars)
    .upload(path, file, { upsert: true })

  if (error) throw new Error(error.message)

  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKETS.avatars)
    .getPublicUrl(path)

  return publicUrl
}

export async function uploadCover(file: File) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Nao autenticado')

  validateImage(file, COVER_MAX_SIZE)
  const ext = extractFileExtension(file.name)
  const path = generateFilePath(user.id, ext)

  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.covers)
    .upload(path, file, { upsert: true })

  if (error) throw new Error(error.message)

  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKETS.covers)
    .getPublicUrl(path)

  return publicUrl
}

export async function uploadPostImage(file: File) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Nao autenticado')

  validateImage(file, POST_IMAGE_MAX_SIZE)
  const ext = extractFileExtension(file.name)
  const path = generateFilePath(user.id, ext)

  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.posts)
    .upload(path, file)

  if (error) throw new Error(error.message)

  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKETS.posts)
    .getPublicUrl(path)

  return publicUrl
}

export async function deletePostImage(path: string) {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.posts)
    .remove([path])

  if (error) throw new Error(error.message)
}
