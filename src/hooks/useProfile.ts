import { useQuery, useMutation } from '@tanstack/react-query'
import * as profilesService from '@/services/profiles.service'

export function useProfile(username: string, currentUserId?: string) {
  return useQuery({
    queryKey: ['profile', username, currentUserId],
    queryFn: () => profilesService.getProfileByUsername(username, currentUserId),
    enabled: !!username,
  })
}

export function useProfileById(userId: string, currentUserId?: string) {
  return useQuery({
    queryKey: ['profileById', userId, currentUserId],
    queryFn: () => profilesService.getProfileById(userId, currentUserId),
    enabled: !!userId,
  })
}

export function useSearchProfiles(query: string) {
  return useQuery({
    queryKey: ['searchProfiles', query],
    queryFn: () => profilesService.searchProfiles(query),
    enabled: !!query.trim(),
  })
}

export function useToggleFollow() {
  return useMutation({
    mutationFn: ({ targetUserId, isFollowing }: { targetUserId: string; isFollowing: boolean }) =>
      profilesService.toggleFollow(targetUserId, isFollowing),
  })
}
