import apiClient from './client'
import type { ApiResponse, ApiPressRelease, ApiMeta } from '@/types/api'

interface GetPressReleasesParams {
  status?: string
  page?: number
  limit?: number
}

export async function getPressReleases(params: GetPressReleasesParams = {}): Promise<{ pressReleases: ApiPressRelease[]; meta?: ApiMeta }> {
  const { data } = await apiClient.get<ApiResponse<ApiPressRelease[]>>('/press-releases', { params })
  return { pressReleases: data.data, meta: data.meta }
}

export async function getPressReleaseBySlug(slug: string): Promise<ApiPressRelease> {
  const { data } = await apiClient.get<ApiResponse<ApiPressRelease>>(`/press-releases/slug/${slug}`)
  return data.data
}
