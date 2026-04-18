import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { ApiError, ApiResponse } from '@/types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// ── Token access (set by auth-store after hydration) ──

let getAccessToken: (() => string | null) | null = null
let getRefreshToken: (() => string | null) | null = null
let onTokenRefreshed: ((access: string, refresh: string) => void) | null = null
let onAuthFailed: (() => void) | null = null

export function setTokenAccessors(opts: {
  getAccess: () => string | null
  getRefresh: () => string | null
  onRefreshed: (access: string, refresh: string) => void
  onFailed: () => void
}) {
  getAccessToken = opts.getAccess
  getRefreshToken = opts.getRefresh
  onTokenRefreshed = opts.onRefreshed
  onAuthFailed = opts.onFailed
}

// ── Request interceptor: attach bearer token ──

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken?.()
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response interceptor: 401 → refresh → retry ──

let isRefreshing = false
let failedQueue: { resolve: (v: unknown) => void; reject: (e: unknown) => void; config: InternalAxiosRequestConfig }[] = []

function processQueue(error: unknown) {
  failedQueue.forEach(({ reject }) => reject(error))
  failedQueue = []
}

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = getRefreshToken?.()
      if (!refreshToken) {
        onAuthFailed?.()
        return Promise.reject(normalizeError(error))
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        })

        const newAccess = data.data.access_token
        const newRefresh = data.data.refresh_token
        onTokenRefreshed?.(newAccess, newRefresh)

        // Retry queued requests
        failedQueue.forEach(({ resolve, config }) => {
          config.headers.Authorization = `Bearer ${newAccess}`
          resolve(apiClient(config))
        })
        failedQueue = []

        originalRequest.headers.Authorization = `Bearer ${newAccess}`
        return apiClient(originalRequest)
      } catch {
        processQueue(error)
        onAuthFailed?.()
        return Promise.reject(normalizeError(error))
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(normalizeError(error))
  }
)

function normalizeError(error: AxiosError<ApiResponse<unknown>>): ApiError {
  const status = error.response?.status ?? 500
  const message =
    error.response?.data?.error ?? error.message ?? 'An unexpected error occurred'
  return new ApiError(message, status)
}

export default apiClient
