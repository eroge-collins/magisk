import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-void-200">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full h-10 px-3 bg-surface rounded-lg border text-void-50 placeholder:text-void-400',
            'transition-colors duration-200 outline-none',
            'focus:border-accent focus:ring-1 focus:ring-accent/30',
            error ? 'border-red-500' : 'border-void-700/50',
            className,
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        {helperText && !error && <p className="text-sm text-void-400">{helperText}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'
export { Input }
