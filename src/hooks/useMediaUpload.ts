import { useState, useCallback } from 'react'
import { uploadPostImage, uploadAvatar, uploadCover } from '@/services/storage.service'

interface UseMediaUploadOptions {
  type: 'post' | 'avatar' | 'cover'
}

export function useMediaUpload({ type }: UseMediaUploadOptions) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const upload = useCallback(
    async (file: File): Promise<string> => {
      setUploading(true)
      try {
        const url = await (type === 'avatar'
          ? uploadAvatar(file)
          : type === 'cover'
            ? uploadCover(file)
            : uploadPostImage(file))
        setPreview(url)
        return url
      } finally {
        setUploading(false)
      }
    },
    [type]
  )

  const setPreviewUrl = useCallback((url: string | null) => {
    setPreview(url)
  }, [])

  return { uploading, preview, upload, setPreview: setPreviewUrl }
}
