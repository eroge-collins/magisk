import { z } from 'zod'
import { MAX_POST_LENGTH, MAX_COMMENT_LENGTH } from '@/lib/constants'

export const createPostSchema = z.object({
  content: z.string().min(1, 'Post nao pode estar vazio').max(MAX_POST_LENGTH, `Maximo ${MAX_POST_LENGTH} caracteres`),
})

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Comentario nao pode estar vazio').max(MAX_COMMENT_LENGTH, `Maximo ${MAX_COMMENT_LENGTH} caracteres`),
})

export type CreatePostFormData = z.infer<typeof createPostSchema>
export type CreateCommentFormData = z.infer<typeof createCommentSchema>
