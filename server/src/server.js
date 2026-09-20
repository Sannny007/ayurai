import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import chatRouter from './routes/chat.js'
import textsRouter from './routes/texts.js';

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/chat', chatRouter)
app.use('/api/texts', textsRouter)

app.listen(PORT, () => console.log(`AyurAI API running on http://localhost:${PORT}`))