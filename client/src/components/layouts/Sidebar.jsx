import { MessageSquare, BookOpen, Leaf, Scale, Plus } from 'lucide-react'
import Sprig from '../botanical/Sprig'

const navItems = [
  { id: 'chat', label: 'Ask AyurMeta', icon: MessageSquare },
  { id: 'texts', label: 'Classical Texts', icon: BookOpen },
  { id: 'plants', label: 'Plant ID', icon: Leaf },
  { id: 'ip', label: 'IP Guidance', icon: Scale },
]

const Sidebar = ({ active, onSelect, onNewChat }) => (
  <aside className="flex w-64 shrink-0 flex-col border-r border-gold/10 bg-forest/60 p-4">
    <div className="mb-6 flex items-center gap-2 px-2">
      <Leaf className="text-gold" size={22} />
      <span className="font-display text-2xl font-bold text-gold">AyurMeta</span>
    </div>

    <button
      onClick={onNewChat}
      className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-2.5 font-semibold text-deep transition hover:opacity-90"
    >
      <Plus size={18} />
      New chat
    </button>

    <nav className="flex flex-col gap-1">
      {navItems.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
            active === id
              ? 'bg-gold/10 text-gold'
              : 'text-parchment/70 hover:bg-white/5 hover:text-parchment'
          }`}
        >
          <Icon size={18} />
          {label}
        </button>
      ))}
    </nav>

    <Sprig className="mx-auto mt-auto h-28 text-gold/20" />
  </aside>
)

export default Sidebar