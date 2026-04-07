import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MainLayout } from '@/components/layout/MainLayout'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { ToastContainer } from '@/components/ui/Toast'
import { FeedPage } from '@/pages/FeedPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { ExplorePage } from '@/pages/ExplorePage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { PostPage } from '@/pages/PostPage'
import { NewPostPage } from '@/pages/NewPostPage'
import { NotificationsPage } from '@/pages/NotificationsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<FeedPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/:username" element={<ProfilePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/new" element={<NewPostPage />} />
              <Route path="/post/:postId" element={<PostPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </MainLayout>
          <ToastContainer />
        </BrowserRouter>
      </ErrorBoundary>
    </QueryClientProvider>
  )
}
