// src/lib/api.js
// Minimal API client for the Express backend with cookie support

const API_BASE = import.meta.env.VITE_API_URL || '' // when using Vite proxy, this can be empty

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include', // send/receive refresh token cookie
  })

  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await res.json().catch(() => ({})) : await res.text()

  if (!res.ok) {
    const message = isJson ? data?.message || res.statusText : res.statusText
    throw new Error(message)
  }

  return data
}

export const authApi = {
  register: (payload) => request('/api/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/api/auth/login', { method: 'POST', body: payload }),
  refresh: () => request('/api/auth/refresh', { method: 'POST' }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
  me: (token) =>
    request('/api/auth/me', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
}

export const usersApi = {
  getMe: (token) =>
    request('/api/users/me', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
  updateMe: (updates, token) =>
    request('/api/users/me', {
      method: 'PUT',
      body: updates,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
}

export const health = () => request('/api/health')
