import { useState } from "react";
import { ArrowUp } from "lucide-react";

const ChatInput = ({ onSend, disabled }) => {
  const [value, setValue] = useState('');

  const submit = () => {
    const text = value.trim()
    if (!text || disabled) return
    onSend(text)
    setValue('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl pt-2">
      <div className="flex items-end gap-2 rounded-2xl border border-gold/20 bg-forest/70 p-2 focus-within:border-gold/50">
      <textarea
      rows={1}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Ask about a herb, a condition, or a classical text..."
      className="max-h-40 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-parchment outline-none field-sizing:content placeholder:text-parchment/40"
      />

      <button
      onClick={submit}
      disabled={!value.trim() || disabled}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold text-deep transition hover:opacity-90 disabled:opacity-30"
      >
        <ArrowUp size={18} />
      </button>
      </div>

      <p className="mt-2 text-center text-xs text-parchment/40">AyurAI shares educational references from classical texts, not medical advice.</p>
    </div>
  )
}

export default ChatInput;