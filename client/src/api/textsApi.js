const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const get = async (path) => {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) throw new Error('Request failed')
  return res.json()
}

export const getChapters = () => get('/api/texts/chapters')
export const getChapter = (number) => get(`/api/texts/chapters/${number}`)