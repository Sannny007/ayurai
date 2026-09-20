import AssistantMessage from './AssistantMessage'

const MessageBubble = ({ message }) => {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] whitespace-pre-wrap rounded-2xl bg-gold px-4 py-2.5 text-sm leading-relaxed text-deep">
          {message.content}
        </div>
      </div>
    )
  }

  return <AssistantMessage message={message} />
}

export default MessageBubble;