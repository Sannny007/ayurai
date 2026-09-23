const Topbar = ({ title }) => (
  <header className="flex h-14 shrink-0 items-center justify-between border-b border-gold/10 px-6">
    <h1 className="font-display text-xl font-semibold">{title}</h1>
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/15 text-sm font-semibold text-gold">
      S
    </div>
  </header>
)

export default Topbar