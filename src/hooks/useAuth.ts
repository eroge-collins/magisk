import { useAuthStore } from '@/stores/auth.store'

export function useAuth() {
  const userId = useAuthStore((s) => s.userId)
  const profile = useAuthStore((s) => s.profile)
  const loading = useAuthStore((s) => s.loading)
  const signOut = useAuthStore((s) => s.signOut)

  return {
    userId,
    profile,
    loading,
    isAuthenticated: !!userId,
    signOut,
  }
}
