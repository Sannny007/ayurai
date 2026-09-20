const MOCK_REPLY = "This is a placeholder answer. Once the RAG engine is connected, I'll answer from the classical texts and show the exact source for every claim."

export const getAnswer = async (question) => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  return { role: 'assistant', content: MOCK_REPLY, citations: [] }
}