'use client'

import {
  Activity,
  ArrowRightLeft,
  BarChart3,
  Boxes,
  FileCode2,
  GitCompareArrows,
  LoaderCircle,
  RefreshCw,
  Scale,
} from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useI18n } from './i18n-provider'
import { GlassCard, Pill } from './ui'

type TreeEntry = { path: string; type: string; size?: number }

type Analysis = {
  path: string
  totalBytes: number
  fileCount: number
  extensions: Array<{ extension: string; bytes: number; count: number }>
  largest: Array<{ path: string; bytes: number }>
}

const presets = [
  'apps/bundle-analyzer',
  'packages/next',
  'packages/create-next-app',
  'packages/next-swc',
  'packages/eslint-plugin-next',
  'turbopack/crates',
  'crates',
  'skills',
  '.agents/skills',
]

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(kb > 100 ? 0 : 1)} KB`
  const mb = kb / 1024
  return `${mb.toFixed(mb > 100 ? 0 : 1)} MB`
}

function extensionOf(filePath: string) {
  const name = filePath.split('/').at(-1) ?? filePath
  if (!name.includes('.')) return '[no extension]'
  if (name.startsWith('.') && name.indexOf('.', 1) === -1) return '[dotfile]'
  return `.${name.split('.').at(-1)?.toLowerCase() ?? ''}`
}

async function directoryTree(targetPath: string) {
  const segments = targetPath.split('/').filter(Boolean)
  const name = segments.at(-1)
  const parent = segments.slice(0, -1).join('/')
  const parentSuffix = parent
    ? '/' + parent.split('/').map(encodeURIComponent).join('/')
    : ''

  const directoryResponse = await fetch(
    `https://api.github.com/repos/vercel/next.js/contents${parentSuffix}?ref=canary`,
    { headers: { Accept: 'application/vnd.github+json' } }
  )
  if (!directoryResponse.ok) {
    throw new Error(`GitHub contents API returned ${directoryResponse.status}`)
  }

  const siblings = (await directoryResponse.json()) as Array<{
    name: string
    type: string
    git_url?: string
  }>
  const directory = siblings.find(
    (entry) => entry.name === name && entry.type === 'dir'
  )
  if (!directory?.git_url) throw new Error(`Directory not found: ${targetPath}`)

  const treeResponse = await fetch(`${directory.git_url}?recursive=1`, {
    headers: { Accept: 'application/vnd.github+json' },
  })
  if (!treeResponse.ok) {
    throw new Error(`Git tree API returned ${treeResponse.status}`)
  }

  const data = (await treeResponse.json()) as {
    truncated?: boolean
    tree: TreeEntry[]
  }

  if (data.truncated) {
    throw new Error('GitHub returned a truncated tree. Choose a narrower path.')
  }

  return data.tree.filter((entry) => entry.type === 'blob')
}

