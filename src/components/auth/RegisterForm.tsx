import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Moon } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { registerSchema, type RegisterFormData } from '@/validations/auth'
import * as authService from '@/services/auth.service'
import { showToast } from '@/lib/toast'
import { APP_NAME } from '@/lib/constants'

export function RegisterForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true)
      await authService.register(data)
      showToast('Conta criada com sucesso', 'success')
      navigate('/')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao criar conta', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-void-950 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Moon size={40} className="text-gold mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-void-50 tracking-tight">{APP_NAME}</h1>
          <p className="text-void-400 mt-2 text-sm">Junte-se a comunidade mistica</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register('display_name')} label="Nome" id="display_name" placeholder="Seu nome" error={errors.display_name?.message} />
          <Input {...register('username')} label="Usuario" id="username" placeholder="seu_usuario" error={errors.username?.message} />
          <Input {...register('email')} label="Email" id="email" type="email" placeholder="seu@email.com" error={errors.email?.message} />
          <Input {...register('password')} label="Senha" id="password" type="password" placeholder="Min. 6 caracteres" error={errors.password?.message} />
          <Input {...register('confirmPassword')} label="Confirmar senha" id="confirmPassword" type="password" placeholder="Repita a senha" error={errors.confirmPassword?.message} />
          <Button type="submit" className="w-full" loading={loading}>Criar conta</Button>
        </form>

        <p className="text-center text-sm text-void-400 mt-6">
          Ja tem conta?{' '}
          <Link to="/login" className="text-accent hover:text-accent-hover font-medium transition-colors">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
