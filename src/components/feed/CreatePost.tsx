import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Image, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/hooks/useAuth'
import { useCreatePost } from '@/hooks/usePosts'
import { useMediaUpload } from '@/hooks/useMediaUpload'
import { createPostSchema, type CreatePostFormData } from '@/validations/post'
import { showToast } from '@/lib/toast'
import { MAX_POST_LENGTH } from '@/lib/constants'

export function CreatePost() {
  const { profile } = useAuth()
  const createPost = useCreatePost()
  const { uploading, preview, upload, setPreview } = useMediaUpload({ type: 'post' })
  const fileRef = useRef<HTMLInputElement>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { content: '' },
  })

  const contentLength = watch('content')?.length ?? 0

  const onSubmit = async (data: CreatePostFormData) => {
    try {
      let imageUrl: string | undefined
      if (imageFile) {
        imageUrl = await upload(imageFile)
      }
      await createPost.mutateAsync({ content: data.content, imageUrl })
      reset()
      setPreview(null)
      setImageFile(null)
      showToast('Post criado com sucesso', 'success')
    } catch {
      showToast('Erro ao criar post', 'error')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      showToast('Imagem muito grande (max 5MB)', 'error')
      return
    }

    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="bg-surface rounded-card border border-void-700/30 p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-3">
          <Avatar src={profile?.avatar_url} alt={profile?.display_name} />
          <div className="flex-1">
            <Textarea
              {...register('content')}
              placeholder="Compartilhe algo mistico..."
              className="min-h-[60px] bg-transparent border-none p-0 focus:ring-0 focus:border-none"
              error={errors.content?.message}
            />
          </div>
        </div>

        {preview && (
          <div className="relative mt-3 pl-[3.25rem]">
            <img src={preview} alt="Preview" className="max-h-80 rounded-xl object-cover" />
            <button
              type="button"
              onClick={() => { setPreview(null); setImageFile(null) }}
              className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-black/80"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-void-700/20">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="p-2 text-void-400 hover:text-accent rounded-lg hover:bg-surface-raised transition-colors"
            >
              <Image size={20} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-xs ${contentLength > MAX_POST_LENGTH ? 'text-red-400' : 'text-void-400'}`}>
              {contentLength}/{MAX_POST_LENGTH}
            </span>
            <Button type="submit" size="sm" loading={createPost.isPending || uploading}>
              Publicar
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
