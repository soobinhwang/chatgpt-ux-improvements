import { useEffect, useMemo, useRef, useState } from 'react'
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
  { id: 'chat-1', label: 'Design feedback' },
  { id: 'chat-2', label: 'Project ideas' },
  { id: 'chat-3', label: 'Writing help' },
  { id: 'chat-4', label: 'Research notes' },
  { id: 'chat-5', label: 'Next steps' },
]

const actionButtons = [
  { id: 'copy', label: 'Copy' },
  { id: 'thumb-up', label: 'Good response' },
  { id: 'thumb-down', label: 'Bad response' },
  { id: 'share', label: 'Share' },
  { id: 'repeat', label: 'Try again...', sublabel: 'Used GPT-5.2' },
  { id: 'dots', label: 'More' },
]

const defaultChatState = {
  messages: [],
  queue: [],
  isThinking: false,
  queueingEnabled: true,
}

const chatThreads = {
  'chat-1': [
    {
      id: 'u1',
      role: 'user',
      content: 'Can you review this landing page hero for clarity and impact?',
    },
    {
      id: 'a1',
      role: 'assistant',
      title: 'Design feedback summary (hero section)',
      items: [
        {
          title: 'Value prop clarity',
          body: 'Lead with a tighter promise in the first line; keep the benefit and audience in one sentence.',
        },
        {
          title: 'Visual hierarchy',
          body: 'Increase headline size slightly and reduce the subhead width to create a cleaner reading path.',
        },
        {
          title: 'Primary action',
          body: 'Use one dominant CTA and move the secondary action to a text link to reduce choice friction.',
        },
        {
          title: 'Social proof',
          body: 'Add a single line of credibility (logos or stat) just below the buttons to boost trust.',
        },
      ],
      footer: 'If you share your target audience, I can tailor the copy and CTA wording.',
    },
  ],
  'chat-2': [
    {
      id: 'u1',
      role: 'user',
      content: 'Give me a few side project ideas for a product designer.',
    },
    {
      id: 'a1',
      role: 'assistant',
      title: 'Five project ideas tailored for a product designer',
      items: [
        {
          title: 'Onboarding teardown + redesign',
          body: 'Pick a popular app and redesign its onboarding for a specific persona.',
        },
        {
          title: 'Feature backlog cleanup',
          body: 'Turn a messy roadmap into a prioritized, user‑outcome focused plan.',
        },
        {
          title: 'UX audit mini‑case study',
          body: 'Run a heuristic audit and turn findings into 3 focused redesigns.',
        },
        {
          title: 'AI prompt playground',
          body: 'Design a small tool that helps users build and reuse effective prompts.',
        },
        {
          title: 'Feedback loop prototype',
          body: 'Design a lightweight feedback widget and its analytics summary.',
        },
      ],
      footer: 'Tell me which one you like and I can scope it into a 1‑week plan.',
    },
  ],
  'chat-3': [
    {
      id: 'u1',
      role: 'user',
      content: 'Rewrite this bio to be shorter and clearer.',
    },
    {
      id: 'a1',
      role: 'assistant',
      title: 'Short, clear bio options',
      items: [
        {
          title: 'Option A (direct)',
          body: 'Product designer focused on clear flows, fast feedback, and measurable outcomes.',
        },
        {
          title: 'Option B (collaborative)',
          body: 'Product designer who pairs research with rapid prototyping to ship thoughtful UX.',
        },
        {
          title: 'Option C (outcome‑oriented)',
          body: 'I design product experiences that reduce friction and improve activation and retention.',
        },
      ],
      footer: 'Share your target role and I’ll tune the tone.',
    },
  ],
  'chat-4': [
    {
      id: 'u1',
      role: 'user',
      content: 'Summarize key themes from these interviews.',
    },
    {
      id: 'a1',
      role: 'assistant',
      title: 'Interview synthesis: key themes',
      items: [
        {
          title: 'Decision anxiety',
          body: 'Users hesitate without clear defaults or guidance at key steps.',
        },
        {
          title: 'Trust signals matter',
          body: 'Security and legitimacy cues strongly influence willingness to proceed.',
        },
        {
          title: 'Time pressure',
          body: 'People prefer short flows and quick wins over complex setup.',
        },
        {
          title: 'Desire for personalization',
          body: 'Users want the product to “remember” their preferences.',
        },
      ],
      footer: 'Want a journey map or a set of prioritized opportunities?',
    },
  ],
  'chat-5': [
    {
      id: 'u1',
      role: 'user',
      content: 'What should I do next after user testing?',
    },
    {
      id: 'a1',
      role: 'assistant',
      title: 'Suggested next steps',
      items: [
        {
          title: 'Cluster issues by severity',
          body: 'Group findings into critical, moderate, and minor to focus effort.',
        },
        {
          title: 'Define the top 3 fixes',
          body: 'Pick the smallest set of changes that improve task success.',
        },
        {
          title: 'Prototype the changes',
          body: 'Update the flow and validate quickly with 2–3 users.',
        },
        {
          title: 'Document learnings',
          body: 'Capture patterns, quotes, and the decisions you made.',
        },
      ],
      footer: 'If you share the test goals, I can help prioritize fixes.',
    },
  ],
}

