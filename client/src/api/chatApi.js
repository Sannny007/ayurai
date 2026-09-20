const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const sendMessage = async (message) => {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || 'Request failed')
  }

  return res.json()
}