import { supabase } from '@/lib/supabase'
import type { LoginFormData, RegisterFormData } from '@/validations/auth'

export async function login(data: LoginFormData) {
  const { data: result, error } = await supabase.auth.signInWithPassword({
    email: data.email.trim().toLowerCase(),
    password: data.password,
  })
  if (error) throw new Error(error.message)
  return result
}

export async function register(data: RegisterFormData) {
  const { data: result, error } = await supabase.auth.signUp({
    email: data.email.trim().toLowerCase(),
    password: data.password,
    options: {
      data: {
        display_name: data.display_name,
        username: data.username,
      },
    },
  })
  if (error) throw new Error(error.message)
  return result
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw new Error(error.message)
  return session
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw new Error(error.message)
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase())
  if (error) throw new Error(error.message)
}

export function onAuthStateChange(callback: (userId: string | null) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user?.id ?? null)
  })
}
