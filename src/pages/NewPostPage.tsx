import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Image, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { useCreatePost } from '@/hooks/usePosts'
import { useMediaUpload } from '@/hooks/useMediaUpload'
import { createPostSchema, type CreatePostFormData } from '@/validations/post'
import { showToast } from '@/lib/toast'
import { MAX_POST_LENGTH } from '@/lib/constants'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'

export function NewPostPage() {
  return (
    <ProtectedRoute>
      <NewPostContent />
    </ProtectedRoute>
  )
}

function NewPostContent() {
  const navigate = useNavigate()
  const createPost = useCreatePost()
  const { uploading, preview, upload, setPreview } = useMediaUpload({ type: 'post' })
  const fileRef = useRef<HTMLInputElement>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
  })

  const contentLength = watch('content')?.length ?? 0

  const onSubmit = async (data: CreatePostFormData) => {
    try {
      let imageUrl: string | undefined
      if (imageFile) imageUrl = await upload(imageFile)
      await createPost.mutateAsync({ content: data.content, imageUrl })
      showToast('Post criado', 'success')
      navigate('/')
    } catch {
      showToast('Erro ao criar post', 'error')
    }
  }

  return (
    <div className="max-w-feed mx-auto px-4 py-4">
      <h1 className="text-xl font-bold text-void-50 mb-4">Novo post</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Textarea
          {...register('content')}
          placeholder="Compartilhe algo mistico..."
          className="min-h-[120px]"
          error={errors.content?.message}
        />

        <div className="flex items-center justify-between">
          <span className={`text-xs ${contentLength > MAX_POST_LENGTH ? 'text-red-400' : 'text-void-400'}`}>
            {contentLength}/{MAX_POST_LENGTH}
          </span>
        </div>

        {preview && (
          <div className="relative">
            <img src={preview} alt="Preview" className="max-h-80 rounded-xl object-cover" />
            <button
              type="button"
              onClick={() => { setPreview(null); setImageFile(null) }}
              className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
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
            onChange={(e) => {
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
            }}
            className="hidden"
          />

          <div className="flex-1" />

          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="submit" loading={createPost.isPending || uploading}>
            Publicar
          </Button>
        </div>
      </form>
    </div>
  )
}