const formatSelectionLabel = (text) => {
  const trimmed = text.replace(/\s+/g, ' ').trim()
  if (trimmed.length <= 80) return `“${trimmed}”`
  return `“${trimmed.slice(0, 80)}...”`
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
    case 'dots':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="currentColor">
          <circle cx="6" cy="12" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="18" cy="12" r="1.6" />
        </svg>
      )
    case 'group':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="9" cy="8" r="3" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M4 19a5 5 0 0 1 10 0" />
          <path d="M14.5 19a4 4 0 0 1 6.5-2" />
        </svg>
      )
    case 'pin':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M8 3h8l-1.5 4.5 2.5 2.5-4.5 1.5-2 6-2-6L4 10l2.5-2.5L8 3z" />
          <path d="M12 17v4" />
        </svg>
      )
    case 'flag':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M5 3v18" />
          <path d="M5 4h10l-1.5 3 1.5 3H5" />
        </svg>
      )
    case 'trash':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M4 7h16" />
          <path d="M9 7V4h6v3" />
          <path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
        </svg>
      )
    case 'chevron-right':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M9 6l6 6-6 6" />
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
    case 'reply':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M9 7H5v4" />
          <path d="M5 11c4.5 0 8.5-2 12-6" />
        </svg>
      )
    case 'branch':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="6" cy="6" r="2.5" />
          <circle cx="6" cy="18" r="2.5" />
          <circle cx="18" cy="18" r="2.5" />
          <path d="M6 8.5v7" />
          <path d="M8.5 6H14a4 4 0 0 1 4 4v5.5" />
        </svg>
      )
    case 'back':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      )
    case 'stop':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="currentColor">
          <rect x="7" y="7" width="10" height="10" rx="2" />
        </svg>
      )
    case 'arrow-up':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5l-5 5M12 5l5 5" />
          <path d="M12 5v14" />
        </svg>
      )
    case 'copy':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="8.5" y="4" width="11" height="11" rx="3.8" />
          <rect x="4" y="8.5" width="11" height="11" rx="3.8" />
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

