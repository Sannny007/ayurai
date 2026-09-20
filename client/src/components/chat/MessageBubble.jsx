import AssistantAvatar from "./AssistantAvatar";

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {isUser && <AssistantAvatar />}

      <div
      className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${isUser ? 'bg-gold text-deep' : 'border border-gold/10 bg-forest/70 text-parchment'}`}
      >
        {message.content}
      </div>
    </div>
  )
}

export default MessageBubble;