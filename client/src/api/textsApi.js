const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const get = async (path) => {
  const res = await fetch(`${BASE_URL}${path}`)
  const data = await res.json().catch(() => null)
  if (!res.ok || !data) throw new Error(data?.detail || data?.error || 'Request failed')
  return data
}

export const getChapters = () => get('/api/texts/chapters')
export const getChapter = (number) => get(`/api/texts/chapters/${number}`)