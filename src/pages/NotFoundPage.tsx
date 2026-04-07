import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[80dvh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-void-200 mb-2">404</h1>
      <p className="text-void-400 mb-6">Pagina nao encontrada</p>
      <Button variant="secondary" onClick={() => navigate('/')}>
        <ArrowLeft size={16} className="mr-2" />
        Voltar ao inicio
      </Button>
    </div>
  )
}
