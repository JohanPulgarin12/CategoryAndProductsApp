import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:44391'

function toCamel(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(toCamel)
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([k, v]) => {
        const keyMap: Record<string, string> = {
          'SKU': 'sku',
          'Id': 'id',
        }
        const newKey = keyMap[k] ?? (k.charAt(0).toLowerCase() + k.slice(1))
        return [newKey, toCamel(v)]
      })
    )
  }
  return obj
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => {
    response.data = toCamel(response.data)
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data)
    }
    return Promise.reject(error)
  }
)

export default api
