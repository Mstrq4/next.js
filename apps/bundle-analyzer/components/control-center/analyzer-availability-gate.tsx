'use client'

import {
  ArrowLeft,
  DatabaseZap,
  FileWarning,
  Link2,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CompareAnalyzer, SingleAnalyzer } from '@/components/analyzer'
import { useI18n } from './i18n-provider'

type GateState = 'checking' | 'ready' | 'unavailable'

function normalizeRoot(value: string) {
  return value.trim().replace(/\/+$/, '').replace(/\/data$/, '')
}

export function AnalyzerAvailabilityGate({
  mode,
}: {
  mode: 'single' | 'compare'
}) {
  const params = useSearchParams()
  const { t } = useI18n()
  const sourceParam = params.get('source') ?? ''
  const sourceRoot = useMemo(() => normalizeRoot(sourceParam), [sourceParam])
  const [sourceInput, setSourceInput] = useState(sourceRoot)
  const [state, setState] = useState<GateState>('checking')
  const [checkedAt, setCheckedAt] = useState<string>('')
  const [detail, setDetail] = useState<string>('')

  const dataBase = sourceRoot ? sourceRoot + '/data' : '/data'

  const checkAvailability = useCallback(async () => {
    setState('checking')
    setDetail('')

    try {
      const [routesResponse, modulesResponse] = await Promise.all([
        fetch(dataBase + '/routes.json', { cache: 'no-store' }),
        fetch(dataBase + '/modules.data', {
          method: 'GET',
          cache: 'no-store',
          headers: { Range: 'bytes=0-0' },
        }),
      ])

      setCheckedAt(new Date().toLocaleTimeString())

      if (routesResponse.ok && modulesResponse.ok) {
        setState('ready')
        return
      }

      setDetail(
        'routes.json: ' +
          routesResponse.status +
          ' · modules.data: ' +
          modulesResponse.status
      )
      setState('unavailable')
    } catch (cause) {
      setCheckedAt(new Date().toLocaleTimeString())
      setDetail(cause instanceof Error ? cause.message : 'Unable to reach data source')
      setState('unavailable')
    }
  }, [dataBase])

  useEffect(() => {
    void checkAvailability()
  }, [checkAvailability])

  const connectSource = () => {
    const root = normalizeRoot(sourceInput)
    const url = new URL(window.location.href)
    if (root) url.searchParams.set('source', root)
    else url.searchParams.delete('source')
    window.location.href = url.pathname + url.search
  }

  if (state === 'ready') {
    return mode === 'single' ? <SingleAnalyzer /> : <CompareAnalyzer />
  }

  if (state === 'checking') {
    return (
      <main className="flex min-h-screen items-center justify-center p-4 sm:p-6">
        <div className="nf-glass-strong w-full max-w-3xl rounded-[30px] p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="nf-skeleton size-12 rounded-[18px]" />
            <div className="flex-1">
              <div className="nf-skeleton h-4 w-40 rounded-full" />
              <div className="nf-skeleton mt-3 h-3 w-64 max-w-full rounded-full" />
            </div>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="nf-skeleton h-24 rounded-[20px]" />
            <div className="nf-skeleton h-24 rounded-[20px]" />
            <div className="nf-skeleton h-24 rounded-[20px]" />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden p-4 sm:p-6">
      <div className="pointer-events-none absolute inset-0 nf-grid opacity-25" />
      <div className="pointer-events-none absolute -left-24 top-10 size-80 rounded-full bg-[#74317a]/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 size-80 rounded-full bg-[#d7afd7]/20 blur-3xl" />

      <section className="nf-glass-strong relative w-full max-w-5xl overflow-hidden rounded-[32px] p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-5 flex size-12 items-center justify-center rounded-[18px] bg-primary/10 text-primary">
              <DatabaseZap className="size-5" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/70">
              {t('Bundle Analyzer · Data source', 'محلل الحزم · مصدر البيانات')}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
              {t('Connect a bundle snapshot.', 'اربط لقطة بيانات للحزم.')}
            </h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {t(
                'The analyzer is fully available when a compatible Next.js bundle-analyzer data root is provided. Use this deployment with /data, or connect another public source root that exposes /data/routes.json and /data/modules.data.',
                'يعمل المحلل بالكامل عند توفير جذر بيانات متوافق مع Bundle Analyzer في Next.js. استخدم /data في هذا النشر أو اربط جذرًا عامًا آخر يوفّر /data/routes.json و/data/modules.data.'
              )}
            </p>
          </div>

          <div className="rounded-full border border-border bg-background/50 px-3 py-1.5 font-mono text-[10px] text-muted-foreground">
            {checkedAt ? 'checked ' + checkedAt : 'source unavailable'}
          </div>
        </div>

        <div className="mt-7 rounded-[22px] border border-border/70 bg-background/35 p-4 sm:p-5">
          <label className="text-xs font-semibold text-foreground">
            {t('Bundle data root URL', 'رابط جذر بيانات الحزم')}
          </label>
          <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
            {t(
              'Example: https://your-analyzer.example.com — Next Forge appends /data and /history automatically.',
              'مثال: https://your-analyzer.example.com — سيضيف Next Forge المسارين /data و/history تلقائيًا.'
            )}
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <div className="flex min-h-11 flex-1 items-center gap-2 rounded-[15px] border border-border bg-background/60 px-3">
              <Link2 className="size-4 shrink-0 text-muted-foreground" />
              <input
                value={sourceInput}
                onChange={(event) => setSourceInput(event.target.value)}
                placeholder="https://example.com"
                dir="ltr"
                className="min-w-0 flex-1 bg-transparent text-left font-mono text-xs outline-none placeholder:text-muted-foreground"
              />
            </div>
            <button
              type="button"
              onClick={connectSource}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[15px] bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              <DatabaseZap className="size-4" />
              {t('Connect source', 'ربط المصدر')}
            </button>
          </div>
          {detail ? (
            <p dir="ltr" className="mt-3 text-left font-mono text-[10px] text-destructive">
              {detail}
            </p>
          ) : null}
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {[
            {
              icon: FileWarning,
              title: 'routes.json',
              detail: t('Route index for the analyzed build.', 'فهرس المسارات للبناء المحلل.'),
            },
            {
              icon: DatabaseZap,
              title: 'modules.data',
              detail: t('Binary module graph for treemap analysis.', 'رسم الوحدات الثنائي لتحليل Treemap.'),
            },
            {
              icon: ShieldCheck,
              title: 'analyze.data',
              detail: t('Per-route module and size data.', 'بيانات الوحدات والأحجام لكل مسار.'),
            },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="rounded-[22px] border border-border/70 bg-background/35 p-4"
              >
                <Icon className="size-4 text-primary" />
                <p className="mt-4 font-mono text-xs font-semibold">{item.title}</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.detail}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-7 flex flex-wrap gap-2.5">
          <Link
            href="/"
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-muted px-4 text-sm font-medium text-muted-foreground"
          >
            <ArrowLeft className="size-4" />
            {t('Back to Next Forge', 'العودة إلى Next Forge')}
          </Link>
          <button
            type="button"
            onClick={() => void checkAvailability()}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-background/55 px-4 text-sm font-medium transition-colors hover:bg-muted"
          >
            <RefreshCw className="size-4" />
            {t('Retry current source', 'إعادة فحص المصدر الحالي')}
          </button>
        </div>
      </section>
    </main>
  )
}
