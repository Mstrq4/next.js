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
  FolderTree,
  Github,
  Home,
  Languages,
  Menu,
  Moon,
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
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { type Copy, useLocale } from './locale-provider'

const navGroups = [
  {
    label: { en: 'Workspace', ar: 'مساحة العمل' },
    items: [
      { href: '/', label: { en: 'Overview', ar: 'نظرة عامة' }, icon: Home },
      { href: '/skills', label: { en: 'Skills', ar: 'المهارات' }, icon: Sparkles },
      { href: '/agents', label: { en: 'Agents', ar: 'الوكلاء' }, icon: Braces },
      { href: '/packages', label: { en: 'Packages', ar: 'الحزم' }, icon: Boxes },
    ],
  },
  {
    label: { en: 'Engineering', ar: 'الهندسة' },
    items: [
      { href: '/toolchain', label: { en: 'Toolchain', ar: 'سلسلة الأدوات' }, icon: Wrench },
      { href: '/testing', label: { en: 'Testing', ar: 'الاختبارات' }, icon: TestTube2 },
      { href: '/workflows', label: { en: 'Workflows', ar: 'سير العمل' }, icon: Workflow },
    ],
  },
  {
    label: { en: 'Knowledge', ar: 'المعرفة' },
    items: [
      { href: '/docs', label: { en: 'Documentation', ar: 'التوثيق' }, icon: BookOpen },
      { href: '/repository', label: { en: 'Repository explorer', ar: 'مستكشف المستودع' }, icon: FolderTree },
    ],
  },
  {
    label: { en: 'Visual tools', ar: 'أدوات التحليل' },
    items: [
      { href: '/analyze', label: { en: 'Bundle analyzer', ar: 'محلل الحزم' }, icon: ChartNoAxesCombined },
      { href: '/compare', label: { en: 'Compare bundles', ar: 'مقارنة الحزم' }, icon: Activity },
    ],
  },
] satisfies Array<{ label: Copy; items: Array<{ href: string; label: Copy; icon: typeof Home }> }>

const commands = [
  { label: { en: 'Start development', ar: 'بدء بيئة التطوير' }, command: 'pnpm dev', icon: Play },
  { label: { en: 'Run Turbopack tests', ar: 'تشغيل اختبارات Turbopack' }, command: 'pnpm test-turbo', icon: Zap },
  { label: { en: 'Run Rspack tests', ar: 'تشغيل اختبارات Rspack' }, command: 'pnpm test-rspack', icon: TestTube2 },
  { label: { en: 'Run lint suite', ar: 'تشغيل فحوصات Lint' }, command: 'pnpm lint', icon: Braces },
  { label: { en: 'Run agent evals', ar: 'تشغيل تقييمات الوكلاء' }, command: 'pnpm eval', icon: WandSparkles },
  { label: { en: 'Build Turbopack CLI', ar: 'بناء Turbopack CLI' }, command: 'pnpm build-turbopack-cli', icon: TerminalSquare },
] satisfies Array<{ label: Copy; command: string; icon: typeof Home }>

