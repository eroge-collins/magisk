import { useLocation } from 'react-router-dom'
import { Header } from './Header'
import { MobileNav } from './MobileNav'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation()
  const isAuthPage = ['/login', '/register'].includes(location.pathname)

  return (
    <div className="min-h-[100dvh] bg-void-950">
      {!isAuthPage && <Header />}
      <main className={!isAuthPage ? 'pt-16 pb-16 md:pb-0' : ''}>
        {children}
      </main>
      {!isAuthPage && <MobileNav />}
    </div>
  )
}
