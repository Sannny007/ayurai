import { useState, useRef, useEffect } from 'react'
import WelcomePanel from './WelcomePanel'
import MessageBubble from './MessageBubble'
import ThinkingIndicator from './ThinkingIndicator'
import ChatInput from './ChatInput'
import { sendMessage } from '../../api/chatapi'

const ChatPage = ({ onOpenChapter }) => {
  const [messages, setMessages] = useState([])
  const [isThinking, setIsThinking] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const handleSend = async (text) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', content: text }])
    setIsThinking(true)

    try {
      const answer = await sendMessage(text)
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), ...answer }])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Sorry, I could not get an answer. Please try again.',
        },
      ])
    } finally {
      setIsThinking(false)
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {messages.length === 0 ? (
        <WelcomePanel />
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto flex max-w-3xl flex-col gap-4 py-4">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} onOpenChapter={onOpenChapter} />
            ))}
            {isThinking && <ThinkingIndicator />}
            <div ref={bottomRef} />
          </div>
        </div>
      )}
      <ChatInput onSend={handleSend} disabled={isThinking} />
    </div>
  )
}

export default ChatPage