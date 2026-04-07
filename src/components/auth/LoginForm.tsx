import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Moon } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { loginSchema, type LoginFormData } from '@/validations/auth'
import * as authService from '@/services/auth.service'
import { showToast } from '@/lib/toast'
import { APP_NAME } from '@/lib/constants'

export function LoginForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true)
      await authService.login(data)
      showToast('Bem-vindo de volta', 'success')
      navigate('/')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao entrar', 'error')
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
          <p className="text-void-400 mt-2 text-sm">Entre para a comunidade oculta</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register('email')} label="Email" id="email" type="email" placeholder="seu@email.com" error={errors.email?.message} />
          <Input {...register('password')} label="Senha" id="password" type="password" placeholder="Sua senha" error={errors.password?.message} />
          <Button type="submit" className="w-full" loading={loading}>Entrar</Button>
        </form>

        <p className="text-center text-sm text-void-400 mt-6">
          Nao tem conta?{' '}
          <Link to="/register" className="text-accent hover:text-accent-hover font-medium transition-colors">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}
