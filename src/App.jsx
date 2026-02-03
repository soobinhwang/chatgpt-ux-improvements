import { useMemo, useRef, useState } from 'react'
import gptLogo from './gpt-logo.png'

const sidebarTop = [
  { id: 'new', label: 'New chat', icon: 'new-chat' },
  { id: 'search', label: 'Search chats', icon: 'search' },
  { id: 'images', label: 'Images', icon: 'image' },
  { id: 'archived', label: 'Archived chats', icon: 'archive' },
]

const sidebarScrollExtras = [
  { id: 'apps', label: 'Apps', icon: 'apps' },
  { id: 'codex', label: 'Codex', icon: 'codex' },
]

const gptItems = [
  { id: 'gpt-1', label: 'Design Mentor', icon: 'circle' },
  { id: 'gpt-2', label: 'Accent Coach', icon: 'circle' },
  { id: 'gpt-3', label: 'Speaking Helper', icon: 'circle' },
  { id: 'gpt-4', label: 'Explore GPTs', icon: 'cube' },
]

const projects = [
  { id: 'proj-new', label: 'New project', icon: 'folder' },
  { id: 'proj-1', label: 'Kommu', icon: 'folder' },
  { id: 'proj-2', label: 'Therapy', icon: 'folder' },
  { id: 'proj-3', label: '[Job] Portfolio', icon: 'folder' },
  { id: 'proj-4', label: '[Job] Interviews', icon: 'folder' },
  { id: 'proj-5', label: '[Job] Presentation', icon: 'folder' },
]

const chats = [
  { id: 'chat-1', label: 'ChatGPT Explanation' },
  { id: 'chat-2', label: 'ChatGPT logo request' },
  { id: 'chat-3', label: 'Visual Guideline Creation' },
  { id: 'chat-4', label: 'Text format fix request' },
  { id: 'chat-5', label: 'App review checklist' },
  { id: 'chat-6', label: 'Chat GPT Logo Drawing' },
  { id: 'chat-7', label: 'Portfolio Role Tips' },
  { id: 'chat-8', label: 'CELPIP Task 1 Email' },
  { id: 'chat-9', label: 'Portfolio Feedback System' },
  { id: 'chat-10', label: 'Email Gratitude Response' },
]

const actionIcons = ['copy', 'thumb-up', 'thumb-down', 'share', 'repeat']

const formatSelectionLabel = (text) => {
  const trimmed = text.replace(/\s+/g, ' ').trim()
  if (trimmed.length <= 80) return `"${trimmed}"`
  return `"${trimmed.slice(0, 80)}..."`
}

const Icon = ({ name, className }) => {
  const base = `w-4 h-4 ${className || ''}`
  switch (name) {
    case 'new-chat':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M14 4h6v6" />
          <path d="M20 4l-9 9" />
          <path d="M12 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
        </svg>
      )
    case 'plus':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 5v14M5 12h14" />
        </svg>
      )
    case 'search':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      )
    case 'image':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="4" y="5" width="16" height="14" rx="2" />
          <circle cx="9" cy="10" r="1.5" />
          <path d="M6 16l4-4 3 3 3-3 2 2" />
        </svg>
      )
    case 'archive':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="4" y="4" width="16" height="5" rx="1" />
          <rect x="5" y="9" width="14" height="11" rx="1.5" />
          <path d="M9 12h6" />
        </svg>
      )
    case 'apps':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="4" y="5" width="6" height="6" rx="1" />
          <rect x="14" y="5" width="6" height="6" rx="1" />
          <rect x="4" y="13" width="6" height="6" rx="1" />
          <rect x="14" y="13" width="6" height="6" rx="1" />
        </svg>
      )
    case 'codex':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M9 10l2.5 2L9 14" />
          <path d="M13 14h3" />
        </svg>
      )
    case 'circle':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="7" />
        </svg>
      )
    case 'cube':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 3l8 4v10l-8 4-8-4V7l8-4z" />
          <path d="M12 7l8 4M12 7L4 11" />
        </svg>
      )
    case 'folder':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 7h6l2 2h10v10a2 2 0 0 1-2 2H3z" />
        </svg>
      )
    case 'caret':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M6 9l6 6 6-6" />
        </svg>
      )
    case 'share':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 16V4" />
          <path d="M8 8l4-4 4 4" />
          <path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
        </svg>
      )
    case 'menu':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M5 12h14M5 6h14M5 18h14" />
        </svg>
      )
    case 'mic':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z" />
          <path d="M5 11a7 7 0 0 0 14 0" />
          <path d="M12 18v3" />
        </svg>
      )
    case 'send':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 12l18-9-5 18-4-7-9-2z" />
        </svg>
      )
    case 'voice':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 10v4" />
          <path d="M10 7v10" />
          <path d="M14 9v6" />
          <path d="M18 6v12" />
        </svg>
      )
    case 'x':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M6 6l12 12M6 18L18 6" />
        </svg>
      )
    case 'copy':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="9" y="9" width="10" height="10" rx="2" />
          <rect x="5" y="5" width="10" height="10" rx="2" />
        </svg>
      )
    case 'thumb-up':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M7 11v8H4v-8h3zM9 11l4-7 3 2v5h4a2 2 0 0 1 2 2l-1 6a2 2 0 0 1-2 2H9z" />
        </svg>
      )
    case 'thumb-down':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M7 13v-8H4v8h3zM9 13l4 7 3-2v-5h4a2 2 0 0 0 2-2l-1-6a2 2 0 0 0-2-2H9z" />
        </svg>
      )
    case 'repeat':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M4 7h11a4 4 0 0 1 4 4v1" />
          <path d="M7 4l-3 3 3 3" />
          <path d="M20 17H9a4 4 0 0 1-4-4v-1" />
          <path d="M17 20l3-3-3-3" />
        </svg>
      )
    default:
      return <span className="block w-4 h-4" />
  }
}

