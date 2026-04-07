import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'

interface AuthState {
  userId: string | null
  profile: Profile | null
  loading: boolean
  setProfile: (profile: Profile | null) => void
  signOut: () => Promise<void>
}

let initialized = false

async function fetchProfile(userId: string) {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  useAuthStore.setState({ profile: (data as Profile) ?? null })
}

function initAuth() {
  if (initialized) return
  initialized = true

  useAuthStore.setState({ loading: true })

  supabase.auth.getSession().then(({ data: { session } }) => {
    const userId = session?.user?.id ?? null
    useAuthStore.setState({ userId, loading: false })
    if (userId) fetchProfile(userId)
  })

  supabase.auth.onAuthStateChange((_event, session) => {
    const userId = session?.user?.id ?? null
    useAuthStore.setState({ userId })
    if (userId) {
      fetchProfile(userId)
    } else {
      useAuthStore.setState({ profile: null })
    }
  })
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  profile: null,
  loading: true,

  setProfile: (profile) => set({ profile }),

  signOut: async () => {
    await supabase.auth.signOut()
    set({ userId: null, profile: null })
  },
}))

initAuth()
