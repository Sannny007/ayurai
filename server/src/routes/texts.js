import { Router } from 'express';

const router = Router();
const ragUrl = () => process.env.RAG_URL || 'http://localhost:8000'

const proxy = async (path, res) => {
  try {
    const r = await fetch(`${ragUrl()}${path}`)
    const data = await r.json()
    res.status(r.status).json(data)
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Text service is unvailable" })
  }
}

router.get('/chapters', (req, res) => proxy('/chapters', res))

router.get('/chapters/:number', (req, res) => {
  const n = Number(req.params.number)
  if (!Number.isInteger(n)) return res.status(400).json({ error: "Invalid chapter number" })
    return proxy(`/chapters/${n}`, res)
})

export default router;