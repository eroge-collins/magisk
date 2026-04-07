import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { addToastListener, type Toast, type ToastType } from '@/lib/toast'

export { showToast } from '@/lib/toast'
export type { ToastType } from '@/lib/toast'

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (toast: Toast) => {
      setToasts((prev) => [...prev, toast])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id))
      }, 4000)
    }
    return addToastListener(listener)
  }, [])

  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle size={18} className="text-green-400" />,
    error: <AlertCircle size={18} className="text-red-400" />,
    info: <Info size={18} className="text-accent" />,
  }

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm',
              'bg-surface-raised/95 border-void-700/50',
            )}
          >
            {icons[toast.type]}
            <span className="text-sm text-void-100 flex-1">{toast.message}</span>
            <button onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))} className="text-void-400 hover:text-void-200">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
