declare module 'framer-motion' {
  import { type ComponentType, type Ref } from 'react'

  interface MotionProps {
    initial?: any
    animate?: any
    exit?: any
    whileTap?: any
    whileHover?: any
    transition?: any
    layout?: boolean
    layoutId?: string
    ref?: Ref<any>
    className?: string
    onClick?: (e: any) => void
    children?: any
    key?: string
  }

  export const motion: {
    div: ComponentType<MotionProps>
    button: ComponentType<MotionProps>
    span: ComponentType<MotionProps>
    [key: string]: ComponentType<MotionProps>
  }

  export function AnimatePresence(props: { children: any; mode?: string }): any
}
