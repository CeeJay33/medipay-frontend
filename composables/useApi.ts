export const useApi = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth()

  const apiFetch = <T = any>(endpoint: string, opts: any = {}) => {
    const headers: Record<string, string> = {
      ...opts.headers,
    }

    if (token.value) {
      headers.Authorization = `Bearer ${token.value}`
    }

    return $fetch<T>(`${config.public.apiBase}${endpoint}`, {
      ...opts,
      headers,
    })
  }

  return { apiFetch }
}