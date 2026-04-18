import apiClient from './client'
import type { ApiResponse, LoginResponse, RefreshResponse, ApiUser } from '@/types/api'

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', { email, password })
  return data.data
}

export async function register(name: string, email: string, password: string): Promise<LoginResponse> {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/auth/register', { email, password, name })
  return data.data
}

export async function refresh(refreshToken: string): Promise<RefreshResponse> {
  const { data } = await apiClient.post<ApiResponse<RefreshResponse>>('/auth/refresh', { refresh_token: refreshToken })
  return data.data
}

export async function logout(refreshToken: string): Promise<void> {
  await apiClient.post('/auth/logout', { refresh_token: refreshToken })
}

export async function getMe(): Promise<ApiUser> {
  const { data } = await apiClient.get<ApiResponse<ApiUser>>('/users/me')
  return data.data
}
