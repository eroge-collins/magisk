import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Home, Search, PlusSquare, Bell, LogOut, Moon } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/hooks/useAuth'
import { APP_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function Header() {
  const { profile, isAuthenticated, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-void-700/30">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Moon size={24} className="text-gold" />
          <span className="text-xl font-bold text-void-50 tracking-tight hidden sm:block">{APP_NAME}</span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-void-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full h-9 pl-9 pr-3 bg-surface-raised rounded-full border border-void-700/50 text-sm text-void-50 placeholder:text-void-400 outline-none focus:border-accent transition-colors"
            />
          </div>
        </form>

        {isAuthenticated ? (
          <nav className="flex items-center gap-1">
            <NavLink to="/" icon={<Home size={22} />} currentPath={location.pathname} />
            <NavLink to="/explore" icon={<Search size={22} />} currentPath={location.pathname} />
            <NavLink to="/new" icon={<PlusSquare size={22} />} currentPath={location.pathname} />
            <NavLink to="/notifications" icon={<Bell size={22} />} currentPath={location.pathname} />
            <Link to={`/${profile?.username ?? ''}`} className="ml-1">
              <Avatar src={profile?.avatar_url} alt={profile?.display_name} size="sm" />
            </Link>
            <button onClick={signOut} className="ml-2 p-2 text-void-400 hover:text-void-100 transition-colors">
              <LogOut size={18} />
            </button>
          </nav>
        ) : (
          <nav className="flex items-center gap-2">
            <Link to="/login" className="text-sm text-void-200 hover:text-void-50 transition-colors px-3 py-1.5">
              Entrar
            </Link>
            <Link to="/register" className="text-sm bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-1.5 transition-colors">
              Criar conta
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}

function NavLink({ to, icon, currentPath }: { to: string; icon: React.ReactNode; currentPath: string }) {
  const isActive = currentPath === to

  return (
    <Link
      to={to}
      className={cn(
        'p-2 rounded-lg transition-colors',
        isActive ? 'text-accent' : 'text-void-300 hover:text-void-50 hover:bg-surface-raised',
      )}
    >
      {icon}
    </Link>
  )
}
