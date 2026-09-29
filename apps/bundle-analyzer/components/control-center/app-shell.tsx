'use client'

import * as Dialog from '@radix-ui/react-dialog'
import {
  Activity,
  BookOpen,
  Boxes,
  Braces,
  ChartNoAxesCombined,
  ChevronRight,
  Command,
  GitBranch,
  FolderTree,
  Github,
  Home,
  Languages,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  Search,
  Sparkles,
  Sun,
  TestTube2,
  TerminalSquare,
  WandSparkles,
  Workflow,
  Wrench,
  X,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useI18n } from './i18n-provider'

const navGroups = [
  {
    label: 'Workspace',
    labelAr: 'مساحة العمل',
    items: [
      { href: '/', label: 'Overview', labelAr: 'نظرة عامة', icon: Home },
      { href: '/skills', label: 'Skills', labelAr: 'المهارات', icon: Sparkles },
      { href: '/agents', label: 'Agents', labelAr: 'الوكلاء', icon: Braces },
      { href: '/packages', label: 'Packages', labelAr: 'الحزم', icon: Boxes },
      { href: '/repository', label: 'Repository', labelAr: 'المستودع', icon: FolderTree },
    ],
  },
  {
    label: 'Engineering',
    labelAr: 'الهندسة',
    items: [
      { href: '/toolchain', label: 'Toolchain', labelAr: 'سلسلة الأدوات', icon: Wrench },
      { href: '/testing', label: 'Testing', labelAr: 'الاختبارات', icon: TestTube2 },
      { href: '/workflows', label: 'Workflows', labelAr: 'سير العمل', icon: Workflow },
      { href: '/docs', label: 'Documentation', labelAr: 'التوثيق', icon: BookOpen },
    ],
  },
  {
    label: 'Visual tools',
    labelAr: 'الأدوات المرئية',
    items: [
      { href: '/analyze', label: 'Bundle analyzer', labelAr: 'محلل الحزم', icon: ChartNoAxesCombined },
      { href: '/compare', label: 'Compare bundles', labelAr: 'مقارنة الحزم', icon: Activity },
    ],
  },
]

const commands = [
  { label: 'Start development', labelAr: 'بدء التطوير', command: 'pnpm dev', icon: Play },
  { label: 'Run Turbopack tests', labelAr: 'تشغيل اختبارات Turbopack', command: 'pnpm test-turbo', icon: Zap },
  { label: 'Run Rspack tests', labelAr: 'تشغيل اختبارات Rspack', command: 'pnpm test-rspack', icon: TestTube2 },
  { label: 'Run lint suite', labelAr: 'تشغيل فحص الكود', command: 'pnpm lint', icon: Braces },
  { label: 'Run agent evals', labelAr: 'تشغيل تقييمات الوكلاء', command: 'pnpm eval', icon: WandSparkles },
  { label: 'Build Turbopack CLI', labelAr: 'بناء Turbopack CLI', command: 'pnpm build-turbopack-cli', icon: TerminalSquare },
]

