type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

const toastListeners: Array<(toast: Toast) => void> = []

export function showToast(message: string, type: ToastType = 'info') {
  const id = Math.random().toString(36).substring(2)
  toastListeners.forEach((listener) => listener({ id, message, type }))
}

export function addToastListener(listener: (toast: Toast) => void) {
  toastListeners.push(listener)
  return () => {
    const index = toastListeners.indexOf(listener)
    if (index > -1) toastListeners.splice(index, 1)
  }
}

export type { ToastType, Toast }
