import { type TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-void-200">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            'w-full min-h-[80px] px-3 py-2 bg-surface rounded-lg border text-void-50 placeholder:text-void-400',
            'transition-colors duration-200 outline-none resize-y',
            'focus:border-accent focus:ring-1 focus:ring-accent/30',
            error ? 'border-red-500' : 'border-void-700/50',
            className,
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
export { Textarea }
