'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Icon } from '@/components/icons'
import { navItems } from '@/lib/site'

const themeStorageKey = 'next-studio-theme'

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <a href="/" className="flex items-center gap-3 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]">
      <span className="brand-mark-shell">
        <span className="brand-mark-glyph h-9 w-7" aria-hidden="true" />
      </span>
      {!compact ? (
        <span className="leading-none">
          <span className="block text-[13px] font-semibold tracking-[0.18em] text-[var(--text-primary)]">NEXT STUDIO</span>
          <span className="mt-1.5 block text-[10px] font-medium tracking-[0.08em] text-[var(--text-tertiary)]">FRAMEWORK CONTROL CENTER</span>
        </span>
      ) : null}
    </a>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const saved = window.localStorage.getItem(themeStorageKey)
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const nextTheme = saved === 'light' || saved === 'dark' ? saved : preferred
    setTheme(nextTheme)
    document.documentElement.dataset.theme = nextTheme
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandOpen((value) => !value)
      }
      if (event.key === 'Escape') {
        setCommandOpen(false)
        setMobileOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const filteredNav = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) return navItems
    return navItems.filter((item) => (item.label + ' ' + item.description).toLowerCase().includes(value))
  }, [query])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    document.documentElement.dataset.theme = nextTheme
    window.localStorage.setItem(themeStorageKey, nextTheme)
  }

  const navigate = (href: string) => {
    router.push(href)
    setCommandOpen(false)
    setQuery('')
  }

  return (
    <div className="studio-root">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <aside className="studio-sidebar hidden lg:flex">
        <div className="px-3 pb-6 pt-3">
          <Brand />
        </div>
        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto py-2">
          {navItems.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <a key={item.href} href={item.href} className={'nav-item ' + (active ? 'nav-item-active' : '')}>
                <Icon name={item.icon} className="h-[17px] w-[17px] shrink-0" />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {active ? <span className="nav-active-dot" /> : null}
              </a>
            )
          })}
        </nav>
        <div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
          <div className="rounded-[18px] bg-[var(--surface-soft)] px-3.5 py-3">
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-primary)]">
              <span className="status-dot" />
              canary
            </div>
            <div className="mt-1 text-[10px] leading-4 text-[var(--text-tertiary)]">Live repository index at build time</div>
          </div>
        </div>
      </aside>

      <div className="studio-content">
        <header className="studio-topbar">
          <div className="lg:hidden"><Brand compact /></div>
          <button className="command-trigger hidden min-w-0 sm:flex" onClick={() => setCommandOpen(true)}>
            <Icon name="search" className="h-4 w-4 shrink-0" />
            <span className="truncate">Search sections and tools</span>
            <kbd>⌘K</kbd>
          </button>
          <div className="ml-auto flex items-center gap-2">
            <a className="icon-button hidden sm:inline-flex" href="https://github.com/Mstrq4/next.js" target="_blank" rel="noreferrer" aria-label="Open repository on GitHub">
              <Icon name="git" className="h-[17px] w-[17px]" />
            </a>
            <button className="icon-button" onClick={toggleTheme} aria-label="Toggle color theme">
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="h-[17px] w-[17px]" />
            </button>
            <button className="icon-button lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
              <Icon name="menu" className="h-[18px] w-[18px]" />
            </button>
          </div>
        </header>

        <main className="studio-main">{children}</main>
      </div>

      <nav className="mobile-dock lg:hidden" aria-label="Primary navigation">
        {navItems.slice(0, 4).map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          return (
            <a key={item.href} href={item.href} className={'mobile-dock-item ' + (active ? 'mobile-dock-active' : '')}>
              <Icon name={item.icon} className="h-[18px] w-[18px]" />
              <span>{item.shortLabel}</span>
            </a>
          )
        })}
        <button className="mobile-dock-item" onClick={() => setMobileOpen(true)}>
          <Icon name="menu" className="h-[18px] w-[18px]" />
          <span>More</span>
        </button>
      </nav>

      {mobileOpen ? (
        <div className="overlay-root lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button className="overlay-backdrop" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />
          <div className="mobile-sheet glass-strong">
            <div className="mb-5 flex items-center justify-between gap-4">
              <Brand />
              <button className="icon-button" onClick={() => setMobileOpen(false)} aria-label="Close navigation">
                <Icon name="x" className="h-[18px] w-[18px]" />
              </button>
            </div>
            <nav className="grid gap-1.5">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className={'nav-item ' + (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)) ? 'nav-item-active' : '')}>
                  <Icon name={item.icon} className="h-[17px] w-[17px]" />
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      ) : null}

      {commandOpen ? (
        <div className="overlay-root" role="dialog" aria-modal="true" aria-label="Command palette">
          <button className="overlay-backdrop" onClick={() => setCommandOpen(false)} aria-label="Close command palette" />
          <div className="command-palette glass-strong">
            <div className="command-search">
              <Icon name="search" className="h-[18px] w-[18px]" />
              <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Go to a section..." />
              <button className="icon-button h-8 w-8" onClick={() => setCommandOpen(false)} aria-label="Close">
                <Icon name="x" className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[56vh] overflow-y-auto p-2">
              {filteredNav.map((item) => (
                <button key={item.href} onClick={() => navigate(item.href)} className="command-result">
                  <span className="section-icon"><Icon name={item.icon} className="h-4 w-4" /></span>
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block text-sm font-medium text-[var(--text-primary)]">{item.label}</span>
                    <span className="mt-0.5 block truncate text-xs text-[var(--text-tertiary)]">{item.description}</span>
                  </span>
                  <Icon name="chevron" className="h-4 w-4 text-[var(--text-tertiary)]" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