export function AppShell({
  children,
  title,
  subtitle,
  eyebrow,
}: {
  children: ReactNode
  title: Copy
  subtitle: Copy
  eyebrow?: Copy
}) {
  const pathname = usePathname()
  const { isArabic, locale, text, toggleLocale } = useLocale()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
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
        text(item.label).toLowerCase().includes(needle) ||
        item.command.toLowerCase().includes(needle)
    )
  }, [query, text])

  const toggleTheme = () => {
    const nextDark = !dark
    setDark(nextDark)
    document.documentElement.classList.toggle('dark', nextDark)
    localStorage.setItem('next-forge-theme', nextDark ? 'dark' : 'light')
  }

  const copyCommand = async (command: string) => {
    await navigator.clipboard.writeText(command)
    setToast(text({ en: 'Command copied to clipboard', ar: 'تم نسخ الأمر' }))
    setCommandOpen(false)
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-3 py-3">
        <div className="flex size-11 items-center justify-center rounded-[18px] bg-[#25002f] shadow-[0_12px_30px_rgba(79,16,89,.22)]">
          {/* eslint-disable-next-line @next/next/no-img-element -- local UI brand mark */}
          <img src="/next-forge-mark.png" alt="" width={36} height={36} className="size-9 object-contain" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-[-0.02em]">Next Forge</p>
          <p className="truncate text-[11px] text-muted-foreground">
            {text({ en: 'Engineering Console', ar: 'منصة الهندسة' })}
          </p>
        </div>
      </div>

      <div className="my-4 h-px bg-border" />

      <nav className="flex-1 space-y-6 overflow-y-auto pb-6">
        {navGroups.map((group) => (
          <div key={group.label.en}>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
              {text(group.label)}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon
                const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => mobile && setMobileOpen(false)}
                    className={`group flex min-h-10 items-center gap-3 rounded-[14px] px-3 text-sm transition-all duration-200 ${
                      active
                        ? 'bg-primary/10 font-medium text-primary shadow-[inset_0_0_0_1px_rgba(173,120,176,.08)]'
                        : 'text-muted-foreground hover:bg-primary/[0.055] hover:text-foreground'
                    }`}
                  >
                    <Icon className="size-[17px] shrink-0" strokeWidth={1.8} />
                    <span className="flex-1 truncate">{text(item.label)}</span>
                    {active ? <ChevronRight className={`size-3.5 opacity-50 ${isArabic ? 'rotate-180' : ''}`} /> : null}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border pt-4">
        <Link
          href="/docs"
          onClick={() => mobile && setMobileOpen(false)}
          className="flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-primary/[0.055] hover:text-foreground"
        >
          <BookOpen className="size-[17px]" strokeWidth={1.8} />
          <span className="flex-1">{text({ en: 'Documentation', ar: 'التوثيق' })}</span>
          <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px]">Guide</span>
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen">
      <aside
        className={`fixed inset-y-4 z-30 hidden w-[252px] rounded-[28px] border border-border/80 bg-sidebar/80 p-3 shadow-[0_24px_90px_rgba(56,12,65,.08)] backdrop-blur-3xl lg:block ${
          isArabic ? 'right-4' : 'left-4'
        }`}
      >
        <Sidebar />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label={text({ en: 'Close navigation', ar: 'إغلاق التنقل' })}
            className="absolute inset-0 bg-[#16001c]/35 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className={`nf-glass-strong absolute inset-y-3 w-[min(86vw,300px)] rounded-[28px] p-3 ${
              isArabic ? 'right-3' : 'left-3'
            }`}
          >
            <div className={`absolute top-4 z-10 ${isArabic ? 'left-4' : 'right-4'}`}>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground"
                aria-label={text({ en: 'Close navigation', ar: 'إغلاق التنقل' })}
              >
                <X className="size-4" />
              </button>
            </div>
            <Sidebar mobile />
          </aside>
        </div>
      ) : null}

      <main className={`min-w-0 ${isArabic ? 'lg:pr-[284px]' : 'lg:pl-[284px]'}`}>
        <div className="mx-auto w-full max-w-[1720px] px-4 pb-12 pt-4 sm:px-6 lg:px-7">
          <header className="nf-glass sticky top-4 z-20 mb-6 flex min-h-16 items-center gap-3 rounded-[22px] px-3.5 sm:px-4">
            <button
              className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label={text({ en: 'Open navigation', ar: 'فتح التنقل' })}
            >
              <Menu className="size-4" />
            </button>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-muted-foreground">
                {text(eyebrow ?? { en: 'Next.js monorepo', ar: 'مستودع Next.js' })}
              </p>
              <p className="truncate text-sm font-semibold sm:text-base">{text(title)}</p>
            </div>

            <button
              onClick={() => setCommandOpen(true)}
              className="hidden min-w-56 items-center gap-2 rounded-full border border-border bg-background/50 px-3.5 py-2 text-start text-xs text-muted-foreground transition-colors hover:bg-background/80 md:flex"
            >
              <Search className="size-3.5" />
              <span className="flex-1">{text({ en: 'Search commands', ar: 'البحث في الأوامر' })}</span>
              <kbd className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
            </button>

            <button
              onClick={() => setCommandOpen(true)}
              className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground md:hidden"
              aria-label={text({ en: 'Open command palette', ar: 'فتح لوحة الأوامر' })}
            >
              <Search className="size-4" />
            </button>

            <button
              onClick={toggleLocale}
              className="flex min-w-9 items-center justify-center gap-1.5 rounded-full bg-muted px-2.5 py-2 text-[11px] font-semibold text-muted-foreground transition-transform active:scale-95"
              aria-label={text({ en: 'Switch to Arabic', ar: 'التبديل إلى الإنجليزية' })}
              title={text({ en: 'Switch language', ar: 'تبديل اللغة' })}
            >
              <Languages className="size-3.5" />
              {locale === 'ar' ? 'EN' : 'AR'}
            </button>

            <button
              onClick={toggleTheme}
              className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-transform active:scale-95"
              aria-label={text({ en: 'Toggle color theme', ar: 'تبديل المظهر' })}
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>

            <a
              href="https://github.com/vercel/next.js"
              target="_blank"
              rel="noreferrer"
              className="hidden size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(111,47,125,.2)] sm:flex"
              aria-label={text({ en: 'Official Next.js repository', ar: 'مستودع Next.js الرسمي' })}
              title={text({ en: 'Official Next.js repository', ar: 'مستودع Next.js الرسمي' })}
            >
              <Github className="size-4" />
            </a>
          </header>

          <section className="mb-7 px-1 sm:px-2">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/70">
              {text(eyebrow ?? { en: 'Engineering workspace', ar: 'مساحة العمل الهندسية' })}
            </p>
            <h1 className={`max-w-4xl text-3xl font-semibold sm:text-4xl lg:text-[44px] ${
              isArabic ? 'tracking-normal' : 'tracking-[-0.045em]'
            }`}>
              {text(title)}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-[15px]">
              {text(subtitle)}
            </p>
          </section>

          {children}
        </div>
      </main>

      <Dialog.Root open={commandOpen} onOpenChange={setCommandOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[80] bg-[#16001c]/30 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in" />
          <Dialog.Content className="nf-glass-strong fixed left-1/2 top-[18%] z-[90] w-[calc(100vw-24px)] max-w-xl -translate-x-1/2 overflow-hidden rounded-[26px] p-2 shadow-[0_30px_120px_rgba(29,0,35,.28)] focus:outline-none">
            <Dialog.Title className="sr-only">{text({ en: 'Command center', ar: 'مركز الأوامر' })}</Dialog.Title>
            <Dialog.Description className="sr-only">
              {text({ en: 'Search and copy common repository commands.', ar: 'ابحث وانسخ أوامر المستودع الشائعة.' })}
            </Dialog.Description>

            <div className="flex items-center gap-3 border-b border-border px-3 py-2.5">
              <Command className="size-4 text-primary" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={text({ en: 'Type a command or workflow…', ar: 'اكتب أمرًا أو سير عمل…' })}
                className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={() => setCommandOpen(false)}
                className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground"
                aria-label={text({ en: 'Close', ar: 'إغلاق' })}
              >
                <X className="size-3.5" />
              </button>
            </div>

            <div className="max-h-[52vh] overflow-y-auto p-2">
              <p className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
                {text({ en: 'Repository commands', ar: 'أوامر المستودع' })}
              </p>
              <div className="space-y-1">
                {filteredCommands.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.command}
                      onClick={() => copyCommand(item.command)}
                      className="flex w-full items-center gap-3 rounded-[16px] px-3 py-3 text-start transition-colors hover:bg-primary/[0.07]"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-[13px] bg-primary/10 text-primary">
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">{text(item.label)}</span>
                        <span dir="ltr" className="mt-0.5 block truncate text-left font-mono text-[11px] text-muted-foreground">
                          {item.command}
                        </span>
                      </span>
                      <span className="rounded-full bg-muted px-2 py-1 text-[10px] text-muted-foreground">
                        {text({ en: 'Copy', ar: 'نسخ' })}
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
