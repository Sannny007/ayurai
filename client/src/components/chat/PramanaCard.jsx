import { useState } from 'react'

const PramanaCard = ({ citation, onOpenChapter }) => {
  const [open, setOpen] = useState(false)

  return (
    <article className="rounded-lg border border-gold/25 border-l-4 border-l-gold/70 bg-parchment/6 px-4 py-3">
      <header className="mb-2 flex items-start gap-2 text-xs text-gold">
        <span className="rounded bg-gold/15 px-1.5 py-0.5 font-semibold">{citation.ref}</span>
        <span className="pt-0.5">
          {citation.source} ·{' '}
          <button
            onClick={() => onOpenChapter?.(citation.chapter)}
            className="underline decoration-dotted underline-offset-2 hover:text-gold"
          >
            Chapter {citation.chapter}
          </button>
        </span>
      </header>

      <p
        className={`whitespace-pre-line font-display text-[17px] leading-relaxed text-parchment/90 ${
          open ? '' : 'line-clamp-4'
        }`}
      >
        {citation.text}
      </p>

      <button
        onClick={() => setOpen((o) => !o)}
        className="mt-2 text-xs text-gold/80 transition hover:text-gold"
      >
        {open ? 'Show less' : 'Read full passage'}
      </button>
    </article>
  )
}

export default PramanaCard