const TopBar = ({
  title,
  onOpenBranches,
  branchCount,
  isBranchesActive,
  showBranches,
  showActions,
  menuOpen,
  setMenuOpen,
}) => {
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen, setMenuOpen])

  return (
    <div className="flex items-center justify-between px-8 pt-6">
      <div className="flex items-center gap-2 text-sm text-[#d9d9d9]">
        <span className="font-medium">{title}</span>
        <Icon name="caret" className="text-[#8d8d8d]" />
      </div>
      {showActions ? (
        <div className="relative flex items-center gap-4 text-[#b0b0b0]" ref={menuRef}>
          {showBranches ? (
            <button
              type="button"
              onClick={onOpenBranches}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
                isBranchesActive
                  ? 'border-[#3a3a3a] bg-[#242424] text-white'
                  : 'border-[#2a2a2a] text-[#cfcfcf] hover:bg-[#2a2a2a]'
              }`}
            >
              <Icon name="branch" className="text-white/80" />
              <span>Branches</span>
            </button>
          ) : null}
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-[#2a2a2a] px-3 py-1.5 text-sm text-[#cfcfcf] transition hover:bg-[#2a2a2a]"
          >
            <Icon name="share" />
            <span>Share</span>
          </button>
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="rounded-full border border-[#2a2a2a] p-2 text-[#cfcfcf] transition hover:bg-[#2a2a2a]"
          >
            <Icon name="dots" />
          </button>
          {menuOpen ? (
            <div className="absolute right-0 top-12 w-64 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-2 text-sm text-[#e0e0e0] shadow-gpt-soft">
              <button type="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:bg-[#2a2a2a]">
                <Icon name="group" />
                <span>Start a group chat</span>
              </button>
              <button type="button" className="flex w-full items-center justify-between rounded-xl px-3 py-2 hover:bg-[#2a2a2a]">
                <span className="flex items-center gap-3">
                  <Icon name="folder" />
                  <span>Move to project</span>
                </span>
                <Icon name="chevron-right" className="text-[#8c8c8c]" />
              </button>
              <button type="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:bg-[#2a2a2a]">
                <Icon name="pin" />
                <span>Pin chat</span>
              </button>
              <button type="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:bg-[#2a2a2a]">
                <Icon name="archive" />
                <span>Archive</span>
              </button>
              <button type="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:bg-[#2a2a2a]">
                <Icon name="flag" />
                <span>Report</span>
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-red-400 hover:bg-[#2a2a2a]"
              >
                <Icon name="trash" className="text-red-400" />
                <span>Delete</span>
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

const ChatInput = ({
  placeholder,
  quote,
  onClearQuote,
  value,
  onChange,
  onSend,
  isThinking,
  onStop,
  inputRef,
  queue,
  queueingEnabled,
  queueMenuId,
  onToggleQueueMenu,
  onSendNow,
  onDeleteQueueItem,
  onEditQueueItem,
  onToggleQueueing,
}) => {
  const [internalValue, setInternalValue] = useState('')
  const inputValue = value ?? internalValue

  const handleChange = (nextValue) => {
    if (onChange) {
      onChange(nextValue)
    } else {
      setInternalValue(nextValue)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed) return
    if (onSend) {
      onSend(trimmed)
    }
    if (!onChange) {
      setInternalValue('')
    }
  }

  const canSend = inputValue.trim().length > 0

  const hasQueue = queue && queue.length > 0
  const showQueueSection = hasQueue || queueingEnabled === false

  return (
    <div className="mx-auto w-full max-w-3xl px-6 pb-8">
      {showQueueSection ? (
        <div className="relative z-10 -mb-4 overflow-hidden rounded-[28px] border border-[#2a2a2a] bg-[#2b2b2b]/70 shadow-gpt-soft backdrop-blur-md">
          {!hasQueue && queueingEnabled === false ? (
            <div className="flex items-center justify-between px-4 py-3 text-xs text-[#cfcfcf]">
              <span>Queueing is off</span>
              <button
                type="button"
                onClick={onToggleQueueing}
                className="rounded-full bg-[#2a2a2a] px-3 py-1 text-[11px] text-white hover:bg-[#333333]"
              >
                Turn on
              </button>
            </div>
          ) : null}
          {hasQueue ? (
            <div className="flex flex-col">
              {queue.map((item) => (
                <div key={item.id} className="relative px-5 py-2">
                  <div className="flex items-center gap-2.5 text-[13px] font-medium text-white/75">
                    <Icon name="reply" className="h-3.5 w-3.5 text-white/35" />
                    <span className="min-w-0 flex-1 truncate">{item.content}</span>
                    <div className="flex items-center gap-2 text-white/40">
                      <button
                        type="button"
                        onClick={() => onSendNow(item.id)}
                        className="rounded-lg p-1 hover:bg-white/5 hover:text-white"
                      >
                        <Icon name="arrow-up" className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteQueueItem(item.id)}
                        className="rounded-lg p-1 hover:bg-white/5 hover:text-white"
                      >
                        <Icon name="trash" className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleQueueMenu(item.id)}
                        className="rounded-lg p-1 hover:bg-white/5 hover:text-white"
                      >
                        <Icon name="dots" className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  {queueMenuId === item.id ? (
                    <div className="absolute right-2 top-[calc(100%+6px)] z-20 w-48 rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] p-2 text-xs text-[#e0e0e0] shadow-gpt-soft">
                      <button
                        type="button"
                        onClick={() => onEditQueueItem(item.id)}
                        className="flex w-full items-center rounded-lg px-3 py-2 text-left hover:bg-[#2a2a2a]"
                      >
                        Edit message
                      </button>
                      <button
                        type="button"
                        onClick={onToggleQueueing}
                        className="flex w-full items-center rounded-lg px-3 py-2 text-left hover:bg-[#2a2a2a]"
                      >
                        {queueingEnabled ? 'Turn off queueing' : 'Turn on queueing'}
                      </button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
      <form
        onSubmit={handleSubmit}
        className={`relative z-0 border border-[#2a2a2a] bg-[#2b2b2b] shadow-gpt-soft ${
          quote ? 'rounded-2xl px-3 py-3' : 'rounded-full px-4 py-3'
        }`}
      >
        {quote ? (
          <div className="mb-2 flex items-center justify-between rounded-xl bg-[#3a3a3a] px-3 py-2 text-sm text-[#d6d6d6]">
            <span className="flex min-w-0 items-center gap-2 text-[#e0e0e0]">
              <Icon name="reply" className="text-[#b5b5b5]" />
              <span className="truncate">{formatSelectionLabel(quote)}</span>
            </span>
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
        <div className={`flex items-center gap-3 ${quote ? 'px-1' : ''}`}>
          <button
            type="button"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#3a3a3a] text-white/90"
          >
            <Icon name="plus" />
          </button>
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={(event) => handleChange(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm text-[#e8e8e8] placeholder:text-[#9b9b9b] focus:outline-none"
          />
          <button type="button" className="rounded-full p-2 text-[#9b9b9b] hover:text-white">
            <Icon name="mic" />
          </button>
          {isThinking && !canSend ? (
            <button
              type="button"
              onClick={onStop}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1d4ed8] text-white"
            >
              <Icon name="stop" />
            </button>
          ) : canSend ? (
            <button
              type="submit"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1d4ed8] text-white"
            >
              <Icon name="arrow-up" />
            </button>
          ) : (
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1d4ed8] text-white"
            >
              <Icon name="voice" />
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

const BranchInput = ({ placeholder, value, onChange, onSend, disabled }) => (
  <form
    onSubmit={(event) => {
      event.preventDefault()
      onSend()
    }}
    className="w-full rounded-full border border-[#2a2a2a] bg-[#2b2b2b] px-4 py-3 shadow-gpt-soft"
  >
    <div className="flex items-center gap-3">
      <button
        type="button"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#3a3a3a] text-white/90"
      >
        <Icon name="plus" />
      </button>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="min-w-0 flex-1 bg-transparent text-sm text-[#e8e8e8] placeholder:text-[#9b9b9b] focus:outline-none disabled:opacity-50"
      />
      <button type="button" className="rounded-full p-2 text-[#9b9b9b] hover:text-white">
        <Icon name="mic" />
      </button>
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1d4ed8] text-white disabled:opacity-50"
      >
        <Icon name="voice" />
      </button>
    </div>
  </form>
)

const BranchPanel = ({
  open,
  view,
  branches,
  activeBranch,
  branchInput,
  onBranchInputChange,
  onSendBranchMessage,
  onClose,
  onBack,
  onOpenBranch,
}) => {
  if (!open) return null

  return (
    <aside className="fixed right-6 top-20 z-40 flex h-[calc(100vh-6rem)] w-80 flex-col rounded-2xl border border-[#2a2a2a] bg-[#1b1b1b] shadow-gpt-soft">
      <div className="flex items-center justify-between border-b border-[#2a2a2a] px-4 py-3 text-sm text-[#e0e0e0]">
        <div className="flex items-center gap-2">
          {view === 'active' ? (
            <button
              type="button"
              onClick={onBack}
              className="rounded-full p-1 text-[#9c9c9c] hover:bg-[#2a2a2a] hover:text-white"
              aria-label="Back to history"
            >
              <Icon name="back" />
            </button>
          ) : null}
          <span className="font-medium">{view === 'active' ? 'Branch chat' : 'Branch chats'}</span>
          {view === 'history' && branches.length > 0 ? (
            <span className="rounded-full bg-[#2a2a2a] px-2 text-xs text-[#d0d0d0]">{branches.length}</span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-[#9c9c9c] hover:bg-[#2a2a2a] hover:text-white"
          aria-label="Close branches"
        >
          <Icon name="x" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 text-sm text-[#cfcfcf] scrollbar-thin">
        {view === 'history' ? (
          branches.length === 0 ? (
            <div className="flex h-full items-center justify-center px-4 text-center">
              <div className="space-y-2">
                <p className="text-sm font-medium text-[#d6d6d6]">No branches yet.</p>
                <p className="text-xs text-[#8f8f8f]">
                  Create one from a selection. Branch history is saved per chat.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {branches.map((branch) => (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() => onOpenBranch(branch)}
                  className="flex w-full flex-col gap-1 rounded-xl border border-[#2a2a2a] bg-[#242424] px-3 py-3 text-left transition hover:bg-[#2b2b2b]"
                >
                  <div className="flex items-center justify-between text-xs text-[#9c9c9c]">
                    <span>Branch</span>
                    <span>{branch.time}</span>
                  </div>
                  <div className="text-sm text-white">{branch.title}</div>
                  <div className="text-xs text-[#b5b5b5]">{branch.snippet}</div>
                </button>
              ))}
            </div>
          )
        ) : (
            <div className="space-y-3">
              {activeBranch ? (
                <>
                  <div className="rounded-xl bg-[#2f2f2f] px-3 py-2 text-xs text-[#cfcfcf]">
                    Branching from: {formatSelectionLabel(activeBranch.seed)}
                  </div>
                  <div className="space-y-3">
                    {activeBranch.messages.length === 0 ? (
                      <p className="text-[#b7b7b7]">Start a focused branch conversation here.</p>
                    ) : (
                      activeBranch.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs ${
                              message.role === 'user'
                                ? 'bg-[#0b3f8f] text-white'
                                : 'bg-[#2a2a2a] text-[#e0e0e0]'
                            }`}
                          >
                            {message.content}
                          </div>
                        </div>
                      ))
                    )}
                    {activeBranch.isThinking ? (
                      <div className="text-xs text-[#9c9c9c]">Thinking…</div>
                    ) : null}
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-xl border border-dashed border-[#2a2a2a] px-3 py-4 text-center text-[#9c9c9c]">
                    No active branch yet. Create one from a selection.
                  </div>
                  <p className="text-[#b7b7b7]">Start a focused branch conversation here.</p>
                </>
              )}
          </div>
        )}
      </div>

      {view === 'active' ? (
        <div className="border-t border-[#2a2a2a] px-4 py-4">
          <BranchInput
            placeholder="Ask in branch"
            value={branchInput}
            onChange={onBranchInputChange}
            onSend={onSendBranchMessage}
            disabled={!activeBranch}
          />
        </div>
      ) : (
        <div className="border-t border-[#2a2a2a] px-4 py-3 text-xs text-[#9c9c9c]"> </div>
      )}
    </aside>
  )
}

