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

const chatMessages = [
  {
    id: 'u1',
    role: 'user',
    content:
      'It’s a toy project where I improve or add new features to a current GPT browser interface for UX improvement.',
  },
  {
    id: 'a1',
    role: 'assistant',
    title: 'Here are a few cleaner, more natural options for that GitHub repo description (pick the one that matches your tone):',
    items: [
      {
        title: 'Short + clear (recommended)',
        body:
          'A toy project where I improve the current ChatGPT browser interface by adding UX-focused features and enhancements.',
      },
      {
        title: 'Slightly more “product-y”',
        body:
          'A toy project exploring UX improvements to the ChatGPT browser interface through new features, UI refinements, and usability tweaks.',
      },
      {
        title: 'More casual',
        body:
          'A small side project where I experiment with improving the ChatGPT browser UI and adding helpful UX features.',
      },
      {
        title: 'More specific about intent',
        body:
          'A toy project to prototype and test UX improvements for the ChatGPT browser interface, including feature additions and interaction polish.',
      },
    ],
    footer:
      'If you tell me whether you want it to sound more professional or more casual, I’ll narrow this to one final best version (and I can also suggest a tighter repo name + README one-liner).',
  },
  {
    id: 'u2',
    role: 'user',
    content: 'What would the repository name be?',
  },
]

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

const ChatInput = ({ placeholder, quote, onClearQuote }) => (
  <div className="mx-auto w-full max-w-3xl px-6 pb-8">
    <div
      className={`border border-[#2a2a2a] bg-[#2b2b2b] shadow-gpt-soft ${
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
          type="text"
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-[#e8e8e8] placeholder:text-[#9b9b9b] focus:outline-none"
        />
        <button type="button" className="rounded-full p-2 text-[#9b9b9b] hover:text-white">
          <Icon name="mic" />
        </button>
        <button type="button" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1d4ed8] text-white">
          <Icon name="voice" />
        </button>
      </div>
    </div>
  </div>
)

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
  const [isBranchPanelOpen, setIsBranchPanelOpen] = useState(false)
  const [branchView, setBranchView] = useState('history')
  const chatContainerRef = useRef(null)
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

  const activeBranch = useMemo(
    () => branches.find((branch) => branch.id === activeBranchId) || null,
    [branches, activeBranchId]
  )

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

  useEffect(() => {
    if (!activeBranchId) return
    setBranchInput('')
  }, [activeBranchId])

  useEffect(() => {
    if (!activeChatId) {
      setIsMenuOpen(false)
    }
  }, [activeChatId])

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

        <main className="relative flex flex-1 flex-col overflow-hidden">
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
            <div className="relative flex flex-1 flex-col">
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
                className={`selection-highlight flex-1 overflow-y-auto px-8 pb-32 pt-6 scrollbar-thin ${
                  isBranchPanelOpen ? 'pr-[22rem]' : ''
                }`}
              >
                <div className="mx-auto flex max-w-3xl flex-col gap-6">
                  {chatMessages.map((message) => {
                    if (message.role === 'user') {
                      return (
                        <div key={message.id} className="flex justify-end">
                          <div className="max-w-xl rounded-2xl bg-[#0b3f8f] px-4 py-3 text-sm text-white shadow-gpt-soft">
                            <p className="leading-relaxed">{message.content}</p>
                          </div>
                        </div>
                      )
                    }

                    return (
                      <div
                        key={message.id}
                        className="text-sm leading-relaxed text-[#e5e5e5]"
                        data-selectable="assistant"
                      >
                        <p className="text-base font-semibold text-white">{message.title}</p>
                        <div className="mt-4 space-y-4 text-[#d6d6d6]">
                          {message.items.map((item, index) => (
                            <div key={item.title} className="space-y-1">
                              <p className="font-semibold text-white">
                                {index + 1}. {item.title}
                              </p>
                              <p className="text-[#b5b5b5]">{item.body}</p>
                            </div>
                          ))}
                        </div>
                        <p className="mt-5 text-[#b5b5b5]">{message.footer}</p>

                        <div className="mt-6 flex items-center gap-2 text-[#8f8f8f]">
                          {actionButtons.map((action) => (
                            <div key={action.id} className="relative">
                              <button
                                type="button"
                                onMouseEnter={() => setHoveredAction(action.id)}
                                onMouseLeave={() => setHoveredAction(null)}
                                className="flex h-9 w-9 items-center justify-center rounded-xl text-[#c8c8c8] transition hover:bg-[#2a2a2a] hover:text-white"
                              >
                                <Icon name={action.id} className="h-5 w-5" />
                              </button>
                              {hoveredAction === action.id ? (
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
                          ))}
                        </div>
                      </div>
                    )
                  })}
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
                  <ChatInput placeholder="Ask anything" quote={quote} onClearQuote={() => setQuote('')} />
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
