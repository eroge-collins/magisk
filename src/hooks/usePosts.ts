import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as postsService from '@/services/posts.service'

export function usePost(postId: string, userId?: string) {
  return useQuery({
    queryKey: ['post', postId, userId],
    queryFn: () => postsService.getPostById(postId, userId),
    enabled: !!postId,
  })
}

export function useFeed(userId?: string) {
  return useInfiniteQuery({
    queryKey: ['feed', userId],
    queryFn: ({ pageParam = 0 }) => postsService.getFeedPosts(pageParam as number, userId),
    getNextPageParam: (lastPage, allPages) =>
      lastPage && lastPage.length > 0 ? allPages.length : undefined,
    initialPageParam: 0,
  })
}

export function useUserPosts(userId: string) {
  return useInfiniteQuery({
    queryKey: ['userPosts', userId],
    queryFn: ({ pageParam = 0 }) => postsService.getUserPosts(userId, pageParam as number),
    getNextPageParam: (lastPage, allPages) =>
      lastPage && lastPage.length > 0 ? allPages.length : undefined,
    initialPageParam: 0,
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ content, imageUrl }: { content: string; imageUrl?: string }) =>
      postsService.createPost(content, imageUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] })
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => postsService.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] })
    },
  })
}

export function useToggleLike() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, isLiked }: { postId: string; isLiked: boolean }) =>
      postsService.toggleLike(postId, isLiked),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] })
    },
  })
}
