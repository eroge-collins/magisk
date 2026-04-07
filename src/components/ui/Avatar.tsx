import { cn } from '@/lib/utils'

interface AvatarProps {
  src?: string | null
  alt?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeMap = {
  xs: 'h-6 w-6',
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
  xl: 'h-20 w-20',
}

export function Avatar({ src, alt = '', size = 'md', className }: AvatarProps) {
  return (
    <div
      className={cn(
        'relative flex-shrink-0 overflow-hidden rounded-full bg-surface-raised',
        sizeMap[size],
        className,
      )}
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-accent/20 text-accent font-semibold">
          {alt?.charAt(0)?.toUpperCase() || '?'}
        </div>
      )}
    </div>
  )
}
