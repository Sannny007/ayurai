import { useState, useRef, useEffect } from "react";
import WelcomePanel from './WelcomePanel';
import MessageBubble from './MessageBubble';
import ThinkingIndicator from './ThinkingIndicator';
import ChatInput from "./ChatInput";

const MOCK_REPLY = "This is a placeholder answer. Once the RAG engine is connected, I'll answer from the classical texts and show the exact source for every claim."

const ChatPage = () => {
  const [ message, setMessage ] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [message, isThinking]);

  const handleSend = (text) => {
    setMessage((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', content: text }]);
    setIsThinking(true);

    setTimeout(() => {
      setMessage((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: MOCK_REPLY },
      ])
      setIsThinking(false)
    }, 1200)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {message.length === 0 ? (
        <WelcomePanel />
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto flex max-w-3xl flex-col gap-4 py-4">
            {message.map((m) => (
              <MessageBubble key={m.id} message={m} />
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

export default ChatPage;