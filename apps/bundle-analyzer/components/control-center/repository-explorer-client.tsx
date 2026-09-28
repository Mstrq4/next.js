'use client'

import {
  ChevronRight,
  Copy,
  ExternalLink,
  FileCode2,
  Folder,
  FolderOpen,
  Github,
  RefreshCw,
  Search,
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useLocale } from './locale-provider'
import { GlassCard, Pill } from './ui'

type Entry = {
  name: string
  path: string
  type: 'file' | 'dir' | 'symlink' | string
  size?: number
  download_url?: string | null
  html_url?: string
  git_url?: string
}

type RootItem = {
  name: string
  path: string
  description: { en: string; ar: string }
  highlighted: boolean
}

const repo = 'Mstrq4/next.js'
const ref = 'canary'

export function RepositoryExplorerClient({
  rootCatalog,
}: {
  rootCatalog: RootItem[]
}) {
  const params = useSearchParams()
  const { text } = useLocale()
  const initialPath = params.get('path') ?? ''
  const [path, setPath] = useState(initialPath)
  const [entries, setEntries] = useState<Entry[]>([])
  const [selected, setSelected] = useState<Entry | null>(null)
  const [fileContent, setFileContent] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  const rootMap = useMemo(
    () => new Map(rootCatalog.map((item) => [item.path, item])),
    [rootCatalog]
  )

  const loadDirectory = async (nextPath: string) => {
    setLoading(true)
    setError('')
    setSelected(null)
    setFileContent('')

    try {
      const suffix = nextPath
        ? `/${nextPath.split('/').map(encodeURIComponent).join('/')}`
        : ''
      const response = await fetch(
        `https://api.github.com/repos/${repo}/contents${suffix}?ref=${ref}`,
        { headers: { Accept: 'application/vnd.github+json' } }
      )
      if (!response.ok) throw new Error(`GitHub API ${response.status}`)
      const data = (await response.json()) as Entry[]
      setEntries(
        [...data].sort((a, b) => {
          if (a.type !== b.type) return a.type === 'dir' ? -1 : 1
          return a.name.localeCompare(b.name)
        })
      )
      setPath(nextPath)
      window.history.replaceState(
        null,
        '',
        nextPath ? `/repository?path=${encodeURIComponent(nextPath)}` : '/repository'
      )
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadDirectory(initialPath)
    // load once from URL
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openEntry = async (entry: Entry) => {
    if (entry.type === 'dir') {
      await loadDirectory(entry.path)
      return
    }

    setSelected(entry)
    setFileContent('')
    setError('')

    try {
      const raw =
        entry.download_url ??
        `https://raw.githubusercontent.com/${repo}/${ref}/${entry.path}`
      const response = await fetch(raw)
      if (!response.ok) throw new Error(`Raw file ${response.status}`)
      const type = response.headers.get('content-type') ?? ''
      if (
        type.startsWith('image/') ||
        type.includes('application/octet-stream') ||
        (entry.size ?? 0) > 300_000
      ) {
        setFileContent(
          text({
            en: 'Binary or large file. Open it on GitHub to inspect it safely.',
            ar: 'ملف ثنائي أو كبير. افتحه على GitHub لمعاينته بأمان.',
          })
        )
        return
      }
      setFileContent(await response.text())
    } catch (cause) {
      setFileContent('')
      setError(cause instanceof Error ? cause.message : 'Unknown error')
    }
  }

  const visible = entries.filter((entry) =>
    entry.name.toLowerCase().includes(query.trim().toLowerCase())
  )

  const crumbs = path ? path.split('/') : []

  const copy = async (value: string) => {
    await navigator.clipboard.writeText(value)
    setCopied(value)
    window.setTimeout(() => setCopied(''), 1300)
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(360px,.78fr)]">
      <GlassCard className="min-w-0 overflow-hidden">
        <div className="border-b border-border p-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void loadDirectory('')}
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
            >
              <Github className="size-3.5" />
              next.js
            </button>
            {crumbs.map((crumb, index) => {
              const crumbPath = crumbs.slice(0, index + 1).join('/')
              return (
                <span key={crumbPath} className="inline-flex items-center gap-1">
                  <ChevronRight className="size-3.5 text-muted-foreground rtl:rotate-180" />
                  <button
                    type="button"
                    onClick={() => void loadDirectory(crumbPath)}
                    className="rounded-full px-2 py-1 font-mono text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    {crumb}
                  </button>
                </span>
              )
            })}
          </div>

          <div className="mt-3 flex gap-2">
            <div className="flex min-h-10 flex-1 items-center gap-2 rounded-[14px] border border-border bg-background/55 px-3">
              <Search className="size-3.5 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={text({ en: 'Filter this directory…', ar: 'تصفية هذا المجلد…' })}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => void loadDirectory(path)}
              className="flex size-10 items-center justify-center rounded-[14px] border border-border bg-background/55 text-muted-foreground"
              aria-label={text({ en: 'Refresh directory', ar: 'تحديث المجلد' })}
            >
              <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {error ? (
          <div className="m-4 rounded-[16px] border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="divide-y divide-border/70">
          {loading ? (
            Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 px-4 py-3.5">
                <div className="nf-skeleton size-5 rounded-md" />
                <div className="nf-skeleton h-3 w-48 max-w-[60%] rounded-full" />
              </div>
            ))
          ) : visible.length ? (
            visible.map((entry) => {
              const Icon =
                entry.type === 'dir'
                  ? path === entry.path
                    ? FolderOpen
                    : Folder
                  : FileCode2
              const rootInfo = !path ? rootMap.get(entry.path) : undefined
              return (
                <button
                  key={entry.path}
                  type="button"
                  onClick={() => void openEntry(entry)}
                  className="flex w-full items-start gap-3 px-4 py-3.5 text-start transition-colors hover:bg-primary/[0.045]"
                >
                  <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1">
                    <span dir="ltr" className="block truncate text-left font-mono text-xs font-semibold">
                      {entry.name}
                    </span>
                    {rootInfo ? (
                      <span className="mt-1 block text-[11px] leading-5 text-muted-foreground">
                        {text(rootInfo.description)}
                      </span>
                    ) : null}
                  </span>
                  {entry.type === 'dir' ? (
                    <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-muted-foreground rtl:rotate-180" />
                  ) : entry.size != null ? (
                    <span dir="ltr" className="shrink-0 font-mono text-[10px] text-muted-foreground">
                      {(entry.size / 1024).toFixed(entry.size > 10240 ? 0 : 1)} KB
                    </span>
                  ) : null}
                </button>
              )
            })
          ) : (
            <div className="p-8 text-center text-sm text-muted-foreground">
              {text({ en: 'No entries match this filter.', ar: 'لا توجد عناصر مطابقة للتصفية.' })}
            </div>
          )}
        </div>
      </GlassCard>

      <GlassCard className="min-w-0 self-start overflow-hidden xl:sticky xl:top-24">
        {selected ? (
          <>
            <div className="border-b border-border p-4">
              <div className="flex items-start gap-3">
                <FileCode2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p dir="ltr" className="truncate text-left font-mono text-xs font-semibold">
                    {selected.path}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Pill>{selected.type}</Pill>
                    {selected.size != null ? (
                      <Pill>{selected.size.toLocaleString()} bytes</Pill>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void copy(selected.path)}
                  className="inline-flex min-h-9 items-center gap-2 rounded-full border border-border bg-background/55 px-3 text-xs font-medium"
                >
                  <Copy className="size-3.5" />
                  {copied === selected.path
                    ? text({ en: 'Copied', ar: 'تم النسخ' })
                    : text({ en: 'Copy path', ar: 'نسخ المسار' })}
                </button>
                {selected.html_url ? (
                  <a
                    href={selected.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-9 items-center gap-2 rounded-full border border-border bg-background/55 px-3 text-xs font-medium"
                  >
                    <ExternalLink className="size-3.5" />
                    GitHub
                  </a>
                ) : null}
              </div>
            </div>
            <pre
              dir="ltr"
              className="max-h-[70vh] overflow-auto bg-[#120017] p-4 text-left font-mono text-[11px] leading-5 text-[#eadcef]"
            >
              <code>{fileContent || text({ en: 'Loading file…', ar: 'جارٍ تحميل الملف…' })}</code>
            </pre>
          </>
        ) : (
          <div className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
            <FolderTree className="size-8 text-primary/70" />
            <h3 className="mt-5 font-semibold">
              {text({ en: 'Live repository browser', ar: 'متصفح مستودع حي' })}
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              {text({
                en: 'Open a directory to navigate it, or choose a text file to preview its current canary contents.',
                ar: 'افتح أي مجلد للتنقل بداخله أو اختر ملفًا نصيًا لمعاينة محتواه الحالي من فرع canary.',
              })}
            </p>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
