import { Feed } from '@/components/feed/Feed'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'

export function FeedPage() {
  return (
    <ProtectedRoute>
      <Feed />
    </ProtectedRoute>
  )
}
