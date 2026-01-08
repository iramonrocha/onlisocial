import type { UserResponse } from '@/types/UserResponse'

export const useAuthUser = () => {
  const user = ref<UserResponse | null>(null)

  const error = ref<Error | null>(null)
  const pending = ref(false)

  const fetchUser = async () => {
    pending.value = true
    error.value = null

    try {
      const res = await useApi().get<UserResponse>('/me')
      user.value = res
    } catch (err: any) {
      user.value = null
      error.value = err
    } finally {
      pending.value = false
    }
  }

  return {
    user,
    error,
    pending,
    fetchUser
  }
}