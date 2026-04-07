import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { updateProfileSchema, type UpdateProfileFormData } from '@/validations/profile'
import { useAuthStore } from '@/stores/auth.store'
import { showToast } from '@/lib/toast'
import * as profilesService from '@/services/profiles.service'

interface EditProfileProps {
  open: boolean
  onClose: () => void
}

export function EditProfile({ open, onClose }: EditProfileProps) {
  const profile = useAuthStore((s) => s.profile)
  const setProfile = useAuthStore((s) => s.setProfile)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      display_name: profile?.display_name ?? '',
      username: profile?.username ?? '',
      bio: profile?.bio ?? '',
      website: profile?.website ?? '',
      location: profile?.location ?? '',
    },
  })

  const onSubmit = async (data: UpdateProfileFormData) => {
    try {
      setSaving(true)
      const updated = await profilesService.updateProfile(data)
      setProfile(updated)
      showToast('Perfil atualizado', 'success')
      onClose()
    } catch {
      showToast('Erro ao atualizar perfil', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Editar perfil">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input {...register('display_name')} label="Nome" id="display_name" error={errors.display_name?.message} />
        <Input {...register('username')} label="Usuario" id="username" error={errors.username?.message} />
        <Textarea {...register('bio')} label="Bio" id="bio" error={errors.bio?.message} />
        <Input {...register('website')} label="Website" id="website" placeholder="https://" error={errors.website?.message} />
        <Input {...register('location')} label="Localizacao" id="location" error={errors.location?.message} />
        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={saving}>Salvar</Button>
        </div>
      </form>
    </Modal>
  )
}
