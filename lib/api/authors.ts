import apiClient from './client'
import type { ApiResponse, ApiAuthor } from '@/types/api'

export async function getAuthors(search?: string): Promise<ApiAuthor[]> {
  const { data } = await apiClient.get<ApiResponse<ApiAuthor[]>>('/authors', { params: search ? { search } : {} })
  return data.data
}

export async function getAuthorById(id: number): Promise<ApiAuthor> {
  const { data } = await apiClient.get<ApiResponse<ApiAuthor>>(`/authors/${id}`)
  return data.data
}
