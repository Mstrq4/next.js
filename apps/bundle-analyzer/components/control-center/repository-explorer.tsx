'use client'

import {
  ChevronRight,
  FileCode2,
  Folder,
  FolderOpen,
  Github,
  Home,
  LoaderCircle,
  RefreshCw,
  Search,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { CopyButton } from './copy-button'
import { useI18n } from './i18n-provider'

type Entry = {
  name: string
  path: string
  type: 'dir' | 'file'
  download_url?: string | null
  html_url?: string
}

const repo = 'vercel/next.js'
const branch = 'canary'

export function RepositoryExplorer({
  initialEntries,
}: {
  initialEntries: Entry[]
}) {
  const { t } = useI18n()
  const [path, setPath] = useState('')
  const [entries, setEntries] = useState<Entry[]>(initialEntries)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<{ path: string; content: string } | null>(null)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return entries
    return entries.filter((entry) => entry.name.toLowerCase().includes(needle))
  }, [entries, query])

  const loadPath = async (nextPath: string) => {
    setLoading(true)
    setError(null)
    setPreview(null)
    try {
      const endpoint =
        'https://api.github.com/repos/' +
        repo +
        '/contents/' +
        encodeURIComponent(nextPath).replaceAll('%2F', '/') +
        '?ref=' +
        branch
      const response = await fetch(endpoint, {
        headers: { Accept: 'application/vnd.github+json' },
      })
      if (!response.ok) throw new Error('GitHub API returned ' + response.status)
      const data = (await response.json()) as Array<{
        name: string
        path: string
        type: string
        download_url?: string | null
        html_url?: string
      }>
      setEntries(
        data
          .filter((item) => item.type === 'dir' || item.type === 'file')
          .map((item) => ({
            name: item.name,
            path: item.path,
            type: item.type as 'dir' | 'file',
            download_url: item.download_url,
            html_url: item.html_url,
          }))
          .sort((a, b) => {
            if (a.type !== b.type) return a.type === 'dir' ? -1 : 1
            return a.name.localeCompare(b.name)
          })
      )
      setPath(nextPath)
      setQuery('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to load repository path')
    } finally {
      setLoading(false)
    }
  }

  const openFile = async (entry: Entry) => {
    if (!entry.download_url) {
      if (entry.html_url) window.open(entry.html_url, '_blank', 'noopener,noreferrer')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(entry.download_url)
      if (!response.ok) throw new Error('Unable to fetch file: ' + response.status)
      const text = await response.text()
      if (text.length > 220000) {
        throw new Error(t('File is too large for inline preview.', 'الملف كبير جدًا للمعاينة داخل الصفحة.'))
      }
      setPreview({ path: entry.path, content: text })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to preview file')
    } finally {
      setLoading(false)
    }
  }

  const parts = path ? path.split('/') : []

  return (
    <div className="grid gap-4 xl:grid-cols-[1.05fr_.95fr]">
      <section className="nf-glass overflow-hidden rounded-[26px]">
        <div className="border-b border-border p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void loadPath('')}
              className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground"
              title={t('Repository root', 'جذر المستودع')}
            >
              <Home className="size-3.5" />
            </button>
            {parts.map((part, index) => {
              const next = parts.slice(0, index + 1).join('/')
              return (
                <div key={next} className="flex items-center gap-1">
                  <ChevronRight className="size-3 text-muted-foreground/50 rtl:rotate-180" />
                  <button
                    type="button"
                    onClick={() => void loadPath(next)}
                    className="max-w-36 truncate rounded-full px-2 py-1 font-mono text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    {part}
                  </button>
                </div>
              )
            })}
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-[16px] border border-border bg-background/45 px-3">
            <Search className="size-3.5 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('Filter files and folders…', 'تصفية الملفات والمجلدات…')}
              className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {loading ? <LoaderCircle className="size-4 animate-spin text-primary" /> : null}
          </div>
        </div>

        {error ? (
          <div className="m-4 rounded-[18px] border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm font-medium text-destructive">{error}</p>
            <button
              type="button"
              onClick={() => void loadPath(path)}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-2 text-xs font-medium"
            >
              <RefreshCw className="size-3.5" />
              {t('Retry', 'إعادة المحاولة')}
            </button>
          </div>
        ) : null}

        <div className="divide-y divide-border/70">
          {filtered.map((entry) => {
            const Icon = entry.type === 'dir' ? Folder : FileCode2
            return (
              <button
                type="button"
                key={entry.path}
                onClick={() =>
                  entry.type === 'dir' ? void loadPath(entry.path) : void openFile(entry)
                }
                className="flex w-full items-center gap-3 px-4 py-3 text-start transition-colors hover:bg-primary/[0.045] sm:px-5"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-[12px] bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1 truncate font-mono text-xs">{entry.name}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                  {entry.type}
                </span>
                <ChevronRight className="size-3.5 text-muted-foreground/45 rtl:rotate-180" />
              </button>
            )
          })}
        </div>
      </section>

      <section className="nf-glass min-h-[520px] overflow-hidden rounded-[26px]">
        {preview ? (
          <>
            <div className="flex items-center gap-3 border-b border-border p-4">
              <FileCode2 className="size-4 text-primary" />
              <p className="min-w-0 flex-1 truncate font-mono text-xs">{preview.path}</p>
              <CopyButton value={preview.content} compact />
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground"
              >
                <X className="size-3.5" />
              </button>
            </div>
            <pre
              dir="ltr"
              className="max-h-[70vh] overflow-auto whitespace-pre-wrap break-words p-5 text-left font-mono text-[11px] leading-6 text-muted-foreground"
            >
              {preview.content}
            </pre>
          </>
        ) : (
          <div className="flex min-h-[520px] flex-col items-center justify-center p-8 text-center">
            <span className="flex size-14 items-center justify-center rounded-[20px] bg-primary/10 text-primary">
              <FolderOpen className="size-6" />
            </span>
            <h3 className="mt-5 text-lg font-semibold">
              {t('Live repository explorer', 'مستكشف مستودع مباشر')}
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              {t(
                'Browse the official Vercel Next.js canary tree and open text files without leaving Next Forge.',
                'تصفح شجرة canary الرسمية لمستودع Next.js من Vercel وافتح الملفات النصية دون مغادرة Next Forge.'
              )}
            </p>
            <a
              href="https://github.com/vercel/next.js"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              <Github className="size-4" />
              {t('Open official repository', 'فتح المستودع الرسمي')}
            </a>
          </div>
        )}
      </section>
    </div>
  )
}
