import apiClient from './client'
import type { ApiResponse, ApiOrder, ApiMeta, CreateOrderRequest } from '@/types/api'

export async function createOrder(request: CreateOrderRequest) {
  const { data } = await apiClient.post<ApiResponse<{ order_id: number; paypal_order_id?: string; stripe_client_secret?: string; payment_method: string }>>('/orders', request)
  return data.data
}

export async function capturePayPalOrder(orderId: number) {
  const { data } = await apiClient.post<ApiResponse<{ order_id: number; status: string; paypal_capture_id: string }>>(`/orders/${orderId}/capture`)
  return data.data
}

export async function captureStripeOrder(orderId: number) {
  const { data } = await apiClient.post<ApiResponse<{ order_id: number; status: string; stripe_payment_intent_id: string }>>(`/orders/${orderId}/stripe-capture`)
  return data.data
}

export async function getMyOrders(page = 1, limit = 20): Promise<{ orders: ApiOrder[]; meta?: ApiMeta }> {
  const { data } = await apiClient.get<ApiResponse<ApiOrder[]>>('/users/me/orders', { params: { page, limit } })
  return { orders: data.data, meta: data.meta }
}