const SidebarItem = ({ icon, label, active, onClick, muted }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
      active ? 'bg-[#2b2b2b] text-white' : muted ? 'text-[#bdbdbd]' : 'text-[#d6d6d6]'
    } hover:bg-[#2b2b2b]`}
  >
    <span className="text-[#9b9b9b]">
      <Icon name={icon} />
    </span>
    <span className="truncate">{label}</span>
  </button>
)

const SidebarSection = ({ title, children }) => (
  <div className="mt-4">
    <p className="px-3 pb-2 text-xs uppercase tracking-wide text-[#7b7b7b]">
      {title}
    </p>
    <div className="space-y-1">{children}</div>
  </div>
)

const TopBar = ({ title }) => (
  <div className="flex items-center justify-between px-8 pt-6">
    <div className="flex items-center gap-2 text-sm text-[#d9d9d9]">
      <span className="font-medium">{title}</span>
      <Icon name="caret" className="text-[#8d8d8d]" />
    </div>
    <div className="flex items-center gap-4 text-[#b0b0b0]">
      <button type="button" className="flex items-center gap-2 text-sm">
        <Icon name="share" />
        <span>Share</span>
      </button>
      <button type="button" aria-label="Menu" className="rounded-full p-2 hover:bg-[#2a2a2a]">
        <Icon name="menu" />
      </button>
    </div>
  </div>
)

const ChatInput = ({ placeholder, quote, onClearQuote }) => (
  <div className="mx-auto w-full max-w-3xl px-6 pb-8">
    {quote ? (
      <div className="mb-3 flex items-center justify-between rounded-lg bg-[#2b2b2b] px-4 py-3 text-sm text-[#d6d6d6]">
        <span className="truncate">{formatSelectionLabel(quote)}</span>
        <button
          type="button"
          onClick={onClearQuote}
          className="ml-3 rounded-full p-1 text-[#9c9c9c] hover:text-white"
          aria-label="Clear selection"
        >
          <Icon name="x" />
        </button>
      </div>
    ) : null}
    <div className="flex items-center gap-3 rounded-full border border-[#2a2a2a] bg-[#2b2b2b] px-4 py-3 shadow-gpt-soft">
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#3a3a3a] text-white/90"
      >
        <Icon name="plus" />
      </button>
      <input
        type="text"
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-[#e8e8e8] placeholder:text-[#9b9b9b] focus:outline-none"
      />
      <button type="button" className="rounded-full p-2 text-[#9b9b9b] hover:text-white">
        <Icon name="mic" />
      </button>
      <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1d4ed8] text-white">
        <Icon name="voice" />
      </button>
    </div>
  </div>
)

