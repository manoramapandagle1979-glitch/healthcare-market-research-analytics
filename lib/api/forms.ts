import apiClient from './client'
import type { ApiResponse, FormSubmissionRequest } from '@/types/api'

export async function submitForm(request: FormSubmissionRequest): Promise<unknown> {
  const { data } = await apiClient.post<ApiResponse<unknown>>('/forms/submissions', request)
  return data.data
}
