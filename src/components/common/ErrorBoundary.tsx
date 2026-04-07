import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
          <h2 className="text-xl font-semibold text-void-100 mb-2">Algo deu errado</h2>
          <p className="text-void-400 mb-4">Tente recarregar a pagina</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-accent rounded-lg text-white hover:bg-accent-hover transition-colors"
          >
            Recarregar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