export default function App() {
  const [activeChatId, setActiveChatId] = useState(null)
  const [selection, setSelection] = useState(null)
  const [quote, setQuote] = useState('')
  const [branches, setBranches] = useState([])
  const [activeBranchId, setActiveBranchId] = useState(null)
  const [branchInput, setBranchInput] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hoveredAction, setHoveredAction] = useState(null)
  const [chatStates, setChatStates] = useState({})
  const [chatInput, setChatInput] = useState('')
  const [queueMenuId, setQueueMenuId] = useState(null)
  const [isBranchPanelOpen, setIsBranchPanelOpen] = useState(false)
  const [branchView, setBranchView] = useState('history')
  const chatContainerRef = useRef(null)
  const mainInputRef = useRef(null)
  const mainTimersRef = useRef({})
  const getSelectableAncestor = (node) => {
    if (!node) return null
    const element = node.nodeType === 1 ? node : node.parentElement
    if (!element) return null
    return element.closest('[data-selectable="assistant"]')
  }

  const activeChatLabel = useMemo(() => {
    const match = chats.find((chat) => chat.id === activeChatId)
    return match?.label || 'ChatGPT 5.2'
  }, [activeChatId])

  const currentMessages = useMemo(() => {
    if (!activeChatId) return []
    return chatThreads[activeChatId] || []
  }, [activeChatId])

  const activeChatState = useMemo(() => {
    if (!activeChatId) return defaultChatState
    return chatStates[activeChatId] || defaultChatState
  }, [chatStates, activeChatId])

  const combinedMessages = useMemo(() => {
    if (!activeChatId) return []
    return [...currentMessages, ...activeChatState.messages]
  }, [currentMessages, activeChatState, activeChatId])

  const turns = useMemo(() => {
    const result = []
    let current = null

    combinedMessages.forEach((message) => {
      if (message.role === 'user') {
        if (current) result.push(current)
        current = { id: message.id, user: message, assistant: null }
        return
      }

      if (!current) {
        result.push({ id: message.id, user: null, assistant: message })
        return
      }

      if (!current.assistant) {
        current.assistant = message
        result.push(current)
        current = null
        return
      }

      result.push(current)
      current = { id: message.id, user: null, assistant: message }
    })

    if (current) result.push(current)
    return result
  }, [combinedMessages])

  const activeBranch = useMemo(
    () => branches.find((branch) => branch.id === activeBranchId) || null,
    [branches, activeBranchId]
  )

  const updateChatState = (chatId, updater) => {
    setChatStates((prev) => {
      const current = prev[chatId] || defaultChatState
      const updated = updater(current)
      return { ...prev, [chatId]: updated }
    })
  }

  const clearChatTimer = (chatId) => {
    const timer = mainTimersRef.current[chatId]
    if (timer) {
      window.clearTimeout(timer)
      delete mainTimersRef.current[chatId]
    }
  }

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
    const assistantAnchor = getSelectableAncestor(selectionObj.anchorNode)
    const assistantFocus = getSelectableAncestor(selectionObj.focusNode)
    if (!assistantAnchor || !assistantFocus || assistantAnchor !== assistantFocus) {
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

  const handleCreateBranch = () => {
    if (!selection?.text) return
    const trimmed = selection.text.replace(/\s+/g, ' ').trim()
    const entry = {
      id: `branch-${Date.now()}`,
      title: trimmed.length > 40 ? `${trimmed.slice(0, 40)}...` : trimmed,
      snippet: formatSelectionLabel(trimmed),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      seed: trimmed,
      messages: [],
      isThinking: false,
    }
    setBranches((prev) => [entry, ...prev])
    setActiveBranchId(entry.id)
    setIsBranchPanelOpen(true)
    setBranchView('active')
    setSelection(null)
    const selectionObj = window.getSelection()
    if (selectionObj) selectionObj.removeAllRanges()
  }

  const sendBranchMessage = () => {
    if (!activeBranch || !branchInput.trim()) return
    const content = branchInput.trim()
    const branchId = activeBranch.id
    setBranchInput('')
    setBranches((prev) =>
      prev.map((branch) =>
        branch.id === branchId
          ? {
              ...branch,
              messages: [
                ...branch.messages,
                { id: `msg-${Date.now()}`, role: 'user', content },
              ],
              isThinking: true,
            }
          : branch
      )
    )

    window.setTimeout(() => {
      const response = `Got it. I'll focus this branch on: ${content}`
      setBranches((prev) =>
        prev.map((branch) =>
          branch.id === branchId
            ? {
                ...branch,
                messages: [
                  ...branch.messages,
                  { id: `msg-${Date.now()}-a`, role: 'assistant', content: response },
                ],
                isThinking: false,
              }
            : branch
        )
      )
    }, 700)
  }

  const sendMainMessage = (content) => {
    if (!activeChatId) return
    const trimmed = content.trim()
    if (!trimmed) return
    let queued = false

    updateChatState(activeChatId, (state) => {
      if (state.isThinking) {
        if (state.queueingEnabled) {
          queued = true
          return {
            ...state,
            queue: [...state.queue, { id: `queue-${Date.now()}`, content: trimmed }],
          }
        }
        clearChatTimer(activeChatId)
        return {
          ...state,
          isThinking: true,
          messages: [...state.messages, { id: `msg-${Date.now()}`, role: 'user', content: trimmed }],
          queue: state.queue,
        }
      }

      return {
        ...state,
        messages: [...state.messages, { id: `msg-${Date.now()}`, role: 'user', content: trimmed }],
        isThinking: true,
      }
    })

    setChatInput('')

    if (queued) return

    const scheduleResponse = (message) => {
      clearChatTimer(activeChatId)
      mainTimersRef.current[activeChatId] = window.setTimeout(() => {
        let nextContent = null
        updateChatState(activeChatId, (state) => {
          const reply = {
            id: `msg-${Date.now()}-a`,
            role: 'assistant',
            content: `Got it. Here’s a quick response to: ${message}`,
          }

          if (state.queueingEnabled && state.queue.length > 0) {
            const [nextItem, ...rest] = state.queue
            nextContent = nextItem.content
            return {
              ...state,
              messages: [
                ...state.messages,
                reply,
                { id: `msg-${Date.now()}-q`, role: 'user', content: nextItem.content },
              ],
              isThinking: true,
              queue: rest,
            }
          }

          return {
            ...state,
            messages: [...state.messages, reply],
            isThinking: false,
          }
        })

        if (nextContent) {
          scheduleResponse(nextContent)
        }
      }, 3000)
    }

    scheduleResponse(trimmed)
  }

  const stopMainThinking = () => {
    if (!activeChatId) return
    clearChatTimer(activeChatId)
    updateChatState(activeChatId, (state) => ({ ...state, isThinking: false }))
  }

  const sendQueuedNow = (id) => {
    if (!activeChatId) return
    const item = activeChatState.queue.find((q) => q.id === id)
    if (!item) return
    updateChatState(activeChatId, (state) => ({
      ...state,
      queue: state.queue.filter((q) => q.id !== id),
    }))
    sendMainMessage(item.content)
  }

  const deleteQueued = (id) => {
    if (!activeChatId) return
    updateChatState(activeChatId, (state) => ({
      ...state,
      queue: state.queue.filter((q) => q.id !== id),
    }))
    setQueueMenuId(null)
  }

  const editQueued = (id) => {
    if (!activeChatId) return
    const item = activeChatState.queue.find((q) => q.id === id)
    if (!item) return
    updateChatState(activeChatId, (state) => ({
      ...state,
      queue: state.queue.filter((q) => q.id !== id),
    }))
    setChatInput(item.content)
    setQueueMenuId(null)
    window.setTimeout(() => {
      mainInputRef.current?.focus()
    }, 0)
  }

  const toggleQueueing = () => {
    if (!activeChatId) return
    updateChatState(activeChatId, (state) => ({
      ...state,
      queueingEnabled: !state.queueingEnabled,
    }))
    setQueueMenuId(null)
  }

  useEffect(() => {
    if (!activeBranchId) return
    setBranchInput('')
  }, [activeBranchId])

  useEffect(() => {
    if (!activeChatId) {
      setIsMenuOpen(false)
    }
  }, [activeChatId])

  useEffect(() => {
    if (!activeChatId) return
    setChatInput('')
    setQueueMenuId(null)
  }, [activeChatId])

  useEffect(() => {
    if (!chatContainerRef.current) return
    const el = chatContainerRef.current
    const scrollToBottom = () => {
      el.scrollTop = el.scrollHeight
    }
    scrollToBottom()
    window.requestAnimationFrame(scrollToBottom)
  }, [turns, activeChatId])

  return (
    <div className="h-screen bg-gpt-bg text-gpt-text">
      <div className="flex h-full">
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
                    if (item.id === 'new') {
                      setActiveChatId(null)
                      setIsBranchPanelOpen(false)
                      setBranchView('history')
                      setActiveBranchId(null)
                    }
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

        <main className="relative flex flex-1 min-h-0 flex-col overflow-hidden">
          <TopBar
            title="ChatGPT 5.2"
            onOpenBranches={() => {
              if (isBranchPanelOpen && branchView === 'history') {
                setIsBranchPanelOpen(false)
              } else {
                setIsBranchPanelOpen(true)
                setBranchView('history')
              }
            }}
            branchCount={branches.length}
            isBranchesActive={isBranchPanelOpen && branchView === 'history'}
            showBranches={Boolean(activeChatId)}
            showActions={Boolean(activeChatId)}
            menuOpen={isMenuOpen}
            setMenuOpen={setIsMenuOpen}
          />

          {!activeChatId ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6">
              <h1 className="text-3xl font-medium text-white">Hey, Sue. Ready to dive in?</h1>
              <div className="mt-10 w-full">
                <ChatInput placeholder="Ask anything" />
              </div>
            </div>
          ) : (
            <div className="relative flex flex-1 min-h-0 flex-col">
              <BranchPanel
                open={isBranchPanelOpen}
                view={branchView}
                branches={branches}
                activeBranch={activeBranch}
                branchInput={branchInput}
                onBranchInputChange={setBranchInput}
                onSendBranchMessage={sendBranchMessage}
                onClose={() => setIsBranchPanelOpen(false)}
                onBack={() => setBranchView('history')}
                onOpenBranch={(branch) => {
                  setActiveBranchId(branch.id)
                  setIsBranchPanelOpen(true)
                  setBranchView('active')
                }}
              />
              <div
                ref={chatContainerRef}
                onMouseUp={handleSelection}
                className={`selection-highlight flex-1 min-h-0 overflow-y-auto px-8 pb-32 pt-6 scrollbar-thin ${
                  isBranchPanelOpen ? 'pr-[22rem]' : ''
                }`}
              >
                <div className="mx-auto flex max-w-3xl flex-col gap-10">
                  {turns.map((turn) => (
                      <div key={turn.id} className="space-y-6">
                        {turn.user ? (
                          <div className="flex justify-end">
                            <div className="max-w-xl rounded-2xl bg-[#0b3f8f] px-4 py-3 text-sm text-white shadow-gpt-soft">
                              <p className="leading-relaxed">{turn.user.content}</p>
                            </div>
                          </div>
                        ) : null}

                        {turn.assistant ? (
                          <div
                            className="text-sm leading-relaxed text-[#e5e5e5]"
                            data-selectable="assistant"
                          >
                            {turn.assistant.items ? (
                              <>
                                <p className="text-base font-semibold text-white">{turn.assistant.title}</p>
                                <div className="mt-4 space-y-4 text-[#d6d6d6]">
                                  {turn.assistant.items.map((item, index) => (
                                    <div key={item.title} className="space-y-1">
                                      <p className="font-semibold text-white">
                                        {index + 1}. {item.title}
                                      </p>
                                      <p className="text-[#b5b5b5]">{item.body}</p>
                                    </div>
                                  ))}
                                </div>
                                <p className="mt-5 text-[#b5b5b5]">{turn.assistant.footer}</p>
                              </>
                            ) : (
                              <p className="text-[#d6d6d6]">{turn.assistant.content}</p>
                            )}

                            <div className="mt-6 flex items-center gap-2 text-[#8f8f8f]">
                              {actionButtons.map((action) => {
                                const hoverKey = `${turn.id}-${action.id}`
                                return (
                                  <div key={action.id} className="relative">
                                    <button
                                      type="button"
                                      onMouseEnter={() => setHoveredAction(hoverKey)}
                                      onMouseLeave={() => setHoveredAction(null)}
                                      className="flex h-9 w-9 items-center justify-center rounded-xl text-[#c8c8c8] transition hover:bg-[#2a2a2a] hover:text-white"
                                    >
                                      <Icon name={action.id} className="h-5 w-5" />
                                    </button>
                                    {hoveredAction === hoverKey ? (
                                      <div
                                        className={`pointer-events-none absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 bg-black/90 px-4 py-2 text-xs font-semibold text-white shadow-gpt-soft ${
                                          action.sublabel ? 'rounded-2xl' : 'rounded-full'
                                        }`}
                                      >
                                        <div className={action.sublabel ? 'text-left' : 'text-center'}>
                                          {action.label}
                                          {action.sublabel ? (
                                            <div className="mt-1 text-[11px] font-medium text-white/70">
                                              {action.sublabel}
                                            </div>
                                          ) : null}
                                        </div>
                                      </div>
                                    ) : null}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ))}
                </div>
              </div>
              <div
                className="pointer-events-none fixed bottom-6 z-20 flex justify-center"
                style={{
                  left: '18rem',
                  right: isBranchPanelOpen ? 'calc(1.5rem + 20rem + 1.5rem)' : '1.5rem',
                }}
              >
                <div className="pointer-events-auto w-full max-w-3xl">
                  <ChatInput
                    placeholder="Ask anything"
                    quote={quote}
                    onClearQuote={() => setQuote('')}
                    value={chatInput}
                    onChange={setChatInput}
                    onSend={sendMainMessage}
                    isThinking={activeChatState.isThinking}
                    onStop={stopMainThinking}
                    inputRef={mainInputRef}
                    queue={activeChatState.queue}
                    queueingEnabled={activeChatState.queueingEnabled}
                    queueMenuId={queueMenuId}
                    onToggleQueueMenu={(id) => setQueueMenuId((prev) => (prev === id ? null : id))}
                    onSendNow={sendQueuedNow}
                    onDeleteQueueItem={deleteQueued}
                    onEditQueueItem={editQueued}
                    onToggleQueueing={toggleQueueing}
                  />
                </div>
              </div>
            </div>
          )}

          {selection ? (
            <div
              style={{
                top: Math.max(16, selection.rect.top - 104),
                left: selection.rect.left + selection.rect.width / 2,
              }}
              className="fixed z-50 -translate-x-1/2"
            >
              <div className="rounded-[22px] border border-[#2a2a2a] bg-[#1f1f1f] p-2 shadow-gpt-soft">
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleAsk}
                    className="rounded-full bg-[#1f1f1f] px-5 py-2 text-sm text-white transition hover:bg-[#2a2a2a]"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 7a3 3 0 0 0-3 3v3h3v4H5v-7a5 5 0 0 1 5-5h1v2H9z" />
                        <path d="M19 7a3 3 0 0 0-3 3v3h3v4h-4v-7a5 5 0 0 1 5-5h1v2h-2z" />
                      </svg>
                      <span>Ask ChatGPT</span>
                    </span>
                  </button>
                  <div className="h-px w-full bg-white/5" />
                  <button
                    type="button"
                    onClick={handleCreateBranch}
                    className="rounded-full bg-[#1f1f1f] px-5 py-2 text-sm text-white transition hover:bg-[#2a2a2a]"
                  >
                    <span className="flex items-center gap-2">
                      <Icon name="branch" className="text-white/80" />
                    <span>Create Branch</span>
                  </span>
                </button>
                </div>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  )
}
