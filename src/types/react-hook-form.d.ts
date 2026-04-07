declare module 'react-hook-form' {
  type FieldValues = Record<string, any>
  
  interface UseFormReturn<T extends FieldValues = FieldValues> {
    register: any
    handleSubmit: (fn: (data: T) => any) => any
    watch: (name?: string) => any
    formState: { errors: any; isSubmitting: boolean; isPending: boolean }
    reset: (values?: Partial<T>) => void
    setValue: (name: string, value: any) => void
    getValues: () => T
    control: any
  }

  interface UseFormProps<T extends FieldValues = FieldValues> {
    resolver?: any
    defaultValues?: Partial<T>
    mode?: string
  }

  export function useForm<T extends FieldValues = FieldValues>(props?: UseFormProps<T>): UseFormReturn<T>
}
