const API_BASE = import.meta.env.DEV
  ? '/watch-shop/api'
  : '/watch-shop/api'

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function api<T = Record<string, unknown>>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T & { success: boolean; message?: string }> {
  const token = localStorage.getItem('token')
  const headers: Record<string, string> = {}

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string>) },
  })

  const data = await res.json()

  if (!res.ok) {
    throw new ApiError(data.message || 'Something went wrong', res.status)
  }

  return data
}

export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
