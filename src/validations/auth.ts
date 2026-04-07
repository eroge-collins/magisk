import { z } from 'zod'
import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from '@/lib/constants'

export const loginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(6, 'Senha deve ter no minimo 6 caracteres'),
})

export const registerSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(6, 'Senha deve ter no minimo 6 caracteres'),
  confirmPassword: z.string(),
  display_name: z.string().min(1, 'Nome obrigatorio').max(50, 'Nome muito longo'),
  username: z
    .string()
    .min(MIN_USERNAME_LENGTH, `Minimo ${MIN_USERNAME_LENGTH} caracteres`)
    .max(MAX_USERNAME_LENGTH, `Maximo ${MAX_USERNAME_LENGTH} caracteres`)
    .regex(/^[a-zA-Z0-9_]+$/, 'Apenas letras, numeros e _'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas nao conferem',
  path: ['confirmPassword'],
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
