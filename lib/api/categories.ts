import apiClient from './client'
import type { ApiResponse, ApiCategory, ApiMeta } from '@/types/api'

export async function getCategories(page = 1, limit = 100): Promise<{ categories: ApiCategory[]; meta?: ApiMeta }> {
  const { data } = await apiClient.get<ApiResponse<ApiCategory[]>>('/categories', { params: { page, limit } })
  return { categories: data.data, meta: data.meta }
}

export async function getCategoryBySlug(slug: string): Promise<ApiCategory> {
  const { data } = await apiClient.get<ApiResponse<ApiCategory>>(`/categories/${slug}`)
  return data.data
}