async function analyze(targetPath: string): Promise<Analysis> {
  const entries = await directoryTree(targetPath)
  const extensionMap = new Map<string, { bytes: number; count: number }>()
  let totalBytes = 0

  for (const entry of entries) {
    const bytes = entry.size ?? 0
    totalBytes += bytes
    const extension = extensionOf(entry.path)
    const current = extensionMap.get(extension) ?? { bytes: 0, count: 0 }
    current.bytes += bytes
    current.count += 1
    extensionMap.set(extension, current)
  }

  const extensions = [...extensionMap.entries()]
    .map(([extension, value]) => ({ extension, ...value }))
    .sort((a, b) => b.bytes - a.bytes)

  const largest = entries
    .map((entry) => ({ path: entry.path, bytes: entry.size ?? 0 }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 14)

  return {
    path: targetPath,
    totalBytes,
    fileCount: entries.length,
    extensions,
    largest,
  }
}

function AnalysisPanel({ analysis }: { analysis: Analysis }) {
  const { t } = useI18n()
  const maxExtension = analysis.extensions[0]?.bytes || 1

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <GlassCard className="p-4">
          <Scale className="size-4 text-primary" />
          <p className="mt-4 text-2xl font-semibold">{formatBytes(analysis.totalBytes)}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t('Source footprint', 'حجم المصدر')}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <FileCode2 className="size-4 text-primary" />
          <p className="mt-4 text-2xl font-semibold">{analysis.fileCount.toLocaleString()}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t('Files', 'الملفات')}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <Boxes className="size-4 text-primary" />
          <p className="mt-4 text-2xl font-semibold">{analysis.extensions.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t('File types', 'أنواع الملفات')}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <BarChart3 className="size-4 text-primary" />
          <p dir="ltr" className="mt-4 truncate text-left font-mono text-sm font-semibold">
            {analysis.path}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{t('Analyzed surface', 'السطح المحلل')}</p>
        </GlassCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_.9fr]">
        <GlassCard className="p-5">
          <h3 className="font-semibold">{t('Size by file type', 'الحجم حسب نوع الملف')}</h3>
          <div className="mt-5 space-y-4">
            {analysis.extensions.slice(0, 12).map((item) => (
              <div key={item.extension}>
                <div className="mb-1.5 flex items-center justify-between gap-4 text-xs">
                  <span dir="ltr" className="font-mono">{item.extension}</span>
                  <span dir="ltr" className="font-mono text-muted-foreground">
                    {formatBytes(item.bytes)} · {item.count}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-primary/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#4f1059] via-[#74317a] to-[#d7afd7]"
                    style={{ width: `${Math.max(2, (item.bytes / maxExtension) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="overflow-hidden">
          <div className="border-b border-border p-5">
            <h3 className="font-semibold">{t('Largest files', 'أكبر الملفات')}</h3>
          </div>
          <div className="divide-y divide-border/70">
            {analysis.largest.map((file, index) => (
              <div key={file.path} className="flex items-center gap-3 px-4 py-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-[10px] bg-primary/8 font-mono text-[10px] text-primary">
                  {index + 1}
                </span>
                <span dir="ltr" className="min-w-0 flex-1 truncate text-left font-mono text-[10px] text-muted-foreground">
                  {file.path}
                </span>
                <span dir="ltr" className="shrink-0 font-mono text-[10px] font-semibold">
                  {formatBytes(file.bytes)}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

export function RepositoryFootprintAnalyzer({ mode }: { mode: 'analyze' | 'compare' }) {
  const { t } = useI18n()
  const [leftPath, setLeftPath] = useState('packages/next')
  const [rightPath, setRightPath] = useState('turbopack/crates')
  const [left, setLeft] = useState<Analysis | null>(null)
  const [right, setRight] = useState<Analysis | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const run = async () => {
    try {
      setBusy(true)
      setError('')
      if (mode === 'analyze') {
        setLeft(await analyze(leftPath.trim()))
        setRight(null)
      } else {
        const [a, b] = await Promise.all([
          analyze(leftPath.trim()),
          analyze(rightPath.trim()),
        ])
        setLeft(a)
        setRight(b)
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unknown error')
    } finally {
      setBusy(false)
    }
  }

  const comparison = useMemo(() => {
    if (!left || !right) return null
    const byExt = new Map<string, { extension: string; left: number; right: number }>()
    for (const item of left.extensions) {
      byExt.set(item.extension, { extension: item.extension, left: item.bytes, right: 0 })
    }
    for (const item of right.extensions) {
      const current = byExt.get(item.extension) ?? {
        extension: item.extension,
        left: 0,
        right: 0,
      }
      current.right = item.bytes
      byExt.set(item.extension, current)
    }
    return [...byExt.values()]
      .sort((a, b) => Math.max(b.left, b.right) - Math.max(a.left, a.right))
      .slice(0, 12)
  }, [left, right])

  return (
    <div>
      <GlassCard className="mb-5 p-5 sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="violet">
                {mode === 'analyze'
                  ? t('Live source analysis', 'تحليل مصدر حي')
                  : t('Live comparison', 'مقارنة حية')}
              </Pill>
              <span className="text-xs text-muted-foreground">vercel/next.js · canary</span>
            </div>
            <h2 className="mt-4 text-xl font-semibold sm:text-2xl">
              {mode === 'analyze'
                ? t('Analyze a repository surface', 'حلّل سطحًا من المستودع')
                : t('Compare two repository surfaces', 'قارن بين سطحين من المستودع')}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              {t(
                'This mode reads the real public canary Git tree and calculates source size, file types and largest files. The original compiled-bundle analyzer remains available in Native mode.',
                'يقرأ هذا الوضع شجرة Git العامة الحقيقية لفرع canary ويحسب حجم المصدر وأنواع الملفات وأكبر الملفات. ويظل محلل الحزم المبنية الأصلي متاحًا في وضع Native.'
              )}
            </p>
          </div>
          <Link
            href={mode === 'analyze' ? '/native-analyzer' : '/native-compare'}
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-border bg-background/55 px-4 text-sm font-medium"
          >
            <Activity className="size-4" />
            {t('Native snapshot mode', 'وضع Snapshot الأصلي')}
          </Link>
        </div>

        <div className={`mt-6 grid gap-3 ${mode === 'compare' ? 'lg:grid-cols-[1fr_auto_1fr_auto]' : 'lg:grid-cols-[1fr_auto]'}`}>
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              {mode === 'compare' ? t('Surface A', 'السطح A') : t('Repository path', 'مسار المستودع')}
            </label>
            <input
              dir="ltr"
              list="next-forge-analysis-presets"
              value={leftPath}
              onChange={(event) => setLeftPath(event.target.value)}
              className="h-11 w-full rounded-[15px] border border-border bg-background/55 px-3 text-left font-mono text-xs outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {mode === 'compare' ? (
            <>
              <div className="hidden items-end pb-3 lg:flex">
                <ArrowRightLeft className="size-4 text-muted-foreground" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground">{t('Surface B', 'السطح B')}</label>
                <input
                  dir="ltr"
                  list="next-forge-analysis-presets"
                  value={rightPath}
                  onChange={(event) => setRightPath(event.target.value)}
                  className="h-11 w-full rounded-[15px] border border-border bg-background/55 px-3 text-left font-mono text-xs outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </>
          ) : null}

          <button
            type="button"
            disabled={busy || !leftPath.trim() || (mode === 'compare' && !rightPath.trim())}
            onClick={() => void run()}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-end rounded-[15px] bg-primary px-5 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {busy ? <LoaderCircle className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            {mode === 'analyze' ? t('Analyze', 'تحليل') : t('Compare', 'مقارنة')}
          </button>
        </div>
        <datalist id="next-forge-analysis-presets">
          {presets.map((preset) => <option key={preset} value={preset} />)}
        </datalist>
      </GlassCard>

      {error ? (
        <div className="mb-5 rounded-[18px] border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {!left ? (
        <GlassCard className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
          {mode === 'analyze' ? <BarChart3 className="size-9 text-primary/70" /> : <GitCompareArrows className="size-9 text-primary/70" />}
          <h3 className="mt-5 font-semibold">{t('Ready for a live analysis', 'جاهز للتحليل الحي')}</h3>
          <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
            {t(
              'Choose a suggested path or type another directory from the repository, then run the analysis.',
              'اختر أحد المسارات المقترحة أو اكتب مجلدًا آخر من المستودع ثم شغّل التحليل.'
            )}
          </p>
        </GlassCard>
      ) : mode === 'analyze' ? (
        <AnalysisPanel analysis={left} />
      ) : right && comparison ? (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <GlassCard className="p-5">
              <p dir="ltr" className="truncate text-left font-mono text-xs text-muted-foreground">{left.path}</p>
              <p className="mt-4 text-2xl font-semibold">{formatBytes(left.totalBytes)}</p>
              <p className="mt-1 text-xs text-muted-foreground">{left.fileCount.toLocaleString()} {t('files', 'ملف')}</p>
            </GlassCard>
            <GlassCard className="p-5">
              <p dir="ltr" className="truncate text-left font-mono text-xs text-muted-foreground">{right.path}</p>
              <p className="mt-4 text-2xl font-semibold">{formatBytes(right.totalBytes)}</p>
              <p className="mt-1 text-xs text-muted-foreground">{right.fileCount.toLocaleString()} {t('files', 'ملف')}</p>
            </GlassCard>
            <GlassCard className="p-5">
              <Scale className="size-4 text-primary" />
              <p dir="ltr" className="mt-4 text-2xl font-semibold">{formatBytes(Math.abs(right.totalBytes - left.totalBytes))}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t('Absolute size delta', 'فرق الحجم المطلق')}</p>
            </GlassCard>
            <GlassCard className="p-5">
              <GitCompareArrows className="size-4 text-primary" />
              <p dir="ltr" className="mt-4 text-2xl font-semibold">
                {left.totalBytes ? `${(((right.totalBytes - left.totalBytes) / left.totalBytes) * 100).toFixed(1)}%` : '—'}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{t('B vs A', 'B مقابل A')}</p>
            </GlassCard>
          </div>

          <GlassCard className="overflow-hidden">
            <div className="grid grid-cols-[1fr_100px_100px] gap-3 border-b border-border px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:grid-cols-[1fr_140px_140px]">
              <span>{t('File type', 'نوع الملف')}</span>
              <span className="text-end">A</span>
              <span className="text-end">B</span>
            </div>
            {comparison.map((item) => (
              <div key={item.extension} className="grid grid-cols-[1fr_100px_100px] gap-3 border-b border-border/60 px-4 py-3 text-xs last:border-0 sm:grid-cols-[1fr_140px_140px]">
                <span dir="ltr" className="font-mono">{item.extension}</span>
                <span dir="ltr" className="text-end font-mono text-muted-foreground">{formatBytes(item.left)}</span>
                <span dir="ltr" className="text-end font-mono text-muted-foreground">{formatBytes(item.right)}</span>
              </div>
            ))}
          </GlassCard>
        </div>
      ) : null}
    </div>
  )
}
