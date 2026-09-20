const NOT_FOUND_MESSAGE =
  "I couldn't find this in the classical text I have indexed (Sushruta Samhita, Sutrasthanam), so I won't guess."

const SYSTEM_PROMPT = `You are AyurAI, an assistant that answers strictly from passages of a classical Ayurvedic text.

Rules:
- Use ONLY the numbered passages provided. Never use outside knowledge.
- Cite the passages you use as [1], [2], etc. right after the claim they support.
- If the passages contain nothing relevant to the question, reply with exactly: NOT_FOUND (and nothing else).
- If the passages answer only part of the question, answer that part and briefly say what they do not cover. Never write NOT_FOUND in that case.
- Write in plain, simple English, in at most 150 words. Do not copy long quotes; the passages are shown to the reader separately.
- The passages come from a 1907 English translation with some scanning errors. Ignore garbled words.
- Describe what the text says. Do not give personal medical advice or doses, and do not tell the reader how to treat themselves.`

const searchPassages = async (question) => {
  const res = await fetch(`${process.env.RAG_URL || 'http://localhost:8000'}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, top_k: 5 }),
  })
  if (!res.ok) throw new Error(`RAG service returned ${res.status}`)
  return res.json()
}

const askModel = async (question, passages) => {
  const context = passages
    .map((p, i) => `[${i + 1}] (Sutrasthanam, Chapter ${p.chapter})\n${p.text}`)
    .join('\n\n')

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL,
      temperature: 0.2,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Passages:\n${context}\n\nQuestion: ${question}` },
      ],
    }),
  })
  if (!res.ok) throw new Error(`LLM returned ${res.status}: ${await res.text()}`)

  const data = await res.json()
  const raw = data.choices?.[0]?.message?.content || ''
  const text = raw.replace(/<think>[\s\S]*?<\/think>/g, '').trim()
  if (!text) console.log('[llm] empty content, full response:', JSON.stringify(data).slice(0, 600))
  return text
}

export const getAnswer = async (question) => {
  const notFound = { role: 'assistant', content: NOT_FOUND_MESSAGE, citations: [] }

  const { found, passages } = await searchPassages(question)
  console.log('[rag] found:', found, '| top score:', passages[0]?.score)
  if (!found) return notFound

  const raw = await askModel(question, passages)
  console.log('[llm] raw answer:', JSON.stringify(raw))

  // Remove any stray NOT_FOUND token, then apply the rule: no citation, no answer.
  const answer = raw.replace(/NOT_FOUND\.?/g, '').trim()
  if (!answer || !/\[\d+\]/.test(answer)) return notFound

  const refs = [...new Set([...answer.matchAll(/\[(\d+)\]/g)].map((m) => Number(m[1])))].sort((a, b) => a - b)
  const citations = refs
    .filter((n) => passages[n - 1])
    .map((n) => {
      const p = passages[n - 1]
      return { ref: n, id: p.id, source: p.source, chapter: p.chapter, score: p.score, text: p.text }
    })

  if (citations.length === 0) return notFound

  return { role: 'assistant', content: answer, citations }
}