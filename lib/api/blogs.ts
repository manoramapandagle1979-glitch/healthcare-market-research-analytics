import apiClient from './client'
import type { ApiResponse, ApiBlog, ApiMeta } from '@/types/api'

interface GetBlogsParams {
  status?: string
  page?: number
  limit?: number
  categoryId?: number
  tags?: string
}

export async function getBlogs(params: GetBlogsParams = {}): Promise<{ blogs: ApiBlog[]; meta?: ApiMeta }> {
  const { data } = await apiClient.get<ApiResponse<ApiBlog[]>>('/blogs', { params })
  return { blogs: data.data, meta: data.meta }
}

export async function getBlogBySlug(slug: string): Promise<ApiBlog> {
  const { data } = await apiClient.get<ApiResponse<ApiBlog>>(`/blogs/slug/${slug}`)
  return data.data
}
