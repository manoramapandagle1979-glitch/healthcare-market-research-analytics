import apiClient from './client'
import type { ApiResponse, ApiUser } from '@/types/api'

export async function updateProfile(data: { name?: string; email?: string }): Promise<ApiUser> {
  const { data: res } = await apiClient.patch<ApiResponse<ApiUser>>('/users/me', data)
  return res.data
}

export async function changePassword(data: { current_password: string; new_password: string }): Promise<void> {
  await apiClient.patch('/users/me/password', data)
}
