import Sidebar from './Sidebar'
import Topbar from './Topbar'

const AppLayout = ({ children, title, active, onSelect, onNewChat }) => (
  <div className="flex h-screen bg-deep font-sans text-parchment">
    <Sidebar active={active} onSelect={onSelect} onNewChat={onNewChat} />
    <div className="flex min-w-0 flex-1 flex-col">
      <Topbar title={title} />
      <main className="flex flex-1 flex-col overflow-y-auto bg-[radial-gradient(ellipse_at_top,rgba(45,122,94,0.12),transparent_60%)] p-6">
        {children}
      </main>
    </div>
  </div>
)

export default AppLayout