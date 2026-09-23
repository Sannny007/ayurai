import AssistantAvatar from './AssistantAvatar'
import AnswerText from './AnswerText'
import PramanaCard from './PramanaCard'

const AssistantMessage = ({ message, onOpenChapter }) => {
  const citations = message.citations ?? []
  const understood = message.understood ?? []

  return (
    <div className="flex gap-3">
      <AssistantAvatar />
      <div className="min-w-0 max-w-[85%] flex-1 space-y-3">
        {citations.length > 0 ? (
          <>
            {understood.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {understood.map((u) => (
                  <span
                    key={u.label}
                    className="rounded-full border border-leaf/40 bg-leaf/10 px-3 py-1 text-xs text-parchment/70"
                  >
                    <span className="font-semibold text-leaf">Glossary</span> · {u.label} → {u.terms.join(', ')}
                  </span>
                ))}
              </div>
            )}

            <section className="rounded-2xl border border-gold/10 bg-forest/70 px-4 py-3">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-leaf">
                Vyākhyā
                <span className="ml-2 font-normal normal-case tracking-normal text-parchment/40">
                  · AI explanation
                </span>
              </p>
              <p className="whitespace-pre-line text-sm leading-relaxed">
                <AnswerText text={message.content} />
              </p>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-gold">
                Pramāṇa
                <span className="ml-2 font-normal normal-case tracking-normal text-parchment/40">
                  · From the classical text
                </span>
              </p>
              <div className="space-y-2">
                {citations.map((c) => (
                  <PramanaCard key={c.id} citation={c} onOpenChapter={onOpenChapter} />
                ))}
              </div>
              <p className="mt-2 text-[11px] text-parchment/40">
                Scanned 1907 translation, so minor scanning errors are possible.
              </p>
            </section>
          </>
        ) : (
          <div className="rounded-2xl border border-gold/10 bg-forest/70 px-4 py-2.5 text-sm leading-relaxed">
            {message.content}
          </div>
        )}
      </div>
    </div>
  )
}

export default AssistantMessage