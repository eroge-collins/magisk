import { Link, useLocation } from 'react-router-dom'
import { Home, Search, PlusSquare, Bell, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

export function MobileNav() {
  const { isAuthenticated, profile } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) return null

  const links = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/explore', icon: Search, label: 'Explorar' },
    { to: '/new', icon: PlusSquare, label: 'Criar' },
    { to: '/notifications', icon: Bell, label: 'Notificacoes' },
    { to: `/${profile?.username ?? ''}`, icon: User, label: 'Perfil' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-xl border-t border-void-700/30 md:hidden">
      <div className="flex items-center justify-around h-14">
        {links.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors',
                isActive ? 'text-accent' : 'text-void-400',
              )}
            >
              <Icon size={22} />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
