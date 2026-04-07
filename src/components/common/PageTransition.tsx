import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const MIN_DURATION = 1500
const FADE_DURATION = 300

export function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [showOverlay, setShowOverlay] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const isFirstRender = useRef(true)
  const childrenRef = useRef(children)
  const timersRef = useRef<number[]>([])

  childrenRef.current = children

  useEffect(() => {
    timersRef.current.forEach((t) => clearTimeout(t))
    timersRef.current = []

    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    setShowOverlay(true)
    setFadeOut(false)

    const swapTimer = window.setTimeout(() => {
      setDisplayChildren(childrenRef.current)
      setFadeOut(true)

      const fadeTimer = window.setTimeout(() => {
        setShowOverlay(false)
        setFadeOut(false)
      }, FADE_DURATION)

      timersRef.current.push(fadeTimer)
    }, MIN_DURATION)

    timersRef.current.push(swapTimer)

    return () => {
      timersRef.current.forEach((t) => clearTimeout(t))
      timersRef.current = []
    }
  }, [location.pathname])

  return (
    <div className="relative">
      <div>{displayChildren}</div>

      {showOverlay && (
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center bg-void-950 transition-opacity duration-300 ${
            fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="fixed top-0 left-0 right-0 h-[3px] bg-surface-raised overflow-hidden z-[101]">
            <div className="h-full bg-accent animate-loading-bar" />
          </div>

          <svg className="animate-spin h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      )}
    </div>
  )
}
