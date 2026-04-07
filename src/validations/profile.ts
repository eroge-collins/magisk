import { z } from 'zod'
import { MAX_BIO_LENGTH, MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from '@/lib/constants'

export const updateProfileSchema = z.object({
  display_name: z.string().min(1, 'Nome obrigatorio').max(50, 'Nome muito longo'),
  username: z
    .string()
    .min(MIN_USERNAME_LENGTH, `Minimo ${MIN_USERNAME_LENGTH} caracteres`)
    .max(MAX_USERNAME_LENGTH, `Maximo ${MAX_USERNAME_LENGTH} caracteres`)
    .regex(/^[a-zA-Z0-9_]+$/, 'Apenas letras, numeros e _'),
  bio: z.string().max(MAX_BIO_LENGTH, `Maximo ${MAX_BIO_LENGTH} caracteres`).default(''),
  website: z.string().url('URL invalida').or(z.literal('')).default(''),
  location: z.string().max(100, 'Localizacao muito longa').default(''),
})

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>
