import { useEffect, useRef, useState } from "react";
import { getChapters, getChapter } from "../../api/textsApi";
import Sprig from '../botanical/Sprig';

const TextsPage = () => {
  const [chapters, setChapters] = useState([]);
  const [selected, setSelected] = useState(null);
  const [content, setContent] = useState(null);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState('');
  const readerRef = useRef(null);

  useEffect(() => {
    getChapters()
    .then(setChapters)
    .catch(() => setError('Could not load the chapter list.'))
  }, []);

  useEffect(() => {
    readerRef.current?.scrollTo(0, 0)
  }, [content]);


  const openChapter = async (number) => {
    setSelected(number)
    setloading(true)
    setError('')
    try {
      setContent(await getChapter(number))
    } catch {
      setError('Could not load this chapter.')
    } finally {
      setloading(false)
    }
  }

  return (
    <div className="flex min-h-0 flex-1 gap-4">
      <aside className="w-72 shrink-0 overflow-y-auto rounded-xl border border-gold/10 bg-forest/40 p-2">
      <p className="px-2 py-2 text-[11px] font-semibold uppercase tracking-widest text-gold">
      Sushruta Samhita · Sutrasthanam
      </p>
      {chapters.map((c) => (
        <button
        key={c.chapter}
        onClick={() => openChapter(c.chapter)}
        className={`block w-full rounded-lg px-3 py-2 text-left transition ${selected === c.chapter ? 'bg-gold/10' : 'hover:bg-white/5'}`}
        >
          <span className="text-sm font-semibold text-gold">Chapter {c.chapter}</span>
          <span className="mt-0.5 line-clamp-2 block text-xs text-parchment/50">{c.preview}</span>
        </button>
      ))}
      </aside>

      <section
      ref={readerRef}
      className="relative min-w-0 flex-1 overflow-y-auto rounded-xl border border-gold/10 bg-parchment/4 p-6"
      >
        {error && <p className="text-sm text-red-300/80">{error}</p>}

        {!selected && !error && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <Sprig className="pointer-events-none absolute h-72 text-gold/10" />
            <h2 className="relative font-display text-3xl font-semibold">Choose a chapter to read</h2>
            <p className="relative mt-2 max-w-sm text-sm text-parchment/50">
            The full text of the Sutrasthanam, chapter by chapter, exactly as AyurMeta searches it.
            </p>
          </div>
        )}

        {loading && <p className="text-sm text-parchment/50">Loading...</p>}

        {content && !loading && (
          <article className="mx-auto max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-gold">{content.source}</p>
            <h2 className="mb-6 mt-1 font-display text-3xl font-semibold">Chapter {content.chapter}</h2>
            <div className="space-y-4 font-display text-[18px] leading-relaxed text-parchment/90">
            {content.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            </div>

            <p className="mt-8 text-[11px] text-parchment/40">
            Scanned 1907 translation, so minor scanning errors are possible.
            </p>
          </article>
        )}
      </section>
    </div>
  )
}

export default TextsPage;