export default function App() {
  const [activeChatId, setActiveChatId] = useState(null)
  const [selection, setSelection] = useState(null)
  const [quote, setQuote] = useState('')
  const chatContainerRef = useRef(null)

  const activeChatLabel = useMemo(() => {
    const match = chats.find((chat) => chat.id === activeChatId)
    return match?.label || 'ChatGPT 5.2'
  }, [activeChatId])

  const handleSelection = () => {
    const selectionObj = window.getSelection()
    if (!selectionObj || selectionObj.isCollapsed) {
      setSelection(null)
      return
    }
    const text = selectionObj.toString().trim()
    if (!text) {
      setSelection(null)
      return
    }
    const anchorNode = selectionObj.anchorNode
    if (chatContainerRef.current && anchorNode && !chatContainerRef.current.contains(anchorNode)) {
      setSelection(null)
      return
    }
    const range = selectionObj.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    if (!rect || rect.width === 0) {
      setSelection(null)
      return
    }
    setSelection({ text, rect })
  }

  const handleAsk = () => {
    if (!selection?.text) return
    setQuote(selection.text)
    setSelection(null)
    const selectionObj = window.getSelection()
    if (selectionObj) selectionObj.removeAllRanges()
  }

  return (
    <div className="min-h-screen bg-gpt-bg text-gpt-text">
      <div className="flex min-h-screen">
        <aside className="flex h-screen w-72 flex-col bg-gpt-panel">
          <div className="px-3 pt-5">
            <div className="flex items-center gap-2 px-2 pb-4 text-white">
              <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-black">
                <img
                  src={gptLogo}
                  alt="ChatGPT"
                  className="h-6 w-6 object-contain"
                />
              </div>
            </div>
            <div className="space-y-1">
              {sidebarTop.map((item) => (
                <SidebarItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  onClick={() => {
                    if (item.id === 'new') setActiveChatId(null)
                  }}
                  muted={false}
                />
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-thin">
            <div className="mt-4 space-y-1">
              {sidebarScrollExtras.map((item) => (
                <SidebarItem key={item.id} icon={item.icon} label={item.label} muted={false} />
              ))}
            </div>
            <SidebarSection title="GPTs">
              {gptItems.map((item) => (
                <SidebarItem key={item.id} icon={item.icon} label={item.label} muted />
              ))}
            </SidebarSection>
            <SidebarSection title="Projects">
              {projects.map((item) => (
                <SidebarItem key={item.id} icon={item.icon} label={item.label} muted />
              ))}
              <button type="button" className="mt-1 flex items-center gap-2 px-3 py-2 text-sm text-[#a6a6a6]">
                <span className="text-lg">...</span>
                <span>See more</span>
              </button>
            </SidebarSection>
            <SidebarSection title="Your chats">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => setActiveChatId(chat.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition hover:bg-[#2b2b2b] ${
                    activeChatId === chat.id ? 'bg-[#2b2b2b] text-white' : 'text-[#cfcfcf]'
                  }`}
                >
                  <span className="truncate">{chat.label}</span>
                </button>
              ))}
            </SidebarSection>
          </div>

          <div className="px-3 pb-4 pt-3 text-sm text-[#c9c9c9]">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2b2b2b]">
                <span className="text-xs font-semibold">SH</span>
              </div>
              <div className="leading-tight">
                <div className="font-medium">Sue Hwang</div>
                <div className="text-xs text-[#8d8d8d]">Plus</div>
              </div>
            </div>
          </div>
        </aside>

        <main className="relative flex flex-1 flex-col overflow-hidden">
          <TopBar title={activeChatId ? 'ChatGPT 5.2 Thinking' : 'ChatGPT 5.2'} />

          {!activeChatId ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6">
              <h1 className="text-3xl font-semibold text-white">Hey, Sue. Ready to dive in?</h1>
              <div className="mt-10 w-full">
                <ChatInput placeholder="Ask anything" />
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col">
              <div
                ref={chatContainerRef}
                onMouseUp={handleSelection}
                className="selection-highlight flex-1 overflow-y-auto px-8 pb-10 pt-6 scrollbar-thin"
              >
                <div className="mx-auto max-w-3xl">
                  <div className="rounded-2xl bg-[#202020] p-6 text-sm leading-relaxed text-[#e5e5e5] shadow-gpt-soft">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="font-semibold">Target API level requirements (release/update blockers)</p>
                        <p className="text-[#b5b5b5]">
                          Example: Starting Aug 31, 2025, new apps/updates must target Android 15 (API 35).
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold">Data safety section (Play Console data safety form)</p>
                        <p className="text-[#b5b5b5]">
                          How to disclose data collection/sharing in Play Console.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold">Payments policy + Play Billing</p>
                        <p className="text-[#b5b5b5]">
                          Requirements and exemptions for digital goods/services.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold">Core App Quality guidelines</p>
                        <p className="text-[#b5b5b5]">
                          General quality checklist covering crashes, UX, and stability.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold">Families Policies</p>
                        <p className="text-[#b5b5b5]">
                          Extra rules for apps that may be used by children or families.
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 space-y-4">
                      <p className="text-base font-semibold">
                        Next steps (tell me what fits your app and I will tailor the checklist)
                      </p>
                      <ol className="list-decimal space-y-2 pl-5 text-[#d6d6d6]">
                        <li>Is login required?</li>
                        <li>Any paid features or subscriptions?</li>
                        <li>What permissions are used (camera, location, contacts)?</li>
                        <li>Any UGC (posts/comments/chat)?</li>
                        <li>Could minors use the app?</li>
                      </ol>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-xs text-[#9c9c9c]">
                      <span className="rounded-full bg-[#2a2a2a] px-2 py-1">Sources</span>
                    </div>

                    <div className="mt-6 flex items-center gap-3 text-[#8f8f8f]">
                      {actionIcons.map((icon) => (
                        <button key={icon} type="button" className="rounded-full p-2 hover:bg-[#2a2a2a]">
                          <Icon name={icon} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <ChatInput placeholder="Ask anything" quote={quote} onClearQuote={() => setQuote('')} />
            </div>
          )}

          {selection ? (
            <button
              type="button"
              onClick={handleAsk}
              style={{
                top: Math.max(16, selection.rect.top - 36),
                left: selection.rect.left + selection.rect.width / 2,
              }}
              className="fixed z-50 -translate-x-1/2 rounded-full bg-[#2d2d2d] px-4 py-2 text-xs text-white shadow-gpt-soft"
            >
              Ask ChatGPT
            </button>
          ) : null}
        </main>
      </div>
    </div>
  )
}
