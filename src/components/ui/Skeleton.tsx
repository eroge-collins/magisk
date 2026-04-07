export function Skeleton({ className }: { className?: string }) {
  return (
    <div className="relative overflow-hidden bg-surface-raised rounded-lg">
      <div className={className} />
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-void-700/20 to-transparent" />
    </div>
  )
}

export function PostSkeleton() {
  return (
    <div className="bg-surface rounded-card border border-void-700/30 p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 !rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-2 w-20" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-4 pt-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  )
}
