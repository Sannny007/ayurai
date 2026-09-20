const AnswerText = ({ text }) =>
  text
    .replace(/\*\*/g, '')
    .split(/(\[\d+\])/g)
    .map((part, i) => {
      const m = part.match(/^\[(\d+)\]$/)
      return m ? (
        <sup key={i} className="mx-0.5 rounded bg-gold/15 px-1 text-[10px] font-semibold text-gold">
          {m[1]}
        </sup>
      ) : (
        <span key={i}>{part}</span>
      )
    })

export default AnswerText