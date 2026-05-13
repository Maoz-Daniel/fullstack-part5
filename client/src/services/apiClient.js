const API_BASE_URL = 'http://localhost:3001'

function buildUrl(path) {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export async function apiClient(path, method = 'GET', body = null, config = {}) {
  const { includeHeaders = false } = config 
  const options = {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : null,
  }

  try {
    const response = await fetch(buildUrl(path), options)

    if (!response.ok) {
      throw new Error(`${method} ${path} failed: ${response.status}`)
    }

    const data = method === 'DELETE' ? null : await response.json()

    if (includeHeaders) {
      return { data, headers: response.headers }
    }

    return data
  } catch (error) {
    console.error('API error:', error)
    throw error
  }
}
