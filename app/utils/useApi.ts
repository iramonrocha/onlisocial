const baseURL = process.env.API_BASE_URL || '/api'

export const useApi = () => {
  const apiFetch = async <T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any
  ): Promise<T> => {
    const url = `${baseURL}${endpoint}`
    const response = await $fetch(url, {
      method,
      ...(data && method !== 'GET' ? { body: data } : {}),
      headers: {
        'Content-Type': 'application/json'
      }
    }) as T
    return response
  }

  return {
    get: <T>(endpoint: string) => apiFetch<T>('GET', endpoint),
    post: <T>(endpoint: string, data: Record<string, any>) => apiFetch<T>('POST', endpoint, data),
    put: <T>(endpoint: string, data: Record<string, any>) => apiFetch<T>('PUT', endpoint, data),
    delete: <T>(endpoint: string) => apiFetch<T>('DELETE', endpoint)
  }
}