export function AppShell({
  children,
  title,
  subtitle,
  eyebrow,
  titleAr,
  subtitleAr,
  eyebrowAr,
}: {
  children: ReactNode
  title: string
  subtitle: string
  eyebrow?: string
  titleAr?: string
  subtitleAr?: string
  eyebrowAr?: string
}) {
  const pathname = usePathname()
  const { language, toggleLanguage, t } = useI18n()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [dark, setDark] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
    setSidebarCollapsed(localStorage.getItem('next-forge-sidebar') === 'collapsed')
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 2400)
    return () => window.clearTimeout(timer)
  }, [toast])

  const filteredCommands = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return commands
    return commands.filter(
      (item) =>
        item.label.toLowerCase().includes(needle) ||
        item.labelAr.toLowerCase().includes(needle) ||
        item.command.toLowerCase().includes(needle)
    )
  }, [query])

  const toggleTheme = () => {
    const nextDark = !dark
    setDark(nextDark)
    document.documentElement.classList.toggle('dark', nextDark)
    localStorage.setItem('next-forge-theme', nextDark ? 'dark' : 'light')
  }

  const copyCommand = async (command: string) => {
    await navigator.clipboard.writeText(command)
    setToast(t('Command copied to clipboard', 'تم نسخ الأمر'))
    setCommandOpen(false)
  }

  const toggleSidebar = () => {
    const next = !sidebarCollapsed
    setSidebarCollapsed(next)
    localStorage.setItem('next-forge-sidebar', next ? 'collapsed' : 'expanded')
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => {
    const compact = sidebarCollapsed && !mobile

    return (
      <div className="flex h-full flex-col">
        <div className={`flex items-center px-3 py-3 ${compact ? 'justify-center' : 'gap-3'}`}>
        <div className="flex size-11 items-center justify-center rounded-[18px] bg-[#25002f] shadow-[0_12px_30px_rgba(79,16,89,.22)]">
          {/* eslint-disable-next-line @next/next/no-img-element -- local UI brand mark; fixed dimensions and no optimization needed */}
          <img
            src="/next-forge-mark.png"
            alt=""
            width={36}
            height={36}
            className="size-9 object-contain"
          />
        </div>
        {!compact ? (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-[-0.02em]">Next Forge</p>
            <p className="truncate text-[11px] text-muted-foreground">{t('Engineering Console', 'لوحة الهندسة')}</p>
          </div>
        ) : null}
      </div>

      <div className="my-4 h-px bg-border" />

      <nav className="flex-1 space-y-6 overflow-y-auto pb-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!compact ? (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
                {t(group.label, group.labelAr)}
              </p>
            ) : (
              <div className="mx-auto mb-2 h-px w-7 bg-border" aria-hidden="true" />
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon
                const active =
                  item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => mobile && setMobileOpen(false)}
                    title={compact ? t(item.label, item.labelAr) : undefined}
                    aria-label={compact ? t(item.label, item.labelAr) : undefined}
                    className={`group flex min-h-10 items-center rounded-[14px] text-sm transition-all duration-200 ${compact ? 'justify-center px-2' : 'gap-3 px-3'} ${
                      active
                        ? 'bg-primary/10 font-medium text-primary shadow-[inset_0_0_0_1px_rgba(173,120,176,.08)]'
                        : 'text-muted-foreground hover:bg-primary/[0.055] hover:text-foreground'
                    }`}
                  >
                    <Icon className="size-[17px] shrink-0" strokeWidth={1.8} />
                    {!compact ? <span className="flex-1 truncate">{t(item.label, item.labelAr)}</span> : null}
                    {active && !compact ? <ChevronRight className="size-3.5 opacity-50 rtl:rotate-180" /> : null}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border pt-4">
        <Link
          href="/repository"
          onClick={() => mobile && setMobileOpen(false)}
          title={compact ? t('Repository explorer', 'مستكشف المستودع') : undefined}
          aria-label={compact ? t('Repository explorer', 'مستكشف المستودع') : undefined}
          className={`flex items-center rounded-[14px] py-2.5 text-sm text-muted-foreground transition-colors hover:bg-primary/[0.055] hover:text-foreground ${compact ? 'justify-center px-2' : 'gap-3 px-3'}`}
        >
          <GitBranch className="size-[17px]" strokeWidth={1.8} />
          {!compact ? (
            <>
              <span className="flex-1">{t('Repository explorer', 'مستكشف المستودع')}</span>
              <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px]">canary</span>
            </>
          ) : null}
        </Link>

        {!mobile ? (
          <button
            type="button"
            onClick={toggleSidebar}
            className={`mt-1 flex w-full items-center rounded-[14px] py-2.5 text-sm text-muted-foreground transition-colors hover:bg-primary/[0.055] hover:text-foreground ${compact ? 'justify-center px-2' : 'gap-3 px-3'}`}
            aria-label={compact ? t('Expand sidebar', 'توسيع الشريط الجانبي') : t('Collapse sidebar', 'طي الشريط الجانبي')}
            title={compact ? t('Expand sidebar', 'توسيع الشريط الجانبي') : t('Collapse sidebar', 'طي الشريط الجانبي')}
          >
            {compact ? <PanelLeftOpen className="size-[17px]" /> : <PanelLeftClose className="size-[17px]" />}
            {!compact ? <span>{t('Collapse sidebar', 'طي الشريط الجانبي')}</span> : null}
          </button>
        ) : null}
      </div>
    </div>
    )
  }

  return (
    <div className="min-h-screen">
      <aside
        className={`fixed inset-y-4 left-4 z-30 hidden rounded-[28px] border border-border/80 bg-sidebar/80 p-3 shadow-[0_24px_90px_rgba(56,12,65,.08)] backdrop-blur-3xl transition-[width] duration-300 lg:block rtl:left-auto rtl:right-4 ${sidebarCollapsed ? 'w-[88px]' : 'w-[252px]'}`}
      >
        <Sidebar />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-[#16001c]/35 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="nf-glass-strong absolute inset-y-3 left-3 w-[min(86vw,300px)] rounded-[28px] p-3 rtl:left-auto rtl:right-3">
            <div className="absolute right-4 top-4 z-10 rtl:left-4 rtl:right-auto">
              <button
                onClick={() => setMobileOpen(false)}
                className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground"
                aria-label="Close navigation"
              >
                <X className="size-4" />
              </button>
            </div>
            <Sidebar mobile />
          </aside>
        </div>
      ) : null}

      <main
        className={`min-w-0 transition-[padding] duration-300 ${sidebarCollapsed ? 'lg:pl-[120px] rtl:lg:pl-0 rtl:lg:pr-[120px]' : 'lg:pl-[284px] rtl:lg:pl-0 rtl:lg:pr-[284px]'}`}
      >
        <div className="mx-auto w-full max-w-[1720px] px-4 pb-12 pt-4 sm:px-6 lg:px-7">
          <header className="nf-glass sticky top-4 z-20 mb-6 flex min-h-16 items-center gap-3 rounded-[22px] px-3.5 sm:px-4">
            <button
              className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label={t('Open navigation', 'فتح التنقل')}
            >
              <Menu className="size-4" />
            </button>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-muted-foreground">
                {t(eyebrow ?? 'Next.js monorepo', eyebrowAr ?? 'مستودع Next.js')}
              </p>
              <p className="truncate text-sm font-semibold sm:text-base">{t(title, titleAr ?? title)}</p>
            </div>

            <button
              onClick={() => setCommandOpen(true)}
              className="hidden min-w-56 items-center gap-2 rounded-full border border-border bg-background/50 px-3.5 py-2 text-left text-xs text-muted-foreground transition-colors hover:bg-background/80 md:flex"
            >
              <Search className="size-3.5" />
              <span className="flex-1">{t('Search commands', 'ابحث في الأوامر')}</span>
              <kbd className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
            </button>

            <button
              onClick={() => setCommandOpen(true)}
              className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground md:hidden"
              aria-label={t('Open command palette', 'فتح لوحة الأوامر')}
            >
              <Search className="size-4" />
            </button>

            <button
              onClick={toggleLanguage}
              className="flex min-w-9 items-center justify-center gap-1 rounded-full bg-muted px-2.5 text-xs font-semibold text-muted-foreground transition-transform active:scale-95"
              aria-label={t('Switch language', 'تبديل اللغة')}
              title={t('Switch to Arabic', 'التبديل إلى الإنجليزية')}
            >
              <Languages className="size-3.5" />
              <span>{language === 'ar' ? 'EN' : 'AR'}</span>
            </button>

            <button
              onClick={toggleTheme}
              className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-transform active:scale-95"
              aria-label={t('Toggle color theme', 'تبديل النمط اللوني')}
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>

            <a
              href="https://github.com/vercel/next.js"
              target="_blank"
              rel="noreferrer"
              className="hidden size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(111,47,125,.2)] sm:flex"
              aria-label={t('Official Vercel Next.js repository', 'مستودع Next.js الرسمي من Vercel')}
              title={t('Official repository', 'المستودع الرسمي')}
            >
              <Github className="size-4" />
            </a>
          </header>

          <section className="mb-7 px-1 sm:px-2">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/70">
              {t(eyebrow ?? 'Engineering workspace', eyebrowAr ?? 'مساحة العمل الهندسية')}
            </p>
            <h1 className="max-w-4xl text-3xl font-semibold tracking-[-0.045em] sm:text-4xl lg:text-[44px]">
              {t(title, titleAr ?? title)}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-[15px]">
              {t(subtitle, subtitleAr ?? subtitle)}
            </p>
          </section>

          {children}
        </div>
      </main>

      <Dialog.Root open={commandOpen} onOpenChange={setCommandOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[80] bg-[#16001c]/30 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in" />
          <Dialog.Content className="nf-glass-strong fixed left-1/2 top-[18%] z-[90] w-[calc(100vw-24px)] max-w-xl -translate-x-1/2 overflow-hidden rounded-[26px] p-2 shadow-[0_30px_120px_rgba(29,0,35,.28)] focus:outline-none">
            <Dialog.Title className="sr-only">{t('Command center', 'مركز الأوامر')}</Dialog.Title>
            <Dialog.Description className="sr-only">
              {t('Search and copy common repository commands.', 'ابحث في أوامر المستودع الشائعة وانسخها.')}
            </Dialog.Description>

            <div className="flex items-center gap-3 border-b border-border px-3 py-2.5">
              <Command className="size-4 text-primary" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t('Type a command or workflow…', 'اكتب أمرًا أو سير عمل…')}
                className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={() => setCommandOpen(false)}
                className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground"
                aria-label={t('Close', 'إغلاق')}
              >
                <X className="size-3.5" />
              </button>
            </div>

            <div className="max-h-[52vh] overflow-y-auto p-2">
              <p className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
                {t('Repository commands', 'أوامر المستودع')}
              </p>
              <div className="space-y-1">
                {filteredCommands.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.command}
                      onClick={() => copyCommand(item.command)}
                      className="flex w-full items-center gap-3 rounded-[16px] px-3 py-3 text-left transition-colors hover:bg-primary/[0.07]"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-[13px] bg-primary/10 text-primary">
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">{t(item.label, item.labelAr)}</span>
                        <span className="mt-0.5 block truncate font-mono text-[11px] text-muted-foreground">
                          {item.command}
                        </span>
                      </span>
                      <span className="rounded-full bg-muted px-2 py-1 text-[10px] text-muted-foreground">
                        {t('Copy', 'نسخ')}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {toast ? (
        <div className="nf-glass-strong fixed bottom-5 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium shadow-2xl">
          <span className="nf-dot size-1.5 rounded-full bg-emerald-500 text-emerald-500" />
          {toast}
        </div>
      ) : null}
    </div>
  )
}
