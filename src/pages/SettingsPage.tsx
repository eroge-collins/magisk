import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'

export function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  )
}

function SettingsContent() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-4">
      <h1 className="text-xl font-bold text-void-50 mb-6">Configuracoes</h1>

      <div className="space-y-4">
        <div className="bg-surface rounded-card border border-void-700/30 p-4 space-y-3">
          <h2 className="text-sm font-semibold text-void-200 uppercase tracking-wider">Conta</h2>
          <Button variant="secondary" className="w-full justify-start" onClick={handleSignOut}>
            Sair da conta
          </Button>
        </div>

        <div className="bg-surface rounded-card border border-void-700/30 p-4 space-y-3">
          <h2 className="text-sm font-semibold text-void-200 uppercase tracking-wider">Sobre</h2>
          <p className="text-sm text-void-400">Magisk - Rede Social de Artes Ocultas</p>
          <p className="text-sm text-void-400">Versao 0.1.0</p>
        </div>
      </div>
    </div>
  )
}
