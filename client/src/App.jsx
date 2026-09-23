import { useState } from 'react'
import AppLayout from './components/layouts/AppLayout'
import ChatPage from './components/chat/ChatPage'
import TextsPage from './components/texts/TextsPage'

const TITLES = {
  chat: 'Ask AyurMeta',
  texts: 'Classical Texts',
  plants: 'Plant ID',
  ip: 'IP Guidance',
}

const ComingSoon = ({ title }) => (
  <div className="flex flex-1 items-center justify-center text-center">
    <div>
      <h2 className="font-display text-3xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-parchment/50">Coming soon.</p>
    </div>
  </div>
)

const App = () => {
  const [view, setView] = useState('chat')
  const [chatKey, setChatKey] = useState(0)
  const [openChapter, setOpenChapter] = useState(null)

  const handleNewChat = () => {
    setChatKey((k) => k + 1)
    setView('chat')
  }

  const handleSelect = (id) => {
    if (id !== 'texts') setOpenChapter(null)
    setView(id)
  }

  const goToChapter = (number) => {
    setOpenChapter(number)
    setView('texts')
  }

  return (
    <AppLayout title={TITLES[view]} active={view} onSelect={handleSelect} onNewChat={handleNewChat}>
      <div className={view === 'chat' ? 'flex min-h-0 flex-1 flex-col' : 'hidden'}>
        <ChatPage key={chatKey} onOpenChapter={goToChapter} />
      </div>
      {view === 'texts' && <TextsPage openChapter={openChapter} />}
      {(view === 'plants' || view === 'ip') && <ComingSoon title={TITLES[view]} />}
    </AppLayout>
  )
}

export default App