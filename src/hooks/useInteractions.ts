import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as interactionsService from '@/services/interactions.service'

export function useComments(postId: string) {
  return useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: ({ pageParam = 0 }) => interactionsService.getComments(postId, pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage && lastPage.length > 0 ? allPages.length : undefined,
    initialPageParam: 0,
  })
}

export function useCreateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) =>
      interactionsService.createComment(postId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] })
      queryClient.invalidateQueries({ queryKey: ['feed'] })
    },
  })
}

export function useDeleteComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: interactionsService.deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
      queryClient.invalidateQueries({ queryKey: ['feed'] })
    },
  })
}

export function useNotifications() {
  return useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: ({ pageParam = 0 }) => interactionsService.getNotifications(pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage && lastPage.length > 0 ? allPages.length : undefined,
    initialPageParam: 0,
  })
}

export function useMarkNotificationsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: interactionsService.markNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
