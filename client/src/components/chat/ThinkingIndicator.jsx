import AssistantAvatar from "./AssistantAvatar";

const ThinkingIndicator = () => (
  <div className="flex gap-3">
    <AssistantAvatar />
    <div className="flex items-center gap-1 rounded-2xl border border-gold/10 bg-forest/70 px-4 py-3">
      <span className="h-1.5 w-1.5 animate-bounce rounded-b-full bg-gold" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-b-full bg-gold [animation-delay:150ms" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-b-full bg-gold [animation-delay:300ms" />
    </div>
  </div>
)

export default ThinkingIndicator;