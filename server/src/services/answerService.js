const NOT_FOUND_MESSAGE =
  "I couldn't find this in the classical text I have indexed (Sushruta Samhita, Sutrasthanam), so I won't guess."

const SYSTEM_PROMPT = `You are AyurMeta, an assistant that answers strictly from passages of a classical Ayurvedic text.

Rules:
- Use ONLY the numbered passages provided. Never use outside knowledge.
- Cite the passages you use as [1], [2], etc. right after the claim they support. Never cite anything else.
- Keep the passage's context. If a passage describes signs of a bad or fatal outcome, say exactly that and never present such signs as ordinary symptoms. If it describes a surgical procedure, say it is a surgical procedure.
- Cover everything the cited passage says about the topic, not just one point. Do not generalize beyond what the passage says.
- Answer only what the passages actually say. If they only partly answer the question, say what they cover and what they do not. Do not fill gaps.
- If the question has several parts, answer each part in its own short paragraph.
- A glossary may list a modern name next to the names the text uses. The glossary is NOT part of the text and must never be cited. Never say the text uses the modern name. Say it like this: "The text does not use the name X. It describes Y, which our glossary treats as the same thing."
- If the passages contain nothing relevant to the question, reply with exactly: NOT_FOUND (and nothing else).
- Plain text only: no markdown, no asterisks, no headings, no bullet symbols, and no direct quotes. Use short sentences, at most 150 words in total.
- The passages come from a 1907 English translation with some scanning errors. Ignore garbled words.
- Describe what the text says. Do not give personal medical advice or doses, and do not tell the reader how to treat themselves.`

const searchPassages = async (question) => {
  const res = await fetch(`${process.env.RAG_URL || 'http://localhost:8000'}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, top_k: 6 }),
  })
  if (!res.ok) throw new Error(`RAG service returned ${res.status}`)
  return res.json()
}

const askModel = async (question, passages, matched) => {
  const context = passages
    .map((p, i) => `[${i + 1}] (Sutrasthanam, Chapter ${p.chapter})\n${p.text}`)
    .join('\n\n')

  const glossary = matched.length
    ? `\n\nGlossary (our own term list, not from the text): ${matched.map((m) => m.terms.join(' = ')).join('; ')}`
    : ''

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
        { role: 'user', content: `Passages:\n${context}${glossary}\n\nQuestion: ${question}` },
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

  const { found, passages, matched = [] } = await searchPassages(question)
  console.log('[rag] found:', found, '| top score:', passages[0]?.score, '| matched:', matched.map((m) => m.label))
  if (!found) return notFound

  const raw = await askModel(question, passages, matched)
  console.log('[llm] raw answer:', JSON.stringify(raw))

  // Remove stray tokens, then apply the rule: no citation, no answer.
  const answer = raw.replace(/NOT_FOUND\.?/g, '').replace(/\[glossary\]/gi, '').trim()
  if (!answer || !/\[\d+\]/.test(answer)) return notFound

  const refs = [...new Set([...answer.matchAll(/\[(\d+)\]/g)].map((m) => Number(m[1])))].sort((a, b) => a - b)
  const citations = refs
    .filter((n) => passages[n - 1])
    .map((n) => {
      const p = passages[n - 1]
      return { ref: n, id: p.id, source: p.source, chapter: p.chapter, score: p.score, text: p.text }
    })

  if (citations.length === 0) return notFound

  return {
    role: 'assistant',
    content: answer,
    citations,
    understood: matched.map((m) => ({ label: m.label, terms: m.terms })),
  }
}