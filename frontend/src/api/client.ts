const API_BASE = '/api'

export async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export async function fetchApiWithAuth<T>(path: string, token: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(Array.isArray(err.detail) ? err.detail[0]?.msg : err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export async function postApi<T>(path: string, data: unknown, token?: string): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(Array.isArray(err.detail) ? err.detail[0]?.msg : err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export async function putApi<T>(path: string, data: unknown, token: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(Array.isArray(err.detail) ? err.detail[0]?.msg : err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export async function deleteApi<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res.json().catch(() => ({} as T))
}

export async function uploadFile(file: File, token: string): Promise<{ url: string }> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${API_BASE}/admin/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  getCategories: () => fetchApi<{ id: number; name: string; slug: string; description: string | null; sort_order: number }[]>('/menu/categories'),
  getMenuItems: (categoryId?: number) =>
    fetchApi<{ id: number; name: string; description: string | null; price: number; image_url: string | null; category_id: number }[]>(
      categoryId ? `/menu/items?category_id=${categoryId}` : '/menu/items'
    ),
  createReservation: (data: { name: string; phone: string; email?: string; date: string; time: string; guests: number; comment?: string }) =>
    postApi<{ id: number }>('/reservations', data),
  createContact: (data: { name: string; email: string; phone?: string; message: string }) =>
    postApi<{ id: number }>('/contact', data),
  getBanners: () =>
    fetchApi<{ id: number; title: string; discount_text: string | null; description: string | null; image_url: string | null; link: string | null; is_active: boolean; sort_order: number }[]>('/banners'),
}
