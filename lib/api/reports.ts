import apiClient from './client'
import type { ApiResponse, ApiReport, ApiMeta } from '@/types/api'

interface GetReportsParams {
  status?: string
  category_slug?: string
  search?: string
  sort?: string
  page?: number
  limit?: number
}

export async function getReports(params: GetReportsParams = {}): Promise<{ reports: ApiReport[]; meta?: ApiMeta }> {
  const { data } = await apiClient.get<ApiResponse<ApiReport[]>>('/reports', { params })
  return { reports: data.data, meta: data.meta }
}

export async function getReportBySlug(slug: string): Promise<ApiReport> {
  const { data } = await apiClient.get<ApiResponse<ApiReport>>(`/reports/${slug}`)
  return data.data
}

export async function searchReports(query: string, page = 1, limit = 20): Promise<{ reports: ApiReport[]; meta?: ApiMeta }> {
  const { data } = await apiClient.get<ApiResponse<ApiReport[]>>('/search', { params: { q: query, page, limit } })
  return { reports: data.data, meta: data.meta }
}

export async function getReportsByCategory(categorySlug: string, page = 1, limit = 20): Promise<{ reports: ApiReport[]; meta?: ApiMeta }> {
  const { data } = await apiClient.get<ApiResponse<ApiReport[]>>(`/categories/${categorySlug}/reports`, { params: { page, limit } })
  return { reports: data.data, meta: data.meta }
}

export async function getReportsByAuthor(authorId: number, page = 1, limit = 20): Promise<{ reports: ApiReport[]; meta?: ApiMeta }> {
  const { data } = await apiClient.get<ApiResponse<ApiReport[]>>(`/reports/author/${authorId}`, { params: { page, limit } })
  return { reports: data.data, meta: data.meta }
}
